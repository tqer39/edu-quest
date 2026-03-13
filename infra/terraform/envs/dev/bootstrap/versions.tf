terraform {
  required_version = "1.14.7"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "6.35.1"
    }
  }
  backend "s3" {
    bucket  = "terraform-tfstate-tqer39-072693953877-ap-northeast-1"
    key     = "edu-quest/infra/terraform/envs/dev/dev-bootstrap.tfstate"
    encrypt = true
    region  = "ap-northeast-1"
  }
}
