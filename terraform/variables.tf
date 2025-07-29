variable "aws_region" {
  description = "AWS Region"
  type        = string
}

variable "prefix" {
  description = "Prefix"
  type        = string
}

variable "domain_name" {
  description = "Domain name"
  type        = string
}

variable "bucket_name" {
  description = "S3 bucket name"
  type        = string
}

variable "github_allowed_repo" {
  description = "Allowed github repo list (username/repo-name)"
  type        = list(string)
}

variable "log_bucket_name" {
  description = "S3 bucket name for Cloudfront access log"
  type        = string
}