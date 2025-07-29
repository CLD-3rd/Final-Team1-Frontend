// S3 버킷 ID를 정의하는 변수
variable "frontend_bucket_id" {
  type = string
}
// CloudFront의 호스팅 영역 ID를 정의하는 변수
variable "cloudfront_hosted_zone_id" {
  type = string
}

// 도메인 이름을 정의하는 변수
variable "domain_name" {
  type = string
}