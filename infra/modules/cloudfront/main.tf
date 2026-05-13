############################################
# S3 Bucket for CloudFront Logs
############################################

resource "aws_s3_bucket" "cloudfront_logs" {
  bucket        = "bisats-cloudfront-logs-${var.environment}"
  force_destroy = true

  tags = {
    Name        = "cloudfront-logs"
    Environment = var.environment
  }
}

#  Block Public Access
resource "aws_s3_bucket_public_access_block" "logs_block" {
  bucket = aws_s3_bucket.cloudfront_logs.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

#  Enable Encryption
resource "aws_s3_bucket_server_side_encryption_configuration" "logs_encryption" {
  bucket = aws_s3_bucket.cloudfront_logs.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

#  Lifecycle Policy (Cost + Hygiene)
resource "aws_s3_bucket_lifecycle_configuration" "logs_lifecycle" {
  bucket = aws_s3_bucket.cloudfront_logs.id

  rule {
    id     = "log-expiry"
    status = "Enabled"

    expiration {
      days = 90
    }
  }
}

# 👤 Ownership Controls
resource "aws_s3_bucket_ownership_controls" "logs" {
  bucket = aws_s3_bucket.cloudfront_logs.id

  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

#  Private ACL

############################################
# CloudFront Security Headers Policy
############################################

resource "aws_cloudfront_response_headers_policy" "security_headers" {
  name = "frontend-security-headers-${var.environment}"

  security_headers_config {

    content_type_options {
      override = true
    }

    frame_options {
      frame_option = "DENY"
      override     = true
    }

    referrer_policy {
      referrer_policy = "strict-origin-when-cross-origin"
      override        = true
    }

    strict_transport_security {
      access_control_max_age_sec = 63072000
      include_subdomains         = true
      preload                    = true
      override                   = true
    }

content_security_policy {
      content_security_policy = "default-src 'self'; connect-src 'self' data: https://fonts.googleapis.com https://*.zohocdn.com https://www.gstatic.com https://api.ipify.org https://api.coingecko.com https://v1-api.bisats.com https://*.zohopublic.eu https://salesiq.zohopublic.eu https://*.zoho.eu https://*.zoho.com wss://*.zoho.eu wss://*.zoho.com https://*.zohosalesiq.eu https://*.mailchimp.com https://*.intuit.com https://9kvu81ddh3.execute-api.us-east-2.amazonaws.com https://*.facebook.com; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://accounts.google.com https://*.zohopublic.eu https://salesiq.zohopublic.eu https://*.zoho.eu https://*.zoho.com https://*.zohocdn.com https://*.zohosalesiq.eu https://chimpstatic.com https://*.mailchimp.com https://connect.facebook.net; worker-src 'self' blob:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://*.zohopublic.eu https://salesiq.zohopublic.eu https://*.zoho.eu https://*.zoho.com https://*.zohocdn.com https://*.zohosalesiq.eu; font-src 'self' data: https://fonts.gstatic.com https://*.zohocdn.com https://*.zoho.eu https://*.zoho.com; img-src 'self' data: https://*.zohopublic.eu https://salesiq.zohopublic.eu https://*.zoho.eu https://*.zoho.com https://*.zohocdn.com https://*.zohosalesiq.eu https://*.mailchimp.com https://chimpstatic.com https://*.facebook.com; frame-src 'self' https://*.zohopublic.eu https://salesiq.zohopublic.eu https://*.zoho.eu https://*.zoho.com https://*.zohosalesiq.eu; object-src 'none'; frame-ancestors 'none'; form-action 'self';"
      override = true
    }
  }

  remove_headers_config {
    items {
      header = "Server"
    }
}
}

############################################
# CloudFront Distribution
############################################

resource "aws_cloudfront_origin_access_control" "this" {
  name                              = "s3-oac"
  description                       = "OAC for S3 origin"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

resource "aws_cloudfront_distribution" "this" {
  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"
  price_class         = "PriceClass_100"

  aliases = ["bisats.com", "www.bisats.com"]
  
  origin {
    domain_name              = var.bucket_domain_name
    origin_id                = "s3-origin"
    origin_access_control_id = aws_cloudfront_origin_access_control.this.id
  }

  default_cache_behavior {
    target_origin_id       = "s3-origin"
    viewer_protocol_policy = "redirect-to-https"

    allowed_methods = ["GET", "HEAD"]
    cached_methods  = ["GET", "HEAD"]
    cache_policy_id = aws_cloudfront_cache_policy.this.id
   

    response_headers_policy_id = aws_cloudfront_response_headers_policy.security_headers.id
  }

  ##########################################
  # SPA Routing (Secure Version)
  ##########################################

  custom_error_response {
    error_code            = 403
    response_code         = 200
    response_page_path    = "/index.html"
    error_caching_min_ttl = 10
  }

  custom_error_response {
    error_code            = 404
    response_code         = 200
    response_page_path    = "/index.html"
    error_caching_min_ttl = 10
  }
  ##########################################
  # SSL
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
  # Logging
  ##########################################

  logging_config {
    bucket          = aws_s3_bucket.cloudfront_logs.bucket_domain_name
    include_cookies = false
    prefix          = "cloudfront-logs/"
  }

  tags = {
    Project     = "BISATS"
    Environment = var.environment
  }
}

resource "aws_cloudfront_cache_policy" "this" {
  name = "frontend-cache-policy-${var.environment}"

  default_ttl = 86400        # 1 day
  max_ttl     = 31536000     # 1 year
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
