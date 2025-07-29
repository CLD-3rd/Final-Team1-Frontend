output "distribution_id" {
  description = "CloudFront distribution ID"
  value = aws_cloudfront_distribution.FE.id
}

output "distribution_arn" {
  description = "CloudFront distribution ARN"
  value = aws_cloudfront_distribution.FE.arn
}

output "distribution_domain_name" {
  description = "CloudFront distribution domain name"
  value = aws_cloudfront_distribution.FE.domain_name
}

output "distribution_hosted_zone_id" {
  description = "CloudFront distribution hosting zone ID"
  value = aws_cloudfront_distribution.FE.hosted_zone_id
}