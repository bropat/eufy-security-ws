# Docker

eufy-security-ws is available via a Docker image
([`bropat/eufy-security-ws`](https://hub.docker.com/r/bropat/eufy-security-ws)). It is configured by a handful of environment variables that correspond to the options found in the config file described in the "[Try it out](tryitout.md)" section:

| Parameter | Description |
| - | - |
| `USERNAME` | Eufy Account Username (required) |
| `PASSWORD` | Eufy Account Password (required) |
| `COUNTRY` | ISO 3166-1 Alpha-2 country code (default: US) |
| `LANGUAGE` | ISO 639 language code (default: en) |
| `TRUSTED_DEVICE_NAME` | Label of the trusted devices (viewable with 2fa activated in Eufy App; default: random device name) |
| `EVENT_DURATION_SECONDS` | Duration in seconds before an event is reset E.g. motion event (default: 10 sec.) |
| `P2P_CONNECTION_SETUP` | P2P connection setup (default: 2 ; Quickest connection) |
| `POLLING_INTERVAL_MINUTES` | Polling intervall for data refresh from Eufy Cloud (default: 10 min.) |
| `ACCEPT_INVITATIONS` | Automatically accept device invitations (default: false) |
| `PORT` | Listening port (default: 3000) |
| `STATION_IP_ADDRESSES` | Suggested IP addresses for a stations (default: unset; value format: `station_serial1:ipaddress1;station_serial2:ipaddress2`) |
| `DEBUG` | When the variable is set, debug mode is activated (default: unset) |

The image also exposes a `/data` volume that corresponds to the `persistentDir`.

Running the image is straightforward:

```
docker run --network host -it \
    -e USERNAME=user \
    -e PASSWORD=password \
    -e PORT=3000 \
    -v "$(PWD)"/data:/data \
    bropat/eufy-security-ws:latest
```

!>Note: In order for the local auto-discovery (udp broadcasting) of the respective station to work, it is recommended to operate the Docker container with the network mode `host`, otherwise the local discovery will not work and the cloud discovery must be resorted to._

Not recommended:

```
docker run -it \
    -e USERNAME=user \
    -e PASSWORD=password \
    -v "$(PWD)"/data:/data \
    -p 3000:3000 \
    bropat/eufy-security-ws:latest
```