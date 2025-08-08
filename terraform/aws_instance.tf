terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.region
}

variable "region" {
  type    = string
  default = "us-east-1"
}

variable "instance_type" {
  type    = string
  default = "t3.micro"
}

variable "root_volume_size" {
  type    = number
  default = 8
}

variable "ssh_ingress_cidr" {
  type    = string
  default = "0.0.0.0/0"
}

variable "vpc_id" {
  type = string
}

variable "backup_role_arn" {
  type = string
}

locals {
  common_tags = {
    Project   = "ops"
    ManagedBy = "terraform"
  }
}

data "aws_ami" "latest" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["amzn2-ami-hvm-*-x86_64-gp2"]
  }
}

resource "aws_security_group" "app" {
  name        = "app-sg"
  description = "Allow SSH"
  vpc_id      = var.vpc_id

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = [var.ssh_ingress_cidr]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = local.common_tags
}

resource "aws_instance" "good_example" {
  ami                    = data.aws_ami.latest.id
  instance_type          = var.instance_type
  vpc_security_group_ids = [aws_security_group.app.id]

  root_block_device {
    encrypted   = true
    volume_size = var.root_volume_size
  }

  tags = merge(local.common_tags, {
    Name = "example-instance"
  })
}

resource "aws_backup_vault" "main" {
  name = "example-vault"
  tags = local.common_tags
}

resource "aws_backup_plan" "daily" {
  name = "daily-backup-plan"

  rule {
    rule_name         = "daily"
    target_vault_name = aws_backup_vault.main.name
    schedule          = "cron(0 5 * * ? *)"

    lifecycle {
      delete_after = 30
    }
  }

  tags = local.common_tags
}

resource "aws_backup_selection" "instance" {
  iam_role_arn = var.backup_role_arn
  name         = "instance-backup"
  plan_id      = aws_backup_plan.daily.id

  resources = [aws_instance.good_example.arn]
}

