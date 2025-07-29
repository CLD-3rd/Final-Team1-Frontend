terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
      # 별도 리전용 프로바이더 지정하도록 alias 설정
      configuration_aliases = [aws.us-east-1]
    }
  }
}

# 이미 존재하는 hosted zone 조회
data "aws_route53_zone" "main" {
  name = var.domain_name
}

# ACM validation dns records 생성
resource "aws_route53_record" "cert_validation" {
  for_each = { for idx, domain in var.acm_domains_for_validation : idx => domain }

  name            = var.acm_certificate_domain_validation_options[each.key].resource_record_name
  type            = var.acm_certificate_domain_validation_options[each.key].resource_record_type
  records         = [var.acm_certificate_domain_validation_options[each.key].resource_record_value]
  ttl             = 60
  zone_id         = data.aws_route53_zone.main.zone_id
  allow_overwrite = true
}

# ACM cert validation
resource "aws_acm_certificate_validation" "fe" {
  provider = aws.us-east-1

  certificate_arn = var.acm_certificate_arn
  # dns 검증용 레코드 fqdn(fully qualified domain name) 목록
  validation_record_fqdns = [for record in aws_route53_record.cert_validation : record.fqdn]

  timeouts {
    # 인증서 검증 완료까지 대기 시간
    create = "30m"
  }
}

# a record 생성 (ipv4)
resource "aws_route53_record" "frontend_a" {
  for_each = toset(var.subdomain_names)
  zone_id  = data.aws_route53_zone.main.zone_id
  name     = each.value == "" ? var.domain_name : "${each.value}.${var.domain_name}"
  type     = "A"
  alias {
    name                   = var.cloudfront_distribution_domain_name
    zone_id                = var.cloudfront_distribution_hosted_zone_id
    evaluate_target_health = false
  }
}

# aaaa record 생성 (ipv6)
resource "aws_route53_record" "frontend_aaaa" {
  for_each = toset(var.subdomain_names)
  zone_id  = data.aws_route53_zone.main.zone_id
  name     = each.value == "" ? var.domain_name : "${each.value}.${var.domain_name}"
  type     = "AAAA"
  alias {
    name                   = var.cloudfront_distribution_domain_name
    zone_id                = var.cloudfront_distribution_hosted_zone_id
    evaluate_target_health = false
  }
}