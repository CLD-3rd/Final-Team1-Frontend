variable "domain_name" {
  description = "Route domain name"
  type = string
}

variable "subdomain_names" {
  description = "Subdomain list"
  type = list(string)
}


variable "acm_certificate_domain_validation_options" {
  description = "ACM domain validation"
  type = list(object({
    domain_name       = string
    resource_record_name = string
    resource_record_type = string
    resource_record_value = string 
  }))
  default = []
}