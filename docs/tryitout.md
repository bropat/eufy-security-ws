# Trying it out

These CLIs will be available as `eufy-security-server` and `eufy-security-client` after installing the NPM package.

## Start server

```shell
Usage: server [options]

Options:
  -c, --config <file>  Configuration file (default: looks in current directory)
  -p, --port <port>    Listening port (default: 3000)
  -H, --host <host>    Listening Host (default: "localhost")
  -v, --verbose
  -q, --quiet
  -h, --help           display help for command
```

```shell
node --security-revert=CVE-2023-46809 dist/bin/server.js -v -H 0.0.0.0
```

Opens server on `ws://localhost:3000`.

You can specify a configuration file with `--config`. This can be a JSON file or a JS file that exports the config. It needs to following format:

```ts
export interface EufySecurityConfig {
    username: string;                         // Eufy Account Username (required)
    password: string;                         // Eufy Account Password (required)
    country?: string;                         // ISO 3166-1 Alpha-2 country code (default: US)
    language?: string;                        // ISO 639 language code (default: en)
    trustedDeviceName?: string;               // Label of the trusted devices (viewable with 2fa activated in Eufy App; default: eufyclient)
    persistentDir?: string;                   // Directory in which the persistent information is saved (default: module path)
    p2pConnectionSetup: number;               // P2P connection setup (default: 2 ; Quickest connection)
    pollingIntervalMinutes: number;           // Polling intervall for data refresh from Eufy Cloud (default: 10 min.)
    eventDurationSeconds: number;             // Duration in seconds before an event is reset E.g. motion event (default: 10 sec.)
    acceptInvitations?: boolean;              // Automatically accept device invitations (default: false)
    stationIPAddresses?: StationIPAddresses;  // Suggested IP addresses for a stations (default: unset)
}
```

Example config file content:

```json
{
    "username": "address@mail.com",
    "password": "password",
    "country": "US",
    "language": "en",
    "trustedDeviceName": "oneplus10pro",
    "acceptInvitations": true,
    "pollingIntervalMinutes": 10,
    "p2pConnectionSetup": 2,
    "stationIPAddresses": {
        "T8010PXXXXXXXXXX": "10.0.1.10",
        "T8410PXXXXXXXXXX": "10.0.1.11"
    }
}
```

To specify different listening port specify `--port`.

## Start client

Requires server to be running.

```shell
Usage: client [options]

Options:
  -s, --schemaVersion <host>    Schema version the server should support (default: max client supported version)
  -H, --host <host>             Host to connect to (default: "localhost")
  -p, --port <port>             Port to connect to (default: 3000)
  -c, --command <command_name>  Silent command to execute (choices: "driver.set_verify_code", "driver.set_captcha", "driver.poll_refresh", "driver.is_connected",
                                "driver.is_push_connected", "driver.connect", "driver.disconnect", "driver.get_alarm_events", "driver.get_video_events", "driver.get_history_events",
                                "driver.set_log_level", "driver.get_log_level", "driver.start_listening_logs", "driver.stop_listening_logs", "driver.is_listening_logs",
                                "driver.is_mqtt_connected", "driver.isConnected", "driver.isPushConnected", "device.get_properties_metadata", "device.get_properties",
                                "device.set_property", "device.has_property", "device.start_livestream", "device.stop_livestream", "device.is_livestreaming", "device.trigger_alarm",
                                "device.reset_alarm", "device.pan_and_tilt", "device.quick_response", "device.start_download", "device.cancel_download", "device.is_downloading",
                                "device.get_voices", "device.get_commands", "device.has_command", "device.start_rtsp_livestream", "device.stop_rtsp_livestream",
                                "device.is_rtsp_livestreaming", "device.calibrate_lock", "device.calibrate", "device.set_default_angle", "device.set_privacy_angle", "device.unlock",
                                "device.start_talkback", "device.stop_talkback", "device.is_talkback_ongoing", "device.talkback_audio_data", "device.snooze", "device.add_user",
                                "device.delete_user", "device.get_users", "device.update_user_passcode", "device.update_user_schedule", "device.update_user", "device.verify_pin",
                                "device.preset_position", "device.save_preset_position", "device.delete_preset_position", "device.open", "device.set_status_led",
                                "device.set_auto_night_vision", "device.set_motion_detection", "device.set_sound_detection", "device.set_pet_detection", "device.set_rtsp_stream",
                                "device.set_anti_theft_detection", "device.set_watermark", "device.enable_device", "device.lock_device", "station.reboot", "station.is_connected",
                                "station.connect", "station.disconnect", "station.get_properties_metadata", "station.get_properties", "station.set_property", "station.has_property",
                                "station.trigger_alarm", "station.reset_alarm", "station.get_commands", "station.has_command", "station.chime", "station.download_image",
                                "station.database_query_latest_info", "station.database_query_local", "station.database_count_by_date", "station.database_delete",
                                "station.set_guard_mode", "station.isConnected", "quit", "exit")
  -a, --arguments <args...>     Arguments for silent command if expected
  -t, --timeout <seconds>       Silent command timeout seconds (default: 30)
  -v, --verbose
  -h, --help                    display help for command
```

Default connects to `ws://localhost:3000`:

```shell
tsx src/bin/client.ts
```

To specify different host and port:

```shell
tsx src/bin/client.ts --host 192.168.1.100 --port 6000
```

To specify a schema version other than the latest (`maxSchemaVersion`):

```shell
tsx src/bin/client.ts --schemaVersion 0
```

To run single command in silent mode (default interactive mode):

```shell
tsx src/bin/client.ts --command device.start_livestream -a T1234P0123456789
```

```shell
tsx src/bin/client.ts --command device.set_property -a T1234P0123456789 enabled false
```

All these options can be combined.

Return codes for silent command execution:

| Return code | Meaning |
| - | - |
| 0 | Command executed successfully |
| 1 | Wrong command syntax/arguments or not existing command |
| 2 | Command executed and returned error |
| 3 | Command execution timed out |
| 4 | WebSocket error |