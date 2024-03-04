#!/bin/bash

# allow setting specific environment variables with docker secrets
# the format is <variable-name>_FILE
supportedSecrets=( "USERNAME" 
                   "PASSWORD"
                  )
for secret in ${supportedSecrets[@]}; do
    envFile="${secret}_FILE"
    if [ $(printenv ${envFile}) ]; then envFileName=`printenv ${envFile}`; fi
    if [[ ${!envFile} && -f "$envFileName" ]]; then
        val=`cat $envFileName`
        export "${secret}"="$val"
        echo "${secret} environment variable was set by secret ${envFile}"
    fi
done

if [ -z "${USERNAME}" ] || [ -z "${PASSWORD}" ]; then
    echo "Missing one of USERNAME or PASSWORD"
    exit 1
fi

RE='^[0-9]+$'

COUNTRY_JQ=""
if [ -n "${COUNTRY}" ]; then
    COUNTRY_JQ="country: \$country,"
else
    COUNTRY=null
fi

EVENT_DURATION_SECONDS_JQ=""
if [ -n "${EVENT_DURATION_SECONDS}" ]; then
    EVENT_DURATION_SECONDS_JQ="eventDurationSeconds: \$event_duration_seconds|tonumber,"
else
    EVENT_DURATION_SECONDS=null
fi

LANGUAGE_JQ=""
if [ -n "${LANGUAGE}" ]; then
    LANGUAGE_JQ="language: \$language,"
else
    LANGUAGE=null
fi

P2P_CONNECTION_SETUP_JQ=""
if [ -n "${P2P_CONNECTION_SETUP}" ]; then
    P2P_CONNECTION_SETUP_JQ="p2pConnectionSetup: \$p2p_connection_setup|tonumber,"
else
    P2P_CONNECTION_SETUP=null
fi

POLLING_INTERVAL_MINUTES_JQ=""
if [ -n "${POLLING_INTERVAL_MINUTES}" ]; then
    POLLING_INTERVAL_MINUTES_JQ="pollingIntervalMinutes: \$polling_interval_minutes|tonumber,"
else
    POLLING_INTERVAL_MINUTES=null
fi

ACCEPT_INVITATIONS_JQ=""
if [ -n "${ACCEPT_INVITATIONS}" ]; then
    ACCEPT_INVITATIONS_JQ="acceptInvitations: \$accept_invitations,"
else
    ACCEPT_INVITATIONS=null
fi

TRUSTED_DEVICE_NAME_JQ=""
if [ -n "${TRUSTED_DEVICE_NAME}" ]; then
    TRUSTED_DEVICE_NAME_JQ="trustedDeviceName: \$trusted_device_name,"
else
    TRUSTED_DEVICE_NAME=null
fi

STATION_IP_ADDRESSES_ARG=""
STATION_IP_ADDRESSES_JQ=""
if [ -n "${STATION_IP_ADDRESSES}" ]; then
    STATION_DATA=(`echo "$STATION_IP_ADDRESSES" | tr -d "[:space:]" | tr ";" " "`)
    for index in "${!STATION_DATA[@]}"; do
        TMP_DATA=(`echo ${STATION_DATA[index]} | tr ":" " "`)
        if [ $index -eq 0 ]; then
            STATION_IP_ADDRESSES_ARG="--arg ${TMP_DATA[0]} ${TMP_DATA[1]}"
            if [ $((${#STATION_DATA[@]}-1)) -gt 0 ]; then
                STATION_IP_ADDRESSES_JQ="stationIPAddresses: { \$${TMP_DATA[0]}"
            else
                STATION_IP_ADDRESSES_JQ="stationIPAddresses: { \$${TMP_DATA[0]} }"
            fi
        else
            STATION_IP_ADDRESSES_ARG="$STATION_IP_ADDRESSES_ARG --arg ${TMP_DATA[0]} ${TMP_DATA[1]}"
            if [ $index -eq $((${#STATION_DATA[@]}-1)) ]; then
                STATION_IP_ADDRESSES_JQ="$STATION_IP_ADDRESSES_JQ, \$${TMP_DATA[0]} }"
            else
                STATION_IP_ADDRESSES_JQ="$STATION_IP_ADDRESSES_JQ, \$${TMP_DATA[0]}"
            fi
        fi
    done
fi

PORT_OPTION=""
MIN_PORT=1025
MAX_PORT=65535
if [ -n "$PORT" ]; then
    if [[ $PORT =~ $re ]] ; then
        if [ $PORT -ge $MIN_PORT ] && [ $PORT -le $MAX_PORT ]; then
            PORT_OPTION="--port $PORT"
        else
            echo "Specified PORT value ($PORT) is out of permitted range ($MIN_PORT-$MAX_PORT)."
            exit 2
        fi
    else
        echo "error: Specified PORT value ($PORT) is not a number."
        exit 2
    fi
fi

DEBUG_OPTION=""
if [ -n "$DEBUG" ]; then
    DEBUG_OPTION="-v"
fi

JSON_STRING="$( jq -n \
  --arg username "$USERNAME" \
  --arg password "$PASSWORD" \
  --arg country "$COUNTRY" \
  --arg event_duration_seconds "$EVENT_DURATION_SECONDS" \
  --arg language "$LANGUAGE" \
  --arg p2p_connection_setup "$P2P_CONNECTION_SETUP" \
  --arg polling_interval_minutes "$POLLING_INTERVAL_MINUTES" \
  --arg accept_invitations "$ACCEPT_INVITATIONS" \
  --arg trusted_device_name "$TRUSTED_DEVICE_NAME" \
  $STATION_IP_ADDRESSES_ARG \
    "{
      username: \$username,
      password: \$password,
      persistentDir: \"/data\",
      $COUNTRY_JQ
      $EVENT_DURATION_SECONDS_JQ
      $LANGUAGE_JQ
      $P2P_CONNECTION_SETUP_JQ
      $POLLING_INTERVAL_MINUTES_JQ
      $TRUSTED_DEVICE_NAME_JQ
      $ACCEPT_INVITATIONS_JQ
      $STATION_IP_ADDRESSES_JQ
    }"
  )"

echo "$JSON_STRING" > /dev/shm/eufy-security-ws-config.json
exec /usr/local/bin/node /usr/src/app/dist/bin/server.js --host 0.0.0.0 --config /dev/shm/eufy-security-ws-config.json $DEBUG_OPTION $PORT_OPTION
