output "role_arn" {
  description = "Github IAM Role ARN"
  value = aws_iam_role.github.arn
}

output "role_name" {
  description = "Github IAM ROle name"
  value = aws_iam_role.github.name
}

output "oidc_provider_arn" {
  description = "Github OIDC Provider ARN"
  value = aws_iam_openid_connect_provider.github.arn
}

