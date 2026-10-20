provider "aws" {
  region = "eu-west-3"
}

data "aws_ami" "ubuntu" {
  most_recent = true

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd-gp3/ubuntu-noble-24.04-amd64-server-*"]
  }

  owners = ["099720109477"] # Canonical
}

# Register your local public key in AWS
resource "aws_key_pair" "deployer" {
  key_name   = "prepsmart-key"
  public_key = file(pathexpand(var.public_key))
}

module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "5.19.0"

  name = "prepsmart-vpc"
  cidr = "10.0.0.0/16"

  azs             = ["eu-west-3a", "eu-west-3b", "eu-west-3c"]
  private_subnets = ["10.0.1.0/24", "10.0.2.0/24"]
  public_subnets  = ["10.0.101.0/24"]

  enable_dns_hostnames = true

  # Security Group rules managed directly inside the VPC module
  manage_default_security_group = true
  default_security_group_name   = "prepsmart-app-sg"

  default_security_group_ingress = [
    {
      description = "Allow ping from anywhere"
      from_port   = 8
      to_port     = 0
      protocol    = "icmp"
      cidr_blocks = "0.0.0.0/0"
    },
    {
      description = "Allow SSH from anywhere"
      from_port   = 22
      to_port     = 22
      protocol    = "tcp"
      cidr_blocks = "0.0.0.0/0"
    },
    {
      description = "Allow HTTP web traffic"
      from_port   = 80
      to_port     = 80
      protocol    = "tcp"
      cidr_blocks = "0.0.0.0/0"
    },
    {
      description = "Allow HTTPS web traffic"
      from_port   = 443
      to_port     = 443
      protocol    = "tcp"
      cidr_blocks = "0.0.0.0/0"
    },
    {
      description = "Allow Next.js web port"
      from_port   = 3000
      to_port     = 3000
      protocol    = "tcp"
      cidr_blocks = "0.0.0.0/0"
    }
  ]

  default_security_group_egress = [
    {
      description = "Allow all outbound traffic"
      from_port   = 0
      to_port     = 0
      protocol    = "-1"
      cidr_blocks = "0.0.0.0/0"
    }
  ]

  default_security_group_tags = {
    Name = "prepsmart-sg"
  }

  # Manage Public Network ACL
  public_dedicated_network_acl = true
  public_inbound_acl_rules = [
    { rule_number = 100, rule_action = "allow", from_port = 80, to_port = 80, protocol = "tcp", cidr_block = "0.0.0.0/0" },
    { rule_number = 110, rule_action = "allow", from_port = 443, to_port = 443, protocol = "tcp", cidr_block = "0.0.0.0/0" },
    { rule_number = 120, rule_action = "allow", from_port = 22, to_port = 22, protocol = "tcp", cidr_block = "0.0.0.0/0" },
    { rule_number = 130, rule_action = "allow", from_port = 1024, to_port = 65535, protocol = "tcp", cidr_block = "0.0.0.0/0" },
    { rule_number = 140, rule_action = "allow", from_port = 8, to_port = 0, protocol = "icmp", cidr_block = "0.0.0.0/0" },
    { rule_number = 150, rule_action = "allow", from_port = 3000, to_port = 3000, protocol = "tcp", cidr_block = "0.0.0.0/0" },
  ]
  public_outbound_acl_rules = [
    { rule_number = 100, rule_action = "allow", from_port = 0, to_port = 0, protocol = "-1", cidr_block = "0.0.0.0/0" },
  ]
}

# Attach the security group and public subnet to your instance
resource "aws_instance" "app_server" {
  ami                    = data.aws_ami.ubuntu.id
  instance_type          = var.instance_type
  key_name               = aws_key_pair.deployer.key_name
  vpc_security_group_ids = [module.vpc.default_security_group_id]
  subnet_id              = module.vpc.public_subnets[0]

  root_block_device {
    volume_size = 20
    volume_type = "gp3"
  }

  tags = {
    Name = var.instance_name
  }
}

# Allocate a permanent, static Public IPv4 address
resource "aws_eip" "app_ip" {
  instance = aws_instance.app_server.id
  domain   = "vpc"

  tags = {
    Name = "prepsmart-static-ip"
  }
}

# Route 53 Hosted Zone for domain management
resource "aws_route53_zone" "primary" {
  name = var.domain_name

  tags = {
    Name        = "${var.instance_name}-dns"
    Environment = "production"
  }
}

# Apex / Root A Record (prepsmart.ng -> Elastic IP)
resource "aws_route53_record" "apex" {
  zone_id = aws_route53_zone.primary.zone_id
  name    = var.domain_name
  type    = "A"
  ttl     = 300
  records = [aws_eip.app_ip.public_ip]
}

# Subdomain www A Record (www.prepsmart.ng -> Elastic IP)
resource "aws_route53_record" "www" {
  zone_id = aws_route53_zone.primary.zone_id
  name    = "www.${var.domain_name}"
  type    = "A"
  ttl     = 300
  records = [aws_eip.app_ip.public_ip]
}
