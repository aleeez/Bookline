
resource "google_sql_database_instance" "my-sql" {
  name             = var.sql_instance
  database_version = "MYSQL_8_0"
  region = var.project_location["region"]
  
  root_password = random_password.my_root_password.result

  settings {
    tier = "db-f1-micro"
  }

}

resource "random_password" "my_root_password" {
  length  = 20
  special = true
}

resource "google_sql_database" "my_database" {
  name     = var.database_name
  instance = var.sql_instance
}

resource "google_compute_network" "vpc_network" {
  project                                   = var.project_name
  name                                      = var.newtwork_name
  auto_create_subnetworks                   = true
  network_firewall_policy_enforcement_order = "BEFORE_CLASSIC_FIREWALL"
}

