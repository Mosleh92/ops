# ELK Stack Configuration

This directory contains configurations to improve Elasticsearch, Logstash, and Kibana operations:

- **Index Lifecycle Management**: `ilm-policy.json` defines rollover and deletion rules to keep indices optimized.
- **Log Parsing Optimization**: `logstash/pipeline.conf` includes grok patterns and tagging for efficient processing.
- **Shard Allocation**: ILM warm phase shrinks shards to balance cluster resources.
- **Backup Strategies**: `snapshot.sh` creates periodic snapshots for disaster recovery.
