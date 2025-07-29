output "S3_BUCKET_NAME" {
  description = "GitHub secrets(S3_BUCKET_NAME) - S3 bukcet ID"
  value       = module.s3.bucket_id
}

output "AWS_ROLE_ARN" {
  description = "GitHub secrets(AWS_ROLE_ARN) - Github IAM Role ARN"
  value       = module.github_oidc.role_arn
}

output "CLOUDFRONT_DISTRIBUTION_ID" {
  description = "GitHub secrets(CLOUDFRONT_DISTRIBUTION_ID) - Cloudfront distribution ID"
  value       = module.cloudfront.distribution_id
}

output "AWS_REGION" {
  description = "GitHub secrets(AWS_REGION) - AWS region"
  value       = var.aws_region
}

output "web_urls" {
  description = "Frontend access URL"
  value = [
    "https://${var.domain_name}",
    "https://www.${var.domain_name}"
  ]
}

# output "cloudfront_distribution_domain" {
#   description = "CloudFront distribution domain"
#   value       = module.cloudfront.distribution_domain_name
# }
#
# output "acm_certificate_status" {
#   description = "ACM certificate status"
#   value       = module.acm.certificate_status
# }
#
#
#
# output "s3_bucket_arn" {
#   description = "S3 bucket ARN"
#   value = module.s3.bucket_arn
# }
#
# output "s3_bucket_domain_name" {
#   description = "S3 bukcet domain name"
#   value       = module.s3.bucket_domain_name
# }
#
# output "s3_bucket_regional_domain_name" {
#   description = "S3 bucket region domain name"
#   value = module.s3.bucket_regional_domain_name
# }
#
# output "s3_fe_log_bucket_domain_name" {
#   description = "Frontend CloudFront access log S3 bucket"
#   value = module.s3.log_bucket_domain_name
# }
#
# output "route53_zone_id" {
#   description = "Route53 hosting zone ID"
#   value = module.route53.zone_id
# }
#
# output "route53_name_servers" {
#   description = "Route53 nameserver"
#   value = module.route53.name_servers
# }
#
# output "github_role_name" {
#   description = "Github IAM Role name"
#   value       = module.github_oidc.role_name
# }
#
# output "github_oidc_provider_arn" {
#   description = "Github OIDC Provider ARN"
#   value       = module.github_oidc.oidc_provider_arn
# }
#
# output "cf_distribution_arn" {
#   description = "CloudFront distribution ARN"
#   value = module.cloudfront.distribution_arn
# }
#
# output "cf_distribution_hosted_zone_id" {
#   description = "CloudFront distribution hosted zone ID"
#   value = module.cloudfront.distribution_hosted_zone_id
# }
#
# output "acm_cert_arn" {
#   description = "ACM certificate ARN"
#   value       = module.acm.certificate_arn
# }
#
# output "acm_cert_id" {
#   description = "ACM certificate ID"
#   value       = module.acm.certificate_id
# }
#
# output "acm_dom_val_opt" {
#   description = "ACM Domain validation option"
#   value       = module.acm.domain_validation_options
# }