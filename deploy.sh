#!/bin/bash

#based on lectures notes and hw04
export MIX_ENV=prod
export PORT=4798
export NODEBIN=`pwd`/assets/node_modules/.bin
export PATH="$PATH:$NODEBIN"
export SECRET_KEY_BASE=insecure
export DATABASE_URL=ecto://events_server:bad@localhost/events_server_prod

echo "Building..."

(cd server && mix deps.get)
(cd server && mix compile)

CFGD=$(readlink -f ~/.config/events_server)

if [ ! -d "$CFGD" ]; then
	mkdir -p "$CFGD"
fi

if [ ! -e "$CFGD/base" ]; then
	mix phx.gen.secret > "$CFGD/base"
fi

if [ ! -e "$CFGD/db_pass" ]; then
    pwgen 12 1 > "$CFGD/db_pass"
fi

SECRET_KEY_BASE=$(cat "$CFGD/base")
export SECRET_KEY_BASE

DB_PASS=$(cat "$CFGD/db_pass")
export DATABASE_URL=ecto://event_manager:$DB_PASS@localhost/event_manager_prod

(cd server && mix ecto.create)
(cd server && mix ecto.migrate)

(cd client && npm install)
#(cd client && webpack --mode production)
(cd server && mix phx.digest)


echo "Generating release..."
(cd server && mix release)


echo "Starting app..."

PROD=t ./start.sh
