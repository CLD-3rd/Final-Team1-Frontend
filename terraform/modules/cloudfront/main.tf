
# 클라우드프론트 Origin access control 생성
resource "aws_cloudfront_origin_access_control" "fe" {
  name                              = "${var.prefix}-oac"
  description                       = "OAC for ${var.prefix}-s3"
  origin_access_control_origin_type = "s3"
  # 요청마다 서명
  signing_behavior = "always"
  signing_protocol = "sigv4"
}

#CF 생성 및 설정
resource "aws_cloudfront_distribution" "fe" {
  # origin = s3
  origin {
    domain_name              = var.bucket_regional_domain_name
    origin_access_control_id = aws_cloudfront_origin_access_control.fe.id
    origin_id                = var.bucket_id
  }

  enabled             = true
  is_ipv6_enabled     = true
  comment             = "${var.prefix}-cf-distribution"
  # 루트 요청시 반환 기본 객체
  default_root_object = "index.html"
  aliases = var.domain_names

  # logging_config {
  #   include_cookies = false
  #   bucket = var.bucket_regional_doma
  # }


  # 기본 캐싱 정책
  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = var.bucket_id

    forwarded_values {
      # query 스트링 포워딩 안함
      query_string = false
      # CORS 처리 위해 Origin, Access-Control-* 헤더만 전달
      headers      = ["Origin", "Access-Control-Request-Method", "Access-Control-Request-Headers"]

      cookies {
        # 쿠키 전달 안함
        forward = "none"
      }
    }

    # https 리다이렉트
    viewer_protocol_policy = "redirect-to-https"
    # 캐시 유효기간 초
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
    compress               = true
  }

  # 접속 국가 제한
  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  # SSL TLS 인증성
  viewer_certificate {
    cloudfront_default_certificate = var.acm_certificate_arn == "" ? true : false
    acm_certificate_arn            = var.acm_certificate_arn != "" ? var.acm_certificate_arn : null
    ssl_support_method = var.acm_certificate_arn != "" ? "sni-only" : null
    minimum_protocol_version = var.acm_certificate_arn != "" ? "TLSv1.2_2021" : null

  }

  tags = {
    "Name" = "${var.prefix}-cf-distribution"
  }
}
