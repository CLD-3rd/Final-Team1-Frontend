variable "prefix" {
  description = "Prefix for CloudFront module"
  type        = string
}

variable "bucket_regional_domain_name" {
  description = "S3 bucket region domain name"
  type        = string
}

variable "bucket_id" {
  description = "S3 bucket ID"
  type        = string
}

variable "bucket_arn" {
  description = "S3 bucket ARN"
  type        = string
}

variable "acm_certificate_arn" {
  description = "ACM certificate ARN"
  type        = string
  default     = ""
}

variable "domain_names" {
  description = "Domain CNAME list"
  type        = list(string)
}