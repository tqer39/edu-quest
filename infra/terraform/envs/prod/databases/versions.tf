terraform {
  required_version = "1.14.3"
  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "5.15.0"
    }
  }
  backend "s3" {
    bucket  = "terraform-tfstate-tqer39-072693953877-ap-northeast-1"
    key     = "edu-quest/infra/terraform/envs/prod/prod-databases.tfstate"
    encrypt = true
    region  = "ap-northeast-1"
  }
}
