#!/bin/bash
# Elasticsearch snapshot backup script
curl -s -XPUT "http://localhost:9200/_snapshot/mallos_backup" -H 'Content-Type: application/json' -d'{
  "type": "fs",
  "settings": { "location": "/usr/share/elasticsearch/backup" }
}'

curl -s -XPOST "http://localhost:9200/_snapshot/mallos_backup/snapshot_$(date +%Y%m%d)?wait_for_completion=true"
