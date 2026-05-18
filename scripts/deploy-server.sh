#!/usr/bin/env bash
# Deploy tea-store on VPS (run on server as linuxuser).
set -euo pipefail

APP_DIR="${APP_DIR:-$HOME/tea-store}"
DOMAIN="${DOMAIN:-tea.leodennis.top}"
export PATH="${HOME}/.local/bin:${PATH}"

if ! command -v pnpm >/dev/null 2>&1; then
  npm install -g pnpm@9.12.3 --prefix "${HOME}/.local"
fi

if [[ ! -d "${APP_DIR}/.git" ]]; then
  git clone https://github.com/tianyehedashu/tea-store.git "${APP_DIR}"
fi

cd "${APP_DIR}"
git pull origin master

pnpm install --frozen-lockfile

if [[ ! -f backend/.env ]]; then
  echo "Missing backend/.env — create it before re-running deploy."
  exit 1
fi

cd backend
export NODE_OPTIONS="${NODE_OPTIONS:---max-old-space-size=512}"
if ! pnpm run build; then
  echo "Server build OOM — upload local backend/.medusa/server tarball and public/admin, then re-run."
  exit 1
fi
mkdir -p public
rm -rf public/admin
cp -a .medusa/server/public/admin public/admin
cd ../front
pnpm run build
cd ..

pm2 delete tea-backend tea-front 2>/dev/null || true
pm2 start ecosystem.config.cjs
pm2 save

echo "Deployed. Configure nginx for https://${DOMAIN} -> :8000 and Medusa API paths -> :9000"
