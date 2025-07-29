variable "thumbprint_list" {
  description = "Github OIDC thumbprint list"
  type        = list(string)
  default = [
    "6938fd4d98bab03faadb97b34396831e3780aea1"
  ]
}

variable "prefix" {
  description = "Prefix for OIDC module"
  type        = string
}

variable "allowed_repositories" {
  description = "Allowed github repo list (username/repo-name)"
  type        = list(string)
}

variable "bucket_arn" {
  description = "Allowed S3 bucket ARN"
  type        = string
}

variable "distribution_arn" {
  description = "Allowed CloudFront distribution ARN for invalidation"
  type        = string
}