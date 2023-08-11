terraform {
  required_providers {
    google = {
      source = "hashicorp/google"
      version = "4.77.0"
    }
  }
}

provider "google" {
  credentials = file("./credentials/keys.json")
  project = var.project_id
  region  = var.project_location["region"]
  zone    = var.project_location["availability_zone"]
}


