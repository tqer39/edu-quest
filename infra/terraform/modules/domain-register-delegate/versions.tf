terraform {
  required_version = "1.14.3"

  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "7.13.0"
    }
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "5.15.0"
    }
  }
}
