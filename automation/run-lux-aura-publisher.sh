#!/bin/zsh

set -uo pipefail
umask 077

SCRIPT_DIR="${0:A:h}"
REPO_DIR="${SCRIPT_DIR:h}"
ENGINE_DIR="$REPO_DIR/content-engine"
NODE_BIN="/Users/dawidbubernak/.nvm/versions/node/v22.22.3/bin/node"
CODEX_BIN="/Users/dawidbubernak/.nvm/versions/node/v20.19.2/bin/codex"
LOCK_DIR="/Users/dawidbubernak/Library/Caches/com.luxauracare.article-publisher.lock"
FAILURE_MARKER_PREFIX="/Users/dawidbubernak/Library/Caches/com.luxauracare.article-publisher.failure"
ACTIVATION_DATE_FILE="$REPO_DIR/state/activation-date"
export DISABLE_CLAUDE_CODE=true
export PATH="/Users/dawidbubernak/.local/bin:/Users/dawidbubernak/.nvm/versions/node/v20.19.2/bin:/Users/dawidbubernak/.nvm/versions/node/v22.22.3/bin:/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin"
if [[ -f "$ACTIVATION_DATE_FILE" ]]; then
    export SLOT_NOT_BEFORE="$(<"$ACTIVATION_DATE_FILE")"
else
    export SLOT_NOT_BEFORE="$(TZ=Europe/Warsaw date +%F)"
fi

notify_final_failure() {
    local failure_message="$1"
    local target_date="${PENDING_DATE:-unknown}"
    local current_hour
    current_hour="$(date +%H)"
    (( 10#$current_hour < 17 )) && return 0

    local marker="${FAILURE_MARKER_PREFIX}.${target_date}"
    [[ -f "$marker" ]] && return 0
    print -r -- "$failure_message" > "$marker"
    cd "$ENGINE_DIR" || return 0
    WATCHDOG_ERROR="$failure_message" "$NODE_BIN" --env-file=../.env --import tsx src/notify-watchdog-failure.ts || true
}

mkdir -p "/Users/dawidbubernak/Library/Caches"
if ! mkdir "$LOCK_DIR" 2>/dev/null; then
    LOCK_PID=""
    [[ -f "$LOCK_DIR/pid" ]] && LOCK_PID="$(<"$LOCK_DIR/pid")"
    if [[ "$LOCK_PID" == <-> ]] && kill -0 "$LOCK_PID" 2>/dev/null; then
        print -r -- "[luxauracare-watchdog] przebieg PID $LOCK_PID nadal działa — pomijam"
        exit 0
    fi
    # Po awarii zasilania katalog blokady może zostać. Usuwamy wyłącznie znany
    # plik PID i pusty katalog o stałej, jawnej ścieżce.
    rm -f "$LOCK_DIR/pid"
    if ! rmdir "$LOCK_DIR" 2>/dev/null || ! mkdir "$LOCK_DIR" 2>/dev/null; then
        print -u2 -r -- "[luxauracare-watchdog] nie można odzyskać blokady po przerwanym przebiegu"
        exit 1
    fi
fi
print -r -- "$$" > "$LOCK_DIR/pid"
trap 'rm -f "$LOCK_DIR/pid"; rmdir "$LOCK_DIR" 2>/dev/null || true' EXIT INT TERM

cd "$ENGINE_DIR" || exit 1
PENDING_DATE="$($NODE_BIN --env-file=../.env --import tsx src/find-pending-slot.ts)"
PREFLIGHT_STATUS=$?

if [[ $PREFLIGHT_STATUS -eq 10 ]]; then
    print -r -- "[luxauracare-watchdog] wszystkie należne sloty są opublikowane"
    exit 0
fi
if [[ $PREFLIGHT_STATUS -ne 0 || ! "$PENDING_DATE" =~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}$' ]]; then
    print -u2 -r -- "[luxauracare-watchdog] preflight nie zwrócił poprawnego slotu"
    notify_final_failure "Preflight nie zwrócił poprawnego slotu (kod $PREFLIGHT_STATUS)."
    exit 1
fi

print -r -- "[luxauracare-watchdog] uruchamiam slot $PENDING_DATE"
cd "$ENGINE_DIR" || exit 1
PREPARE_ONLY=true MODE=publish SCHEDULED_FOR="$PENDING_DATE" \
    "$NODE_BIN" --env-file=../.env --import tsx src/run.ts
PREPARE_STATUS=$?

if [[ $PREPARE_STATUS -ne 0 ]]; then
    print -u2 -r -- "[luxauracare-watchdog] przygotowanie artykułu zakończyło się kodem $PREPARE_STATUS"
    notify_final_failure "Przygotowanie artykułu dla slotu $PENDING_DATE zakończyło się kodem $PREPARE_STATUS."
    exit "$PREPARE_STATUS"
fi

if [[ ! -f "$ENGINE_DIR/out/run-status.json" || ! -f "$ENGINE_DIR/out/prepared.json" || ! -f "$ENGINE_DIR/out/visual-prompts.json" ]]; then
    print -u2 -r -- "[luxauracare-watchdog] przygotowanie nie utworzyło kompletu manifestów"
    notify_final_failure "Przygotowanie slotu $PENDING_DATE nie utworzyło kompletu manifestów."
    exit 1
fi

cd "$REPO_DIR" || exit 1
"$CODEX_BIN" exec \
    --dangerously-bypass-approvals-and-sandbox \
    --ephemeral \
    --skip-git-repo-check \
    -C "$REPO_DIR" \
    -m gpt-5.6-sol \
    - < "$REPO_DIR/automation/lux-aura-local-publisher.md"
CODEX_STATUS=$?

if [[ $CODEX_STATUS -ne 0 ]]; then
    print -u2 -r -- "[luxauracare-watchdog] generowanie grafik przez Codex zakończyło się kodem $CODEX_STATUS"
    notify_final_failure "Generowanie grafik dla slotu $PENDING_DATE zakończyło się kodem $CODEX_STATUS."
    exit "$CODEX_STATUS"
fi

cd "$ENGINE_DIR" || exit 1
"$NODE_BIN" --env-file=../.env --import tsx src/publish-prepared.ts
PUBLISH_STATUS=$?
if [[ $PUBLISH_STATUS -ne 0 ]]; then
    print -u2 -r -- "[luxauracare-watchdog] publikacja przygotowanego artykułu zakończyła się kodem $PUBLISH_STATUS"
    notify_final_failure "Publikacja slotu $PENDING_DATE zakończyła się kodem $PUBLISH_STATUS."
    exit "$PUBLISH_STATUS"
fi

NEXT_PENDING="$($NODE_BIN --env-file=../.env --import tsx src/find-pending-slot.ts)"
VERIFY_STATUS=$?
if [[ $VERIFY_STATUS -eq 0 && "$NEXT_PENDING" == "$PENDING_DATE" ]]; then
    print -u2 -r -- "[luxauracare-watchdog] slot $PENDING_DATE nadal nie jest opublikowany"
    notify_final_failure "Po wykonaniu Codex slot $PENDING_DATE nadal nie jest opublikowany."
    exit 1
fi
if [[ $VERIFY_STATUS -ne 0 && $VERIFY_STATUS -ne 10 ]]; then
    print -u2 -r -- "[luxauracare-watchdog] nie udało się potwierdzić publikacji"
    notify_final_failure "Nie udało się potwierdzić publikacji slotu $PENDING_DATE (kod $VERIFY_STATUS)."
    exit 1
fi

rm -f "${FAILURE_MARKER_PREFIX}.${PENDING_DATE}"
print -r -- "[luxauracare-watchdog] slot $PENDING_DATE opublikowany i potwierdzony"
