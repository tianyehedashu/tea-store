#!/usr/bin/env bash
set -euo pipefail

export PATH="${HOME}/.local/bin:${PATH}"
command -v pnpm >/dev/null || npm install -g pnpm@9.12.3 --prefix "${HOME}/.local"

APP_DIR="${HOME}/tea-store"
if [[ ! -d "${APP_DIR}/.git" ]]; then
  git clone https://github.com/tianyehedashu/tea-store.git "${APP_DIR}"
else
  git -C "${APP_DIR}" pull origin master
fi

MEDUSA_DB_PASS="$(openssl rand -hex 12)"
JWT_SECRET="$(openssl rand -hex 24)"
COOKIE_SECRET="$(openssl rand -hex 24)"

docker exec chatwoot-postgres-1 psql -U postgres -c \
  "DO \$\$ BEGIN CREATE USER medusa WITH PASSWORD '${MEDUSA_DB_PASS}'; EXCEPTION WHEN duplicate_object THEN NULL; END \$\$;"
docker exec chatwoot-postgres-1 psql -U postgres -c \
  "SELECT 1 FROM pg_database WHERE datname = 'medusa'" | grep -q 1 || \
  docker exec chatwoot-postgres-1 psql -U postgres -c "CREATE DATABASE medusa OWNER medusa;"

cat > "${APP_DIR}/backend/.env" <<EOF
DATABASE_URL=postgres://medusa:${MEDUSA_DB_PASS}@127.0.0.1:5432/medusa
STORE_CORS=https://tea.leodennis.top,http://tea.leodennis.top
ADMIN_CORS=https://tea.leodennis.top,http://tea.leodennis.top
AUTH_CORS=https://tea.leodennis.top,http://tea.leodennis.top
JWT_SECRET=${JWT_SECRET}
COOKIE_SECRET=${COOKIE_SECRET}
EOF
chmod 600 "${APP_DIR}/backend/.env"
echo "MEDUSA_DB_PASS=${MEDUSA_DB_PASS}" > "${APP_DIR}/.deploy-secrets"
chmod 600 "${APP_DIR}/.deploy-secrets"

cd "${APP_DIR}"
pnpm install --frozen-lockfile

cd backend
export NODE_OPTIONS="--max-old-space-size=512"
if ! pnpm run build; then
  echo "Backend build failed (often OOM). Upload local .medusa/server tarball instead."
  exit 1
fi
mkdir -p public
rm -rf public/admin
cp -a .medusa/server/public/admin public/admin
pnpm exec medusa db:migrate
pnpm run seed 2>&1 | tee "${APP_DIR}/seed.log" || true

PUBLISHABLE_KEY="$(grep -oE 'pk_[a-f0-9]+' "${APP_DIR}/seed.log" | tail -1 || true)"
if [[ -z "${PUBLISHABLE_KEY}" ]]; then
  PUBLISHABLE_KEY="pk_fb8abf6b0df38a42bcad2b6368af444c1155f5e940e3f48fb76118bcefffadfd"
fi

cat > "${APP_DIR}/front/.env.local" <<EOF
MEDUSA_BACKEND_URL=https://tea.leodennis.top
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=${PUBLISHABLE_KEY}
EOF
chmod 600 "${APP_DIR}/front/.env.local"

cd "${APP_DIR}/front"
pnpm run build

cd "${APP_DIR}"
pm2 delete tea-backend tea-front 2>/dev/null || true
pm2 start ecosystem.config.cjs
pm2 save

sudo mkdir -p /var/www/ssl-proof/tea
sudo cp "${APP_DIR}/scripts/nginx-tea.leodennis.top.conf" /etc/nginx/sites-enabled/tea.leodennis.top.conf
sudo nginx -t && sudo systemctl reload nginx

echo "Bootstrap complete. Add DNS A record tea.leodennis.top -> server IP, then: sudo certbot --nginx -d tea.leodennis.top"
