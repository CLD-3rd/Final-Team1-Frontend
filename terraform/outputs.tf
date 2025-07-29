output "cloudfront_distribution_domain" {
  description = "CloudFront distribution domain"
  value = module.cloudfront.distribution_domain_name
}

output "s3_bucket_id" {
  description = "S3 bukcet ID"
  value = module.s3.bucket_id
}

output "s3_bucket_domain_name" {
    description = "S3 bukcet domain name"
  value = module.s3.bucket_domain_name
}

output "web_urls" {
  description = "Website URL"
  value = module.route53.fe_urls
}

output "acm_certificate_status" {
  description = "ACM certificate status"
  value = module.acm.certificate_status
}

output "github_role_arn" {
  description = "Github IAM Role ARN (Paste to github secret)"
  value = module.github_oidc[0].role_arn
}

