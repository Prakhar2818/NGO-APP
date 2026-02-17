FROM prom/prometheus:latest

# Use a relative path to copy the config file from the same folder as this Dockerfile
COPY prometheus.yml /etc/prometheus/prometheus.yml

# Explicitly tell Prometheus to use this config and listen on port 9090
CMD [ "--config.file=/etc/prometheus/prometheus.yml", \
      "--storage.tsdb.path=/prometheus", \
      "--web.listen-address=:9090" ]
