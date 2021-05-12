# eufy-security-ws

![Logo](img/eufy-security.png)

[![node](https://img.shields.io/node/v/eufy-security-ws.svg)](https://www.npmjs.com/package/eufy-security-ws)
[![NPM version](http://img.shields.io/npm/v/eufy-security-ws.svg)](https://www.npmjs.com/package/eufy-security-ws)
[![Downloads](https://img.shields.io/npm/dm/eufy-security-ws.svg)](https://www.npmjs.com/package/eufy-security-ws)
[![Dependency Status](https://img.shields.io/david/bropat/eufy-security-ws.svg)](https://david-dm.org/bropat/eufy-security-ws)
[![Known Vulnerabilities](https://snyk.io/test/github/bropat/eufy-security-ws/badge.svg)](https://snyk.io/test/github/bropat/eufy-security-ws)

[![NPM](https://nodei.co/npm/eufy-security-ws.png?downloads=true)](https://nodei.co/npm/eufy-security-ws/)

Small server wrapper around [eufy-security-client](https://www.npmjs.com/package/eufy-security-client) library to access it via a WebSocket.

The development of this server was inspired by the following project:

* [zwave-js-server](https://github.com/zwave-js/zwave-js-server)

Credits go to them as well.

If you appreciate my work and progress and want to support me, you can do it here:

[![ko-fi](https://www.ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/E1E332Q6Z)

## Trying it out

These instructions are for development only. These CLIs will be available as `eufy-security-server` and `eufy-security-client` after installing the NPM package.

### Start server

```shell
ts-node src/bin/server.ts
```

Opens server on `ws://localhost:3000`.

You can specify a configuration file with `--config`. This can be a JSON file or a JS file that exports the config. It needs to following format:

```ts
export interface EufySecurityConfig {
    username: string;                       // Eufy Account Username (required)
    password: string;                       // Eufy Account Password (required)
    country?: string;                       // ISO 3166-1 Alpha-2 country code (default: US)
    language?: string;                      // ISO 639 language code (default: en)
    trustedDeviceName?: string;             // Label of the trusted devices (viewable with 2fa activated in Eufy App; default: eufyclient)
    persistentDir?: string;                 // Directory in which the persistent information is saved (default: module path)
    p2pConnectionSetup: number;             // P2P connection setup (default: 0 ; Prefers local connection over cloud)
    pollingIntervalMinutes: number;         // Polling intervall for data refresh from Eufy Cloud (default: 10 min.)
    eventDurationSeconds: number;           // Duration in seconds befora an event is reset E.g. motion event (default: 10 sec.)
}
```

To specify different listening port specify `--port`.

### Start client

Requires server to be running.

Default connects to `ws://localhost:3000`:

```shell
ts-node src/bin/client.ts
```

To specify different host and port:

```shell
ts-node src/bin/client.ts --host 192.168.1.100 --port 6000
```

To specify a schema version other than the latest (`maxSchemaVersion`):

```shell
ts-node src/bin/client.ts --schemaVersion 0
```

All these options can be combined.

## API

When a client connects, the server will send the version.

```ts
interface {
    type: "version";
    driverVersion: string;
    serverVersion: string;
    minSchemaVersion: number;
    maxSchemaVersion: number;
}
```

To start receive the state and get events, the client needs to send the `start_listening` command.

```ts
interface {
    messageId: string;
    command: "start_listening";
}
```

The server will respond with the current state and start sending events.

```ts
interface {
    type: "result";
    messageId: string; // maps the `start_listening` command
    success: true,
    result: {
      state: {
          driver: {
              version:
              connected:
              pushConnected:
          }
          stations: Partial<StationState>[];
          devices: Partial<DeviceState>[];
      }
  };
}
```

After that, the client will be notified of each state change that happens inside eufy-security-client.

Event keys follow the names/types as used by eufy-security-client.

```ts
interface {
    type: "event",
    event: {
        source: "driver" | "station" | "device";
        event: string;
        [key: string]: unknown;
    }
}
```

## Client commands

### Server level commands

#### Start listening to events

```ts
interface {
    messageId: string;
    command: "start_listening";
}
```

### Set API schema version

[compatible with schema version: 0+]

```ts
interface {
    messageId: string;
    command: "set_api_schema";
    schemaVersion: number;
}
```

### Driver level commands

#### Get the config of the driver

[compatible with schema version: 0+]

```ts
interface {
    messageId: string;
    command: "driver.set_verify_code";
    verifyCode: string;
}
```

Returns:

```ts
interface {
    result: boolean;
}
```

#### Update the station and device informations

[compatible with schema version: 0+]

```ts
interface {
    messageId: string;
    command: "driver.poll_refresh";
}
```

#### Get cloud connection status

[compatible with schema version: 0+]

```ts
interface {
    messageId: string;
    command: "driver.isConnected";
}
```

Returns:

```ts
interface {
    connected: boolean;
}
```

#### Get push notification connection status

[compatible with schema version: 0+]

```ts
interface {
    messageId: string;
    command: "driver.isPushConnected";
}
```

Returns:

```ts
interface {
    connected: boolean;
}
```

#### Connect to cloud and push notifications

[compatible with schema version: 0+]

```ts
interface {
    messageId: string;
    command: "driver.connect";
}
```

Returns:

```ts
interface {
    result: boolean;
}
```

#### Disconnect from cloud and push notifications

[compatible with schema version: 0+]

```ts
interface {
    messageId: string;
    command: "driver.disconnect";
}
```

### Station level commands

#### Reboot station

[compatible with schema version: 0+]

```ts
interface {
    messageId: string;
    command: "station.reboot";
    serialNumber: string;
}
```

#### Set guard mode

[compatible with schema version: 0+]

```ts
interface {
    messageId: string;
    command: "station.set_guard_mode";
    serialNumber: string;
    mode: number;
}
```

#### Get station connection status

[compatible with schema version: 0+]

```ts
interface {
    messageId: string;
    command: "station.isConnected";
    serialNumber: string;
}
```

Returns:

```ts
interface {
    connected: boolean;
}
```

#### Connect to station

[compatible with schema version: 0+]

```ts
interface {
    messageId: string;
    command: "station.connect";
}
```

#### Disconnect from station

[compatible with schema version: 0+]

```ts
interface {
    messageId: string;
    command: "station.disconnect";
}
```

#### Get properties metadata

[compatible with schema version: 0+]

```ts
interface {
    messageId: string;
    command: "station.get_properties_metadata";
    serialNumber: string;
}
```

Returns:

```ts
interface {
    properties: {
        [index: string]: PropertyMetadataAny;
    }
}
```

#### Get property values

[compatible with schema version: 0+]

```ts
interface {
    messageId: string;
    command: "station.get_properties";
    serialNumber: string;
}
```

Returns:

```ts
interface {
    properties: {
        [index: string]: PropertyValue;
    }
}
```

#### Set property value

[compatible with schema version: 0+]

```ts
interface {
    messageId: string;
    command: "station.set_property";
    serialNumber: string;
    name: string;
    value: unknown;
}
```

### Device level commands

#### Get properties metadata

[compatible with schema version: 0+]

```ts
interface {
    messageId: string;
    command: "device.get_properties_metadata";
    serialNumber: string;
}
```

Returns:

```ts
interface {
    properties: {
        [index: string]: PropertyMetadataAny;
    }
}
```

#### Get property values

[compatible with schema version: 0+]

```ts
interface {
    messageId: string;
    command: "device.get_properties";
    serialNumber: string;
}
```

Returns:

```ts
interface {
    properties: {
        [index: string]: PropertyValue;
    }
}
```

#### Set property value

[compatible with schema version: 0+]

```ts
interface {
    messageId: string;
    command: "device.set_property";
    serialNumber: string;
    name: string;
    value: unknown;
}
```

#### Enable/disable status led

[compatible with schema version: 0+]

```ts
interface {
  messageId: string;
  command: "device.set_status_led";
  serialNumber: string;
  value: boolean;
}
```

#### Enable/disable auto nightvision

[compatible with schema version: 0+]

```ts
interface {
  messageId: string;
  command: "device.set_auto_night_vision";
  serialNumber: string;
  value: boolean;
}
```

#### Enable/disable motion detection

[compatible with schema version: 0+]

```ts
interface {
  messageId: string;
  command: "device.set_motion_detection";
  serialNumber: string;
  value: boolean;
}
```

#### Enable/disable sound detection

[compatible with schema version: 0+]

```ts
interface {
  messageId: string;
  command: "device.set_sound_detection";
  serialNumber: string;
  value: boolean;
}
```

#### Enable/disable pet detection

[compatible with schema version: 0+]

```ts
interface {
  messageId: string;
  command: "device.set_pet_detection";
  serialNumber: string;
  value: boolean;
}
```

#### Enable/disable RTSP stream

[compatible with schema version: 0+]

```ts
interface {
  messageId: string;
  command: "device.set_rtsp_stream";
  serialNumber: string;
  value: boolean;
}
```

#### Enable/disable anti theft detection

[compatible with schema version: 0+]

```ts
interface {
  messageId: string;
  command: "device.set_anti_theft_detection";
  serialNumber: string;
  value: boolean;
}
```

#### Set watermark

[compatible with schema version: 0+]

```ts
interface {
  messageId: string;
  command: "device.set_watermark";
  serialNumber: string;
  value: number;
}
```

#### Enable/disable device

[compatible with schema version: 0+]

```ts
interface {
  messageId: string;
  command: "device.enable_device";
  serialNumber: string;
  value: boolean;
}
```

#### Lock/unlock device

[compatible with schema version: 0+]

```ts
interface {
  messageId: string;
  command: "device.lock_device";
  serialNumber: string;
  value: boolean;
}
```

## Schema Version

In an attempt to keep compatibility between different server and client versions, we've introduced a (basic) API Schema Version.

1. **client connects** --> server sends back version info including the schema versions it can handle:

   ```json
   {
     "type": "version",
     "driverVersion": "0.8.0",
     "serverVersion": "0.1.0",
     "minSchemaVersion": 0,
     "maxSchemaVersion": 1
   }
   ```

2. **Client decides what to do based on supported schema version**.
   For example drop connection if the supported server schema is too old or just handle the supported schema itself. For example most/all basic commands will just work but relatively new commands won't and the client decides to only not handle the stuff in the upgraded schema.

3. **Client needs to tell the server what schema it wants to use.** This is done with the "set_api_schema" command:

   ```json
   {
     "command": "set_api_schema",
     "messageId": 1,
     "schemaVersion": 1
   }
   ```

   From this moment the server knows how to treat commands to/from this client. The server can handle multiple clients with different schema versions.

4. By default the server will use the minimum schema it supports (which is 0 at this time) if the `set_api_schema` command is omitted.

5. If the client sends a schema version which is **out of range**, this will produce an error to the client and in the server's log:

   ```json
   {
     "command": "set_api_schema",
     "messageId": 1,
     "schemaVersion": 3
   }
   {"type":"result","success":false,"messageId":1,"errorCode":"schema_incompatible"}
   ```

6. When we make **breaking changes** in the api, we **bump the schema version**. When adding new commands/features, we also bump the api schema and note in both code comments and documentation to which schema version that feature is compatible with.

## Authentication

eufy-security-ws does not handle authentication and allows all connections to the websocket API. If you want to add authentication, add authentication middleware to your Express instance or run NGINX in front of Express instance.
