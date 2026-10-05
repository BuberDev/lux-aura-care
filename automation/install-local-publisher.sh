#!/bin/zsh

set -euo pipefail
umask 077

SOURCE_REPO="${0:A:h:h}"
RUNTIME_DIR="/Users/dawidbubernak/Library/Application Support/LuxAuraCarePublisher"
LAUNCH_AGENT="/Users/dawidbubernak/Library/LaunchAgents/com.luxauracare.article-publisher.plist"
NODE_NPM="/Users/dawidbubernak/.nvm/versions/node/v22.22.3/bin/npm"
SHARED_LLM_ENV="${PUBLISHER_LLM_ENV_SOURCE:-/Users/dawidbubernak/Desktop/Projekty/Tensor_Deep/.env}"
SITE_ENV_SOURCE="${PUBLISHER_SITE_ENV_SOURCE:-$SOURCE_REPO/.env.publisher}"
USER_ID="$(id -u)"
export PATH="/Users/dawidbubernak/.nvm/versions/node/v22.22.3/bin:/Users/dawidbubernak/.nvm/versions/node/v20.19.2/bin:/Users/dawidbubernak/.local/bin:/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin"

if [[ "$RUNTIME_DIR" != "/Users/dawidbubernak/Library/Application Support/LuxAuraCarePublisher" ]]; then
    print -u2 -r -- "Odmowa instalacji: nieoczekiwana ścieżka runtime"
    exit 1
fi

mkdir -p "$RUNTIME_DIR/content-engine" "$RUNTIME_DIR/automation" "$RUNTIME_DIR/state" "/Users/dawidbubernak/Library/LaunchAgents" "/Users/dawidbubernak/Library/Logs"
if [[ ! -f "$RUNTIME_DIR/state/activation-date" ]]; then
    TZ=Europe/Warsaw date +%F > "$RUNTIME_DIR/state/activation-date"
    chmod 600 "$RUNTIME_DIR/state/activation-date"
fi

# Kopiujemy tylko wykonawczą część projektu. Runtime nie zależy od chronionego
# przez macOS katalogu Desktop i nie zawiera historii Git ani plików aplikacji.
/usr/bin/rsync -a --delete \
    --exclude node_modules \
    --exclude out \
    "$SOURCE_REPO/content-engine/" "$RUNTIME_DIR/content-engine/"
/usr/bin/install -m 700 "$SOURCE_REPO/automation/run-lux-aura-publisher.sh" "$RUNTIME_DIR/automation/run-lux-aura-publisher.sh"
/usr/bin/install -m 600 "$SOURCE_REPO/automation/lux-aura-local-publisher.md" "$RUNTIME_DIR/automation/lux-aura-local-publisher.md"
/usr/bin/install -m 600 "$SOURCE_REPO/.env" "$RUNTIME_DIR/.env"

# Pliki .env nie zawsze kończą się znakiem nowej linii. Zapewniamy separator,
# aby pierwszy dopisywany sekret nie został sklejony z poprzednią wartością.
if [[ -s "$RUNTIME_DIR/.env" ]] && [[ "$(tail -c 1 "$RUNTIME_DIR/.env" | wc -l | tr -d ' ')" == "0" ]]; then
    printf '\n' >> "$RUNTIME_DIR/.env"
fi

# Lux Aura Care already has its own database and Telegram variables. Import the
# endpoint secret from the dedicated Vercel pull, then reuse only local text-
# engine credentials from the shared source. Values are never printed.
for key in CRON_SECRET DEEPSEEK_API_KEY OPENROUTER_API_KEY; do
    if ! /usr/bin/grep -q "^${key}=" "$RUNTIME_DIR/.env"; then
        source_file=""
        if [[ -f "$SITE_ENV_SOURCE" ]] && /usr/bin/grep -q "^${key}=" "$SITE_ENV_SOURCE"; then
            source_file="$SITE_ENV_SOURCE"
        elif [[ -f "$SHARED_LLM_ENV" ]] && /usr/bin/grep -q "^${key}=" "$SHARED_LLM_ENV"; then
            source_file="$SHARED_LLM_ENV"
        fi
        if [[ -z "$source_file" ]]; then
            print -u2 -r -- "Brak wymaganej zmiennej ${key} w źródłach konfiguracji publikatora"
            exit 1
        fi
        /usr/bin/awk -v wanted="$key" -F= '$1 == wanted { print; exit }' "$source_file" >> "$RUNTIME_DIR/.env"
    fi
done
if ! /usr/bin/grep -q '^SITE_URL=' "$RUNTIME_DIR/.env"; then
    print -r -- 'SITE_URL=https://luxauracare.com' >> "$RUNTIME_DIR/.env"
fi
chmod 600 "$RUNTIME_DIR/.env"

cd "$RUNTIME_DIR/content-engine"
"$NODE_NPM" ci --no-audit --no-fund

/usr/bin/install -m 600 "$SOURCE_REPO/automation/com.luxauracare.article-publisher.plist" "$LAUNCH_AGENT"
launchctl bootout "gui/$USER_ID/com.luxauracare.article-publisher" 2>/dev/null || true
# launchd can briefly retain a just-stopped service while its process tree exits.
# Retry for a few seconds so an update cannot leave the publisher unloaded.
bootstrap_ok=false
for attempt in 1 2 3 4 5; do
    if launchctl bootstrap "gui/$USER_ID" "$LAUNCH_AGENT"; then
        bootstrap_ok=true
        break
    fi
    if [[ "$attempt" -lt 5 ]]; then
        /bin/sleep 2
    fi
done
if [[ "$bootstrap_ok" != true ]]; then
    print -u2 -r -- "Nie udało się ponownie załadować LaunchAgenta po 5 próbach"
    exit 1
fi
launchctl enable "gui/$USER_ID/com.luxauracare.article-publisher"

print -r -- "Lux Aura Care Publisher zainstalowany w: $RUNTIME_DIR"
print -r -- "LaunchAgent: $LAUNCH_AGENT"
