#!/bin/sh

if [ -z "${USERNAME}" ] || [ -z "${PASSWORD}" ]; then
    echo "Missing one of USERNAME or PASSWORD"
    exit 1
fi

COUNTRY="${COUNTRY:-US}"
EVENT_DURATION_SECONDS="${EVENT_DURATION_SECONDS:-10}"
LANGUAGE="${LANGUAGE:-en}"
P2P_CONNECTION_SETUP="${P2P_CONNECTION_SETUP:-0}"
POLLING_INTERVAL_MINUTES="${POLLING_INTERVAL_MINUTES:-10}"
TRUSTED_DEVICE_NAME="${TRUSTED_DEVICE_NAME:-eufyclient}"
ACCEPT_INVITATIONS="${ACCEPT_INVITATIONS:-false}"

DEBUG_OPTION=""
if [ -n "$DEBUG" ]; then
    DEBUG_OPTION="-v"
fi

JSON_STRING="$( jq -n \
  --arg username "$USERNAME" \
  --arg password "$PASSWORD" \
  --arg country "$COUNTRY"  \
  --arg event_duration_seconds "$EVENT_DURATION_SECONDS"  \
  --arg language "$LANGUAGE"  \
  --arg p2p_connection_setup "$P2P_CONNECTION_SETUP"  \
  --arg polling_interval_minutes "$POLLING_INTERVAL_MINUTES"  \
  --arg trusted_device_name "$TRUSTED_DEVICE_NAME"  \
  --arg accept_invitations "$ACCEPT_INVITATIONS"  \
    '{
      country: $country,
      eventDurationSeconds: $event_duration_seconds,
      language: $language,
      p2pConnectionSetup: $p2p_connection_setup,
      password: $password,
      persistentDir: "/data",
      pollingIntervalMinutes: $polling_interval_minutes,
      trustedDeviceName: $trusted_device_name,
      username: $username,
      acceptInvitations: $accept_invitations
    }'
  )"

echo "$JSON_STRING" > /etc/eufy-security-ws-config.json
/usr/local/bin/node /usr/src/app/dist/bin/server.js --config /etc/eufy-security-ws-config.json $DEBUG_OPTION
