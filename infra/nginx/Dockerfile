FROM nginx:1.27-alpine

RUN apk add --no-cache openssl

COPY infra/nginx/default.conf /etc/nginx/conf.d/default.conf
COPY infra/nginx/docker-entrypoint.sh /docker-entrypoint.sh

RUN chmod +x /docker-entrypoint.sh

ENTRYPOINT ["/docker-entrypoint.sh"]
