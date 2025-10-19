output "d1_database" {
  description = "Primary D1 database information"
  value       = module.cf_app_resources.d1_database
}

output "turnstile_widget" {
  description = "Turnstile widget details (null when disabled)"
  value       = module.cf_app_resources.turnstile_widget
}

output "turnstile_widget_secret" {
  description = "Turnstile secret API key"
  value       = module.cf_app_resources.turnstile_widget_secret
  sensitive   = true
}
