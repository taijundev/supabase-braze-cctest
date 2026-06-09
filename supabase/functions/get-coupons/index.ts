const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Authorization, Content-Type, apiKey",
};

interface Coupon {
  coupon_id: string;
  coupon_name: string;
  category: string;
  discount_amount: number;
  expired_at: string;
}

const SAMPLE_COUPONS: Coupon[] = [
  // fashion
  { coupon_id: "C001", coupon_name: "봄 패션 10% 할인", category: "fashion", discount_amount: 10, expired_at: "2026-09-30" },
  { coupon_id: "C002", coupon_name: "신상 의류 15% 할인", category: "fashion", discount_amount: 15, expired_at: "2026-08-31" },
  { coupon_id: "C003", coupon_name: "아우터 전용 20% 할인", category: "fashion", discount_amount: 20, expired_at: "2026-12-31" },
  // food
  { coupon_id: "C004", coupon_name: "레스토랑 5,000원 할인", category: "food", discount_amount: 5000, expired_at: "2026-07-31" },
  { coupon_id: "C005", coupon_name: "카페 음료 30% 할인", category: "food", discount_amount: 30, expired_at: "2026-08-15" },
  { coupon_id: "C006", coupon_name: "배달 앱 3,000원 할인", category: "food", discount_amount: 3000, expired_at: "2026-07-15" },
  // beauty
  { coupon_id: "C007", coupon_name: "스킨케어 15% 할인", category: "beauty", discount_amount: 15, expired_at: "2026-10-31" },
  { coupon_id: "C008", coupon_name: "뷰티 브랜드 25% 할인", category: "beauty", discount_amount: 25, expired_at: "2026-09-30" },
  // electronics
  { coupon_id: "C009", coupon_name: "가전제품 10만원 할인", category: "electronics", discount_amount: 100000, expired_at: "2026-08-31" },
  { coupon_id: "C010", coupon_name: "스마트폰 액세서리 20% 할인", category: "electronics", discount_amount: 20, expired_at: "2026-11-30" },
  // travel
  { coupon_id: "C011", coupon_name: "국내 숙박 15% 할인", category: "travel", discount_amount: 15, expired_at: "2026-12-31" },
  { coupon_id: "C012", coupon_name: "항공권 5만원 할인", category: "travel", discount_amount: 50000, expired_at: "2026-10-31" },
];

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }

  let body: { user_id?: string; prefer_categories?: string[] };
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }

  const { prefer_categories } = body;

  const coupons =
    !prefer_categories || prefer_categories.length === 0
      ? SAMPLE_COUPONS
      : SAMPLE_COUPONS.filter((c) => prefer_categories.includes(c.category));

  return new Response(JSON.stringify(coupons), {
    status: 200,
    headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
  });
});
