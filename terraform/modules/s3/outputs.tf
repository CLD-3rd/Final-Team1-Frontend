output "bucket_id" {
  description = "S3 bucket ID"
  value = aws_s3_bucket.fe.id
}

output "bucket_arn" {
  description = "S3 bucket ARN"
  value = aws_s3_bucket.fe.arn
}

output "bucket_domain_name" {
  description = "S3 bucket domain name"
  value = aws_s3_bucket.fe.bucket_domain_name
}

output "bucket_regional_domain_name" {
  description = "S3 bucket region domain name"
  value = aws_s3_bucket.fe.bucket_regional_domain_name
}