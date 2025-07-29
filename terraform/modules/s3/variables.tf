variable "bucket_name" {
  default = "S3 Bucket Name"
  type    = string
}

variable "prefix" {
  description = "Prefix for S3 module"
  type        = string
}