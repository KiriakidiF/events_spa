export MIX_ENV=prod
export PORT=4798

CFGD=$(readlink -f ~/.config/events_server)

if [ ! -e "$CFGD/base" ]; then
    echo "run deploy first"
    exit 1
fi

DB_PASS=$(cat "$CFGD/db_pass")
export DATABASE_URL=ecto://events_server:$DB_PASS@localhost/events_server_prod

SECRET_KEY_BASE=$(cat "$CFGD/base")
export SECRET_KEY_BASE
(cd server && _build/prod/rel/events_server/bin/events_server start)