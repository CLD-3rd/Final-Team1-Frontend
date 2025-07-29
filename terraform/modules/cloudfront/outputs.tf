output "distribution_id" {
  description = "CloudFront distribution ID"
  value       = aws_cloudfront_distribution.fe.id
}

output "distribution_arn" {
  description = "CloudFront distribution ARN"
  value       = aws_cloudfront_distribution.fe.arn
}

output "distribution_domain_name" {
  description = "CloudFront distribution domain name"
  value       = aws_cloudfront_distribution.fe.domain_name
}

output "distribution_hosted_zone_id" {
  description = "CloudFront distribution hosting zone ID"
  value       = aws_cloudfront_distribution.fe.hosted_zone_id
}