terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# ACM cert provider (Cloudfront = us-east-1 인증서만 사용 가능)
provider "aws" {
  alias = "us-east-1"
  region = "us-east-1"
}

module "acm" {
  source = "./modules/acm"
  
  providers = {
    "aws.us-east-1" = aws.us-east-1
  }

  domain_name = var.domain_name
  subject_alternative_names = ["*.${var.domain_name}"]
  validation_method = "DNS"
  validation_record_fqdns = [ for record in module.route53.cert_calidation_records : record.fqdn ]
  prefix = var.prefix

  depends_on = [ module.route53 ]
}

module "cloudfront" {
  source = "./modules/cloudfront"

  prefix = var.prefix
  bucket_id = module.s3_bucket_id
  bucket_regional_domain_name = module.s3.bucket_regional_domain_name
  domain_names = [ var.domain_name, "www.${var.domain_name}" ]
  acm_certificate_arn = module.acm.certificate_arn

  depends_on = [ module.acm ]
}

module "s3" {
  source = "./modules/s3"

  bucket_name = var.bucket_name
  prefix = var.prefix
  cloudfront_distribution_arn = module.cloudfront.distribution_arn
}

module "route53" {
  source = "./modules/route53"

  domain_name = var.domain_name
  subdomain_names = ["", "www"]
  cloudfront_domain_name = module.cloudfront.distribution_domain_name
  cloudfront_hosted_zone_id = module.cloudfront.distribution_hosted_zone_id
  acm_certificate_domain_validation_options = module.acm.domain_validation_options
}

module "github_oidc" {
  source = "./modules/oidc"

  prefix = var.prefix
  allowed_repositories = var.github_allowed_repo
  bucket_arn = module.s3.bucket_arn
  distribution_arn = module.cloudfront.distribution_arn
}

# S3 퍼블릭 전면 차단
# CloudFront origin access control(OAC)통해서만 (Cloudfront캐시 계층 경유 요청만 허용) 버킷 내 객체 읽을 수 있도록 s3 버킷 정책
# Cloudfront 생성시 OAC 생성 필요 (S3 에 서명기반 요청) → OAC ID 를 s3 정책/CloudFront origin 설정에 연결하면 Cloudfornt 만 s3에 접근 가능 == oidc 생성 필요
# OIDC로 GitHub actions에서 s3로 배포 가능 (s3 퍼블릭 만 차단 → oidc로 자격 증명)