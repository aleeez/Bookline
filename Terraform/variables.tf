variable "project_id" {
  description = "Google Cloud project ID for Bookline"
  default = "terraform-demo-395521"
}

variable "project_name" {
  description = "Name of the project"
  default = "Terraform-demo"
}

variable "project_location" {
  description = "Location configuration for the project"
  type        = map

  default = {
    region           = "europe-central2"
    availability_zone = "europe-central2-a"
  }
}

variable "newtwork_name" {
  description = "Name of my network which hosts the app"
  default = "bookline-terraform-network"
}

variable "sql_instance" {
  description = "Service instance which hosts my database"
  default = "bookline-terraform-sql"
}

variable "database_name" {
  description = "Name of my database"
  default = "library"
}
