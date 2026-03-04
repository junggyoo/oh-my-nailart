# Plan: YouTube Thumbnail AI Service - Hero Section (v3 — Final)

## Requirements Summary

YouTube 썸네일을 생성하는 AI 서비스의 랜딩 페이지 히어로 섹션을 구현한다.
현재 "The Infinite Grid" 데모를 YouTube 썸네일 AI 서비스에 맞는 히어로로 교체한다.

### Constraints
- 현재 디자인 시스템 유지 (인피니트 그리드 배경, 그라디언트 오버레이, 마우스 트래킹, Framer Motion 애니메이션)
- lucide-react 등 아이콘 라이브러리 사용 금지 — 모든 아이콘/일러스트는 인라인 SVG로 구현
- 기존 기술 스택 유지: Next.js 16, React 19, Tailwind CSS 4, shadcn/ui, Framer Motion

## Acceptance Criteria

1. [TESTABLE] h1 텍스트가 정확히 "AI로 완성하는 유튜브 썸네일"이다
2. [TESTABLE] p 텍스트가 정확히 "클릭 한 번으로 눈길을 사로잡는 썸네일을 만들어보세요. AI가 당신의 영상에 딱 맞는 디자인을 제안합니다."이다
3. [TESTABLE] CTA 버튼 2개 존재: 텍스트가 "썸네일 만들기" (primary) + "더 알아보기" (secondary)
4. [TESTABLE] 인피니트 그리드 배경 애니메이션이 유지된다 — `useAnimationFrame` 루프 + `GridPattern` 2개 렌더링 확인
5. [TESTABLE] 그라디언트 오버레이 3개 유지 (orange, primary, blue blurs) — `components/ui/the-infinite-grid.tsx:58-62`
6. [TESTABLE] `grep -r "lucide" components/` 결과가 0건이다
7. [TESTABLE] 각 SVG 데코레이션이 `<motion.svg>` 요소로 래핑되어 있다 (3개)
8. [TESTABLE] `useReducedMotion()` 훅이 사용되며 `?? false`로 null 처리, reduced-motion 시 float 애니메이션이 비활성화된다
9. [TESTABLE] 모바일: h1이 `text-4xl`, 데스크톱(md): h1이 `text-6xl`
10. [TESTABLE] 다크모드에서 SVG 요소가 `currentColor` 또는 CSS 변수를 사용한다
11. [TESTABLE] 썸네일 미리보기 카드가 3개이며, 부모 `motion.svg`에 `staggerChildren: 0.15`, 각 카드 `motion.g`에 child variant 적용
12. [TESTABLE] 헤드라인 위에 "AI Powered" 배지가 존재한다 (필수)
13. [TESTABLE] 데스크톱에서 히어로가 `md:flex-row` 레이아웃이다 (텍스트+CTA 좌측 / 목업 우측), 모바일에서 `flex-col`
14. [TESTABLE] 연속 반복 애니메이션(float/scale/rotate)이 최대 3개이다 (성능 기준)

## Implementation Steps

### Step 1: count 상태 제거 및 헤드라인/텍스트/버튼 교체

**파일:** `components/ui/the-infinite-grid.tsx`

**변경 사항:**
- Line 13: `const [count, setCount] = useState(0);` 제거
- Line 3: `useState` import 제거 (useRef만 유지)
- Lines 66-67: h1 텍스트 → `"AI로 완성하는 유튜브 썸네일"`
- Lines 69-72: p 텍스트 → `"클릭 한 번으로 눈길을 사로잡는 썸네일을 만들어보세요. AI가 당신의 영상에 딱 맞는 디자인을 제안합니다."`
- Lines 76-79: 첫 번째 버튼 → `onClick` 제거, 텍스트를 `"썸네일 만들기"`로 변경
- Lines 82-83: 두 번째 버튼 텍스트를 `"더 알아보기"`로 변경

### Step 2: 히어로 레이아웃을 2컬럼으로 변경

**파일:** `components/ui/the-infinite-grid.tsx`

**변경 사항:**
- Line 64: 콘텐츠 div의 클래스를 변경
  - 기존: `flex flex-col items-center text-center px-4 max-w-3xl mx-auto space-y-6 pointer-events-none`
  - 변경: `flex flex-col md:flex-row items-center md:items-center text-center md:text-left px-4 md:px-8 max-w-6xl mx-auto gap-8 md:gap-12 pointer-events-none`

**좌측 컬럼 (텍스트 + CTA):**
- Lines 65-85의 기존 콘텐츠를 `<div className="flex-1 space-y-6">` 안에 래핑
- 배지 (Step 5), h1, p, CTA 버튼 그룹이 모두 이 좌측 컬럼 안에 위치
- CTA 버튼 그룹 (`flex gap-4 pointer-events-auto`)은 좌측 컬럼 내부에서 텍스트 아래 배치

**우측 컬럼 (목업):**
- `<div className="flex-1 flex items-center justify-center pointer-events-none">` 추가
- Step 4에서 `<ThumbnailMockup>` 컴포넌트가 이 div 내부에 배치됨

**DOM 구조 (명시):**
```tsx
<div className="... md:flex-row ...">       {/* 콘텐츠 컨테이너 */}
  <div className="flex-1 space-y-6">         {/* 좌측: 텍스트 + CTA */}
    <div>AI Powered 배지</div>                {/* Step 5 */}
    <h1>...</h1>
    <p>...</p>
    <div className="flex gap-4 pointer-events-auto">  {/* CTA 버튼 */}
      <button>썸네일 만들기</button>
      <button>더 알아보기</button>
    </div>
  </div>
  <div className="flex-1 ...">               {/* 우측: 목업 */}
    <ThumbnailMockup />                       {/* Step 4 */}
  </div>
</div>
```

### Step 3: SVG 데코레이션 서브컴포넌트 추가

**파일:** `components/ui/the-infinite-grid.tsx`
**삽입 위치:** Line 121 (`GridPattern` 컴포넌트) 뒤에 추가

**새 컴포넌트:**
```tsx
const FloatingDecorations = ({ reducedMotion }: { reducedMotion: boolean }) => { ... }
```

**SVG 요소 3개 — 각각 `<motion.svg>`로 래핑 (AC7 충족):**
1. **PlayButtonSVG**: `<motion.svg className="w-12 h-12" viewBox="0 0 48 48">`
   - 내용: `<circle fill="none" stroke="currentColor" />` + `<polygon fill="currentColor" />`
   - 위치: `absolute top-[15%] left-[8%]`
   - 애니메이션: `animate={{ y: [0, -8, 0] }}`, `transition={{ duration: 3, repeat: Infinity, repeatType: "loop" }}`
   - reducedMotion 시: `animate` 제거 (정적 렌더링)
2. **SparkSVG**: `<motion.svg className="w-8 h-8" viewBox="0 0 32 32">`
   - 내용: `<path fill="currentColor" />` (4각 별)
   - 위치: `absolute top-[25%] right-[12%]`
   - 애니메이션: `animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }}`, `transition={{ duration: 4, repeat: Infinity }}`
   - reducedMotion 시: `animate` 제거
3. **FrameSVG**: `<motion.svg className="w-10 h-10" viewBox="0 0 40 40">`
   - 내용: `<rect fill="none" stroke="currentColor" />` + `<path stroke="currentColor" />` (대각선)
   - 위치: `absolute bottom-[20%] left-[15%]`
   - 애니메이션: `animate={{ rotate: [0, 5, 0] }}`, `transition={{ duration: 5, repeat: Infinity }}`
   - reducedMotion 시: `animate` 제거

**래퍼 div:**
```tsx
<div className="absolute inset-0 z-[5] pointer-events-none hidden md:block text-muted-foreground/30">
  {/* 3개의 motion.svg */}
</div>
```

**호출 위치:** Line 62 뒤 (그라디언트 오버레이 div 뒤, 콘텐츠 div 앞):
```tsx
<FloatingDecorations reducedMotion={reducedMotion} />
```

### Step 4: 썸네일 미리보기 목업 서브컴포넌트 추가

**파일:** `components/ui/the-infinite-grid.tsx`
**삽입 위치:** `FloatingDecorations` 컴포넌트 뒤 (Step 3에서 추가한 컴포넌트 바로 다음)

**새 컴포넌트:**
```tsx
const ThumbnailMockup = ({ reducedMotion }: { reducedMotion: boolean }) => { ... }
```

**구현 — motion variants 구조 (AC11 충족):**
```tsx
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } }
};
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (targetOpacity: number) => ({ opacity: targetOpacity, y: 0, transition: { duration: 0.6 } })
};
```

**부모:** `<motion.svg viewBox="0 0 320 240" variants={containerVariants} initial="hidden" animate="visible">`

**3개의 카드 (각각 `<motion.g>` with child variant):**
- 카드 1 (뒤): `<motion.g variants={cardVariants} custom={0.4} style={{ transform: "rotate(-6deg)" }}>` → `<rect rx="8" />` + 텍스트 라인 placeholder, `stroke-muted-foreground`, `fill-muted/20`
- 카드 2 (중): `<motion.g variants={cardVariants} custom={0.7} style={{ transform: "rotate(3deg)" }}>` → `<rect rx="8" />` + 텍스트 라인
- 카드 3 (앞): `<motion.g variants={cardVariants} custom={1.0} style={{ transform: "rotate(0deg)" }}>` → `<rect rx="8" />` + 재생 삼각형 `<polygon>` + 텍스트 라인

**색상:** `stroke-muted-foreground`, `fill-muted/20` (currentColor 기반, 다크모드 호환)
**pointer-events:** `pointer-events-none` (비인터랙티브)

**배치:** Step 2에서 만든 우측 컬럼 div 내부:
```tsx
<div className="flex-1 flex items-center justify-center pointer-events-none">
  <ThumbnailMockup reducedMotion={reducedMotion} />
</div>
```

### Step 5: "AI Powered" 배지 추가

**파일:** `components/ui/the-infinite-grid.tsx`
**삽입 위치:** Step 2에서 만든 좌측 컬럼 div 내부, h1 바로 위

**구현:**
```tsx
<motion.div
  className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-sm text-primary"
  initial={{ opacity: 0, y: -10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
    <path d="M8 0l2 6h6l-5 4 2 6-5-4-5 4 2-6-5-4h6z" />
  </svg>
  AI Powered
</motion.div>
```

### Step 6: `prefers-reduced-motion` 지원 추가

**파일:** `components/ui/the-infinite-grid.tsx`

**변경 사항:**
- Line 6-9 (import 블록): `useReducedMotion` 추가
  ```tsx
  import { motion, useMotionValue, useMotionTemplate, useAnimationFrame, useReducedMotion } from "framer-motion";
  ```
- Line 14 부근 (컴포넌트 상단, useRef 뒤): null 처리 포함하여 추가
  ```tsx
  const reducedMotion = useReducedMotion() ?? false;
  ```
- Lines 28-29: 그리드 스크롤 속도를 reducedMotion에 따라 조건부 설정
  ```tsx
  const speedX = reducedMotion ? 0 : 0.5;
  const speedY = reducedMotion ? 0 : 0.5;
  ```
- `FloatingDecorations`와 `ThumbnailMockup`에 `reducedMotion` prop 전달 (Step 3, 4에서 이미 반영)

### Step 7: 컴포넌트 이름 리팩토링

**파일:** `components/ui/the-infinite-grid.tsx`
- Line 12: `export const Component` → `export const HeroContent`

**파일:** `components/main/hero.tsx`
- Line 3: `import { Component }` → `import { HeroContent }`
- Line 6: `<Component />` → `<HeroContent />`

## File Changes Summary

| File | Action | Lines Affected |
|------|--------|----------------|
| `components/ui/the-infinite-grid.tsx` | MODIFY | 3, 6-9, 12-14, 28-29, 62 뒤 삽입, 64-86 구조 변경, 121 뒤 `FloatingDecorations` + `ThumbnailMockup` 추가 |
| `components/main/hero.tsx` | MODIFY | 3, 6 |

## Risks and Mitigations

| Risk | Impact | Mitigation | 관련 Step | 검증 방법 |
|------|--------|------------|-----------|-----------|
| SVG + useAnimationFrame 프레임 부하 | 중 | 연속 반복 애니메이션 최대 3개, SVG에 blur 필터 없음, 단순 path만 사용 | Step 3 | AC14: 반복 애니메이션 수 카운트 |
| 모바일에서 데코레이션 레이아웃 깨짐 | 중 | `hidden md:block`으로 모바일에서 숨김 | Step 3 | Verification #5 |
| 다크모드에서 SVG 미표시 | 낮 | `currentColor` + Tailwind 색상 클래스 | Step 3,4,5 | Verification #9 |
| reduced-motion 미지원 접근성 | 중 | `useReducedMotion() ?? false`로 null 안전 처리, 반복 애니메이션 비활성화 | Step 6 | Verification #8 |
| 2컬럼에서 CTA가 3번째 컬럼으로 빠짐 | 높 | CTA를 좌측 텍스트 컬럼 내부에 명시적 배치 | Step 2 | DOM 구조 확인 |
| SVG 데코레이션이 CTA 클릭 차단 | 낮 | 데코레이션 `pointer-events-none`, `z-[5]` (콘텐츠 `z-10` 아래) | Step 3 | Verification #3 |

## Verification Steps

1. `npm run dev` → 브라우저에서 히어로 확인
2. h1 = "AI로 완성하는 유튜브 썸네일" 확인
3. CTA 버튼 2개 클릭 가능 확인 (pointer-events 검증)
4. 마우스 트래킹 그리드 애니메이션 동작 확인
5. 브라우저 너비 < 768px: flex-col 레이아웃 + 데코레이션 숨김 확인
6. 브라우저 너비 >= 768px: flex-row 레이아웃 (텍스트+CTA 좌측 / 목업 우측) + 데코레이션 표시 확인
7. `grep -r "lucide" components/` → 결과 0건
8. DevTools → Rendering → prefers-reduced-motion 에뮬레이션 → 반복 애니메이션 정지 + 그리드 정지 확인
9. 다크모드 토글 → SVG 색상 정상 확인
10. 썸네일 목업 카드 3개 stagger 등장 애니메이션 확인

## Changelog
### v3 (Architect/Critic 2차 리뷰 반영)
- Architect: CTA 버튼 그룹을 좌측 텍스트 컬럼 내부에 명시적 배치 (Step 2 DOM 구조도 추가)
- Architect: 각 데코레이션을 `motion.svg`로 래핑하는 구체적 구조 명시 (Step 3)
- Architect: 목업에 `containerVariants`/`cardVariants` + `staggerChildren` 구조 명시 (Step 4)
- Critic: `useReducedMotion() ?? false`로 null 안전 처리 명시 (Step 6)
- Critic: 카드별 opacity 확정값 명시 — 카드1: 0.4, 카드2: 0.7, 카드3: 1.0 (Step 4)
- Critic: 성능 기준을 측정 가능하게 변경 — "반복 애니메이션 최대 3개, SVG에 blur 필터 없음" (AC14, 리스크 테이블)
- Critic: 모든 Step에 정확한 삽입 위치와 line 참조 추가

### v2
- Architect: SVG 데코레이션과 목업을 별도 서브컴포넌트로 분리
- Architect: 명시적 z-index 레이어링 추가 (`z-[5]`)
- Architect: pointer-events 정책 명시
- Critic: 모든 텍스트를 확정 문자열로 지정
- Critic: prefers-reduced-motion 구현을 별도 Step 6으로 추가
- Critic: 레이아웃 변경 구체화 — md:flex-row 2컬럼 레이아웃
- Critic: 파일/라인 참조 추가
- Critic: 배지를 필수 요소로 승격
- Critic: 애니메이션 파라미터 구체화
