# Network Improvements

This repository now includes basic configurations to address common networking gaps.

## Load Balancing
- **Health Checks**: `docker-compose.yml` defines a healthcheck for the `nginx` service hitting `/healthz` on the upstream.
- **Session Persistence**: `deploy/nginx.conf` uses `ip_hash` to keep clients on the same backend.
- **Timeouts**: `proxy_connect_timeout`, `proxy_send_timeout`, and `proxy_read_timeout` protect against hanging connections.
- **Circuit Breaker**: `proxy_next_upstream` with limited retries and `max_fails` in the upstream reduce pressure on unhealthy instances.

The full configuration lives in [`deploy/nginx.conf`](deploy/nginx.conf).

## Service Mesh
- **Traffic Management**: [`deploy/service-mesh.yaml`](deploy/service-mesh.yaml) includes an Istio `DestinationRule` with `LEAST_CONN` balancing.
- **Retry Policies**: The `VirtualService` section sets three retries with a two second per-try timeout.
- **Rate Limiting**: An `EnvoyFilter` applies local rate limiting at 100 requests per second.
- **Observability**: A `Telemetry` resource enables request metrics and Zipkin tracing for the service.

Use these manifests as a starting point when deploying to a service mesh environment.
