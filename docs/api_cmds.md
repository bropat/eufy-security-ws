# Client commands

## Server level commands

### Start listening to events

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

## Driver level commands

### Set 2FA verify code

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

### Set captcha

[compatible with schema version: 7+]

```ts
interface {
    messageId: string;
    command: "driver.set_captcha";
    captchaId?: string;
    captcha: string;
}
```

Returns:

```ts
interface {
    result: boolean;
}
```

### Update the station and device informations

[compatible with schema version: 0+]

```ts
interface {
    messageId: string;
    command: "driver.poll_refresh";
}
```

### Get cloud connection status

[compatible with schema version: 0+]

```ts
interface {
    messageId: string;
    command: "driver.is_connected";
}
```

Returns:

```ts
interface {
    connected: boolean;
}
```

### Get push notification connection status

[compatible with schema version: 0+]

```ts
interface {
    messageId: string;
    command: "driver.is_push_connected";
}
```

Returns:

```ts
interface {
    connected: boolean;
}
```

### Connect to cloud and push notifications

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

### Disconnect from cloud and push notifications

[compatible with schema version: 0+]

```ts
interface {
    messageId: string;
    command: "driver.disconnect";
}
```

### Get Video Events

[compatible with schema version: 3+]

```ts
interface {
    messageId: string;
    command: "driver.get_video_events";
    startTimestampMs?: number;
    endTimestampMs?: number;
    filter?: EventFilterType;
    maxResults?: number;
}
```

Returns:

```ts
interface {
    events: Array<EventRecordResponse>
}
```

### Get Alarm Events

[compatible with schema version: 3+]

```ts
interface {
    messageId: string;
    command: "driver.get_alarm_events";
    startTimestampMs?: number;
    endTimestampMs?: number;
    filter?: EventFilterType;
    maxResults?: number;
}
```

Returns:

```ts
interface {
    events: Array<EventRecordResponse>
}
```

### Get History Events

[compatible with schema version: 3+]

```ts
interface {
    messageId: string;
    command: "driver.get_history_events";
    startTimestampMs?: number;
    endTimestampMs?: number;
    filter?: EventFilterType;
    maxResults?: number;
}
```

Returns:

```ts
interface {
    events: Array<EventRecordResponse>
}
```

### Get MQTT notification connection status

[compatible with schema version: 9+]

```ts
interface {
    messageId: string;
    command: "driver.is_mqtt_connected";
}
```

Returns:

```ts
interface {
    connected: boolean;
}
```

### Set log level

[compatible with schema version: 9+]

```ts
interface {
    messageId: string;
    command: "driver.set_log_level";
    level: "silly" | "trace" | "debug" | "info" | "warn" | "error" | "fatal";
}
```

### Get log level

[compatible with schema version: 9+]

```ts
interface {
    messageId: string;
    command: "driver.get_log_level";
}
```

Returns:

```ts
interface {
    level: "silly" | "trace" | "debug" | "info" | "warn" | "error" | "fatal";
}
```

### Start listening logs

[compatible with schema version: 9+]

```ts
interface {
    messageId: string;
    command: "driver.start_listening_logs";
}
```

### Stop listening logs

[compatible with schema version: 9+]

```ts
interface {
    messageId: string;
    command: "driver.stop_listening_logs";
}
```

## Station level commands

### Reboot station

[compatible with schema version: 0+]

```ts
interface {
    messageId: string;
    command: "station.reboot";
    serialNumber: string;
}
```

### Set guard mode

[compatible with schema version: 0+]

!>_Deprecated: Will be removed in future versions. Use the set/get property commands instead._

```ts
interface {
    messageId: string;
    command: "station.set_guard_mode";
    serialNumber: string;
    mode: number;
}
```

### Get station connection status

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
    serialNumber: string;  // [added with schema version: 4+]
    connected: boolean;
}
```

### Connect to station

[compatible with schema version: 0+]

```ts
interface {
    messageId: string;
    command: "station.connect";
}
```

### Disconnect from station

[compatible with schema version: 0+]

```ts
interface {
    messageId: string;
    command: "station.disconnect";
}
```

### Get properties metadata

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

### Get property values

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
    serialNumber: string;  // [added with schema version: 4+]
    properties: {
        [index: string]: PropertyValue;
    }
}
```

### Set property value

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

### Trigger alarm sound

[compatible with schema version: 3+]

```ts
interface {
    messageId: string;
    command: "station.trigger_alarm";
    serialNumber: string;
    seconds: number;
}
```

### Reset alarm sound

[compatible with schema version: 3+]

```ts
interface {
    messageId: string;
    command: "station.reset_alarm";
    serialNumber: string;
}
```

### Get supported commands

[compatible with schema version: 3+]

```ts
interface {
    messageId: string;
    command: "station.get_commands";
    serialNumber: string;
}
```

Returns:

```ts
interface {
    serialNumber: string;  // [added with schema version: 4+]
    commands: Array<CommandName>;
}
```

### Check command name

[compatible with schema version: 3+]

```ts
interface {
    messageId: string;
    command: "station.has_command";
    serialNumber: string;
    commandName: string;
}
```

Returns:

```ts
interface {
    serialNumber: string;  // [added with schema version: 4+]
    exists: boolean;
}
```

### Check property name

[compatible with schema version: 3+]

```ts
interface {
    messageId: string;
    command: "station.has_property";
    serialNumber: string;
    propertyName: string;
}
```

Returns:

```ts
interface {
    serialNumber: string;  // [added with schema version: 4+]
    exists: boolean;
}
```

## Device level commands

### Get properties metadata

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
    serialNumber: string;  // [added with schema version: 4+]
    properties: {
        [index: string]: PropertyMetadataAny;
    }
}
```

### Get property values

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
    serialNumber: string;  // [added with schema version: 4+]
    properties: {
        [index: string]: PropertyValue;
    }
}
```

### Set property value

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

### Enable/disable status led

[compatible with schema version: 0+]

!>_Deprecated: Will be removed in future versions. Use the set/get property commands instead._

```ts
interface {
  messageId: string;
  command: "device.set_status_led";
  serialNumber: string;
  value: boolean;
}
```

### Enable/disable auto nightvision

[compatible with schema version: 0+]

!>_Deprecated: Will be removed in future versions. Use the set/get property commands instead._

```ts
interface {
  messageId: string;
  command: "device.set_auto_night_vision";
  serialNumber: string;
  value: boolean;
}
```

### Enable/disable motion detection

[compatible with schema version: 0+]

!>_Deprecated: Will be removed in future versions. Use the set/get property commands instead._

```ts
interface {
  messageId: string;
  command: "device.set_motion_detection";
  serialNumber: string;
  value: boolean;
}
```

### Enable/disable sound detection

[compatible with schema version: 0+]

!>_Deprecated: Will be removed in future versions. Use the set/get property commands instead._

```ts
interface {
  messageId: string;
  command: "device.set_sound_detection";
  serialNumber: string;
  value: boolean;
}
```

### Enable/disable pet detection

[compatible with schema version: 0+]

!>_Deprecated: Will be removed in future versions. Use the set/get property commands instead._

```ts
interface {
  messageId: string;
  command: "device.set_pet_detection";
  serialNumber: string;
  value: boolean;
}
```

### Enable/disable RTSP stream

[compatible with schema version: 0+]

!>_Deprecated: Will be removed in future versions. Use the set/get property commands instead._

```ts
interface {
  messageId: string;
  command: "device.set_rtsp_stream";
  serialNumber: string;
  value: boolean;
}
```

### Enable/disable anti theft detection

[compatible with schema version: 0+]

!>_Deprecated: Will be removed in future versions. Use the set/get property commands instead._

```ts
interface {
  messageId: string;
  command: "device.set_anti_theft_detection";
  serialNumber: string;
  value: boolean;
}
```

### Set watermark

[compatible with schema version: 0+]

!>_Deprecated: Will be removed in future versions. Use the set/get property commands instead._

```ts
interface {
  messageId: string;
  command: "device.set_watermark";
  serialNumber: string;
  value: number;
}
```

### Enable/disable device

[compatible with schema version: 0+]

!>_Deprecated: Will be removed in future versions. Use the set/get property commands instead._

```ts
interface {
  messageId: string;
  command: "device.enable_device";
  serialNumber: string;
  value: boolean;
}
```

### Lock/unlock device

[compatible with schema version: 0+]

!>_Deprecated: Will be removed in future versions. Use the set/get property commands instead._

```ts
interface {
  messageId: string;
  command: "device.lock_device";
  serialNumber: string;
  value: boolean;
}
```

### Start live stream

[compatible with schema version: 2+]

```ts
interface {
  messageId: string;
  command: "device.start_livestream";
  serialNumber: string;
}
```

### Stop live stream

[compatible with schema version: 2+]

```ts
interface {
  messageId: string;
  command: "device.stop_livestream";
  serialNumber: string;
}
```

### Get live stream status

[compatible with schema version: 2+]

```ts
interface {
  messageId: string;
  command: "device.is_livestreaming";
  serialNumber: string;
}
```

Returns:

```ts
interface {
    serialNumber: string;  // [added with schema version: 4+]
    livestreaming: boolean;
}
```

### Trigger alarm sound

[compatible with schema version: 3+]

```ts
interface {
    messageId: string;
    command: "device.trigger_alarm";
    serialNumber: string;
    seconds: number;
}
```

### Reset alarm sound

[compatible with schema version: 3+]

```ts
interface {
    messageId: string;
    command: "device.reset_alarm";
    serialNumber: string;
}
```

### Start video download

[compatible with schema version: 3+]

```ts
interface {
  messageId: string;
  command: "device.start_download";
  serialNumber: string;
  path: string;
  cipherId: number;
}
```

### Cancel video download

[compatible with schema version: 3+]

```ts
interface {
  messageId: string;
  command: "device.cancel_download";
  serialNumber: string;
}
```

### Pan and tilt camera

[compatible with schema version: 3+]

```ts
interface {
  messageId: string;
  command: "device.pan_and_tilt";
  serialNumber: string;
  direction: PanTiltDirection;
}
```

### Doorbell quick response

[compatible with schema version: 3+]

```ts
interface {
  messageId: string;
  command: "device.quick_response";
  serialNumber: string;
  voiceId: number;
}
```

### Get doorbell quick response voices

[compatible with schema version: 3+]

```ts
interface {
  messageId: string;
  command: "device.get_voices";
  serialNumber: string;
}
```

Returns:

```ts
interface {
    serialNumber: string;  // [added with schema version: 4+]
    voices: Voices
}
```

### Get supported commands

[compatible with schema version: 3+]

```ts
interface {
    messageId: string;
    command: "device.get_commands";
    serialNumber: string;
}
```

Returns:

```ts
interface {
    serialNumber: string;  // [added with schema version: 4+]
    commands: Array<CommandName>;
}
```

### Check command name

[compatible with schema version: 3+]

```ts
interface {
    messageId: string;
    command: "device.has_command";
    serialNumber: string;
    commandName: string;
}
```

Returns:

```ts
interface {
    serialNumber: string;  // [added with schema version: 4+]
    exists: boolean;
}
```

### Check property name

[compatible with schema version: 3+]

```ts
interface {
    messageId: string;
    command: "device.has_property";
    serialNumber: string;
    propertyName: string;
}
```

Returns:

```ts
interface {
    serialNumber: string;  // [added with schema version: 4+]
    exists: boolean;
}
```

### Start RTSP live stream

[compatible with schema version: 6+]

```ts
interface {
  messageId: string;
  command: "device.start_rtsp_livestream";
  serialNumber: string;
}
```

### Stop RTSP live stream

[compatible with schema version: 6+]

```ts
interface {
  messageId: string;
  command: "device.stop_rtsp_livestream";
  serialNumber: string;
}
```

### Get RTSP live stream status

[compatible with schema version: 6+]

```ts
interface {
  messageId: string;
  command: "device.is_rtsp_livestreaming";
  serialNumber: string;
}
```

Returns:

```ts
interface {
    serialNumber: string;
    livestreaming: boolean;
}
```

### Calibrate lock

[compatible with schema version: 9+]

```ts
interface {
  messageId: string;
  command: "device.calibrate_lock";
  serialNumber: string;
}
```