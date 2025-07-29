# 이미 존재하는 hosted zone 조회
data "aws_route53_zone" "main" {
  name = var.domain_name
}

