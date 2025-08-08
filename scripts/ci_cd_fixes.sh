#!/bin/bash
# Hardened CI/CD pipeline checklist

PIPELINE_CHECKS=(
    "Secrets managed through Vault or external secrets"
    "Security scanning integrated in build (gitleaks, semgrep, trivy)"
    "Artifacts signed and provenance generated"
    "Rollback mechanisms in place"
    "Environment parity via GitOps"
    "Automated testing gates enforced"
    "Modern deployment strategies (blue-green/canary)"
)

SECURITY_CONTROLS=(
    "No hardcoded credentials in configs"
    "Image vulnerability scanning enabled"
    "Supply chain security ensured"
    "Least-privilege access controls"
)

echo "CI/CD Pipeline Checks:"
for check in "${PIPELINE_CHECKS[@]}"; do
    echo "- $check"
done

echo ""
echo "Security Controls:"
for control in "${SECURITY_CONTROLS[@]}"; do
    echo "- $control"
done
