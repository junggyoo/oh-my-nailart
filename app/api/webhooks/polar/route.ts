import { NextRequest, NextResponse } from "next/server";
import {
  validateEvent,
  WebhookVerificationError,
} from "@polar-sh/sdk/webhooks";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const PRO_PRODUCT_ID = process.env.POLAR_PRO_PRODUCT_ID!;
const ULTRA_PRODUCT_ID = process.env.POLAR_ULTRA_PRODUCT_ID!;

function getPlanFromProductId(productId: string | null | undefined): "pro" | "ultra" | "free" {
  if (!productId) return "free";
  if (productId === PRO_PRODUCT_ID) return "pro";
  if (productId === ULTRA_PRODUCT_ID) return "ultra";
  console.warn("Unknown productId:", productId);
  return "free";
}

const PLAN_CREDITS: Record<string, number> = {
  pro: 100,
  ultra: 300,
};

const PLAN_RANK: Record<string, number> = {
  free: 0,
  pro: 1,
  ultra: 2,
};

export async function POST(req: NextRequest) {
  const body = await req.text();
  const headers: Record<string, string> = {};
  req.headers.forEach((value, key) => {
    headers[key] = value;
  });

  let event;
  try {
    event = validateEvent(body, headers, process.env.POLAR_WEBHOOK_SECRET!);
  } catch (e) {
    if (e instanceof WebhookVerificationError) {
      console.error("Webhook verification failed:", e.message);
      return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
    }
    throw e;
  }

  try {
    switch (event.type) {
      case "order.paid":
        await handleOrderPaid(event.data);
        break;
      case "subscription.canceled":
        await handleSubscriptionCanceled(event.data);
        break;
      case "subscription.uncanceled":
        await handleSubscriptionUncanceled(event.data);
        break;
      case "subscription.revoked":
        await handleSubscriptionRevoked(event.data);
        break;
      case "customer.state_changed":
        await handleCustomerStateChanged(event.data);
        break;
      default:
        break;
    }
  } catch (error) {
    console.error(`Webhook handling error [${event.type}]:`, error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }

  return NextResponse.json({ received: true });
}

async function handleOrderPaid(order: any) {
  const userId = order.customer?.externalId;
  if (!userId) {
    console.error("order.paid: No externalId on customer", order.customer?.id);
    return;
  }

  const productId = order.product?.id ?? order.productId;
  const plan = getPlanFromProductId(productId);
  const billingReason = order.billingReason;

  console.log("order.paid:", { userId, productId, plan, billingReason });

  // 크레딧 계산
  const isRegularBilling =
    billingReason === "subscription_create" ||
    billingReason === "subscription_cycle";
  const creditsToCharge = isRegularBilling ? (PLAN_CREDITS[plan] ?? 0) : 0;

  // 결제 기록 저장
  const { error: paymentError } = await supabase.from("payments").insert({
    user_id: userId,
    amount: order.totalAmount,
    currency: order.currency,
    status: "paid",
    plan,
    credits_charged: creditsToCharge,
  });

  if (paymentError) {
    console.error("Failed to insert payment:", paymentError);
  }

  // 구독 생성 또는 갱신일 때만 크레딧 충전 (업그레이드 프로레이션은 제외)
  if (creditsToCharge > 0) {
    const { data: user } = await supabase
      .from("users")
      .select("credits")
      .eq("id", userId)
      .single();

    await supabase
      .from("users")
      .update({ credits: (user?.credits ?? 0) + creditsToCharge })
      .eq("id", userId);
  }
}

async function handleSubscriptionCanceled(subscription: any) {
  const userId = subscription.customer?.externalId;
  if (!userId) {
    console.error("subscription.canceled: No externalId on customer", subscription.customer?.id);
    return;
  }

  console.log("subscription.canceled:", { userId, productId: subscription.productId });

  // 취소 예약: plan은 유지, subscription_status만 "canceled"로 변경
  const { error } = await supabase
    .from("users")
    .update({ subscription_status: "canceled" })
    .eq("id", userId);

  if (error) {
    console.error("Failed to update subscription status on cancel:", error);
  }
}

async function handleSubscriptionUncanceled(subscription: any) {
  const userId = subscription.customer?.externalId;
  if (!userId) {
    console.error("subscription.uncanceled: No externalId on customer", subscription.customer?.id);
    return;
  }

  const productId = subscription.productId;
  const plan = getPlanFromProductId(productId);

  console.log("subscription.uncanceled:", { userId, productId, plan });

  // 구독 재개: plan 복원 + subscription_status를 "active"로 변경
  const { error } = await supabase
    .from("users")
    .update({
      plan,
      subscription_status: "active",
    })
    .eq("id", userId);

  if (error) {
    console.error("Failed to update user on uncancel:", error);
  }
}

async function handleSubscriptionRevoked(subscription: any) {
  const userId = subscription.customer?.externalId;
  if (!userId) {
    console.error("subscription.revoked: No externalId on customer", subscription.customer?.id);
    return;
  }

  console.log("subscription.revoked:", { userId, productId: subscription.productId });

  // 구독 만료/해지: plan을 "free"로, subscription_status를 "inactive"로 변경
  const { error } = await supabase
    .from("users")
    .update({
      plan: "free",
      subscription_status: "inactive",
    })
    .eq("id", userId);

  if (error) {
    console.error("Failed to reset user on revoke:", error);
  }
}

async function handleCustomerStateChanged(customerState: any) {
  const userId = customerState.externalId;
  if (!userId) {
    console.error(
      "customer.state_changed: No externalId on customer",
      customerState.id
    );
    return;
  }

  const activeSubscriptions = customerState.activeSubscriptions ?? [];

  // 활성 구독이 있는 경우
  if (activeSubscriptions.length > 0) {
    const subscription = activeSubscriptions[0];

    // 디버깅: subscription 데이터 구조 확인
    console.log("customer.state_changed subscription data:", JSON.stringify(subscription, null, 2));

    const subProductId = subscription.productId ?? subscription.product_id ?? subscription.product?.id;
    const newPlan = getPlanFromProductId(subProductId);

    console.log("customer.state_changed:", { userId, subProductId, newPlan, activeSubscriptions: activeSubscriptions.length });

    // 현재 DB의 plan 조회 (업그레이드 감지용)
    const { data: currentUser } = await supabase
      .from("users")
      .select("plan")
      .eq("id", userId)
      .single();

    const oldPlan = currentUser?.plan ?? "free";

    // 업그레이드 감지: 기존 플랜보다 상위 플랜으로 변경
    const isUpgrade =
      (PLAN_RANK[newPlan] ?? 0) > (PLAN_RANK[oldPlan] ?? 0) &&
      oldPlan !== "free"; // free → pro/ultra는 첫 구독이므로 order.paid에서 처리

    let subscriptionStatus = "active";
    if (subscription.cancelAtPeriodEnd) {
      subscriptionStatus = "canceled";
    }

    const { error } = await supabase
      .from("users")
      .update({
        plan: newPlan,
        subscription_status: subscriptionStatus,
      })
      .eq("id", userId);

    if (error) {
      console.error("Failed to update user plan:", error);
    }

    // 업그레이드 시 차액 크레딧 200 추가 충전
    if (isUpgrade) {
      const { data: user } = await supabase
        .from("users")
        .select("credits")
        .eq("id", userId)
        .single();

      await supabase
        .from("users")
        .update({ credits: (user?.credits ?? 0) + 200 })
        .eq("id", userId);
    }
  } else {
    // 활성 구독 없음 → 로그만 남김
    // plan을 "free"로 변경하는 것은 subscription.revoked 핸들러에서 처리
    // (플랜 변경 시 과도기 상태에서 빈 activeSubscriptions가 올 수 있으므로 여기서 변경하지 않음)
    console.log("customer.state_changed: No active subscriptions", { userId });
  }
}
