# Configuration Management Fixes

This guide documents best practices to address common issues seen in Ansible and Puppet/Chef setups within MallOS Enterprise deployments.

## Ansible

- **Ensure idempotency** by relying on idempotent modules and specifying the desired `state` for resources.
- **Manage variables properly** using `group_vars`, `host_vars`, and role defaults to avoid conflicts.
- **Protect sensitive data** through `ansible-vault` or an external secrets manager.
- **Handle errors explicitly** with `block`, `rescue`, and `always` sections.
- **Organize roles** using the standard Ansible role structure and reusable Galaxy roles.

## Puppet/Chef

- **Detect configuration drift** by running agents in audit mode and monitoring reports.
- **Test configurations** using RSpec/Serverspec for Puppet or InSpec/ChefSpec for Chef.
- **Manage dependencies** through metadata files and tools like `librarian-puppet` or `berkshelf`.
- **Provide rollback capabilities** by versioning manifests/cookbooks and using release tools (e.g., `r10k`, `Code Manager`).

These practices help maintain secure, predictable, and maintainable infrastructure automation.
