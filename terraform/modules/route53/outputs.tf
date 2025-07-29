output "zone_id" {
  description = "Route53 hosting zone ID"
  value       = data.aws_route53_zone.main.zone_id
}

output "name_servers" {
  description = "Route53 nameserver"
  value       = data.aws_route53_zone.main.name_servers
}


output "cert_validation_records" {
  description = "ACM certificate validation record"
  value = aws_route53_record.cert_validation
}
