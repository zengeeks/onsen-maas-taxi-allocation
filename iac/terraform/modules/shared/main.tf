locals {
  component       = "shared"
  resource_suffix = var.env != "" ? "-${var.env}" : ""
}

data "azurerm_resource_group" "main" {
  name = var.resource_group_name
}

resource "azurerm_cosmosdb_account" "shared" {
  name                = "cosmos-${var.identifier}-${local.component}${local.resource_suffix}"
  resource_group_name = data.azurerm_resource_group.main.name
  location            = data.azurerm_resource_group.main.location
  offer_type          = "Standard"
  kind                = "GlobalDocumentDB"

  enable_free_tier = var.cosmosdb_enable_free_tier

  consistency_policy {
    consistency_level = "Session"
  }

  geo_location {
    location          = data.azurerm_resource_group.main.location
    failover_priority = 0
  }
}

resource "azurerm_cosmosdb_sql_database" "shared" {
  name                = "TaxiReserveDb"
  resource_group_name = data.azurerm_resource_group.main.name
  account_name        = azurerm_cosmosdb_account.shared.name
  autoscale_settings {
    max_throughput = 4000
  }
}

resource "azurerm_cosmosdb_sql_container" "shared" {
  name                = "TaxiReserveCol"
  resource_group_name = data.azurerm_resource_group.main.name
  account_name        = azurerm_cosmosdb_account.shared.name
  database_name       = azurerm_cosmosdb_sql_database.shared.name
  partition_key_path  = "/userId"
}
