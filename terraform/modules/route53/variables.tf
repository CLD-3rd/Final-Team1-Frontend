// CloudFront의 도메인 이름을 정의하는 변수
variable "cloudfront_domain_name" {
  type = string
}

// CloudFront의 호스팅 영역 ID를 정의하는 변수
variable "cloudfront_hosted_zone_id" {
  type = string
}

// Route53에서 사용할 도메인 이름을 정의하는 변수
variable "domain_name" {
  type = string
}