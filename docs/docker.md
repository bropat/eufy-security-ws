# Docker

eufy-security-ws is available via a Docker image
([`bropat/eufy-security-ws`](https://hub.docker.com/r/bropat/eufy-security-ws)). It is configured by a handful of environment variables that correspond to the options found in the config file above:

| Parameter | Description |
| - | - |
| `USERNAME` | Eufy Account Username (required) |
| `PASSWORD` | Eufy Account Password (required) |
| `COUNTRY` | ISO 3166-1 Alpha-2 country code (default: US) |
| `LANGUAGE` | ISO 639 language code (default: en) |
| `TRUSTED_DEVICE_NAME` | Label of the trusted devices (viewable with 2fa activated in Eufy App; default: eufyclient) |
| `EVENT_DURATION_SECONDS` | Duration in seconds before an event is reset E.g. motion event (default: 10 sec.) |
| `P2P_CONNECTION_SETUP` | P2P connection setup (default: 2 ; Quickest connection) |
| `POLLING_INTERVAL_MINUTES` | Polling intervall for data refresh from Eufy Cloud (default: 10 min.) |
| `ACCEPT_INVITATIONS` | Automatically accept device invitations (default: false) |
| `DEBUG` | When the variable is set, debug mode is activated (default: unset) |

The image also exposes a `/data` volume that corresponds to the `persistentDir`.

Running the image is straightforward:

```
docker run -it \
    -e USERNAME=user \
    -e PASSWORD=password \
    -v "$(PWD)"/data:/data \
    -p 3000:3000 \
    bropat/eufy-security-ws:latest
```
