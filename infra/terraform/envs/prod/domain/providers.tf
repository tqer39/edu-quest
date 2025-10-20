provider "google" {
  project = var.gcp_project_id
  region  = var.gcp_region
}

provider "cloudflare" {
  api_token = var.cloudflare_api_token
}

# Cloud Resource Manager API を有効化（google_project_service を使うために必要）
resource "google_project_service" "cloudresourcemanager" {
  project                    = var.gcp_project_id
  service                    = "cloudresourcemanager.googleapis.com"
  disable_on_destroy         = false
  disable_dependent_services = false

  timeouts {
    create = "5m"
    update = "5m"
  }
}

# Cloud Domains API を有効化（環境側で一度だけ）
resource "google_project_service" "domains" {
  project                    = var.gcp_project_id
  service                    = "domains.googleapis.com"
  disable_on_destroy         = false
  disable_dependent_services = false

  # Cloud Resource Manager API が有効化された後に実行
  depends_on = [google_project_service.cloudresourcemanager]

  timeouts {
    create = "5m"
    update = "5m"
  }
}
