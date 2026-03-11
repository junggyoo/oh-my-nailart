# 썸네일 이미지 품질 개선 계획: AI/웹툰 느낌 제거 (v2)

## 문제
- 현재 모델: `gemini-3-pro-image-preview` (Nano Banana Pro) — 이미 최상위 모델 사용 중
- 증상: 웹툰/만화/일러스트 느낌의 이미지가 계속 생성됨
- 근본 원인 (3가지):
  1. `personGeneration` 미설정 → 안전 레이어가 인물을 비사실적 스타일로 렌더링 (`route.ts:48-53`)
  2. `imageSize` 미설정 (기본 1K) → 낮은 해상도가 디테일 부족 → 스타일화된 출력 유도 (`route.ts:48-53`)
  3. 시스템 프롬프트에 포토리얼리즘 강제 지시 부족 (`thumbnail-system.ts:12` — 한 줄만 존재)

## 수용 기준
1. 10개 니치(게임, 요리, 테크, 뷰티, 여행, 교육, 뉴스, 피트니스, 음악, 브이로그)에서 각 3개 = 총 30개 이미지 생성 테스트
2. 30개 중 0개가 flat shading, outline stroke, cel-shading 스타일을 보여야 함
3. 30개 중 25개 이상이 depth-of-field blur(보케) 효과를 포함해야 함
4. 텍스트 렌더링 품질은 기존과 동등해야 함 (가독성 유지)
5. API 응답 시간이 기존 대비 2배 이상 증가하지 않아야 함

## 구현 단계

### Step 1: SDK 설정 추가 (`app/api/generate-image/route.ts:45-54`)

**가장 중요한 변경** — 프롬프트와 무관하게 모델 동작을 제어하는 SDK 레벨 설정.

**변경 전:**
```typescript
const response = await ai.models.generateContent({
  model: "gemini-3-pro-image-preview",
  contents: contents,
  config: {
    responseModalities: ["TEXT", "IMAGE"],
    imageConfig: {
      aspectRatio: "16:9",
    },
  },
});
```

**변경 후:**
```typescript
const response = await ai.models.generateContent({
  model: process.env.GEMINI_MODEL || "gemini-3-pro-image-preview",
  contents: contents,
  config: {
    temperature: 0.5,
    responseModalities: ["TEXT", "IMAGE"],
    imageConfig: {
      aspectRatio: "16:9",
      personGeneration: "ALLOW_ADULT",
      imageSize: "2K",
    },
  },
});
```

**변경 근거:**
- `personGeneration: "ALLOW_ADULT"` — 안전 레이어의 카툰 폴백 방지 (SDK 타입: `genai.d.ts:5831-5833`)
- `imageSize: "2K"` — 고해상도로 사실적 디테일 강화 (SDK 타입: `genai.d.ts:5828-5830`)
- `temperature: 0.5` — 창의적 해석(=스타일화) 감소, 리터럴/사실적 출력 유도
- `process.env.GEMINI_MODEL` — 모델 ID를 환경변수로 관리

### Step 2: 시스템 프롬프트 개선 (`lib/prompts/thumbnail-system.ts`)

프롬프트 길이를 최소화하면서 핵심 지시를 상단/하단에 배치(sandwich technique).

#### 2-1. 프롬프트 최상단 변경 (line 1)

**변경 전:**
```
You are a world-class YouTube thumbnail designer who creates stunning, high-CTR thumbnails for ANY topic or channel niche.
```

**변경 후:**
```
You are a world-class YouTube thumbnail PHOTOGRAPHER. Every image you create MUST be a real photograph — shot on a professional DSLR camera. NEVER create cartoons, webtoons, illustrations, or digital art.

You create stunning, high-CTR thumbnails for ANY topic or channel niche.
```

#### 2-2. Technical Specifications 섹션 교체 (lines 10-14)

**변경 전:**
```
## Technical Specifications
- Aspect ratio: 16:9 (1280×720 concept)
- Style: Photorealistic, high-resolution, studio-quality imagery
- Color space: Vibrant sRGB, optimized for screen display
- Final output must look like a real, professional YouTube thumbnail
```

**변경 후:**
```
## Technical Specifications
- Aspect ratio: 16:9 (1280×720 concept)
- Style: REAL PHOTOGRAPH — professional DSLR (Canon EOS R5, 35mm f/1.4 lens)
- FORBIDDEN: cartoon, webtoon, manga, anime, illustration, digital art, CGI, 3D render, painting, sketch, cel-shading, flat colors, vector art
- Photography: shallow depth of field, natural film grain, realistic skin with pores, bokeh backgrounds
- Lighting: Natural or studio (softbox, rim light, golden hour). NOT flat illustration lighting
- Color: Film-grade grading (Kodak Portra 400 tonality), vibrant sRGB
- Final output must be indistinguishable from a real professional photograph
```

#### 2-3. Lighting & Visual Quality 섹션에 추가 (line 55 뒤에 append)

`thumbnail-system.ts:55` (`- Catch lights and specular highlights add polish and realism`) 바로 뒤에 추가:

```
- Camera simulation: f/2.8, ISO 400, 1/250s — think like a photographer, not an illustrator
- Lens effects: natural vignetting, perspective distortion, chromatic aberration at edges
- Skin rendering: subsurface scattering, visible pores, realistic hair strands — NEVER smooth/airbrushed
- Post-processing: Adobe Lightroom look, NOT Photoshop illustration or digital painting
```

#### 2-4. Topic-Specific Adaptation 모든 카테고리에 사진 앵커 추가 (lines 64-75)

**전체 교체:**
```
### 6. Topic-Specific Adaptation
- Gaming: cinematic in-game screenshot feel with dramatic lighting, NOT cartoon fanart or anime style
- Cooking/Food: editorial food photography (Bon Appétit magazine style), overhead or 45° angle, warm lighting, steam/texture
- Tech/Reviews: product photography on clean backdrop, studio softbox lighting, sharp focus on device
- Vlogs/Lifestyle: candid street photography feel, natural window light, authentic expressions with real skin texture
- Education/Tutorial: documentary-style photography, clear visual diagrams shot as real objects, whiteboard photography
- Travel: landscape photography (National Geographic style), golden hour, wide-angle lens with foreground interest
- Beauty/Fashion: editorial fashion photography (Vogue style), beauty dish lighting, macro detail shots
- News/Commentary: photojournalistic style, dramatic portrait lighting, real press conference / studio set feel
- Fitness/Sports: sports photography with fast shutter speed freeze-frame, dramatic rim lighting, action shots
- Music: concert photography / studio session feel, moody lighting, shallow DOF on performer
- ALL categories: output must look like a real photograph, never an illustration
```

### Step 3: API 프롬프트 래핑에 리마인더 추가 (`app/api/generate-image/route.ts:27-31`)

**변경 전:**
```typescript
const fullPrompt = prompt
  ? `${THUMBNAIL_SYSTEM_PROMPT}\n\n---\nUser Request: ${prompt}`
  : THUMBNAIL_SYSTEM_PROMPT;
```

**변경 후:**
```typescript
const PHOTO_REMINDER = "\n\nREMINDER: Output a photorealistic DSLR photograph. No cartoon/illustration/webtoon styles.";

const fullPrompt = prompt
  ? `${THUMBNAIL_SYSTEM_PROMPT}\n\n---\nUser Request: ${prompt}${PHOTO_REMINDER}`
  : `${THUMBNAIL_SYSTEM_PROMPT}${PHOTO_REMINDER}`;
```

## 리스크 및 완화
| 리스크 | 완화 방안 |
|--------|-----------|
| `personGeneration: "ALLOW_ADULT"` 설정 시 콘텐츠 정책 리뷰 가능 | Google의 기본 안전 필터는 여전히 적용됨. 부적절한 콘텐츠는 차단됨 |
| `imageSize: "2K"` 설정 시 응답 시간 증가 | maxDuration이 이미 120초. 수용 기준에 2배 이하 응답시간 기준 포함 |
| 프롬프트 길이 증가로 토큰 비용 증가 | 기존 대비 ~500자 순증가로 제한 (verbose 섹션 통합). 비용 영향 미미 |
| 일부 특수 주제에서 여전히 스타일화된 출력 가능 | PHOTO_REMINDER가 매 요청마다 하단에 추가되어 이중 방어 |
| 환경변수 GEMINI_MODEL 미설정 시 | 기본값 fallback (`gemini-3-pro-image-preview`) 설정 |

## 검증 방법
1. `.env.local`에 `GEMINI_MODEL` 추가 확인
2. 10개 니치별 대표 프롬프트 3개씩 작성 (총 30개)
3. 변경 전/후 동일 프롬프트로 이미지 생성 비교
4. 각 이미지에 대해 체크: flat shading 없음 / bokeh 존재 / 텍스트 가독성
5. 응답 시간 측정 (기존 대비 2배 이내 확인)

## 변경 파일
1. `lib/prompts/thumbnail-system.ts` — 시스템 프롬프트 개선 (4개 섹션)
2. `app/api/generate-image/route.ts` — SDK 설정 추가 + 프롬프트 래핑 + 모델 ID 환경변수화

## Changelog (v2)
- Architect 피드백 반영: `personGeneration`, `imageSize`, `temperature` SDK 설정 추가
- Architect 피드백 반영: 모델 ID를 환경변수로 추출
- Architect 피드백 반영: Nano Banana 2 모델 업그레이드 제거 (flash 모델은 품질 저하 우려)
- Architect 피드백 반영: 프롬프트 간결화 (verbose 섹션 통합, ~500자 순증가로 제한)
- Critic 피드백 반영: 모든 삽입 지점에 정확한 라인 번호 명시
- Critic 피드백 반영: 10개 카테고리 전체에 사진 앵커 텍스트 작성
- Critic 피드백 반영: 수용 기준을 측정 가능하게 변경 (30개 이미지, 구체적 통과 기준)
