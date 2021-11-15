terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "=2.84.0"
    }
  }
}

provider "azurerm" {
  features {}
}

module "shared" {
  source = "./modules/shared"

  env                       = var.env
  identifier                = var.identifier
  resource_group_name       = var.resource_group_name
  cosmosdb_enable_free_tier = var.cosmosdb_enable_free_tier
}

module "client" {
  source = "./modules/client"

  env                 = var.env
  identifier          = var.identifier
  resource_group_name = var.resource_group_name
}

module "admin" {
  source = "./modules/admin"

  env                 = var.env
  identifier          = var.identifier
  resource_group_name = var.resource_group_name
}
