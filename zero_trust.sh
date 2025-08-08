#!/bin/bash
set -euo pipefail

# implement_zero_trust applies security controls to address common access issues
# such as shared accounts, overprivileged roles, lack of key rotation, missing
# audit logs, password-based logins and poor network segmentation.
implement_zero_trust() {
  echo "Implementing Zero Trust Architecture..."

  # 1. Unique service accounts and least-privilege RBAC
  kubectl apply -f rbac/service-accounts.yaml
  kubectl apply -f rbac/roles.yaml
  kubectl apply -f rbac/role-bindings.yaml

  # 2. Enforce network segmentation
  kubectl apply -f network-policies/

  # 3. mTLS between services via Istio
  istioctl install --set profile=default -y
  kubectl label namespace default istio-injection=enabled --overwrite
  istioctl authn tls-check

  # 4. Replace password-based logins with token-based authentication
  kubectl apply -f auth/token-auth.yaml

  # 5. Vault for key rotation and short-lived credentials
  vault auth enable kubernetes 2>/dev/null || true
  vault write auth/kubernetes/config \
    token_reviewer_jwt=@/var/run/secrets/kubernetes.io/serviceaccount/token \
    kubernetes_host=https://${KUBERNETES_HOST} \
    kubernetes_ca_cert=@/var/run/secrets/kubernetes.io/serviceaccount/ca.crt

  vault write auth/kubernetes/role/app \
    bound_service_account_names=app-sa \
    bound_service_account_namespaces=default \
    policies=app \
    ttl=15m

  # 6. Enable audit logging
  vault audit enable file file_path=/var/log/vault_audit.log 2>/dev/null || true

  echo "Zero Trust configuration applied."
}

implement_zero_trust
