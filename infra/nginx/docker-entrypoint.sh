#!/bin/sh
set -e

CERT_DIR="/etc/nginx/certs"
CERT_FILE="$CERT_DIR/dev.crt"
KEY_FILE="$CERT_DIR/dev.key"
OPENSSL_CONFIG="/tmp/dev-cert.cnf"
CERT_CN="${NGINX_CERT_CN:-localhost}"
ALT_NAMES_RAW="${NGINX_CERT_ALT_NAMES:-DNS:localhost,IP:127.0.0.1}"

mkdir -p "$CERT_DIR"

if [ ! -f "$CERT_FILE" ] || [ ! -f "$KEY_FILE" ]; then
  cat > "$OPENSSL_CONFIG" <<EOF
[req]
default_bits = 2048
prompt = no
default_md = sha256
distinguished_name = dn
x509_extensions = v3_req

[dn]
CN = ${CERT_CN}

[v3_req]
subjectAltName = @alt_names

[alt_names]
EOF

  alt_index=1
  OLD_IFS="$IFS"
  IFS=','
  for alt_name in $ALT_NAMES_RAW; do
    alt_name="$(echo "$alt_name" | xargs)"
    [ -z "$alt_name" ] && continue
    alt_type="${alt_name%%:*}"
    alt_value="${alt_name#*:}"
    if [ -n "$alt_type" ] && [ -n "$alt_value" ] && [ "$alt_type" != "$alt_name" ]; then
      printf '%s.%s = %s\n' "$alt_type" "$alt_index" "$alt_value" >> "$OPENSSL_CONFIG"
      alt_index=$((alt_index + 1))
    fi
  done
  IFS="$OLD_IFS"

  openssl req \
    -x509 \
    -nodes \
    -days 3650 \
    -newkey rsa:2048 \
    -keyout "$KEY_FILE" \
    -out "$CERT_FILE" \
    -config "$OPENSSL_CONFIG"
fi

exec nginx -g "daemon off;"
