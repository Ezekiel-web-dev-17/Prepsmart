output "instance_id" {
  description = "The ID of the EC2 instance."
  value       = aws_instance.app_server.id
}

output "instance_hostname" {
  description = "Private DNS name of the EC2 instance."
  value       = aws_instance.app_server.private_dns
}

output "private_ip" {
  description = "Private IP address of the EC2 instance."
  value       = aws_instance.app_server.private_ip
}

output "public_dns" {
  description = "Public DNS name of the EC2 instance."
  value       = aws_instance.app_server.public_dns
}

output "public_ip" {
  description = "Public static Elastic IP address of the EC2 instance."
  value       = aws_eip.app_ip.public_ip
}

output "route53_name_servers" {
  description = "Name servers to configure at your domain registrar for prepsmart.tech."
  value       = aws_route53_zone.primary.name_servers
}
