output "stapp_id" {
  value = azurerm_static_site.client.id
}

output "stapp_api_key" {
  value     = azurerm_static_site.client.api_key
  sensitive = true
}
