variable "cloudflare_account_id" {
  description = "Cloudflare Account ID"
  type        = string
  sensitive   = true
}

variable "zone_domain" {
  description = "作成するサブドメインの Zone 名（例: dev.edu-quest.app）"
  type        = string
}
