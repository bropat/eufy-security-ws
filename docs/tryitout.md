# Trying it out

These instructions are for development only. These CLIs will be available as `eufy-security-server` and `eufy-security-client` after installing the NPM package.

## Start server

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
    p2pConnectionSetup: number;             // P2P connection setup (default: 2 ; Quickest connection)
    pollingIntervalMinutes: number;         // Polling intervall for data refresh from Eufy Cloud (default: 10 min.)
    eventDurationSeconds: number;           // Duration in seconds before an event is reset E.g. motion event (default: 10 sec.)
    acceptInvitations?: booleam;            // Automatically accept device invitations (default: false)
}
```

To specify different listening port specify `--port`.

## Start client

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