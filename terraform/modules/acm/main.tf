terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
      # 별도 리전용 프로바이더 지정하도록 alias 설정
      configuration_aliases = [ aws.us-east-1 ]
    }
  }
}

# ACM cert 생성 (cloudfront acm cert = us-east-1에서만 생성가능)
resource "aws_acm_certificate" "fe" {
  provider = aws.us-east-1

  # 기본 도메인
  domain_name = var.domain_name
  # 추가 도메인 목록
  subject_alternative_names = var.subject_alternative_names
  validation_method = var.validation_method

  lifecycle {
    # 갱신시 새 인증서 생성후 기존 인증서 파괴
    create_before_destroy = true
  }

  tags = {
    "Name" = "${var.prefix}-certificate"
  }
}

