# API

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
     "schemaVersion": 4
   }
   {"type":"result","success":false,"messageId":1,"errorCode":"schema_incompatible"}
   ```

6. When we make **breaking changes** in the api, we **bump the schema version**. When adding new commands/features, we also bump the api schema and note in both code comments and documentation to which schema version that feature is compatible with.
