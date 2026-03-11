# Fix: Subscription Cancel/Uncancel Webhook Handling

## Problem
1. 구독 재개(uncancel) 시 `plan`이 "free"로 남아있음
2. `subscription.canceled`, `subscription.uncanceled`, `subscription.revoked` 이벤트가 처리되지 않음
3. `subscription.product?.id` 접근이 SDK 타입과 불일치 (productId만 존재)

## Root Cause
- webhook handler가 `order.paid`와 `customer.state_changed`만 처리
- `customer.state_changed`가 모든 상태 변경에 일관되게 발생하지 않을 수 있음
- 명시적인 subscription event handler 부재

## Acceptance Criteria
- [ ] 구독 취소 시: `subscription_status = "canceled"`, `plan` 유지 (기간 만료 전)
- [ ] 구독 재개 시: `subscription_status = "active"`, `plan` 복원 (pro/ultra)
- [ ] 구독 만료 시: `subscription_status = "inactive"`, `plan = "free"`
- [ ] 기존 `customer.state_changed` 핸들러도 유지 (safety net)
- [ ] `subscription.product?.id` phantom 접근 제거

## Implementation Steps

### Step 1: Add subscription event handlers to webhook route
**File:** `app/api/webhooks/polar/route.ts`

1. switch문에 `subscription.canceled`, `subscription.uncanceled`, `subscription.revoked` 케이스 추가
2. `handleSubscriptionCanceled(data)`: userId 추출 → `subscription_status = "canceled"` 업데이트 (plan 유지)
3. `handleSubscriptionUncanceled(data)`: userId 추출 → `subscription_status = "active"`, productId로 plan 복원
4. `handleSubscriptionRevoked(data)`: userId 추출 → `plan = "free"`, `subscription_status = "inactive"`

### Step 2: Fix productId access pattern
**File:** `app/api/webhooks/polar/route.ts:138`

- `subscription.product?.id ?? subscription.productId` → `subscription.productId`

### Step 3: Improve customer.state_changed handler
**File:** `app/api/webhooks/polar/route.ts:123-200`

- `subscription.product?.id ?? subscription.productId` → `subscription.productId` (line 138)
- Keep as reconciliation safety net

## Risks & Mitigations
- **이중 처리**: subscription event + customer.state_changed 둘 다 발생 가능 → 멱등성 보장 (같은 상태로 update하면 부작용 없음)
- **subscription 이벤트 데이터 형식**: SDK 타입 확인 필요 → customer.externalId 또는 customer_external_id로 userId 추출
