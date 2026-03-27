module "s3" {
  source      = "../../modules/s3_frontend"
  bucket_name = var.bucket_name
  environment = var.environment
  cloudfront_arn = module.cloudfront.distribution_arn

}

module "waf" {
  source      = "../../modules/waf"
  environment = var.environment
}

module "cloudfront" {
  source              = "../../modules/cloudfront"
  bucket_domain_name  = module.s3.bucket_domain_name
  acm_certificate_arn = var.acm_certificate_arn
  waf_arn             = module.waf.arn
  environment        = var.environment
}

