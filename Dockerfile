FROM caddy:2-alpine

# Create directories (files will be mounted as volumes)
RUN mkdir -p /usr/share/caddy /etc/caddy

# Expose ports 80 and 443
EXPOSE 80 443

# Caddy runs automatically on container start

