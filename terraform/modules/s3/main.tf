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

  # 버킷 acl 활성화
  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = true
}

# 버킷 객체 소유권 => 버킷 owner, cloudfront가 로그 업로드 허용
resource "aws_s3_bucket_ownership_controls" "fe_log" {
  bucket = aws_s3_bucket.fe_log.id
  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

resource "aws_s3_bucket_policy" "fe_log" {
  bucket = aws_s3_bucket.fe_log.id
  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Principal = { Service = "delivery.logs.amazonaws.com" },
        Action = "s3:PutObject",
        Resource = "${aws_s3_bucket.fe_log.arn}/*",
        Condition = {
          StringEquals = {
            "s3:x-amz-acl" = "bucket-owner-full-control"
          }
        }
      },
      {
        Effect = "Allow",
        Principal = { Service = "delivery.logs.amazonaws.com" },
        Action = "s3:GetBucketAcl",
        Resource = aws_s3_bucket.fe_log.arn
      }]
  })
  depends_on = [aws_s3_bucket_ownership_controls.fe_log]
}