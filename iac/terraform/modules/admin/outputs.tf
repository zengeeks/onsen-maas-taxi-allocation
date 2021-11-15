output "stapp_id" {
  value = azurerm_static_site.admin.id
}

output "stapp_api_key" {
  value     = azurerm_static_site.admin.api_key
  sensitive = true
}
