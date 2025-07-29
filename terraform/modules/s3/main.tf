# bucket 생성
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

# CloudFront Origin access control 통해서만 버킷 객체 읽을 수 있도록 정책 설정
# resource "aws_s3_bucket_policy" "fe" {
#   bucket = aws_s3_bucket.fe.id

#   policy = jsonencode({
#     Version = "2012-10-17"
#     Statement = [
#       {
#         Effect = "Allow"
#         # CloudFront에 권한 부여
#         Principal = {
#           Service = "cloudfront.amazonaws.com"
#         }
#         # Resource의 S3 getObject 권한
#         Action   = "s3:GetObject"
#         Resource = "${aws_s3_bucket.fe.arn}/*"

#         # "AWS:SourceArn"의 값이 var.cloudfront_distribution_arn와 똑같을 때만
#         Condition = {
#           StringEquals = {
#             "AWS:SourceArn" = var.cloudfront_distribution_arn
#           }
#         }
#       }
#     ]
#     }
#   )
# }
