// CloudFront OAI(Origin Access Identity) 생성
resource "aws_cloudfront_origin_access_identity" "oai" {
  comment = "OAI for website bucket"
}

// CloudFront 배포 생성
resource "aws_cloudfront_distribution" "website_distribution" {
    enabled = true // 배포 활성화
    is_ipv6_enabled = true // IPv6 활성화
    default_root_object = "index.html" // 기본 루트 객체 설정

    origin {
        domain_name = var.bucket_regional_domain_name // S3 버킷의 지역 도메인 이름
        origin_id = var.frontend_bucket_id // S3 버킷 ID

        s3_origin_config {
            origin_access_identity = aws_cloudfront_origin_access_identity.oai.cloudfront_access_identity_path
        }
    }

    default_cache_behavior {
        allowed_methods = ["GET", "HEAD"] // 허용된 HTTP 메서드
        cached_methods = ["GET", "HEAD"] // 캐시된 HTTP 메서드
        target_origin_id = var.frontend_bucket_id // 대상 원본 ID
        viewer_protocol_policy = "redirect-to-https" // HTTPS로 리디렉션

        forwarded_values {
            query_string = true // 쿼리 문자열 전달
            cookies {
                forward = "all" // 모든 쿠키 전달
            }
        }

        min_ttl = 0 // 최소 TTL
        default_ttl = 3600 // 기본 TTL
        max_ttl = 86400 // 최대 TTL
        
        }
    restrictions {
        geo_restriction {
            restriction_type = "none" // 지리적 제한 없음
    }
}

viewer_certificate {
    cloudfront_default_certificate = true // 기본 CloudFront 인증서 사용
    }
}
