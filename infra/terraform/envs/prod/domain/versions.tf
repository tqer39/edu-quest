terraform {
  required_version = "1.14.5"

  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "7.19.0"
    }
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "5.17.0"
    }
    null = {
      source  = "hashicorp/null"
      version = "3.2.4"
    }
  }

  backend "s3" {
    bucket  = "terraform-tfstate-tqer39-072693953877-ap-northeast-1"
    key     = "edu-quest/infra/terraform/envs/prod/prod-domain.tfstate"
    encrypt = true
    region  = "ap-northeast-1"
  }
}
