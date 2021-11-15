output "resource_group_name" {
  value = var.resource_group_name
}

output "stapp_id_client" {
  value = module.client.stapp_id
}

output "stapp_api_key_client" {
  value     = module.client.stapp_api_key
  sensitive = true
}

output "stapp_id_admin" {
  value = module.admin.stapp_id
}

output "stapp_api_key_admin" {
  value     = module.admin.stapp_api_key
  sensitive = true
}

output "cosmosdb_connection_string" {
  value     = module.shared.cosmosdb_connection_string
  sensitive = true
}

output "cosmosdb_endpoint" {
  value = module.shared.cosmosdb_endpoint
}

output "cosmosdb_key" {
  value     = module.shared.cosmosdb_key
  sensitive = true
}

output "cosmosdb_database_name" {
  value = module.shared.cosmosdb_database_name
}

output "cosmosdb_container_name" {
  value = module.shared.cosmosdb_container_name
}
