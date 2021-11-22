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
    eventDurationSeconds: number;           // Duration in seconds before an event is reset E.g. motion event (default: 10 sec.)
    acceptInvitations?: booleam;            // Automatically accept device invitations (default: false)
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

#### Set 2FA verify code

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

#### Set captcha

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
    command: "driver.is_connected";
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
    command: "driver.is_push_connected";
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

#### Get Video Events

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

#### Get Alarm Events

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

#### Get History Events

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
    serialNumber: string;  // [added with schema version: 4+]
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
    serialNumber: string;  // [added with schema version: 4+]
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

#### Trigger alarm sound

[compatible with schema version: 3+]

```ts
interface {
    messageId: string;
    command: "station.trigger_alarm";
    serialNumber: string;
    seconds: number;
}
```

#### Reset alarm sound

[compatible with schema version: 3+]

```ts
interface {
    messageId: string;
    command: "station.reset_alarm";
    serialNumber: string;
}
```

#### Get supported commands

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

#### Check command name

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

#### Check property name

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
    serialNumber: string;  // [added with schema version: 4+]
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
    serialNumber: string;  // [added with schema version: 4+]
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

#### Start live stream

[compatible with schema version: 2+]

```ts
interface {
  messageId: string;
  command: "device.start_livestream";
  serialNumber: string;
}
```

#### Stop live stream

[compatible with schema version: 2+]

```ts
interface {
  messageId: string;
  command: "device.stop_livestream";
  serialNumber: string;
}
```

#### Get live stream status

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

#### Trigger alarm sound

[compatible with schema version: 3+]

```ts
interface {
    messageId: string;
    command: "device.trigger_alarm";
    serialNumber: string;
    seconds: number;
}
```

#### Reset alarm sound

[compatible with schema version: 3+]

```ts
interface {
    messageId: string;
    command: "device.reset_alarm";
    serialNumber: string;
}
```

#### Start video download

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

#### Cancel video download

[compatible with schema version: 3+]

```ts
interface {
  messageId: string;
  command: "device.cancel_download";
  serialNumber: string;
}
```

#### Pan and tilt camera

[compatible with schema version: 3+]

```ts
interface {
  messageId: string;
  command: "device.pan_and_tilt";
  serialNumber: string;
  direction: PanTiltDirection;
}
```

#### Doorbell quick response

[compatible with schema version: 3+]

```ts
interface {
  messageId: string;
  command: "device.quick_response";
  serialNumber: string;
  voiceId: number;
}
```

#### Get doorbell quick response voices

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

#### Get supported commands

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

#### Check command name

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

#### Check property name

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

#### Start RTSP live stream

[compatible with schema version: 6+]

```ts
interface {
  messageId: string;
  command: "device.start_rtsp_livestream";
  serialNumber: string;
}
```

#### Stop RTSP live stream

[compatible with schema version: 6+]

```ts
interface {
  messageId: string;
  command: "device.stop_rtsp_livestream";
  serialNumber: string;
}
```

#### Get RTSP live stream status

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

## Events

### Driver level events

#### `verify code`

[compatible with schema version: 0+]

This event is sent whenever the Eufy Cloud asks for a 2FA token during the login process.

```ts
interface {
  type: "event";
  event: {
    source: "driver";
    event: "verify code";
  }
}
```

#### `captcha request`

[compatible with schema version: 7+]

This event is sent whenever the Eufy Cloud asks for a captcha during the login process.

```ts
interface {
  type: "event";
  event: {
    source: "driver";
    event: "captcha request";
    captchaId: string;
    captcha: string;
  }
}
```

#### `connected`

[compatible with schema version: 0+]

This event is sent whenever the connection to the Eufy Cloud is successfully established.

```ts
interface {
  type: "event";
  event: {
    source: "driver";
    event: "connected";
  }
}
```

#### `disconnected`

[compatible with schema version: 0+]

This event is sent whenever the connection to the Eufy Cloud connection is lost.

```ts
interface {
  type: "event";
  event: {
    source: "driver";
    event: "disconnected";
  }
}
```

#### `push connected`

[compatible with schema version: 0+]

This event is sent whenever the connection to the Eufy Cloud Push notification is successfully established.

```ts
interface {
  type: "event";
  event: {
    source: "driver";
    event: "push connected";
  }
}
```

#### `push disconnected`

[compatible with schema version: 0+]

This event is sent whenever the connection to the Eufy Cloud Push notification is lost.

```ts
interface {
  type: "event";
  event: {
    source: "driver";
    event: "push disconnected";
  }
}
```

### Station level events

#### `station added`

[compatible with schema version: 0+]

This event is sent when a new station is found.

```ts
interface {
  type: "event";
  event: {
    source: "station";
    event: "station added";
    station: {
      name: string;
      model: string;
      serialNumber: string;
      hardwareVersion: string;
      softwareVersion: string;
      lanIpAddress: string;
      macAddress: string;
      currentMode: number;
      guardMode: number;
      connected: boolean;
      type: number;                             // [added with schema version: 1+]
      timeFormat: number;                       // [added with schema version: 3+]
      alarmVolume: number;                      // [added with schema version: 3+]
      alarmTone: number;                        // [added with schema version: 3+]
      promptVolume: number;                     // [added with schema version: 3+]
      notificationSwitchModeSchedule: boolean;  // [added with schema version: 3+]
      notificationSwitchModeGeofence: boolean;  // [added with schema version: 3+]
      notificationSwitchModeApp: boolean;       // [added with schema version: 3+]
      notificationSwitchModeKeypad: boolean;    // [added with schema version: 3+]
      notificationStartAlarmDelay: boolean;     // [added with schema version: 3+]
      switchModeWithAccessCode: boolean;        // [added with schema version: 5+]
      autoEndAlarm: boolean;                    // [added with schema version: 5+]
      turnOffAlarmWithButton: boolean;          // [added with schema version: 5+]
    }
  }
}
```

#### `station removed`

[compatible with schema version: 0+]

This event is sent when a station is removed.

```ts
interface {
  type: "event";
  event: {
    source: "station";
    event: "station removed";
    station: {
      name: string;
      model: string;
      serialNumber: string;
      hardwareVersion: string;
      softwareVersion: string;
      lanIpAddress: string;
      macAddress: string;
      currentMode: number;
      guardMode: number;
      connected: boolean;
      type: number;                             // [added with schema version: 1+]
      timeFormat: number;                       // [added with schema version: 3+]
      alarmVolume: number;                      // [added with schema version: 3+]
      alarmTone: number;                        // [added with schema version: 3+]
      promptVolume: number;                     // [added with schema version: 3+]
      notificationSwitchModeSchedule: boolean;  // [added with schema version: 3+]
      notificationSwitchModeGeofence: boolean;  // [added with schema version: 3+]
      notificationSwitchModeApp: boolean;       // [added with schema version: 3+]
      notificationSwitchModeKeypad: boolean;    // [added with schema version: 3+]
      notificationStartAlarmDelay: boolean;     // [added with schema version: 3+]
      switchModeWithAccessCode: boolean;        // [added with schema version: 5+]
      autoEndAlarm: boolean;                    // [added with schema version: 5+]
      turnOffAlarmWithButton: boolean;          // [added with schema version: 5+]
    }
  }
}
```

#### `guard mode changed`

[compatible with schema version: 0+]

This event is sent whenever the guard mode of a station is changed.

```ts
interface {
  type: "event";
  event: {
    source: "station";
    event: "guard mode changed";
    serialNumber: string;
    currentMode: number;      // [removed with schema version: 3+ as there is now a separate event]
    guardMode: number;
  }
}
```

#### `current mode changed`

[compatible with schema version: 3+]

This event is sent whenever the current mode of a station is changed.

```ts
interface {
  type: "event";
  event: {
    source: "station";
    event: "current mode changed";
    serialNumber: string;
    currentMode: number;
  }
}
```

#### `command result`

[compatible with schema version: 0+]

This event is sent after each execution of a p2p command and reflects the result of the command.

```ts
interface {
  type: "event";
  event: {
    source: "station";
    event: "command result";
    serialNumber: string;
    command: string;
    returnCode: number;
    returnCodeName: string;
  }
}
```

#### `connected`

[compatible with schema version: 0+]

This event is sent when the connection to the station is successfully established.

```ts
interface {
  type: "event";
  event: {
    source: "station";
    event: "connected";
    serialNumber: string;
  }
}
```

#### `disconnected`

[compatible with schema version: 0+]

This event is sent whenever the connection to the station is lost.

```ts
interface {
  type: "event";
  event: {
    source: "station";
    event: "disconnected";
    serialNumber: string;
  }
}
```

#### `property changed`

[compatible with schema version: 0+]

This event is sent whenever a property of a station is changed.

```ts
interface {
  type: "event";
  event: {
    source: "station";
    event: "property changed";
    serialNumber: string;
    name: string;
    value: JSONValue;
    timestamp: number;
  }
}
```

#### `alarm event`

[compatible with schema version: 3+]

This event is sent whenever an alarm event occurred.

```ts
interface {
  type: "event";
  event: {
    source: "station";
    event: "alarm event";
    serialNumber: string;
    alarmEvent: AlarmEvent;
  }
}
```

### Device level events

#### `device added`

[compatible with schema version: 0+]

This event is sent when a new device is found.

```ts
interface {
  type: "event";
  event: {
    source: "device";
    event: "device added";
    device: {
      name: string;
      model: string;
      serialNumber: string;
      hardwareVersion: string;
      softwareVersion: string;
      stationSerialNumber: device.getPropertyValue(PropertyName.DeviceStationSN)?.value as string,
      enabled: boolean;
      state: number;
      battery: number;
      batteryTemperature: number;
      batteryLow: boolean;
      lastChargingDays: number;
      lastChargingTotalEvents: number;
      lastChargingRecordedEvents: number;
      lastChargingFalseEvents: number;
      batteryUsageLastWeek: number;
      motionDetected: boolean;
      personDetected: boolean;
      personName: string;
      soundDetected: boolean;
      petDetected: boolean;
      cryingDetected: boolean;
      ringing: boolean;
      locked: boolean;
      sensorOpen: boolean;
      sensorChangeTime: number;
      antitheftDetection: boolean;
      autoNightvision: boolean;
      ledStatus: boolean;                             // [added with schema version: 0+; removed with schema version: 4+]
      motionDetection: boolean;
      soundDetection: boolean;
      petDetection: boolean;
      rtspStream: boolean;
      watermark: number;
      lockStatus: number;
      motionSensorPIREvent: number;
      wifiRSSI: number;
      pictureUrl: string;
      type: number;                                   // [added with schema version: 1+]
      motionDetectionType: number;                    // [added with schema version: 3+]
      motionDetectionSensivity: number;               // [added with schema version: 3+; removed with schema version: 4+]
      motionTracking: boolean;                        // [added with schema version: 3+]
      soundDetectionType: number;                     // [added with schema version: 3+]
      soundDetectionSensivity: number;                // [added with schema version: 3+; removed with schema version: 4+]
      light: boolean;                                 // [added with schema version: 3+]
      microphone: boolean;                            // [added with schema version: 3+]
      speaker: boolean;                               // [added with schema version: 3+]
      speakerVolume: number;                          // [added with schema version: 3+]
      ringtoneVolume: number;                         // [added with schema version: 3+]
      audioRecording: boolean;                        // [added with schema version: 3+]
      powerSource: number;                            // [added with schema version: 3+]
      powerWorkingMode: number;                       // [added with schema version: 3+]
      recordingEndClipMotionStops: boolean;           // [added with schema version: 3+]
      recordingClipLength: number;                    // [added with schema version: 3+]
      recordingRetriggerInterval: number;             // [added with schema version: 3+]
      videoStreamingQuality: number;                  // [added with schema version: 3+]
      videoRecordingQuality: number;                  // [added with schema version: 3+]
      videoWDR: boolean;                              // [added with schema version: 3+]
      lightSettingsEnable: boolean;                   // [added with schema version: 3+]
      lightSettingsBrightnessManual: number;          // [added with schema version: 3+]
      lightSettingsBrightnessMotion: number;          // [added with schema version: 3+]
      lightSettingsBrightnessSchedule: number;        // [added with schema version: 3+]
      lightSettingsMotionTriggered: boolean;          // [added with schema version: 3+]
      lightSettingsMotionTriggeredDistance: number;   // [added with schema version: 3+]
      lightSettingsMotionTriggeredTimer: number;      // [added with schema version: 3+]
      chimeIndoor: boolean;                           // [added with schema version: 3+]
      chimeHomebase: boolean;                         // [added with schema version: 3+]
      chimeHomebaseRingtoneVolume: number;            // [added with schema version: 3+]
      chimeHomebaseRingtoneType: number;              // [added with schema version: 3+]
      notificationType: number;                       // [added with schema version: 3+]
      rotationSpeed: number;                          // [added with schema version: 3+]
      notificationPerson: boolean;                    // [added with schema version: 3+]
      notificationPet: boolean;                       // [added with schema version: 3+]
      notificationAllOtherMotion: boolean;            // [added with schema version: 3+]
      notificationCrying: boolean;                    // [added with schema version: 3+]
      notificationAllSound: boolean;                  // [added with schema version: 3+]
      notificationIntervalTime: boolean;              // [added with schema version: 3+]
      notificationRing: boolean;                      // [added with schema version: 3+]
      notificationMotion:boolean;                     // [added with schema version: 3+]
      chirpVolume: number;                            // [added with schema version: 4+]
      chirpTone: number;                              // [added with schema version: 4+]
      motionDetectionSensitivity: number;             // [added with schema version: 4+]
      soundDetectionSensitivity: number;              // [added with schema version: 4+]
      videoHdr: boolean;                              // [added with schema version: 4+]
      videoDistortionCorrection: boolean;             // [added with schema version: 4+]
      videoRingRecord: number;                        // [added with schema version: 4+]
      statusLed: boolean;                             // [added with schema version: 4+]
      chargingStatus: number;                         // [added with schema version: 4+]
      rtspStreamUrl: string;                          // [added with schema version: 4+]
      wifiSignalLevel: number;                        // [added with schema version: 4+]
      nightvision: number;                            // [added with schema version: 5+]
      batteryIsCharging: boolean;                     // [added with schema version: 5+]
    }
  }
}
```

#### `device removed`

[compatible with schema version: 0+]

This event is sent when a device is removed.

```ts
interface {
  type: "event";
  event: {
    source: "device";
    event: "device removed";
    device: {
      name: string;
      model: string;
      serialNumber: string;
      hardwareVersion: string;
      softwareVersion: string;
      stationSerialNumber: device.getPropertyValue(PropertyName.DeviceStationSN)?.value as string,
      enabled: boolean;
      state: number;
      battery: number;
      batteryTemperature: number;
      batteryLow: boolean;
      lastChargingDays: number;
      lastChargingTotalEvents: number;
      lastChargingRecordedEvents: number;
      lastChargingFalseEvents: number;
      batteryUsageLastWeek: number;
      motionDetected: boolean;
      personDetected: boolean;
      personName: string;
      soundDetected: boolean;
      petDetected: boolean;
      cryingDetected: boolean;
      ringing: boolean;
      locked: boolean;
      sensorOpen: boolean;
      sensorChangeTime: number;
      antitheftDetection: boolean;
      autoNightvision: boolean;
      ledStatus: boolean;                             // [added with schema version: 0+; removed with schema version: 4+]
      motionDetection: boolean;
      soundDetection: boolean;
      petDetection: boolean;
      rtspStream: boolean;
      watermark: number;
      lockStatus: number;
      motionSensorPIREvent: number;
      wifiRSSI: number;
      pictureUrl: string;
      type: number;                                   // [added with schema version: 1+]
      motionDetectionType: number;                    // [added with schema version: 3+]
      motionDetectionSensivity: number;               // [added with schema version: 3+; removed with schema version: 4+]
      motionTracking: boolean;                        // [added with schema version: 3+]
      soundDetectionType: number;                     // [added with schema version: 3+]
      soundDetectionSensivity: number;                // [added with schema version: 3+; removed with schema version: 4+]
      light: boolean;                                 // [added with schema version: 3+]
      microphone: boolean;                            // [added with schema version: 3+]
      speaker: boolean;                               // [added with schema version: 3+]
      speakerVolume: number;                          // [added with schema version: 3+]
      ringtoneVolume: number;                         // [added with schema version: 3+]
      audioRecording: boolean;                        // [added with schema version: 3+]
      powerSource: number;                            // [added with schema version: 3+]
      powerWorkingMode: number;                       // [added with schema version: 3+]
      recordingEndClipMotionStops: boolean;           // [added with schema version: 3+]
      recordingClipLength: number;                    // [added with schema version: 3+]
      recordingRetriggerInterval: number;             // [added with schema version: 3+]
      videoStreamingQuality: number;                  // [added with schema version: 3+]
      videoRecordingQuality: number;                  // [added with schema version: 3+]
      videoWDR: boolean;                              // [added with schema version: 3+]
      lightSettingsEnable: boolean;                   // [added with schema version: 3+]
      lightSettingsBrightnessManual: number;          // [added with schema version: 3+]
      lightSettingsBrightnessMotion: number;          // [added with schema version: 3+]
      lightSettingsBrightnessSchedule: number;        // [added with schema version: 3+]
      lightSettingsMotionTriggered: boolean;          // [added with schema version: 3+]
      lightSettingsMotionTriggeredDistance: number;   // [added with schema version: 3+]
      lightSettingsMotionTriggeredTimer: number;      // [added with schema version: 3+]
      chimeIndoor: boolean;                           // [added with schema version: 3+]
      chimeHomebase: boolean;                         // [added with schema version: 3+]
      chimeHomebaseRingtoneVolume: number;            // [added with schema version: 3+]
      chimeHomebaseRingtoneType: number;              // [added with schema version: 3+]
      notificationType: number;                       // [added with schema version: 3+]
      rotationSpeed: number;                          // [added with schema version: 3+]
      notificationPerson: boolean;                    // [added with schema version: 3+]
      notificationPet: boolean;                       // [added with schema version: 3+]
      notificationAllOtherMotion: boolean;            // [added with schema version: 3+]
      notificationCrying: boolean;                    // [added with schema version: 3+]
      notificationAllSound: boolean;                  // [added with schema version: 3+]
      notificationIntervalTime: boolean;              // [added with schema version: 3+]
      notificationRing: boolean;                      // [added with schema version: 3+]
      notificationMotion:boolean;                     // [added with schema version: 3+]
      chirpVolume: number;                            // [added with schema version: 4+]
      chirpTone: number;                              // [added with schema version: 4+]
      motionDetectionSensitivity: number;             // [added with schema version: 4+]
      soundDetectionSensitivity: number;              // [added with schema version: 4+]
      videoHdr: boolean;                              // [added with schema version: 4+]
      videoDistortionCorrection: boolean;             // [added with schema version: 4+]
      videoRingRecord: number;                        // [added with schema version: 4+]
      statusLed: boolean;                             // [added with schema version: 4+]
      chargingStatus: number;                         // [added with schema version: 4+]
      rtspStreamUrl: string;                          // [added with schema version: 4+]
      wifiSignalLevel: number;                        // [added with schema version: 4+]
      nightvision: number;                            // [added with schema version: 5+]
      batteryIsCharging: boolean;                     // [added with schema version: 5+]
    }
  }
}
```

#### `motion detected`

[compatible with schema version: 0+]

This event is sent whenever a motion is detected on the device (the cooldown is determined by the `eventDurationSeconds` param).

```ts
interface {
  type: "event";
  event: {
    source: "device";
    event: "motion detected";
    serialNumber: string;
    state: boolean;
  }
}
```

#### `person detected`

[compatible with schema version: 0+]

This event is sent whenever a person is detected on the device (the cooldown is determined by the `eventDurationSeconds` param).

```ts
interface {
  type: "event";
  event: {
    source: "device";
    event: "person detected";
    serialNumber: string;
    state: boolean;
    person: string;
  }
}
```

#### `crying detected`

[compatible with schema version: 0+]

This event is sent whenever a crying is detected on the device (the cooldown is determined by the `eventDurationSeconds` param).

```ts
interface {
  type: "event";
  event: {
    source: "device";
    event: "crying detected";
    serialNumber: string;
    state: boolean;
  }
}
```

#### `sound detected`

[compatible with schema version: 0+]

This event is sent whenever sound is detected on the device (the cooldown is determined by the `eventDurationSeconds` param).

```ts
interface {
  type: "event";
  event: {
    source: "device";
    event: "sound detected";
    serialNumber: string;
    state: boolean;
  }
}
```

#### `pet detected`

[compatible with schema version: 0+]

This event is sent whenever a pet is detected on the device (the cooldown is determined by the `eventDurationSeconds` param).

```ts
interface {
  type: "event";
  event: {
    source: "device";
    event: "pet detected";
    serialNumber: string;
    state: boolean;
  }
}
```

#### `rings`

[compatible with schema version: 0+]

This event is sent whenever the device is ringing (the cooldown is determined by the `eventDurationSeconds` param).

```ts
interface {
  type: "event";
  event: {
    source: "device";
    event: "rings";
    serialNumber: string;
    state: boolean;
  }
}
```

#### `sensor open`

[compatible with schema version: 0+]

This event is sent whenever the device is opened/closed (the cooldown is determined by the `eventDurationSeconds` param).

```ts
interface {
  type: "event";
  event: {
    source: "device";
    event: "sensor open";
    serialNumber: string;
    state: boolean;
  }
}
```

#### `command result`

[compatible with schema version: 0+]

This event is sent after each execution of a p2p command and reflects the result of the command.

```ts
interface {
  type: "event";
  event: {
    source: "device";
    event: "command result";
    serialNumber: string;
    command: string;
    returnCode: number;
    returnCodeName: string;
  }
}
```

#### `got rtsp url`

[compatible with schema version: 0+]

This event is sent after RTSP is enabled on the supported device.

```ts
interface {
  type: "event";
  event: {
    source: "device";
    event: "got rtsp url";
    serialNumber: string;
    rtspUrl: string;
  }
}
```

#### `property changed`

[compatible with schema version: 0+]

This event is sent whenever a property of a device is changed.

```ts
interface {
  type: "event";
  event: {
    source: "device";
    event: "property changed";
    serialNumber: string;
    name: string;
    value: JSONValue;
    timestamp: number;
  }
}
```

#### `livestream started`

[compatible with schema version: 2+]

This event is sent whenever the live stream of a device is started.

```ts
interface {
  type: "event";
  event: {
    source: "device";
    event: "livestream started";
    serialNumber: string;
  }
}
```

#### `livestream stopped`

[compatible with schema version: 2+]

This event is sent whenever the live stream of a device is stopped.

```ts
interface {
  type: "event";
  event: {
    source: "device";
    event: "livestream stopped";
    serialNumber: string;
  }
}
```

#### `livestream video data`

[compatible with schema version: 2+]

This event is sent when video data is received during an active live stream of a device. It contains the metadata information and the video chunck.

```ts
interface {
  type: "event";
  event: {
    source: "device";
    event: "livestream video data";
    serialNumber: string;
    buffer: JSONValue,
    metadata: { 
      videoCodec: string;
      videoFPS: number;
      videoHeight: number;
      videoWidth: number;
    }
  }
}
```

#### `livestream audio data`

[compatible with schema version: 2+]

This event is sent when audio data is received during an active live stream of a device. It contains the metadata information and the video chunck.

```ts
interface {
  type: "event";
  event: {
    source: "device";
    event: "livestream audio data";
    serialNumber: string;
    buffer: JSONValue,
    metadata: { 
      audioCodec: string;
    }
  }
}
```

#### `download started`

[compatible with schema version: 3+]

This event is sent whenever a video download is started.

```ts
interface {
  type: "event";
  event: {
    source: "device";
    event: "download started";
    serialNumber: string;
  }
}
```

#### `download finished`

[compatible with schema version: 3+]

This event is sent whenever a video download is finished.

```ts
interface {
  type: "event";
  event: {
    source: "device";
    event: "download finished";
    serialNumber: string;
  }
}
```

#### `download video data`

[compatible with schema version: 3+]

This event is sent when video data is received during a video download. It contains the metadata information and the video chunck.

```ts
interface {
  type: "event";
  event: {
    source: "device";
    event: "download video data";
    serialNumber: string;
    buffer: JSONValue,
    metadata: { 
      videoCodec: string;
      videoFPS: number;
      videoHeight: number;
      videoWidth: number;
    }
  }
}
```

#### `download audio data`

[compatible with schema version: 3+]

This event is sent when audio data is received during a video download. It contains the metadata information and the video chunck.

```ts
interface {
  type: "event";
  event: {
    source: "device";
    event: "download audio data";
    serialNumber: string;
    buffer: JSONValue,
    metadata: { 
      audioCodec: string;
    }
  }
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
     "schemaVersion": 4
   }
   {"type":"result","success":false,"messageId":1,"errorCode":"schema_incompatible"}
   ```

6. When we make **breaking changes** in the api, we **bump the schema version**. When adding new commands/features, we also bump the api schema and note in both code comments and documentation to which schema version that feature is compatible with.

## Authentication

eufy-security-ws does not handle authentication and allows all connections to the websocket API. If you want to add authentication, add authentication middleware to your Express instance or run NGINX in front of Express instance.

## Docker

eufy-security-ws is available via a Docker image
([`bropat/eufy-security-ws`](https://hub.docker.com/r/bropat/eufy-security-ws)). It is configured by a handful of environment variables that correspond to the options found in the config file above:

* `USERNAME:` Eufy Account Username (required)
* `PASSWORD:` Eufy Account Password (required)
* `COUNTRY:` ISO 3166-1 Alpha-2 country code (default: US)
* `LANGUAGE:` ISO 639 language code (default: en)
* `TRUSTED_DEVICE_NAME:` Label of the trusted devices (viewable with 2fa activated in Eufy App; default: eufyclient)
* `EVENT_DURATION_SECONDS:` Duration in seconds before an event is reset E.g. motion event (default: 10 sec.)
* `P2P_CONNECTION_SETUP:` P2P connection setup (default: 0 ; Prefers local connection over cloud)
* `POLLING_INTERVAL_MINUTES:` Polling intervall for data refresh from Eufy Cloud (default: 10 min.)
* `ACCEPT_INVITATIONS:` Automatically accept device invitations (default: false)
* `DEBUG:` When the variable is set, debug mode is activated (default: unset)

The image also exposes a `/data` volume that corresponds to the `persistentDir`.

Running the image is straightforward:

```
docker run -it \
    -e USERNAME=user \
    -e PASSWORD=password \
    -v "$(PWD)"/data:/data \
    -p 3000:0000 \
    bropat/eufy-security-ws:latest
```
