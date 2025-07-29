resource "aws_s3_bucket" "frontend_bucket" {
  bucket = var.frontend_bucket_id
}

// S3 버킷의 웹사이트 구성
resource "aws_s3_bucket_website_configuration" "frontend_bucket_website_config" {
    bucket = aws_s3_bucket.frontend_bucket.id


    index_document {
        suffix = "index.html"
    }

    error_document {
        key = "error.html"
    }

}

// S3 버킷의 공용 액세스 차단 설정
resource "aws_s3_bucket_public_access_block" "website_public_access" {
    bucket = aws_s3_bucket.frontend_bucket.id

    block_public_acls = false
    block_public_policy = false
    ignore_public_acls = false
    restrict_public_buckets = false
}

// S3 버킷 정책 설정
resource "aws_s3_bucket_policy" "website_bucket_policy" {
    bucket = aws_s3_bucket.frontend_bucket.id


    policy = jsonencode({
        Version = "2012-10-17"
        Statement = [
            {
                Sid       = "AllowCloudFrontAccess"
                Effect    = "Allow"
                Principal = { AWS = var.oai_iam_arn }
                Action    = "s3:GetObject"
                Resource  = "${aws_s3_bucket.frontend_bucket.arn}/*"
            }
        ]
    })
}