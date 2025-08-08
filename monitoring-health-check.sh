#!/usr/bin/env bash
# =============================================================================
# MallOS Enterprise - Monitoring Health Check Script
# =============================================================================
set -e

echo "📊 Running monitoring health checks..."

# Validate Prometheus configuration if the reloader is available
if command -v prometheus-config-reloader >/dev/null 2>&1; then
    echo "🔍 Validating Prometheus configuration..."
    prometheus-config-reloader --validate
else
    echo "⚠️ prometheus-config-reloader is not installed; skipping Prometheus config validation."
fi

echo "✅ Monitoring health check completed."
