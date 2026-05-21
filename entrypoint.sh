#!/bin/sh
set -e

if [ -n "$POSTGRES_DB" ]; then
  python - <<'PY'
import os
import time

import psycopg

dsn = {
    "dbname": os.environ["POSTGRES_DB"],
    "user": os.environ["POSTGRES_USER"],
    "password": os.environ["POSTGRES_PASSWORD"],
    "host": os.environ.get("POSTGRES_HOST", "db"),
    "port": os.environ.get("POSTGRES_PORT", "5432"),
}

for attempt in range(30):
    try:
        with psycopg.connect(**dsn):
            break
    except psycopg.OperationalError:
        if attempt == 29:
            raise
        time.sleep(1)
PY
fi

if [ "$DJANGO_RUN_BOOTSTRAP" = "1" ]; then
  if [ -f /app/webapp/package.json ]; then
    if [ -f /app/webapp/package-lock.json ]; then
      if [ ! -d /app/webapp/node_modules/react ] || [ ! -f /app/webapp/node_modules/.package-lock.json ] || [ /app/webapp/package-lock.json -nt /app/webapp/node_modules/.package-lock.json ] || [ /app/webapp/package.json -nt /app/webapp/node_modules/.package-lock.json ]; then
        npm ci --prefix /app/webapp
      fi
    elif [ ! -d /app/webapp/node_modules/react ]; then
      npm install --prefix /app/webapp
    fi

    npm run build --prefix /app/webapp
  fi

  python manage.py migrate --noinput
  python manage.py collectstatic --noinput --clear

  if [ "$DJANGO_SEED_DEMO" = "1" ]; then
    python manage.py seed_demo
  fi

  if [ -n "$DJANGO_SUPERUSER_USERNAME" ] && [ -n "$DJANGO_SUPERUSER_EMAIL" ] && [ -n "$DJANGO_SUPERUSER_PASSWORD" ]; then
    python manage.py shell -c "from django.contrib.auth import get_user_model; User = get_user_model(); import os; User.objects.filter(username=os.environ['DJANGO_SUPERUSER_USERNAME']).exists() or User.objects.create_superuser(os.environ['DJANGO_SUPERUSER_USERNAME'], os.environ['DJANGO_SUPERUSER_EMAIL'], os.environ['DJANGO_SUPERUSER_PASSWORD'])"
  fi
fi

exec "$@"
