variable "bucket_name" {
  type = string
}
variable "environment" {
  description = "Environment name (prod / test)"
  type        = string
}

variable "cloudfront_arn" {
  type = string
}
