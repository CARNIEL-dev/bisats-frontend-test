###########
############################################
resource "aws_cloudfront_origin_access_control" "this" {
  name                              = "frontend-oac"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

############################################
# Cache Policy (REQUIRED)
############################################
resource "aws_cloudfront_cache_policy" "this" {
  name = "frontend-cache-policy"

  default_ttl = 3600
  max_ttl     = 86400
  min_ttl     = 0

  parameters_in_cache_key_and_forwarded_to_origin {
    cookies_config {
      cookie_behavior = "none"
    }

    headers_config {
      header_behavior = "none"
    }

    query_strings_config {
      query_string_behavior = "none"
    }
  }
}

############################################
# CloudFront Distribution
############################################
resource "aws_cloudfront_distribution" "this" {
  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"
  price_class         = "PriceClass_100"

  ##########################################
  # Origin (Private S3 via OAC)
  ##########################################
  origin {
    domain_name              = var.bucket_domain_name
    origin_id                = "s3-origin"
    origin_access_control_id = aws_cloudfront_origin_access_control.this.id
  }

  ##########################################
  # Default Cache Behavior
  ##########################################
  default_cache_behavior {
    target_origin_id       = "s3-origin"
    viewer_protocol_policy = "redirect-to-https"

    allowed_methods = ["GET", "HEAD"]
    cached_methods  = ["GET", "HEAD"]

    cache_policy_id = aws_cloudfront_cache_policy.this.id
  }

  ##########################################
  # Security & SSL
  ##########################################
  viewer_certificate {
    acm_certificate_arn      = var.acm_certificate_arn
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1.2_2021"
  }

  ##########################################
  # WAF
  ##########################################
  web_acl_id = var.waf_arn

  ##########################################
  # Restrictions
  ##########################################
  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  ##########################################
  # Logging (optional – cost-saving default OFF)
  ##########################################
  tags = {
    Project     = "BISATS"
    Environment = var.environment
  }
}
