// CloudFront 배포의 도메인 이름을 출력
output "distribution_domain_name" {
  value = aws_cloudfront_distribution.website_distribution.domain_name
}

// CloudFront 배포의 호스팅 영역 ID를 출력
output "distribution_hosted_zone_id" {
  value = aws_cloudfront_distribution.website_distribution.hosted_zone_id
}

// CloudFront OAI의 IAM ARN을 출력
output "aws_cloudfront_origin_access_identity_oai_iam_arn" {
  value = aws_cloudfront_origin_access_identity.oai.iam_arn
}