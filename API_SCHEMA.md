# API Schema

This document describes the changes that are introduced with each schema version.

## Schema 0

Base schema.

## Schema 1

* Added `type`property to Device and Station

## Schema 2

* Added new commands `startLivestream`, `stopLivestream` and `isLiveStreaming` to Device
* Added new Device events `livestreamStarted`,`livestreamStopped`, `livestreamVideoData` and `livestreamAudioData`

## Schema 3

* Added new commands `triggerAlarm`, `resetAlarm`, `panAndTilt`, `quickResponse`, `startDownload`, `cancelDownload`, `getVoices`, `hasProperty`, `hasCommand` and `getCommands` to Device
* Added new commands `getAlarmEvents`, `getVideoEvents` and `getHistoryEvents` to Driver
* Renamed commands `isConnected` and `isPushConnected` to Driver
* Added new Device events `downloadStarted`,`downloadFinished`, `downloadVideoData` and `downloadAudioData`
* Added new properties `motionDetectionType`, `motionDetectionSensivity`, `motionTracking`, `soundDetectionType`, `soundDetectionSensivity`, `light`, `microphone`, `speaker`, `speakerVolume`, `ringtoneVolume`, `audioRecording`, `powerSource`, `powerWorkingMode`, `recordingEndClipMotionStops`, `recordingClipLength`, `recordingRetriggerInterval`, `videoStreamingQuality`, `videoRecordingQuality`, `videoWDR`, `lightSettingsEnable`, `lightSettingsBrightnessManual`, `lightSettingsBrightnessMotion`, `lightSettingsBrightnessSchedule`, `lightSettingsMotionTriggered`, `lightSettingsMotionTriggeredDistance`, `lightSettingsMotionTriggeredTimer`, `chimeIndoor`, `chimeHomebase`, `chimeHomebaseRingtoneVolume`, `chimeHomebaseRingtoneType`, `notificationType`, `rotationSpeed`, `notificationPerson`, `notificationPet`, `notificationAllOtherMotion`, `notificationCrying`, `notificationAllSound`, `notificationIntervalTime`, `notificationRing` and `notificationMotion` to Device
* Added new Station events `currentModeChanged` and `alarmEvent`
* Added new commands `triggerAlarm`, `resetAlarm`, `hasProperty`, `hasCommand` and `getCommands` to Station
* Added new properties `timeFormat`, `alarmVolume`, `alarmTone`, `promptVolume`, `notificationSwitchModeSchedule`, `notificationSwitchModeGeofence`, `notificationSwitchModeApp`, `notificationSwitchModeKeypad` and `notificationStartAlarmDelay` to Station
* Added new error codes `deviceInvalidProperty`, `deviceInvalidPropertyValue`, `devicePropertyNotSupported`, `deviceReadOnlyProperty`, `deviceNotSupported`, `deviceInvalidCommandValue`, `deviceLivestreamAlreadyRunning`, `deviceLivestreamNotRunning`, `schemaIncompatible`, `invalidCountryCode` and `invalidLanguageCode`

## Schema 4

* Added new properties `chargingStatus`, `wifiSignalLevel`, `rtspStreamUrl`, `chirpVolume`, `chirpTone`, `videoHdr`, `videoDistortionCorrection` and `videoRingRecord` to Device
* Renamed properties from `motionDetectionSensivity`, `soundDetectionSensivity` and `ledStatus` to `motionDetectionSensitivity`, `soundDetectionSensitivity` and `statusLed` for Device

## Schema 5

* Added new properties `nightvision` and `batteryIsCharging` to Device
* Added new properties `switchModeWithAccessCode`, `autoEndAlarm` and `turnOffAlarmWithButton` to Station