provider "aws" {
  region = "us-east-1" 
  profile = "company"
}

# Additional aliased provider required by some modules (WAF/CloudFront global resources)
provider "aws" {
  alias   = "us_east_1"
  region  = "us-east-1"
  profile = "company"
}

