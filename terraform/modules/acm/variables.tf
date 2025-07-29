variable "prefix" {
  description = "Prefix for ACM module"
  type = string
}

variable "domain_name" {
  description = "Domain name"
  type = string
}

variable "subject_alternative_names" {
  description = "Subject alternative names"
  type = list(string)
  default = []
}

variable "validation_method" {
  description = "Cert validation method (DNS or EMAIL)"
  type = string
  default = "DNS"
}

variable "validation_record_fqdns" {
  description = "FQDN list for DNS validation"
  type = list(string)
  default = [ ]
}