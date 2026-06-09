# supabase-braze-cctest

Braze Connected Content 테스트를 위한 Supabase Edge Functions 프로젝트입니다.

## API: `get-coupons`

유저의 선호 카테고리에 맞는 쿠폰 목록을 반환합니다.

### Endpoint

```
POST https://<project-ref>.supabase.co/functions/v1/get-coupons
```

### Request

```json
{
  "user_id": "user_123",
  "prefer_categories": ["fashion", "food"]
}
```

| 필드 | 타입 | 설명 |
|---|---|---|
| `user_id` | string | 유저 식별자 |
| `prefer_categories` | string[] | 선호 카테고리 목록. 비어있으면 전체 반환. |

지원 카테고리: `fashion`, `food`, `beauty`, `electronics`, `travel`

### Response

```json
[
  {
    "coupon_id": "C001",
    "coupon_name": "봄 패션 10% 할인",
    "category": "fashion",
    "discount_amount": 10,
    "expired_at": "2026-09-30"
  }
]
```

### curl 예시

```bash
curl -X POST https://<project-ref>.supabase.co/functions/v1/get-coupons \
  -H "Authorization: Bearer <anon-key>" \
  -H "Content-Type: application/json" \
  -d '{"user_id": "user_123", "prefer_categories": ["fashion", "food"]}'
```

## Braze Connected Content 연동 예시

```liquid
{% capture postbody %}
{
  "user_id": "{{ ${user_id} }}",
  "prefer_categories": {{ custom_attribute.${prefer_categories} | to_json }}
}
{% endcapture %}

{% connected_content
    https://<project-ref>.supabase.co/functions/v1/get-coupons
    :method post
    :headers {
      "Authorization": "Bearer <anon-key>",
      "Content-Type": "application/json"
    }
    :body {{postbody}}
    :save coupons
%}

{% for coupon in coupons %}
{{ coupon.coupon_name }} - {{ coupon.discount_amount }} 할인 ({{ coupon.expired_at }} 까지)
{% endfor %}
```

## 배포 방법

```bash
# 1. Supabase 로그인
supabase login

# 2. 프로젝트 연결
supabase link --project-ref <project-ref>

# 3. 배포
supabase functions deploy get-coupons --no-verify-jwt
```
