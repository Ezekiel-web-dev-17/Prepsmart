variable "instance_name" {
  description = "Value of the EC2 instance's Name tag."
  type        = string
  default     = "Prepsmart"
}

variable "instance_type" {
  description = "The EC2 instance's type."
  type        = string
  default     = "t2.micro"
}

variable "public_key" {
  description = "Public key for SSH access."
  type        = string
  default     = "~/.ssh/id_ed25519.pub"
}