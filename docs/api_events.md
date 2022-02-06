# Events

## Driver level events

### `verify code`

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

### `captcha request`

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

### `connected`

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

### `disconnected`

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

### `push connected`

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

### `push disconnected`

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

### `mqtt connected`

[compatible with schema version: 9+]

This event is sent whenever the connection to the Eufy Cloud MQTT broker is successfully established.

```ts
interface {
  type: "event";
  event: {
    source: "driver";
    event: "mqtt connected";
  }
}
```

### `mqtt disconnected`

[compatible with schema version: 9+]

This event is sent whenever the connection to the Eufy Cloud MQTT broker is lost.

```ts
interface {
  type: "event";
  event: {
    source: "driver";
    event: "mqtt disconnected";
  }
}
```

### `log level changed`

[compatible with schema version: 9+]

This event is sent whenever the log level is changed.

```ts
interface {
  type: "event";
  event: {
    source: "driver";
    event: "log level changed";
    level: "silly" | "trace" | "debug" | "info" | "warn" | "error" | "fatal";
  }
}
```

### `logging`

[compatible with schema version: 9+]

This event is sent whenever a log message is generated. Clients will only receive these events when they have issued the `driver.start_listening_logs` command.

```ts
interface {
  type: "event";
  event: {
    source: "driver";
    event: "logging";
    message: ILogObject;  // tslog object
  }
}
```

## Station level events

### `station added`

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

### `station removed`

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

### `guard mode changed`

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

### `current mode changed`

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

### `command result`

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

### `connected`

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

### `disconnected`

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

### `property changed`

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

### `alarm event`

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

## Device level events

### `device added`

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

### `device removed`

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

### `motion detected`

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

### `person detected`

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

### `crying detected`

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

### `sound detected`

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

### `pet detected`

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

### `rings`

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

### `sensor open`

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

### `command result`

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

### `got rtsp url`

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

### `property changed`

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

### `livestream started`

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

### `livestream stopped`

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

### `livestream video data`

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

### `livestream audio data`

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

### `download started`

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

### `download finished`

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

### `download video data`

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

### `download audio data`

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