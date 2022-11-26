# Events

## Server level events

### `shutdown`

[compatible with schema version: 10+]

This event is sent when the server is shutting down.

```ts
interface {
  type: "event";
  event: {
    source: "server";
    event: "shutdown";
  }
}
```

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

### `connection error`

[compatible with schema version: 14+]

This event is sent whenever a connection/authentication error to the cloud occurs.

```ts
interface {
  type: "event";
  event: {
    source: "driver";
    event: "connection error";
    error: Error;
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
    station: string;                            // [starting with schema version: 13+]
    /*station: {                                // [removed with schema version: 13+]
      name: string;                             // [removed with schema version: 13+]
      model: string;                            // [removed with schema version: 13+]
      serialNumber: string;                     // [removed with schema version: 13+]
      hardwareVersion: string;                  // [removed with schema version: 13+]
      softwareVersion: string;                  // [removed with schema version: 13+]
      lanIpAddress: string;                     // [removed with schema version: 13+]
      macAddress: string;                       // [removed with schema version: 13+]
      currentMode: number;                      // [removed with schema version: 13+]
      guardMode: number;                        // [removed with schema version: 13+]
      connected: boolean;                       // [removed with schema version: 13+]
      type: number;                             // [added with schema version: 1+; removed with schema version: 13+]
      timeFormat?: number;                      // [added with schema version: 3+; removed with schema version: 13+]
      alarmVolume?: number;                     // [added with schema version: 3+; removed with schema version: 13+]
      alarmTone?: number;                       // [added with schema version: 3+; removed with schema version: 13+]
      promptVolume?: number;                    // [added with schema version: 3+; removed with schema version: 13+]
      notificationSwitchModeSchedule?: boolean; // [added with schema version: 3+; removed with schema version: 13+]
      notificationSwitchModeGeofence?: boolean; // [added with schema version: 3+; removed with schema version: 13+]
      notificationSwitchModeApp?: boolean;      // [added with schema version: 3+; removed with schema version: 13+]
      notificationSwitchModeKeypad?: boolean;   // [added with schema version: 3+; removed with schema version: 13+]
      notificationStartAlarmDelay?: boolean;    // [added with schema version: 3+; removed with schema version: 13+]
      switchModeWithAccessCode?: boolean;       // [added with schema version: 5+; removed with schema version: 13+]
      autoEndAlarm?: boolean;                   // [added with schema version: 5+; removed with schema version: 13+]
      turnOffAlarmWithButton?: boolean;         // [added with schema version: 5+; removed with schema version: 13+]
    }*/
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
    station: string;                            // [starting with schema version: 13+]
    /*station: {                                // [removed with schema version: 13+]
      name: string;                             // [removed with schema version: 13+]
      model: string;                            // [removed with schema version: 13+]
      serialNumber: string;                     // [removed with schema version: 13+]
      hardwareVersion: string;                  // [removed with schema version: 13+]
      softwareVersion: string;                  // [removed with schema version: 13+]
      lanIpAddress: string;                     // [removed with schema version: 13+]
      macAddress: string;                       // [removed with schema version: 13+]
      currentMode: number;                      // [removed with schema version: 13+]
      guardMode: number;                        // [removed with schema version: 13+]
      connected: boolean;                       // [removed with schema version: 13+]
      type: number;                             // [added with schema version: 1+; removed with schema version: 13+]
      timeFormat?: number;                      // [added with schema version: 3+; removed with schema version: 13+]
      alarmVolume?: number;                     // [added with schema version: 3+; removed with schema version: 13+]
      alarmTone?: number;                       // [added with schema version: 3+; removed with schema version: 13+]
      promptVolume?: number;                    // [added with schema version: 3+; removed with schema version: 13+]
      notificationSwitchModeSchedule?: boolean; // [added with schema version: 3+; removed with schema version: 13+]
      notificationSwitchModeGeofence?: boolean; // [added with schema version: 3+; removed with schema version: 13+]
      notificationSwitchModeApp?: boolean;      // [added with schema version: 3+; removed with schema version: 13+]
      notificationSwitchModeKeypad?: boolean;   // [added with schema version: 3+; removed with schema version: 13+]
      notificationStartAlarmDelay?: boolean;    // [added with schema version: 3+; removed with schema version: 13+]
      switchModeWithAccessCode?: boolean;       // [added with schema version: 5+; removed with schema version: 13+]
      autoEndAlarm?: boolean;                   // [added with schema version: 5+; removed with schema version: 13+]
      turnOffAlarmWithButton?: boolean;         // [added with schema version: 5+; removed with schema version: 13+]
    }*/
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
    customData?: CustomData;                          // [added with schema version: 13+]
  }
}
```

Note: This event was removed in schema version 13.

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
    timestamp?: number;                               // [removed with schema version: 10+]
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

### `alarm delay event`

[compatible with schema version: 11+]

This event is sent whenever an alarm delay event occurred.

```ts
interface {
  type: "event";
  event: {
    source: "station";
    event: "alarm delay event";
    serialNumber: string;
    alarmDelayEvent: AlarmEvent;
    alarmDelay: number;
  }
}
```

### `alarm armed event`

[compatible with schema version: 11+]

This event is sent whenever an alarm armed event occurred.

```ts
interface {
  type: "event";
  event: {
    source: "station";
    event: "alarm armed event";
    serialNumber: string;
  }
}
```

### `alarm arm delay event`

[compatible with schema version: 12+]

This event is sent whenever an alarm arm delay event occurred.

```ts
interface {
  type: "event";
  event: {
    source: "station";
    event: "alarm arm delay event";
    serialNumber: string;
    alarmDelay: number;
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
    device: string;                                                   // [starting with schema version: 13+]
    /*device: {                                                       // [removed with schema version: 13+]
      name: string;                                                   // [removed with schema version: 13+]
      model: string;                                                  // [removed with schema version: 13+]
      serialNumber: string;                                           // [removed with schema version: 13+]
      hardwareVersion: string;                                        // [removed with schema version: 13+]
      softwareVersion: string;                                        // [removed with schema version: 13+]
      stationSerialNumber: string;                                    // [removed with schema version: 13+]
      enabled?: boolean;                                              // [removed with schema version: 13+]
      state?: number;                                                 // [removed with schema version: 13+]
      battery?: number;                                               // [removed with schema version: 13+]
      batteryTemperature?: number;                                    // [removed with schema version: 13+]
      batteryLow?: boolean;                                           // [removed with schema version: 13+]
      lastChargingDays?: number;                                      // [removed with schema version: 13+]
      lastChargingTotalEvents?: number;                               // [removed with schema version: 13+]
      lastChargingRecordedEvents?: number;                            // [removed with schema version: 13+]
      lastChargingFalseEvents?: number;                               // [removed with schema version: 13+]
      batteryUsageLastWeek?: number;                                  // [removed with schema version: 13+]
      motionDetected?: boolean;                                       // [removed with schema version: 13+]
      personDetected?: boolean;                                       // [removed with schema version: 13+]
      personName?: string;                                            // [removed with schema version: 13+]
      soundDetected?: boolean;                                        // [removed with schema version: 13+]
      petDetected?: boolean;                                          // [removed with schema version: 13+]
      cryingDetected?: boolean;                                       // [removed with schema version: 13+]
      ringing?: boolean;                                              // [removed with schema version: 13+]
      locked?: boolean;                                               // [removed with schema version: 13+]
      sensorOpen?: boolean;                                           // [removed with schema version: 13+]
      sensorChangeTime?: number;                                      // [removed with schema version: 13+]
      antitheftDetection?: boolean;                                   // [removed with schema version: 13+]
      autoNightvision?: boolean;                                      // [removed with schema version: 13+]
      ledStatus?: boolean;                                            // [added with schema version: 0+; removed with schema version: 4+]
      motionDetection?: boolean;                                      // [removed with schema version: 13+]
      soundDetection?: boolean;                                       // [removed with schema version: 13+]
      petDetection?: boolean;                                         // [removed with schema version: 13+]
      rtspStream?: boolean;                                           // [removed with schema version: 13+]
      watermark?: number;                                             // [removed with schema version: 13+]
      lockStatus?: number;                                            // [removed with schema version: 13+]
      motionSensorPIREvent?: number;                                  // [removed with schema version: 13+]
      wifiRSSI?: number;                                              // [removed with schema version: 13+]
      pictureUrl?: string;                                            // [removed with schema version: 13+]
      type?: number;                                                  // [added with schema version: 1+; removed with schema version: 13+]
      motionDetectionType?: number;                                   // [added with schema version: 3+; removed with schema version: 13+]
      motionDetectionSensivity?: number;                              // [added with schema version: 3+; removed with schema version: 4+]
      motionTracking?: boolean;                                       // [added with schema version: 3+; removed with schema version: 13+]
      soundDetectionType?: number;                                    // [added with schema version: 3+; removed with schema version: 13+]
      soundDetectionSensivity?: number;                               // [added with schema version: 3+; removed with schema version: 4+]
      light?: boolean;                                                // [added with schema version: 3+; removed with schema version: 13+]
      microphone?: boolean;                                           // [added with schema version: 3+; removed with schema version: 13+]
      speaker?: boolean;                                              // [added with schema version: 3+; removed with schema version: 13+]
      speakerVolume?: number;                                         // [added with schema version: 3+; removed with schema version: 13+]
      ringtoneVolume?: number;                                        // [added with schema version: 3+; removed with schema version: 13+]
      audioRecording?: boolean;                                       // [added with schema version: 3+; removed with schema version: 13+]
      powerSource?: number;                                           // [added with schema version: 3+; removed with schema version: 13+]
      powerWorkingMode?: number;                                      // [added with schema version: 3+; removed with schema version: 13+]
      recordingEndClipMotionStops?: boolean;                          // [added with schema version: 3+; removed with schema version: 13+]
      recordingClipLength?: number;                                   // [added with schema version: 3+; removed with schema version: 13+]
      recordingRetriggerInterval?: number;                            // [added with schema version: 3+; removed with schema version: 13+]
      videoStreamingQuality?: number;                                 // [added with schema version: 3+; removed with schema version: 13+]
      videoRecordingQuality?: number;                                 // [added with schema version: 3+; removed with schema version: 13+]
      videoWDR?: boolean;                                             // [added with schema version: 3+; removed with schema version: 13+]
      lightSettingsEnable?: boolean;                                  // [added with schema version: 3+; removed with schema version: 13+]
      lightSettingsBrightnessManual?: number;                         // [added with schema version: 3+; removed with schema version: 13+]
      lightSettingsBrightnessMotion?: number;                         // [added with schema version: 3+; removed with schema version: 13+]
      lightSettingsBrightnessSchedule?: number;                       // [added with schema version: 3+; removed with schema version: 13+]
      lightSettingsMotionTriggered?: boolean;                         // [added with schema version: 3+; removed with schema version: 13+]
      lightSettingsMotionTriggeredDistance?: number;                  // [added with schema version: 3+; removed with schema version: 13+]
      lightSettingsMotionTriggeredTimer?: number;                     // [added with schema version: 3+; removed with schema version: 13+]
      chimeIndoor?: boolean;                                          // [added with schema version: 3+; removed with schema version: 13+]
      chimeHomebase?: boolean;                                        // [added with schema version: 3+; removed with schema version: 13+]
      chimeHomebaseRingtoneVolume?: number;                           // [added with schema version: 3+; removed with schema version: 13+]
      chimeHomebaseRingtoneType?: number;                             // [added with schema version: 3+; removed with schema version: 13+]
      notificationType?: number;                                      // [added with schema version: 3+; removed with schema version: 13+]
      rotationSpeed?: number;                                         // [added with schema version: 3+; removed with schema version: 13+]
      notificationPerson?: boolean;                                   // [added with schema version: 3+; removed with schema version: 13+]
      notificationPet?: boolean;                                      // [added with schema version: 3+; removed with schema version: 13+]
      notificationAllOtherMotion?: boolean;                           // [added with schema version: 3+; removed with schema version: 13+]
      notificationCrying?: boolean;                                   // [added with schema version: 3+; removed with schema version: 13+]
      notificationAllSound?: boolean;                                 // [added with schema version: 3+; removed with schema version: 13+]
      notificationIntervalTime?: boolean;                             // [added with schema version: 3+; removed with schema version: 13+]
      notificationRing?: boolean;                                     // [added with schema version: 3+; removed with schema version: 13+]
      notificationMotion?: boolean;                                   // [added with schema version: 3+; removed with schema version: 13+]
      chirpVolume?: number;                                           // [added with schema version: 4+; removed with schema version: 13+]
      chirpTone?: number;                                             // [added with schema version: 4+; removed with schema version: 13+]
      motionDetectionSensitivity?: number;                            // [added with schema version: 4+; removed with schema version: 13+]
      soundDetectionSensitivity?: number;                             // [added with schema version: 4+; removed with schema version: 13+]
      videoHdr?: boolean;                                             // [added with schema version: 4+; removed with schema version: 13+]
      videoDistortionCorrection?: boolean;                            // [added with schema version: 4+; removed with schema version: 13+]
      videoRingRecord?: number;                                       // [added with schema version: 4+; removed with schema version: 13+]
      statusLed?: boolean;                                            // [added with schema version: 4+; removed with schema version: 13+]
      chargingStatus?: number;                                        // [added with schema version: 4+; removed with schema version: 13+]
      rtspStreamUrl?: string;                                         // [added with schema version: 4+; removed with schema version: 13+]
      wifiSignalLevel?: number;                                       // [added with schema version: 4+; removed with schema version: 13+]
      nightvision?: number;                                           // [added with schema version: 5+; removed with schema version: 13+]
      batteryIsCharging?: boolean;                                    // [added with schema version: 5+; removed with schema version: 13+]
      motionDetectionRange?: boolean;                                 // [added with schema version: 8+; removed with schema version: 13+]
      motionDetectionRangeStandardSensitivity?: number;               // [added with schema version: 8+; removed with schema version: 13+]
      motionDetectionRangeAdvancedLeftSensitivity?: number;           // [added with schema version: 8+; removed with schema version: 13+]
      motionDetectionRangeAdvancedMiddleSensitivity?: number;         // [added with schema version: 8+; removed with schema version: 13+]
      motionDetectionRangeAdvancedRightSensitivity?: number;          // [added with schema version: 8+; removed with schema version: 13+]
      motionDetectionTestMode?: boolean;                              // [added with schema version: 8+; removed with schema version: 13+]
      motionTrackingSensitivity?: number;                             // [added with schema version: 8+; removed with schema version: 13+]
      motionAutoCruise?: boolean;                                     // [added with schema version: 8+; removed with schema version: 13+]
      motionOutOfViewDetection?: boolean;                             // [added with schema version: 8+; removed with schema version: 13+]
      lightSettingsColorTemperatureManual?: number;                   // [added with schema version: 8+; removed with schema version: 13+]
      lightSettingsColorTemperatureMotion?: number;                   // [added with schema version: 8+; removed with schema version: 13+]
      lightSettingsColorTemperatureSchedule?: number;                 // [added with schema version: 8+; removed with schema version: 13+]
      lightSettingsMotionActivationMode?: number;                     // [added with schema version: 8+; removed with schema version: 13+]
      videoNightvisionImageAdjustment?: boolean;                      // [added with schema version: 8+; removed with schema version: 13+]
      videoColorNightvision?: boolean;                                // [added with schema version: 8+; removed with schema version: 13+]
      autoCalibration?: boolean;                                      // [added with schema version: 8+; removed with schema version: 13+]
      lockSettingsAutoLock?: boolean;                                 // [added with schema version: 9+; removed with schema version: 13+]
      lockSettingsAutoLockTimer?: number;                             // [added with schema version: 9+; removed with schema version: 13+]
      lockSettingsAutoLockSchedule?: boolean;                         // [added with schema version: 9+; removed with schema version: 13+]
      lockSettingsAutoLockScheduleStartTime?: string;                 // [added with schema version: 9+; removed with schema version: 13+]
      lockSettingsAutoLockScheduleEndTime?: string;                   // [added with schema version: 9+; removed with schema version: 13+]
      lockSettingsOneTouchLocking?: boolean;                          // [added with schema version: 9+; removed with schema version: 13+]
      lockSettingsWrongTryProtection?: boolean;                       // [added with schema version: 9+; removed with schema version: 13+]
      lockSettingsWrongTryAttempts?: number;                          // [added with schema version: 9+; removed with schema version: 13+]
      lockSettingsWrongTryLockdownTime?: number;                      // [added with schema version: 9+; removed with schema version: 13+]
      lockSettingsScramblePasscode?: boolean;                         // [added with schema version: 9+; removed with schema version: 13+]
      lockSettingsSound?: number;                                     // [added with schema version: 9+; removed with schema version: 13+]
      lockSettingsNotification?: boolean;                             // [added with schema version: 9+; removed with schema version: 13+]
      lockSettingsNotificationUnlocked?: boolean;                     // [added with schema version: 9+; removed with schema version: 13+]
      lockSettingsNotificationLocked?: boolean;                       // [added with schema version: 9+; removed with schema version: 13+]
      notificationRadarDetector?: boolean;                            // [added with schema version: 10+; removed with schema version: 13+]
      continuousRecording?: boolean;                                  // [added with schema version: 10+; removed with schema version: 13+]
      continuousRecordingType?: number;                               // [added with schema version: 10+; removed with schema version: 13+]
      loiteringDetection?: boolean;                                   // [added with schema version: 10+; removed with schema version: 13+]
      loiteringDetectionRange?: number;                               // [added with schema version: 10+; removed with schema version: 13+]
      loiteringDetectionLength?: number;                              // [added with schema version: 10+; removed with schema version: 13+]
      motionDetectionSensitivityMode?: number;                        // [added with schema version: 10+; removed with schema version: 13+]
      motionDetectionSensitivityStandard?: number;                    // [added with schema version: 10+; removed with schema version: 13+]
      motionDetectionSensitivityAdvancedA?: number;                   // [added with schema version: 10+; removed with schema version: 13+]
      motionDetectionSensitivityAdvancedB?: number;                   // [added with schema version: 10+; removed with schema version: 13+]
      motionDetectionSensitivityAdvancedC?: number;                   // [added with schema version: 10+; removed with schema version: 13+]
      motionDetectionSensitivityAdvancedD?: number;                   // [added with schema version: 10+; removed with schema version: 13+]
      motionDetectionSensitivityAdvancedE?: number;                   // [added with schema version: 10+; removed with schema version: 13+]
      motionDetectionSensitivityAdvancedF?: number;                   // [added with schema version: 10+; removed with schema version: 13+]
      motionDetectionSensitivityAdvancedG?: number;                   // [added with schema version: 10+; removed with schema version: 13+]
      motionDetectionSensitivityAdvancedH?: number;                   // [added with schema version: 10+; removed with schema version: 13+]
      loiteringCustomResponsePhoneNotification?: boolean;             // [added with schema version: 10+; removed with schema version: 13+]
      loiteringCustomResponseAutoVoiceResponse?: boolean;             // [added with schema version: 10+; removed with schema version: 13+]
      loiteringCustomResponseAutoVoiceResponseVoice?: number;         // [added with schema version: 10+; removed with schema version: 13+]
      loiteringCustomResponseHomeBaseNotification?: boolean;          // [added with schema version: 10+; removed with schema version: 13+]
      loiteringCustomResponseTimeFrom?: string;                       // [added with schema version: 10+; removed with schema version: 13+]
      loiteringCustomResponseTimeTo?: string;                         // [added with schema version: 10+; removed with schema version: 13+]
      deliveryGuard?: boolean;                                        // [added with schema version: 10+; removed with schema version: 13+]
      deliveryGuardPackageGuarding?: boolean;                         // [added with schema version: 10+; removed with schema version: 13+]
      deliveryGuardPackageGuardingVoiceResponseVoice?: number;        // [added with schema version: 10+; removed with schema version: 13+]
      deliveryGuardPackageGuardingActivatedTimeFrom?: string;         // [added with schema version: 10+; removed with schema version: 13+]
      deliveryGuardPackageGuardingActivatedTimeTo?: string;           // [added with schema version: 10+; removed with schema version: 13+]
      deliveryGuardUncollectedPackageAlert?: boolean;                 // [added with schema version: 10+; removed with schema version: 13+]
      deliveryGuardUncollectedPackageAlertTimeToCheck?: string;       // [added with schema version: 10+; removed with schema version: 13+]
      deliveryGuardPackageLiveCheckAssistance?: boolean;              // [added with schema version: 10+; removed with schema version: 13+]
      dualCamWatchViewMode?: number;                                  // [added with schema version: 10+; removed with schema version: 13+]
      ringAutoResponse?: boolean;                                     // [added with schema version: 10+; removed with schema version: 13+]
      ringAutoResponseVoiceResponse?: boolean;                        // [added with schema version: 10+; removed with schema version: 13+]
      ringAutoResponseVoiceResponseVoice?: number;                    // [added with schema version: 10+; removed with schema version: 13+]
      ringAutoResponseTimeFrom?: string;                              // [added with schema version: 10+; removed with schema version: 13+]
      ringAutoResponseTimeTo?: string;                                // [added with schema version: 10+; removed with schema version: 13+]
      defaultAngle?: boolean;                                         // [added with schema version: 10+; removed with schema version: 13+]
      defaultAngleIdleTime?: number;                                  // [added with schema version: 10+; removed with schema version: 13+]
      soundDetectionRoundLook?: boolean;                              // [added with schema version: 10+; removed with schema version: 13+]
      imageMirrored?: boolean;                                        // [added with schema version: 11+; removed with schema version: 13+]
    }*/
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
    device: string;                                                   // [starting with schema version: 13+]
    /*device: {                                                       // [removed with schema version: 13+]
      name: string;                                                   // [removed with schema version: 13+]
      model: string;                                                  // [removed with schema version: 13+]
      serialNumber: string;                                           // [removed with schema version: 13+]
      hardwareVersion: string;                                        // [removed with schema version: 13+]
      softwareVersion: string;                                        // [removed with schema version: 13+]
      stationSerialNumber: string;                                    // [removed with schema version: 13+]
      enabled?: boolean;                                              // [removed with schema version: 13+]
      state?: number;                                                 // [removed with schema version: 13+]
      battery?: number;                                               // [removed with schema version: 13+]
      batteryTemperature?: number;                                    // [removed with schema version: 13+]
      batteryLow?: boolean;                                           // [removed with schema version: 13+]
      lastChargingDays?: number;                                      // [removed with schema version: 13+]
      lastChargingTotalEvents?: number;                               // [removed with schema version: 13+]
      lastChargingRecordedEvents?: number;                            // [removed with schema version: 13+]
      lastChargingFalseEvents?: number;                               // [removed with schema version: 13+]
      batteryUsageLastWeek?: number;                                  // [removed with schema version: 13+]
      motionDetected?: boolean;                                       // [removed with schema version: 13+]
      personDetected?: boolean;                                       // [removed with schema version: 13+]
      personName?: string;                                            // [removed with schema version: 13+]
      soundDetected?: boolean;                                        // [removed with schema version: 13+]
      petDetected?: boolean;                                          // [removed with schema version: 13+]
      cryingDetected?: boolean;                                       // [removed with schema version: 13+]
      ringing?: boolean;                                              // [removed with schema version: 13+]
      locked?: boolean;                                               // [removed with schema version: 13+]
      sensorOpen?: boolean;                                           // [removed with schema version: 13+]
      sensorChangeTime?: number;                                      // [removed with schema version: 13+]
      antitheftDetection?: boolean;                                   // [removed with schema version: 13+]
      autoNightvision?: boolean;                                      // [removed with schema version: 13+]
      ledStatus?: boolean;                                            // [added with schema version: 0+; removed with schema version: 4+]
      motionDetection?: boolean;                                      // [removed with schema version: 13+]
      soundDetection?: boolean;                                       // [removed with schema version: 13+]
      petDetection?: boolean;                                         // [removed with schema version: 13+]
      rtspStream?: boolean;                                           // [removed with schema version: 13+]
      watermark?: number;                                             // [removed with schema version: 13+]
      lockStatus?: number;                                            // [removed with schema version: 13+]
      motionSensorPIREvent?: number;                                  // [removed with schema version: 13+]
      wifiRSSI?: number;                                              // [removed with schema version: 13+]
      pictureUrl?: string;                                            // [removed with schema version: 13+]
      type?: number;                                                  // [added with schema version: 1+; removed with schema version: 13+]
      motionDetectionType?: number;                                   // [added with schema version: 3+; removed with schema version: 13+]
      motionDetectionSensivity?: number;                              // [added with schema version: 3+; removed with schema version: 4+]
      motionTracking?: boolean;                                       // [added with schema version: 3+; removed with schema version: 13+]
      soundDetectionType?: number;                                    // [added with schema version: 3+; removed with schema version: 13+]
      soundDetectionSensivity?: number;                               // [added with schema version: 3+; removed with schema version: 4+]
      light?: boolean;                                                // [added with schema version: 3+; removed with schema version: 13+]
      microphone?: boolean;                                           // [added with schema version: 3+; removed with schema version: 13+]
      speaker?: boolean;                                              // [added with schema version: 3+; removed with schema version: 13+]
      speakerVolume?: number;                                         // [added with schema version: 3+; removed with schema version: 13+]
      ringtoneVolume?: number;                                        // [added with schema version: 3+; removed with schema version: 13+]
      audioRecording?: boolean;                                       // [added with schema version: 3+; removed with schema version: 13+]
      powerSource?: number;                                           // [added with schema version: 3+; removed with schema version: 13+]
      powerWorkingMode?: number;                                      // [added with schema version: 3+; removed with schema version: 13+]
      recordingEndClipMotionStops?: boolean;                          // [added with schema version: 3+; removed with schema version: 13+]
      recordingClipLength?: number;                                   // [added with schema version: 3+; removed with schema version: 13+]
      recordingRetriggerInterval?: number;                            // [added with schema version: 3+; removed with schema version: 13+]
      videoStreamingQuality?: number;                                 // [added with schema version: 3+; removed with schema version: 13+]
      videoRecordingQuality?: number;                                 // [added with schema version: 3+; removed with schema version: 13+]
      videoWDR?: boolean;                                             // [added with schema version: 3+; removed with schema version: 13+]
      lightSettingsEnable?: boolean;                                  // [added with schema version: 3+; removed with schema version: 13+]
      lightSettingsBrightnessManual?: number;                         // [added with schema version: 3+; removed with schema version: 13+]
      lightSettingsBrightnessMotion?: number;                         // [added with schema version: 3+; removed with schema version: 13+]
      lightSettingsBrightnessSchedule?: number;                       // [added with schema version: 3+; removed with schema version: 13+]
      lightSettingsMotionTriggered?: boolean;                         // [added with schema version: 3+; removed with schema version: 13+]
      lightSettingsMotionTriggeredDistance?: number;                  // [added with schema version: 3+; removed with schema version: 13+]
      lightSettingsMotionTriggeredTimer?: number;                     // [added with schema version: 3+; removed with schema version: 13+]
      chimeIndoor?: boolean;                                          // [added with schema version: 3+; removed with schema version: 13+]
      chimeHomebase?: boolean;                                        // [added with schema version: 3+; removed with schema version: 13+]
      chimeHomebaseRingtoneVolume?: number;                           // [added with schema version: 3+; removed with schema version: 13+]
      chimeHomebaseRingtoneType?: number;                             // [added with schema version: 3+; removed with schema version: 13+]
      notificationType?: number;                                      // [added with schema version: 3+; removed with schema version: 13+]
      rotationSpeed?: number;                                         // [added with schema version: 3+; removed with schema version: 13+]
      notificationPerson?: boolean;                                   // [added with schema version: 3+; removed with schema version: 13+]
      notificationPet?: boolean;                                      // [added with schema version: 3+; removed with schema version: 13+]
      notificationAllOtherMotion?: boolean;                           // [added with schema version: 3+; removed with schema version: 13+]
      notificationCrying?: boolean;                                   // [added with schema version: 3+; removed with schema version: 13+]
      notificationAllSound?: boolean;                                 // [added with schema version: 3+; removed with schema version: 13+]
      notificationIntervalTime?: boolean;                             // [added with schema version: 3+; removed with schema version: 13+]
      notificationRing?: boolean;                                     // [added with schema version: 3+; removed with schema version: 13+]
      notificationMotion?: boolean;                                   // [added with schema version: 3+; removed with schema version: 13+]
      chirpVolume?: number;                                           // [added with schema version: 4+; removed with schema version: 13+]
      chirpTone?: number;                                             // [added with schema version: 4+; removed with schema version: 13+]
      motionDetectionSensitivity?: number;                            // [added with schema version: 4+; removed with schema version: 13+]
      soundDetectionSensitivity?: number;                             // [added with schema version: 4+; removed with schema version: 13+]
      videoHdr?: boolean;                                             // [added with schema version: 4+; removed with schema version: 13+]
      videoDistortionCorrection?: boolean;                            // [added with schema version: 4+; removed with schema version: 13+]
      videoRingRecord?: number;                                       // [added with schema version: 4+; removed with schema version: 13+]
      statusLed?: boolean;                                            // [added with schema version: 4+; removed with schema version: 13+]
      chargingStatus?: number;                                        // [added with schema version: 4+; removed with schema version: 13+]
      rtspStreamUrl?: string;                                         // [added with schema version: 4+; removed with schema version: 13+]
      wifiSignalLevel?: number;                                       // [added with schema version: 4+; removed with schema version: 13+]
      nightvision?: number;                                           // [added with schema version: 5+; removed with schema version: 13+]
      batteryIsCharging?: boolean;                                    // [added with schema version: 5+; removed with schema version: 13+]
      motionDetectionRange?: boolean;                                 // [added with schema version: 8+; removed with schema version: 13+]
      motionDetectionRangeStandardSensitivity?: number;               // [added with schema version: 8+; removed with schema version: 13+]
      motionDetectionRangeAdvancedLeftSensitivity?: number;           // [added with schema version: 8+; removed with schema version: 13+]
      motionDetectionRangeAdvancedMiddleSensitivity?: number;         // [added with schema version: 8+; removed with schema version: 13+]
      motionDetectionRangeAdvancedRightSensitivity?: number;          // [added with schema version: 8+; removed with schema version: 13+]
      motionDetectionTestMode?: boolean;                              // [added with schema version: 8+; removed with schema version: 13+]
      motionTrackingSensitivity?: number;                             // [added with schema version: 8+; removed with schema version: 13+]
      motionAutoCruise?: boolean;                                     // [added with schema version: 8+; removed with schema version: 13+]
      motionOutOfViewDetection?: boolean;                             // [added with schema version: 8+; removed with schema version: 13+]
      lightSettingsColorTemperatureManual?: number;                   // [added with schema version: 8+; removed with schema version: 13+]
      lightSettingsColorTemperatureMotion?: number;                   // [added with schema version: 8+; removed with schema version: 13+]
      lightSettingsColorTemperatureSchedule?: number;                 // [added with schema version: 8+; removed with schema version: 13+]
      lightSettingsMotionActivationMode?: number;                     // [added with schema version: 8+; removed with schema version: 13+]
      videoNightvisionImageAdjustment?: boolean;                      // [added with schema version: 8+; removed with schema version: 13+]
      videoColorNightvision?: boolean;                                // [added with schema version: 8+; removed with schema version: 13+]
      autoCalibration?: boolean;                                      // [added with schema version: 8+; removed with schema version: 13+]
      lockSettingsAutoLock?: boolean;                                 // [added with schema version: 9+; removed with schema version: 13+]
      lockSettingsAutoLockTimer?: number;                             // [added with schema version: 9+; removed with schema version: 13+]
      lockSettingsAutoLockSchedule?: boolean;                         // [added with schema version: 9+; removed with schema version: 13+]
      lockSettingsAutoLockScheduleStartTime?: string;                 // [added with schema version: 9+; removed with schema version: 13+]
      lockSettingsAutoLockScheduleEndTime?: string;                   // [added with schema version: 9+; removed with schema version: 13+]
      lockSettingsOneTouchLocking?: boolean;                          // [added with schema version: 9+; removed with schema version: 13+]
      lockSettingsWrongTryProtection?: boolean;                       // [added with schema version: 9+; removed with schema version: 13+]
      lockSettingsWrongTryAttempts?: number;                          // [added with schema version: 9+; removed with schema version: 13+]
      lockSettingsWrongTryLockdownTime?: number;                      // [added with schema version: 9+; removed with schema version: 13+]
      lockSettingsScramblePasscode?: boolean;                         // [added with schema version: 9+; removed with schema version: 13+]
      lockSettingsSound?: number;                                     // [added with schema version: 9+; removed with schema version: 13+]
      lockSettingsNotification?: boolean;                             // [added with schema version: 9+; removed with schema version: 13+]
      lockSettingsNotificationUnlocked?: boolean;                     // [added with schema version: 9+; removed with schema version: 13+]
      lockSettingsNotificationLocked?: boolean;                       // [added with schema version: 9+; removed with schema version: 13+]
      notificationRadarDetector?: boolean;                            // [added with schema version: 10+; removed with schema version: 13+]
      continuousRecording?: boolean;                                  // [added with schema version: 10+; removed with schema version: 13+]
      continuousRecordingType?: number;                               // [added with schema version: 10+; removed with schema version: 13+]
      loiteringDetection?: boolean;                                   // [added with schema version: 10+; removed with schema version: 13+]
      loiteringDetectionRange?: number;                               // [added with schema version: 10+; removed with schema version: 13+]
      loiteringDetectionLength?: number;                              // [added with schema version: 10+; removed with schema version: 13+]
      motionDetectionSensitivityMode?: number;                        // [added with schema version: 10+; removed with schema version: 13+]
      motionDetectionSensitivityStandard?: number;                    // [added with schema version: 10+; removed with schema version: 13+]
      motionDetectionSensitivityAdvancedA?: number;                   // [added with schema version: 10+; removed with schema version: 13+]
      motionDetectionSensitivityAdvancedB?: number;                   // [added with schema version: 10+; removed with schema version: 13+]
      motionDetectionSensitivityAdvancedC?: number;                   // [added with schema version: 10+; removed with schema version: 13+]
      motionDetectionSensitivityAdvancedD?: number;                   // [added with schema version: 10+; removed with schema version: 13+]
      motionDetectionSensitivityAdvancedE?: number;                   // [added with schema version: 10+; removed with schema version: 13+]
      motionDetectionSensitivityAdvancedF?: number;                   // [added with schema version: 10+; removed with schema version: 13+]
      motionDetectionSensitivityAdvancedG?: number;                   // [added with schema version: 10+; removed with schema version: 13+]
      motionDetectionSensitivityAdvancedH?: number;                   // [added with schema version: 10+; removed with schema version: 13+]
      loiteringCustomResponsePhoneNotification?: boolean;             // [added with schema version: 10+; removed with schema version: 13+]
      loiteringCustomResponseAutoVoiceResponse?: boolean;             // [added with schema version: 10+; removed with schema version: 13+]
      loiteringCustomResponseAutoVoiceResponseVoice?: number;         // [added with schema version: 10+; removed with schema version: 13+]
      loiteringCustomResponseHomeBaseNotification?: boolean;          // [added with schema version: 10+; removed with schema version: 13+]
      loiteringCustomResponseTimeFrom?: string;                       // [added with schema version: 10+; removed with schema version: 13+]
      loiteringCustomResponseTimeTo?: string;                         // [added with schema version: 10+; removed with schema version: 13+]
      deliveryGuard?: boolean;                                        // [added with schema version: 10+; removed with schema version: 13+]
      deliveryGuardPackageGuarding?: boolean;                         // [added with schema version: 10+; removed with schema version: 13+]
      deliveryGuardPackageGuardingVoiceResponseVoice?: number;        // [added with schema version: 10+; removed with schema version: 13+]
      deliveryGuardPackageGuardingActivatedTimeFrom?: string;         // [added with schema version: 10+; removed with schema version: 13+]
      deliveryGuardPackageGuardingActivatedTimeTo?: string;           // [added with schema version: 10+; removed with schema version: 13+]
      deliveryGuardUncollectedPackageAlert?: boolean;                 // [added with schema version: 10+; removed with schema version: 13+]
      deliveryGuardUncollectedPackageAlertTimeToCheck?: string;       // [added with schema version: 10+; removed with schema version: 13+]
      deliveryGuardPackageLiveCheckAssistance?: boolean;              // [added with schema version: 10+; removed with schema version: 13+]
      dualCamWatchViewMode?: number;                                  // [added with schema version: 10+; removed with schema version: 13+]
      ringAutoResponse?: boolean;                                     // [added with schema version: 10+; removed with schema version: 13+]
      ringAutoResponseVoiceResponse?: boolean;                        // [added with schema version: 10+; removed with schema version: 13+]
      ringAutoResponseVoiceResponseVoice?: number;                    // [added with schema version: 10+; removed with schema version: 13+]
      ringAutoResponseTimeFrom?: string;                              // [added with schema version: 10+; removed with schema version: 13+]
      ringAutoResponseTimeTo?: string;                                // [added with schema version: 10+; removed with schema version: 13+]
      defaultAngle?: boolean;                                         // [added with schema version: 10+; removed with schema version: 13+]
      defaultAngleIdleTime?: number;                                  // [added with schema version: 10+; removed with schema version: 13+]
      soundDetectionRoundLook?: boolean;                              // [added with schema version: 10+; removed with schema version: 13+]
      imageMirrored?: boolean;                                        // [added with schema version: 11+; removed with schema version: 13+]
    }*/
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

### `stranger person detected`

[compatible with schema version: 15+]

This event is sent whenever a stranger person is detected on the device (the cooldown is determined by the `eventDurationSeconds` param).

```ts
interface {
  type: "event";
  event: {
    source: "device";
    event: "stranger person detected";
    serialNumber: string;
    state: boolean;
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

### `vehicle detected`

[compatible with schema version: 14+]

This event is sent whenever a vehicle is detected on the device (the cooldown is determined by the `eventDurationSeconds` param).

```ts
interface {
  type: "event";
  event: {
    source: "device";
    event: "vehicle detected";
    serialNumber: string;
    state: boolean;
  }
}
```

### `dog detected`

[compatible with schema version: 15+]

This event is sent whenever a dog is detected on the device (the cooldown is determined by the `eventDurationSeconds` param).

```ts
interface {
  type: "event";
  event: {
    source: "device";
    event: "dog detected";
    serialNumber: string;
    state: boolean;
  }
}
```

### `dog lick detected`

[compatible with schema version: 15+]

This event is sent whenever a dog lick is detected on the device (the cooldown is determined by the `eventDurationSeconds` param).

```ts
interface {
  type: "event";
  event: {
    source: "device";
    event: "dog lick detected";
    serialNumber: string;
    state: boolean;
  }
}
```

### `dog poop detected`

[compatible with schema version: 15+]

This event is sent whenever a dog poop is detected on the device (the cooldown is determined by the `eventDurationSeconds` param).

```ts
interface {
  type: "event";
  event: {
    source: "device";
    event: "dog poop detected";
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
    customData?: CustomData;                          // [added with schema version: 13+]
  }
}
```

Note: This event was removed in schema version 13.

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
    timestamp?: number;                               // [removed with schema version: 10+]
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

### `locked`

[compatible with schema version: 13+]

This event is sent whenever the device is locked/unlocked

```ts
interface {
  type: "event";
  event: {
    source: "device";
    event: "locked";
    serialNumber: string;
    state: boolean;
  }
}
```

### `package delivered`

[compatible with schema version: 13+]

This event is sent whenever a package is delivered (the cooldown is determined by the `eventDurationSeconds` param).

```ts
interface {
  type: "event";
  event: {
    source: "device";
    event: "package delivered";
    serialNumber: string;
    state: boolean;
  }
}
```

### `package stranded`

[compatible with schema version: 13+]

This event is sent whenever a package is stranded (the cooldown is determined by the `eventDurationSeconds` param).

```ts
interface {
  type: "event";
  event: {
    source: "device";
    event: "package stranded";
    serialNumber: string;
    state: boolean;
  }
}
```

### `package taken`

[compatible with schema version: 13+]

This event is sent whenever a delivered package was taken (the cooldown is determined by the `eventDurationSeconds` param).

```ts
interface {
  type: "event";
  event: {
    source: "device";
    event: "package taken";
    serialNumber: string;
    state: boolean;
  }
}
```

### `someone loitering`

[compatible with schema version: 13+]

This event is sent whenever someone is loitering in front of the device (the cooldown is determined by the `eventDurationSeconds` param).

```ts
interface {
  type: "event";
  event: {
    source: "device";
    event: "someone loitering";
    serialNumber: string;
    state: boolean;
  }
}
```

### `radar motion detected`

[compatible with schema version: 13+]

This event is sent whenever motion is detected by radar (the cooldown is determined by the `eventDurationSeconds` param).

```ts
interface {
  type: "event";
  event: {
    source: "device";
    event: "radar motion detected";
    serialNumber: string;
    state: boolean;
  }
}
```

### `wrong try-protect alarm`

[compatible with schema version: 13+]

This event is sent whenever wrong try-protect alarm is triggered by the device (the cooldown is determined by the `eventDurationSeconds` param).

```ts
interface {
  type: "event";
  event: {
    source: "device";
    event: "wrong try-protect alarm";
    serialNumber: string;
    state: boolean;
  }
}
```

### `long time not close`

[compatible with schema version: 13+]

This event is sent whenever long time not close is triggered by the device (the cooldown is determined by the `eventDurationSeconds` param).

```ts
interface {
  type: "event";
  event: {
    source: "device";
    event: "long time not close";
    serialNumber: string;
    state: boolean;
  }
}
```

### `low battery`

[compatible with schema version: 13+]

This event is sent whenever low battery is triggered by the device (the cooldown is determined by the `eventDurationSeconds` param).

```ts
interface {
  type: "event";
  event: {
    source: "device";
    event: "low battery";
    serialNumber: string;
    state: boolean;
  }
}
```

### `jammed`

[compatible with schema version: 13+]

This event is sent whenever jammed alert is triggered by the device (the cooldown is determined by the `eventDurationSeconds` param).

```ts
interface {
  type: "event";
  event: {
    source: "device";
    event: "ljammed";
    serialNumber: string;
    state: boolean;
  }
}
```

### `alarm 911`

[compatible with schema version: 13+]

This event is sent whenever 911 alarm is triggered by the device (the cooldown is determined by the `eventDurationSeconds` param).

```ts
interface {
  type: "event";
  event: {
    source: "device";
    event: "alarm 911";
    serialNumber: string;
    state: boolean;
    detail: SmartSafeAlarm911Event;
  }
}
```

### `shake alarm`

[compatible with schema version: 13+]

This event is sent whenever a shake alarm is triggered by the device (the cooldown is determined by the `eventDurationSeconds` param).

```ts
interface {
  type: "event";
  event: {
    source: "device";
    event: "shake alarm";
    serialNumber: string;
    state: boolean;
    detail: SmartSafeShakeAlarmEvent;
  }
}
```

### `talkback started`

[compatible with schema version: 13+]

This event is sent whenever the talkback of a device is started.

```ts
interface {
  type: "event";
  event: {
    source: "device";
    event: "talkback started";
    serialNumber: string;
  }
}
```

### `talkback stopped`

[compatible with schema version: 13+]

This event is sent whenever the talkback of a device is stopped.

```ts
interface {
  type: "event";
  event: {
    source: "device";
    event: "talkback stopped";
    serialNumber: string;
  }
}
```

### `user added`

[compatible with schema version: 13+]

This event is sent whenever a new user is successfully added to a lock device.

```ts
interface {
  type: "event";
  event: {
    source: "device";
    event: "user added";
    serialNumber: string;
    username: string;
    schedule?: Schedule;
  }
}
```

### `user deleted`

[compatible with schema version: 13+]

This event is sent whenever a user is successfully delete from a lock device.

```ts
interface {
  type: "event";
  event: {
    source: "device";
    event: "user deleted";
    serialNumber: string;
    username: string;
  }
}
```

### `user error`

[compatible with schema version: 13+]

This event is sent whenever during a user action (add/delete/modify), for a lock device, an error occured.

```ts
interface {
  type: "event";
  event: {
    source: "device";
    event: "user error";
    serialNumber: string;
    username: string;
    error: Error;
  }
}
```

### `user username updated`

[compatible with schema version: 13+]

This event is sent whenever a username is successfully changed for a lock device.

```ts
interface {
  type: "event";
  event: {
    source: "device";
    event: "user username updated";
    serialNumber: string;
    username: string;
  }
}
```

### `user schedule updated`

[compatible with schema version: 13+]

This event is sent whenever a user schedule is successfully changed for a lock device.

```ts
interface {
  type: "event";
  event: {
    source: "device";
    event: "user schedule updated";
    serialNumber: string;
    username: string;
    schedule: Schedule;
  }
}
```

### `user passcode updated`

[compatible with schema version: 13+]

This event is sent whenever a user passcode is successfully changed for a lock device.

```ts
interface {
  type: "event";
  event: {
    source: "device";
    event: "user passcode updated";
    serialNumber: string;
    username: string;
  }
}
```

### `pin verified`

[compatible with schema version: 13+]

This event is sent whenever a pin verification for a smart safe was requested.

```ts
interface {
  type: "event";
  event: {
    source: "device";
    event: "pin verified";
    serialNumber: string;
    successfull: boolean;
  }
}
```