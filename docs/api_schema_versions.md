# API Schema versions

This document describes the changes that are introduced with each schema version.

## Schema 19

* Added new property `lightSettingsManualLightingActiveMode`, `lightSettingsManualDailyLighting`, `lightSettingsManualColoredLighting`, `lightSettingsManualDynamicLighting`, `lightSettingsMotionLightingActiveMode`, `lightSettingsMotionDailyLighting`, `lightSettingsMotionColoredLighting`, `lightSettingsMotionDynamicLighting`, `lightSettingsScheduleLightingActiveMode`, `lightSettingsScheduleDailyLighting`, `lightSettingsScheduleColoredLighting`, `lightSettingsScheduleDynamicLighting`, `lightSettingsColoredLightingColors`, `lightSettingsDynamicLightingThemes`, `doorControlWarning`, `door1Open`, `door2Open`, `doorSensor1Status`, `doorSensor2Status`, `doorSensor1MacAddress`, `doorSensor2MacAddress`, `doorSensor1Name`, `doorSensor2Name`, `doorSensor1SerialNumber`, `doorSensor2SerialNumber`, `doorSensor1Version`, `doorSensor2Version`, `doorSensor1LowBattery`, `doorSensor2LowBattery`, `doorSensor1BatteryLevel`, 
and `doorSensor2BatteryLevel` to Device

## Schema 18

* Added new commands `database_query_latest_info`, `database_query_local` , `database_count_by_date` and `database_delete` to Station
* Added new Station events `database query latest`, `database query local`, `station.database_count_by_date` and `station.database_delete`

## Schema 17

* Added new property `picture` to Device
* Removed property `pictureUrl`from Device
* Added new command `downloadImage` to Station
* Added new Station event `image downloaded`

## Schema 16

* Added new property `cellularRSSI`, `cellularSignalLevel`, `cellularSignal`, `cellularBand`, `cellularIMEI` and `cellularICCID` to Device

## Schema 15

* Added new property `snoozeStartTime`, `snoozeHomebase`, `snoozeMotion` and `snoozeChime` to Device
* Added new Device events `stranger person detected`, `dog detected`, `dog lick detected` and `dog poop detected`
* Added new command `chime` to Station

## Schema 14

* Added new property `alarm`, `alarmType`, `alarmArmed`, `alarmArmDelay`, `alarmDelay` and `alarmDelayType` to Station
* Added new Device event `vehicle detected`
* Added new Driver event `connection error`

## Schema 13

* Modified Station event `command result` adding custom data
* Modified Device event `command result` adding custom data
* Modified Station commands `get_properties` and `get_properties_metadata` to only return supported properties (schema versioned)
* Modified Device commands `get_properties` and `get_properties_metadata` to only return supported properties (schema versioned)
* Added new Device events `locked`, `package delivered` , `package stranded`, `package taken`, `someone loitering`, `radar motion detected`, `alarm 911`, `shake alarm`, `wrong try-protect alarm`, `long time not close`, `low battery`, `jammed`, `talkback started`, `talkback stopped`, `user added`, `user deleted`, `user error`, `user username updated`, `user schedule updated`, `user passcode updated` and `pin verified`
* Added new commands `snooze`, `unlock`, `is_downloading`, `start_talkback`, `stop_talkback`, `is_talkback_ongoing`, `talkback_audio_data`, `add_user`, `delete_user`, `get_users`, `device.update_user_passcode`, `device.update_user_schedule`, `device.update_user` and `device.verify_pin` to Device
* Removed deprecated commands `set_status_led`, `set_auto_night_vision`, `set_motion_detection`, `set_sound_detection`, `set_pet_detection`, `set_rtsp_stream`, `set_anti_theft_detection`, `set_watermark`, `enable_device` and `lock_device` to Device. Please use instead `set_property` command.
* Changed `start_listening` response to only list station and device serial numbers (removed all properties). Please use now appropiate calls for getting properties (`get_properties` etc.)
* Device events `device added` and `device removed` only returns the device serial number (no more all properties of the device)
* Station events `station added` and `station removed` only returns the station serial number (no more all properties of the station)
* Added new Station event `connection error`
* Added new error types `device_download_already_running`, `device_download_not_running`, `device_only_one_download_at_a_time`, `deviceTalkbackAlreadyRunning`, `device_talkback_already_running`, `device_talkback_not_running`, `deviceOnlyOneTalkbackAtATime`, `device_only_one_talkback_at_a_time` and `device_rtsp_property_not_enabled` to Device
* Added new error type `station_connection_timeout` to Station

## Schema 12

* Added new Station event `alarmArmDelayEvent`

## Schema 11

* Added new property `imageMirrored` to Device
* Added new Station events `alarmDelayEvent` and `alarmArmedEvent`

## Schema 10

* Added new Server event `shutdown`
* Removed property `timestamp`from Station event `property changed`
* Removed property `timestamp`from Device event `property changed`
* Added new properties `notificationRadarDetector`, `continuousRecording`, `continuousRecordingType`, `loiteringDetection`, `loiteringDetectionRange`, `loiteringDetectionLength`, `motionDetectionSensitivityMode`, `motionDetectionSensitivityStandard`, `motionDetectionSensitivityAdvancedA`, `motionDetectionSensitivityAdvancedB`, `motionDetectionSensitivityAdvancedC`, `motionDetectionSensitivityAdvancedD`, `motionDetectionSensitivityAdvancedE`, `motionDetectionSensitivityAdvancedF`, `motionDetectionSensitivityAdvancedG`, `motionDetectionSensitivityAdvancedH`, `loiteringCustomResponsePhoneNotification`, `loiteringCustomResponseAutoVoiceResponse`, `loiteringCustomResponseAutoVoiceResponseVoice`, `loiteringCustomResponseHomeBaseNotification`, `loiteringCustomResponseTimeFrom`, `loiteringCustomResponseTimeTo`, `deliveryGuard`, `deliveryGuardPackageGuarding`, `deliveryGuardPackageGuardingVoiceResponseVoice`, `deliveryGuardPackageGuardingActivatedTimeFrom`, `deliveryGuardPackageGuardingActivatedTimeTo`, `deliveryGuardUncollectedPackageAlert`, `deliveryGuardUncollectedPackageAlertTimeToCheck`, `deliveryGuardPackageLiveCheckAssistance`, `dualCamWatchViewMode`, `ringAutoResponse`, `ringAutoResponseVoiceResponse`, `ringAutoResponseVoiceResponseVoice`, `ringAutoResponseTimeFrom`, `ringAutoResponseTimeTo`, `defaultAngle`, `defaultAngleIdleTime` and `soundDetectionRoundLook` to Device

## Schema 9

* Added new commands `setLogLevel`, `getLogLevel`, `startListeningLogs`, `stopListeningLogs` and `isMqttConnected` to Driver
* Added new Driver events `mqttConnected`, `mqttDisconnected` , `logLevelChanged` and `logging`
* Added new property `mqttConnected` to Driver
* Added new command `calibrateLock` to Device
* Added new properties `lockSettingsAutoLock`, `lockSettingsAutoLockTimer`, `lockSettingsAutoLockSchedule`, `lockSettingsAutoLockScheduleStartTime`, `lockSettingsAutoLockScheduleEndTime`, `lockSettingsOneTouchLocking`, `lockSettingsWrongTryProtection`, `lockSettingsWrongTryAttempts`, `lockSettingsWrongTryLockdownTime`, `lockSettingsScramblePasscode`, `lockSettingsSound`, `lockSettingsNotification`, `lockSettingsNotificationUnlocked` and `lockSettingsNotificationLocked` to Device

## Schema 8

* Added new properties `motionDetectionRange`, `motionDetectionRangeStandardSensitivity`, `motionDetectionRangeAdvancedLeftSensitivity`, `motionDetectionRangeAdvancedMiddleSensitivity`, `motionDetectionRangeAdvancedRightSensitivity`, `motionDetectionTestMode`, `motionTrackingSensitivity`, `motionAutoCruise`, `motionOutOfViewDetection`, `lightSettingsColorTemperatureManual`, `lightSettingsColorTemperatureMotion`, `lightSettingsColorTemperatureSchedule`, `lightSettingsMotionActivationMode`, `videoNightvisionImageAdjustment`, `videoColorNightvision` and `autoCalibration` to Device

## Schema 7

* Added new command `setCaptcha` to Driver
* Added new Driver event `captchaRequest`

## Schema 6

* Added new commands `startRTSPLivestream`, `stopRTSPLivestream` and `isRTSPLiveStreaming` to Station

## Schema 5

* Added new properties `nightvision` and `batteryIsCharging` to Device
* Added new properties `switchModeWithAccessCode`, `autoEndAlarm` and `turnOffAlarmWithButton` to Station

## Schema 4

* Added new properties `chargingStatus`, `wifiSignalLevel`, `rtspStreamUrl`, `chirpVolume`, `chirpTone`, `videoHdr`, `videoDistortionCorrection` and `videoRingRecord` to Device
* Renamed properties from `motionDetectionSensivity`, `soundDetectionSensivity` and `ledStatus` to `motionDetectionSensitivity`, `soundDetectionSensitivity` and `statusLed` for Device

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

## Schema 2

* Added new commands `startLivestream`, `stopLivestream` and `isLiveStreaming` to Device
* Added new Device events `livestreamStarted`,`livestreamStopped`, `livestreamVideoData` and `livestreamAudioData`

## Schema 1

* Added `type`property to Device and Station

## Schema 0

Base schema.