variable "env" {
  type    = string
  default = ""
}

variable "identifier" {
  type = string
}

variable "resource_group_name" {
  type = string
}

variable "cosmosdb_enable_free_tier" {
  type    = bool
  default = true
}
