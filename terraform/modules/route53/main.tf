// Route53에서 도메인 영역을 생성하는 리소스
resource "aws_route53_zone" "mindscape_domain" {
    name = var.domain_name
}

// Route53에서 도메인 레코드를 생성하는 리소스
resource "aws_route53_record" "mindscape_domain_record" {
    zone_id = aws_route53_zone.mindscape_domain.zone_id // 생성된 도메인 영역의 ID
    name = "www.${var.domain_name}" // www 서브도메인 생성
    type = "A" // A 레코드 타입

    alias{
        name = var.cloudfront_domain_name // CloudFront 도메인 이름
        zone_id = var.cloudfront_hosted_zone_id // CloudFront 호스팅 영역 ID
        evaluate_target_health = true // 대상의 상태를 평가
    }
}
