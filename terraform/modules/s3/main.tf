terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }
  }
}
# content bucket 생성
resource "aws_s3_bucket" "fe" {
  bucket = var.bucket_name

  tags = {
    "Name" = "${var.prefix}-bucket"
  }
}

resource "aws_s3_bucket_versioning" "fe" {
  bucket = aws_s3_bucket.fe.id

  versioning_configuration {
    status = "Enabled"
  }
}

# 퍼블릭 엑세스 전면 차단
resource "aws_s3_bucket_public_access_block" "fe" {
  bucket = aws_s3_bucket.fe.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# 모든 객체 서버사이드 암호화 / 별도 키 관리 필요 없는 s3 관리형 키로 객체 암호화
resource "aws_s3_bucket_server_side_encryption_configuration" "fe" {
  bucket = aws_s3_bucket.fe.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

# log bucket 생성
resource "aws_s3_bucket" "fe_log" {
  bucket = var.log_bucket_name

  tags = {
    "Name" = "${var.prefix}-log-bucket"
  }
}

resource "aws_s3_bucket_public_access_block" "fe_log" {
  bucket = aws_s3_bucket.fe_log.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# AWS log delivery service가 로그 쓸 수 있도록 acl 설정
resource "aws_s3_bucket_acl" "fe_log_bucket_acl" {
  bucket = aws_s3_bucket.fe_log.id
  acl    = "log-delivery-write"
}