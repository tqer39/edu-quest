terraform {
  required_version = "1.14.1"

  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "7.12.0"
    }
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "5.13.0"
    }
  }
}
