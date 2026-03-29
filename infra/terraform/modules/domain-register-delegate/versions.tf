terraform {
  required_version = "1.14.8"

  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "7.25.0"
    }
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "5.18.0"
    }
  }
}
