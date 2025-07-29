variable "aws_region" {
    description = "AWS Region"
    type = string
    default = "ap-northeast-2"
}

variable "prefix" {
    description = "Prefix"
  type = string
  default = "Team1-front"
}

variable "domain_name" {
  description = "Domain name"
  type = string
}

variable "bucket_name" {
  description = "S3 bucket name"
  type = string
}

variable "github_allowed_repo" {
  description = "Allowed github repo list"
  type = list(string)
  default = [ ]
}