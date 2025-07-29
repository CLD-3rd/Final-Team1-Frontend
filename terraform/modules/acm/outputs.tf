output "certificate_arn" {
  description = "ACM cert ARN"
  value = aws_acm_certificate.fe.arn
}

output "certificate_id" {
  description = "ACM cert ID"
  value = aws_acm_certificate.fe.id
}

output "certificate_status" {
  description = "ACM cert status"
  value = aws_acm_certificate.fe.status
}

output "domain_validation_options" {
  description = "Domain validation option"
  value = aws_acm_certificate.fe.domain_validation_options
}

output "validation_id" {
  description = "ACM cert validation ID"
  value = aws_acm_certificate_validation.fe.id
}