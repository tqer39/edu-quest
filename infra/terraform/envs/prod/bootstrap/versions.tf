terraform {
  required_version = "1.14.1"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "6.23.0"
    }
  }

  backend "s3" {
    bucket  = "terraform-tfstate-tqer39-072693953877-ap-northeast-1"
    key     = "edu-quest/infra/terraform/envs/prod/prod-bootstrap.tfstate"
    encrypt = true
    region  = "ap-northeast-1"
  }
}
