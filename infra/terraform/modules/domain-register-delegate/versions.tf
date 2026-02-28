terraform {
  required_version = "1.14.6"

  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "7.20.0"
    }
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "5.17.0"
    }
  }
}
