locals {
  component       = "admin"
  resource_suffix = var.env != "" ? "-${var.env}" : ""
}

data "azurerm_resource_group" "main" {
  name = var.resource_group_name
}

resource "azurerm_static_site" "admin" {
  name                = "stapp-${var.identifier}-${local.component}${local.resource_suffix}"
  resource_group_name = data.azurerm_resource_group.main.name
  location            = var.stapp_location
}
