terraform {
  required_version = "1.13.5"

  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "7.10.0"
    }
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "5.12.0"
    }
  }
}
