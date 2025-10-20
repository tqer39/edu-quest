variable "root_domain" {
  description = "取得・運用するルートドメイン名 (例: edu-quest.app)"
  type        = string
}

variable "cloudflare_account_id" {
  description = "Cloudflare Account ID"
  type        = string
  sensitive   = true
}

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

variable "yearly_price_currency" {
  description = "年額の通貨コード（例: USD, JPY）"
  type        = string
  sensitive   = true
}

variable "yearly_price_units" {
  description = "年額（整数）。実価格に合わせて更新してください"
  type        = number
  sensitive   = true
}

variable "create_domain_registration" {
  description = "ドメイン登録リソースを作成するかどうか（既存ドメインの場合は false）"
  type        = bool
  default     = false
}
