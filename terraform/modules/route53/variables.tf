variable "domain_name" {
  description = "Route domain name"
  type        = string
}

variable "subdomain_names" {
  description = "Subdomain list"
  type        = list(string)
}

variable "acm_domains_for_validation" {
  description = "Domain list for ACM validation"
  type        = list(string)
  default     = []
}

variable "acm_certificate_domain_validation_options" {
  description = "ACM domain validation"
  type = list(object({
    domain_name           = string
    resource_record_name  = string
    resource_record_type  = string
    resource_record_value = string
  }))
  default = []
}

variable "acm_certificate_arn" {
  description = "ACM certificate ARN for validation"
  type        = string
}

variable "cloudfront_distribution_domain_name" {
  description = "Cloudfront distribution domain name for alias record"
  type        = string
}

variable "cloudfront_distribution_hosted_zone_id" {
  description = "Cloudfront distribution hosted zone ID for alias record"
  type        = string
}