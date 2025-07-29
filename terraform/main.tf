# S3 버킷 모듈 설정
# 정적 웹사이트 파일들을 저장할 스토리지 공간 생성
module "s3_bucket" {
    source = "./modules/S3Bucket"
    oai_iam_arn = module.cloudfront.aws_cloudfront_origin_access_identity_oai_iam_arn // CloudFront OAI ARN
    frontend_bucket_id = var.frontend_bucket_id // S3 버킷 ID
}

// CloudFront 모듈 설정
module "cloudfront" {
    source = "./modules/cloudFront"
    frontend_bucket_id = var.frontend_bucket_id // S3 버킷 ID
    bucket_regional_domain_name = module.s3_bucket.bucket_regional_domain_name // S3 버킷 지역 도메인 이름
}

// Route53 모듈 설정
module "route53" {
    source = "./modules/route53"
    cloudfront_hosted_zone_id = var.cloudfront_hosted_zone_id // CloudFront 호스팅 영역 ID
    cloudfront_domain_name = module.cloudfront.distribution_domain_name // CloudFront 도메인 이름
    domain_name = var.domain_name // 도메인 이름
}