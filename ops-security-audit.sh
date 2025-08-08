#!/usr/bin/env bash
# =============================================================================
# MallOS Enterprise - Security Audit Script
# =============================================================================
set -e

echo "🔐 Running security audit checks..."

# Check for kubectl and gather pod security contexts if available
if command -v kubectl >/dev/null 2>&1; then
    echo "📋 Collecting Kubernetes pod security contexts..."
    kubectl get pods --all-namespaces -o jsonpath='{range .items[*]}{.metadata.name}\t{.spec.securityContext}{"\n"}{end}'
else
    echo "⚠️ kubectl is not installed; skipping Kubernetes security context check."
fi

echo "✅ Security audit script completed."
