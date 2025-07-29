# 이미 존재하는 hosted zone 조회
data "aws_route53_zone" "main" {
  name = var.domain_name
}

# A record 생성 (ipv4)
resource "aws_route53_record" "a_record" {
  # 서브도메인 리스트에 대해 각각 레코드 생성
  for_each = toset(var.subdomain_names)

  zone_id  = data.aws_route53_zone.main.zone_id
  # 빈 값이면 서브도메인 없음
  name = each.value == "" ? var.domain_name : "${each.value}.${var.domain_name}"
  type = "A"

  # cloudfront로 포인팅
  alias {
    name = var.cloudfront_domain_name
    zone_id = var.cloudfront_hosted_zone_id
    evaluate_target_health = false
  }
}

# AAAA record 생성 (ipv6)
resource "aws_route53_record" "aaaa_record" {
  for_each = toset(var.subdomain_names)

  zone_id = data.aws_route53_zone.main.zone_id
  name = each.value == "" ? var.domain_name : "${each.value}.${var.domain_name}"
  type = "AAAA"

  alias {
    name = var.cloudfront_domain_name
    zone_id = var.cloudfront_hosted_zone_id
    evaluate_target_health = false
  }
}

# acm 인증서 검증용 record
resource "aws_route53_record" "cert_validation" {
  for_each = length(var.acm_certificate_domain_validation_options) > 0 ? {
    # acm 반환된 검증용 cname 정보 목록 순회
    for dvo in var.acm_certificate_domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  } : {}

  # 동일 레코드 있으면 덮어쓰기
  allow_overwrite = true

  # dns 검증용 cname 레코드 생성
  name = each.value.name
  records = [each.value.record]
  ttl = 60
  type = each.value.type
  zone_id = data.aws_route53_zone.main.zone_id
}