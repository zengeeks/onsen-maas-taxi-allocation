output "cosmosdb_connection_string" {
  value     = azurerm_cosmosdb_account.shared.connection_strings[0]
  sensitive = true
}

output "cosmosdb_endpoint" {
  value = "https://${azurerm_cosmosdb_account.shared.name}.documents.azure.com"
}

output "cosmosdb_key" {
  value     = azurerm_cosmosdb_account.shared.primary_key
  sensitive = true
}

output "cosmosdb_database_name" {
  value = azurerm_cosmosdb_sql_database.shared.name
}

output "cosmosdb_container_name" {
  value = azurerm_cosmosdb_sql_container.shared.name
}
