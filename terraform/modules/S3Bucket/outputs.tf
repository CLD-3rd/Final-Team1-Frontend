// S3 버킷 ID를 출력
output "bucket_id" {
  value = aws_s3_bucket.frontend_bucket.id
}

// S3 버킷의 지역 도메인 이름을 출력
output "bucket_regional_domain_name" {
  value = aws_s3_bucket.frontend_bucket.bucket_regional_domain_name
}

// S3 버킷의 ARN을 출력
output "bucket_arn" {
  value = aws_s3_bucket.frontend_bucket.arn
}