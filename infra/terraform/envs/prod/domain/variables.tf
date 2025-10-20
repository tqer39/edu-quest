variable "root_domain" {
  description = "取得するルートドメイン (例: edu-quest.app)"
  type        = string
  default     = "edu-quest.app"
}

variable "gcp_project_id" {
  description = "Google Cloud のプロジェクトID"
  type        = string
  sensitive   = true
}

variable "gcp_region" {
  description = "GCP リージョン（未使用でも provider 要件のため設定）"
  type        = string
  default     = "us-central1"
}

variable "cloudflare_api_token" {
  description = "Cloudflare API Token（Zone 作成権限が必要）"
  type        = string
  sensitive   = true
}

variable "cloudflare_account_id" {
  description = "Cloudflare Account ID（Zone 作成先アカウント）"
  type        = string
}

variable "dev_subdomain_target" {
  description = "dev サブドメインの転送先 (Workers/Pages の URL など)"
  type        = string
  default     = "edu-quest-dev.pages.dev"
}

# Contact
variable "contact_country_code" {
  description = "登録連絡先の国コード（例: JP, US）"
  type        = string
  sensitive   = true
}

variable "contact_postal_code" {
  description = "登録連絡先の郵便番号"
  type        = string
  sensitive   = true
}

variable "contact_administrative_area" {
  description = "都道府県など"
  type        = string
  sensitive   = true
}

variable "contact_locality" {
  description = "市区町村"
  type        = string
  sensitive   = true
}

variable "contact_address_lines" {
  description = "住所（複数行可）"
  type        = list(string)
  sensitive   = true
}

variable "contact_recipient" {
  description = "受取人名（個人名）"
  type        = string
  sensitive   = true
}

variable "contact_email" {
  description = "連絡用メールアドレス"
  type        = string
  sensitive   = true
}

variable "contact_phone" {
  description = "電話番号（E.164形式 例: +81XXXXXXXXXX）"
  type        = string
  sensitive   = true
}

# Pricing
variable "yearly_price_currency" {
  description = "年額の通貨コード（例: USD, JPY）"
  type        = string
  sensitive   = true
}

variable "yearly_price_units" {
  description = "年額（整数）。実価格に合わせて更新してください"
  type        = number
}
