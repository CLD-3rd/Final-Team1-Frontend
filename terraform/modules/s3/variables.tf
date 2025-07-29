variable "bucket_name" {
  default = "S3 Bucket Name"
  type    = string
}

variable "prefix" {
  description = "Prefix for S3 module"
  type        = string
}

variable "log_bucket_name" {
  description = "S3 bucket name for log"
  type = string
}