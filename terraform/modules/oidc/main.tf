# github에서 AWS에 oidc 방식으로 연동할 수 있도록 하는 oidc provider 생성
resource "aws_iam_openid_connect_provider" "github" {
  # Github actions가 토큰 발급하는 oidc endpoint url
  url = "https://token.actions.githubusercontent.com"

  # 발급받은 토큰을 aws sts통해 교환시 허용할 클라이언트 id
  client_id_list = ["sts.amazonaws.com"]

  # github oidc 제공자의 tls 인증서 thumbprint -> aws가 provider ep와 안전하게 통신했음 검증
  thumbprint_list = var.thumbprint_list

  tags = {
    "Name" = "${var.prefix}-github-oidc"
  }
}

# github actions가 aws 리소스 접근시 사용할 iam role
resource "aws_iam_role" "github" {
  name = "${var.prefix}-github-actions-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          # 만든 oidc provider로 부터 발급된 토큰만
          Federated = aws_iam_openid_connect_provider.github.arn
        }
        # oidc 토큰으로 role 획득하는 sts api 호출
        Action = "sts:AssumeRoleWithWebIdentity"
        Condition = {
          StringEquals = {
            # 토큰 audience 가 aws sts용인지 검증
            "token.actions.githubusercontent.com:aud" = "sts.amazonaws.com"
          }
          StringLike = {
            # 토큰 subject가 특정 레포에서 발급된 것만 허용
            "token.actions.githubusercontent.com:sub" = [
              for repo in var.allowed_repositories : "repo:${repo}:*"
            ]
          }
        }
      }
    ]
  })

  tags = {
    "Name" = "${var.prefix}-github-actions-role"
  }
}

# 생성한 iam role에 policy 부여
resource "aws_iam_role_policy" "github" {
  name = "${var.prefix}-github-actions-role-policy"

  role = aws_iam_role.github.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        # 버킷자체, 버킷내 모든 객체에 대한 crud
        Effect = "Allow"
        Action = [
          "s3:ListBucket",
          "s3:PutObject",
          "s3:GetObject",
          "s3:DeleteObject",
          "s3:PutObjectAcl"
        ]
        Resource = [
          var.bucket_arn, "${var.bucket_arn}/*"
        ]
      },
      {
        # cloudfront 캐시 무효화
        Effect = "Allow"
        Action = [
          "cloudfront:CreateInvalidation"
        ]
        Resource = [
          var.distribution_arn
        ]
      }
    ]
  })
}