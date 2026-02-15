terraform {
  required_version = "1.14.5"
  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "5.17.0"
    }
  }
  backend "s3" {
    bucket  = "terraform-tfstate-tqer39-072693953877-ap-northeast-1"
    key     = "edu-quest/infra/terraform/envs/dev/dev-databases.tfstate"
    encrypt = true
    region  = "ap-northeast-1"
  }
}
