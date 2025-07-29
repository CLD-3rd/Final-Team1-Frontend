terraform {
  required_providers {
    aws = {
      source = "hashicorp/aws" // AWS 제공자를 HashiCorp 레지스트리에서 가져옴
      version = "~> 4.0"       // AWS 제공자의 4.x 버전 사용
    }
  }
  // Terraform Cloud 구성
  cloud {
    organization = "to-doorjh"  // 테라폼 클라우드 조직 이름
    tags = ["mindscape-frontend"] // 태그 설정
    workspaces {
      name = "tfc-devops"  // 워크스페이스 이름
    }
  }
}

provider "aws" {
  region = "ap-northeast-2" // Set the AWS region to US East (N. Virginia)
}
