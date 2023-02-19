#!/bin/bash

if [ -z "${USERNAME}" ] || [ -z "${PASSWORD}" ]; then
    echo "Missing one of USERNAME or PASSWORD"
    exit 1
fi

RE='^[0-9]+$'

COUNTRY_ARG=""
COUNTRY_JQ=""
if [ -n "${COUNTRY}" ]; then
    COUNTRY_ARG="--arg country $COUNTRY"
    COUNTRY_JQ="country: \$country,"
fi

EVENT_DURATION_SECONDS_ARG=""
EVENT_DURATION_SECONDS_JQ=""
if [ -n "${EVENT_DURATION_SECONDS}" ]; then
    EVENT_DURATION_SECONDS_ARG="--arg event_duration_seconds $EVENT_DURATION_SECONDS"
    EVENT_DURATION_SECONDS_JQ="eventDurationSeconds: \$event_duration_seconds,"
fi

LANGUAGE_ARG=""
LANGUAGE_JQ=""
if [ -n "${LANGUAGE}" ]; then
    LANGUAGE_ARG="--arg language $LANGUAGE"
    LANGUAGE_JQ="language: \$language,"
fi

P2P_CONNECTION_SETUP_ARG=""
P2P_CONNECTION_SETUP_JQ=""
if [ -n "${P2P_CONNECTION_SETUP}" ]; then
    P2P_CONNECTION_SETUP_ARG="--arg p2p_connection_setup $P2P_CONNECTION_SETUP"
    P2P_CONNECTION_SETUP_JQ="p2pConnectionSetup: \$p2p_connection_setup,"
fi

POLLING_INTERVAL_MINUTES_ARG=""
POLLING_INTERVAL_MINUTES_JQ=""
if [ -n "${POLLING_INTERVAL_MINUTES}" ]; then
    POLLING_INTERVAL_MINUTES_ARG="--arg polling_interval_minutes $POLLING_INTERVAL_MINUTES"
    POLLING_INTERVAL_MINUTES_JQ="pollingIntervalMinutes: \$polling_interval_minutes,"
fi

ACCEPT_INVITATIONS_ARG=""
ACCEPT_INVITATIONS_JQ=""
if [ -n "${ACCEPT_INVITATIONS}" ]; then
    ACCEPT_INVITATIONS_ARG="--arg accept_invitations $ACCEPT_INVITATIONS"
    ACCEPT_INVITATIONS_JQ="acceptInvitations: \$accept_invitations,"
fi

TRUSTED_DEVICE_NAME_ARG=""
TRUSTED_DEVICE_NAME_JQ=""
if [ -n "${TRUSTED_DEVICE_NAME}" ]; then
    TRUSTED_DEVICE_NAME_ARG="--arg trusted_device_name ${TRUSTED_DEVICE_NAME}"
    TRUSTED_DEVICE_NAME_JQ="trustedDeviceName: \$trusted_device_name,"
fi

STATION_IP_ADDRESSES_ARG=""
STATION_IP_ADDRESSES_JQ=""
if [ -n "${STATION_IP_ADDRESSES}" ]; then
    STATION_DATA=(`echo "$STATION_IP_ADDRESSES" | tr -d "[:space:]" | tr ";" " "`)
    for index in "${!STATION_DATA[@]}"; do
        TMP_DATA=(`echo ${STATION_DATA[index]} | tr ":" " "`)
        if [ $index -eq 0 ]; then
            STATION_IP_ADDRESSES_ARG="--arg ${TMP_DATA[0]} ${TMP_DATA[1]}"
            STATION_IP_ADDRESSES_JQ="stationIPAddresses: { \$${TMP_DATA[0]}"
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
  $COUNTRY_ARG \
  $EVENT_DURATION_SECONDS_ARG \
  $LANGUAGE_ARG \
  $P2P_CONNECTION_SETUP_ARG \
  $POLLING_INTERVAL_MINUTES_ARG \
  $TRUSTED_DEVICE_NAME_ARG \
  $ACCEPT_INVITATIONS_ARG \
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

echo "$JSON_STRING" > /etc/eufy-security-ws-config.json
/usr/local/bin/node /usr/src/app/dist/bin/server.js --host 0.0.0.0 --config /etc/eufy-security-ws-config.json $DEBUG_OPTION $PORT_OPTION
