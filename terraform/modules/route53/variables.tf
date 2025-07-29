variable "domain_name" {
  description = "Route domain name"
  type = string
}

variable "subdomain_names" {
  description = "Subdomain list"
  type = list(string)
}

variable "cloudfront_domain_name" {
  description = "Cloudfront distribution domain name"
  type = string
}

variable "cloudfront_hosted_zone_id" {
  description = "Cloudfront hosting zone ID"
  type = string
}

variable "acm_certificate_domain_validation_options" {
  description = "ACM domain validation"
  type = list(object({
    domain_name       = string
    resource_record_name = string
    resource_record_type = string
    resource_record_value = string 
  }))
  default = []
}