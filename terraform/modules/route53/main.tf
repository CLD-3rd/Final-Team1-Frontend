# 이미 존재하는 hosted zone 조회
data "aws_route53_zone" "main" {
  name = var.domain_name
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