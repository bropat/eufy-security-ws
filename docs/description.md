# Description

`eufy-security-ws` is a small server wrapper around the [eufy-security-client](https://github.com/bropat/eufy-security-client) library to access it via a WebSocket. It allows you to control [Eufy security devices](https://us.eufylife.com/collections/security) by connecting to the Eufy cloud servers and local/remote stations.

For everything to work you need to provide your login details for the cloud. The server will then connect to your cloud account and request all device data via HTTPS. Depending on the device, it will also try to establish a P2P connection (local or remote) and/or a MQTT connection. However, a connection to the Eufy Cloud is always a prerequisite.

A server instance displays all devices from an Eufy Cloud account and allows them to be controlled.

## Authentication

`eufy-security-ws` does not handle authentication and allows all connections to the websocket API. If you want to add authentication, add authentication middleware to your Express instance or run NGINX in front of Express instance.