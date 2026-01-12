variable "bucket_domain_name" {
  description = "S3 bucket regional domain name"
  type        = string
}

variable "acm_certificate_arn" {
  description = "ACM certificate ARN (must be in us-east-1)"
  type        = string
}

variable "waf_arn" {
  description = "WAF Web ACL ARN"
  type        = string
}

variable "environment" {
  description = "Environment name (prod / test)"
  type        = string
}
