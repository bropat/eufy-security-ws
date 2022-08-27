import { Device, DeviceType, PropertyName } from "eufy-security-client"

import { Modify } from "../state";

export interface DeviceStateSchema0 {
    name: string;
    model: string;
    serialNumber: string;
    hardwareVersion: string;
    softwareVersion: string;
    stationSerialNumber: string;
    state?: number;
    battery?: number;
    batteryTemperature?: number;
    batteryLow?: boolean;
    lastChargingDays?: number;
    lastChargingTotalEvents?: number;
    lastChargingRecordedEvents?: number;
    lastChargingFalseEvents?: number;
    batteryUsageLastWeek?: number;
    motionDetected?: boolean;
    personDetected?: boolean;
    personName?: string;
    soundDetected?: boolean;
    petDetected?: boolean;
    cryingDetected?: boolean;
    ringing?: boolean;
    locked?: boolean;
    sensorOpen?: boolean;
    sensorChangeTime?: number;
    enabled: boolean;
    antitheftDetection?: boolean;
    autoNightvision?: boolean;
    ledStatus?: boolean;
    motionDetection?: boolean;
    soundDetection?: boolean;
    petDetection?: boolean;
    rtspStream?: boolean;
    watermark?: number;
    lockStatus?: number;
    motionSensorPIREvent?: number;
    wifiRSSI?: number;
    pictureUrl?: string;
}

type DeviceStateSchema1 = Modify<
DeviceStateSchema0,
{ type: DeviceType }
>;

type DeviceStateSchema3 = Modify<
DeviceStateSchema1,
{
    motionDetectionType?: number;
    motionDetectionSensivity?: number;
    motionTracking?: boolean;
    soundDetectionType?: number;
    soundDetectionSensivity?: number;
    light?: boolean;
    microphone?: boolean;
    speaker?: boolean;
    speakerVolume?: number;
    ringtoneVolume?: number;
    audioRecording?: boolean;
    powerSource?: number;
    powerWorkingMode?: number;
    recordingEndClipMotionStops?: boolean;
    recordingClipLength?: number;
    recordingRetriggerInterval?: number;
    videoStreamingQuality?: number;
    videoRecordingQuality?: number;
    videoWDR?: boolean;
    lightSettingsEnable?: boolean;
    lightSettingsBrightnessManual?: number;
    lightSettingsBrightnessMotion?: number;
    lightSettingsBrightnessSchedule?: number;
    lightSettingsMotionTriggered?: boolean;
    lightSettingsMotionTriggeredDistance?: number;
    lightSettingsMotionTriggeredTimer?: number;
    chimeIndoor?: boolean;
    chimeHomebase?: boolean;
    chimeHomebaseRingtoneVolume?: number;
    chimeHomebaseRingtoneType?: number;
    notificationType?: number;
    rotationSpeed?: number;
    notificationPerson?: boolean;
    notificationPet?: boolean;
    notificationAllOtherMotion?: boolean;
    notificationCrying?: boolean;
    notificationAllSound?: boolean;
    notificationIntervalTime?: boolean;
    notificationRing?: boolean;
    notificationMotion?:boolean;
}>;

type DeviceStateSchema4 = Omit<
Modify<
DeviceStateSchema3,
{
    chirpVolume?: number;
    chirpTone?: number;
    motionDetectionSensitivity?: number;
    soundDetectionSensitivity?: number;
    videoHdr?: boolean;
    videoDistortionCorrection?: boolean;
    videoRingRecord?: number;
    statusLed?: boolean;
    rtspStreamUrl?: string;
    chargingStatus?: number;
    wifiSignalLevel?: number;
}>,
"motionDetectionSensivity" | "soundDetectionSensivity" | "ledStatus"
>;

type DeviceStateSchema5 = Modify<
DeviceStateSchema4,
{
    batteryIsCharging?: boolean;
    nightvision?: number;
}>;

type DeviceStateSchema6 = Modify<
DeviceStateSchema5,
{
    motionDetectionRange?: boolean;
    motionDetectionRangeStandardSensitivity?: number;
    motionDetectionRangeAdvancedLeftSensitivity?: number;
    motionDetectionRangeAdvancedMiddleSensitivity?: number;
    motionDetectionRangeAdvancedRightSensitivity?: number;
    motionDetectionTestMode?: boolean;
    motionTrackingSensitivity?: number;
    motionAutoCruise?: boolean;
    motionOutOfViewDetection?: boolean;
    lightSettingsColorTemperatureManual?: number;
    lightSettingsColorTemperatureMotion?: number;
    lightSettingsColorTemperatureSchedule?: number;
    lightSettingsMotionActivationMode?: number;
    videoNightvisionImageAdjustment?: boolean;
    videoColorNightvision?: boolean;
    autoCalibration?: boolean;
}>;

type DeviceStateSchema7 = Modify<
DeviceStateSchema6,
{
    lockSettingsAutoLock?: boolean;
    lockSettingsAutoLockTimer?: number;
    lockSettingsAutoLockSchedule?: boolean;
    lockSettingsAutoLockScheduleStartTime?: string;
    lockSettingsAutoLockScheduleEndTime?: string;
    lockSettingsOneTouchLocking?: boolean;
    lockSettingsWrongTryProtection?: boolean;
    lockSettingsWrongTryAttempts?: number;
    lockSettingsWrongTryLockdownTime?: number;
    lockSettingsScramblePasscode?: boolean;
    lockSettingsSound?: number;
    lockSettingsNotification?: boolean;
    lockSettingsNotificationUnlocked?: boolean;
    lockSettingsNotificationLocked?: boolean;
}>;

type DeviceStateSchema8 = Modify<
DeviceStateSchema7,
{
    notificationRadarDetector?: boolean;
    continuousRecording?: boolean;
    continuousRecordingType?: number;
    loiteringDetection?: boolean;
    loiteringDetectionRange?: number;
    loiteringDetectionLength?: number;
    motionDetectionSensitivityMode?: number;
    motionDetectionSensitivityStandard?: number;
    motionDetectionSensitivityAdvancedA?: number;
    motionDetectionSensitivityAdvancedB?: number;
    motionDetectionSensitivityAdvancedC?: number;
    motionDetectionSensitivityAdvancedD?: number;
    motionDetectionSensitivityAdvancedE?: number;
    motionDetectionSensitivityAdvancedF?: number;
    motionDetectionSensitivityAdvancedG?: number;
    motionDetectionSensitivityAdvancedH?: number;
    loiteringCustomResponsePhoneNotification?: boolean;
    loiteringCustomResponseAutoVoiceResponse?: boolean;
    loiteringCustomResponseAutoVoiceResponseVoice?: number;
    loiteringCustomResponseHomeBaseNotification?: boolean;
    loiteringCustomResponseTimeFrom?: string;
    loiteringCustomResponseTimeTo?: string;
    deliveryGuard?: boolean;
    deliveryGuardPackageGuarding?: boolean;
    deliveryGuardPackageGuardingVoiceResponseVoice?: number;
    deliveryGuardPackageGuardingActivatedTimeFrom?: string;
    deliveryGuardPackageGuardingActivatedTimeTo?: string;
    deliveryGuardUncollectedPackageAlert?: boolean;
    deliveryGuardUncollectedPackageAlertTimeToCheck?: string;
    deliveryGuardPackageLiveCheckAssistance?: boolean;
    dualCamWatchViewMode?: number;
    ringAutoResponse?: boolean;
    ringAutoResponseVoiceResponse?: boolean;
    ringAutoResponseVoiceResponseVoice?: number;
    ringAutoResponseTimeFrom?: string;
    ringAutoResponseTimeTo?: string;
    defaultAngle?: boolean;
    defaultAngleIdleTime?: number;
    soundDetectionRoundLook?: boolean;
}>;

type DeviceStateSchema9 = Modify<
DeviceStateSchema8,
{
    imageMirrored?: boolean;
}>;

export type DeviceState = 
  | DeviceStateSchema0
  | DeviceStateSchema1
  | DeviceStateSchema3
  | DeviceStateSchema4
  | DeviceStateSchema5
  | DeviceStateSchema6
  | DeviceStateSchema7
  | DeviceStateSchema8
  | DeviceStateSchema9;

export const dumpDevice = (device: Device, schemaVersion: number): DeviceState => {
    const base: DeviceStateSchema0 = {
        name: device.getPropertyValue(PropertyName.Name) as string,
        model: device.getPropertyValue(PropertyName.Model) as string,
        serialNumber: device.getPropertyValue(PropertyName.SerialNumber) as string,
        hardwareVersion: device.getPropertyValue(PropertyName.HardwareVersion) as string,
        softwareVersion: device.getPropertyValue(PropertyName.SoftwareVersion) as string,
        stationSerialNumber: device.getPropertyValue(PropertyName.DeviceStationSN) as string,
        enabled: device.getPropertyValue(PropertyName.DeviceEnabled) as boolean,
        state: device.getPropertyValue(PropertyName.DeviceState) as number,
        battery: device.getPropertyValue(PropertyName.DeviceBattery) as number,
        batteryTemperature: device.getPropertyValue(PropertyName.DeviceBatteryTemp) as number,
        batteryLow: device.getPropertyValue(PropertyName.DeviceBatteryLow) as boolean,
        lastChargingDays: device.getPropertyValue(PropertyName.DeviceLastChargingDays) as number,
        lastChargingTotalEvents: device.getPropertyValue(PropertyName.DeviceLastChargingTotalEvents) as number,
        lastChargingRecordedEvents: device.getPropertyValue(PropertyName.DeviceLastChargingRecordedEvents) as number,
        lastChargingFalseEvents: device.getPropertyValue(PropertyName.DeviceLastChargingFalseEvents) as number,
        batteryUsageLastWeek: device.getPropertyValue(PropertyName.DeviceBatteryUsageLastWeek) as number,
        motionDetected: device.getPropertyValue(PropertyName.DeviceMotionDetected) as boolean,
        personDetected: device.getPropertyValue(PropertyName.DevicePersonDetected) as boolean,
        personName: device.getPropertyValue(PropertyName.DevicePersonName) as string,
        soundDetected: device.getPropertyValue(PropertyName.DeviceSoundDetected) as boolean,
        petDetected: device.getPropertyValue(PropertyName.DevicePetDetected) as boolean,
        cryingDetected: device.getPropertyValue(PropertyName.DeviceCryingDetected) as boolean,
        ringing: device.getPropertyValue(PropertyName.DeviceRinging) as boolean,
        locked: device.getPropertyValue(PropertyName.DeviceLocked) as boolean,
        antitheftDetection: device.getPropertyValue(PropertyName.DeviceAntitheftDetection) as boolean,
        autoNightvision: device.getPropertyValue(PropertyName.DeviceAutoNightvision) as boolean,
        motionDetection: device.getPropertyValue(PropertyName.DeviceMotionDetection) as boolean,
        soundDetection: device.getPropertyValue(PropertyName.DeviceSoundDetection) as boolean,
        petDetection: device.getPropertyValue(PropertyName.DevicePetDetection) as boolean,
        rtspStream: device.getPropertyValue(PropertyName.DeviceRTSPStream) as boolean,
        watermark: device.getPropertyValue(PropertyName.DeviceWatermark) as number,
        lockStatus: device.getPropertyValue(PropertyName.DeviceLockStatus) as number,
        motionSensorPIREvent: device.getPropertyValue(PropertyName.DeviceMotionSensorPIREvent) as number,
        wifiRSSI: device.getPropertyValue(PropertyName.DeviceWifiRSSI) as number,
        pictureUrl: device.getPropertyValue(PropertyName.DevicePictureUrl) as string,
        sensorOpen: device.getPropertyValue(PropertyName.DeviceSensorOpen) as boolean,
        sensorChangeTime: device.getPropertyValue(PropertyName.DeviceSensorChangeTime) as number,
    };

    if (schemaVersion == 0) {
        base.ledStatus = device.getPropertyValue(PropertyName.DeviceStatusLed) as boolean;
        return base as DeviceStateSchema0;
    }

    const device1 = base as DeviceStateSchema1;
    device1.type = device.getPropertyValue(PropertyName.Type) as number;
    if (schemaVersion <= 2) {
        return device1;
    }

    const device3 = device1 as DeviceStateSchema3;
    device3.motionDetectionType = device.getPropertyValue(PropertyName.DeviceMotionDetectionType) as number;
    device3.motionTracking = device.getPropertyValue(PropertyName.DeviceMotionTracking) as boolean;
    device3.soundDetectionType = device.getPropertyValue(PropertyName.DeviceSoundDetectionType) as number;
    device3.light = device.getPropertyValue(PropertyName.DeviceLight) as boolean;
    device3.microphone = device.getPropertyValue(PropertyName.DeviceMicrophone) as boolean;
    device3.speaker = device.getPropertyValue(PropertyName.DeviceSpeaker) as boolean;
    device3.speakerVolume = device.getPropertyValue(PropertyName.DeviceSpeakerVolume) as number;
    device3.ringtoneVolume = device.getPropertyValue(PropertyName.DeviceRingtoneVolume) as number;
    device3.audioRecording = device.getPropertyValue(PropertyName.DeviceAudioRecording) as boolean;
    device3.powerSource = device.getPropertyValue(PropertyName.DevicePowerSource) as number;
    device3.powerWorkingMode = device.getPropertyValue(PropertyName.DevicePowerWorkingMode) as number;
    device3.recordingEndClipMotionStops = device.getPropertyValue(PropertyName.DeviceRecordingEndClipMotionStops) as boolean;
    device3.recordingClipLength = device.getPropertyValue(PropertyName.DeviceRecordingClipLength) as number;
    device3.recordingRetriggerInterval = device.getPropertyValue(PropertyName.DeviceRecordingRetriggerInterval) as number;
    device3.videoStreamingQuality = device.getPropertyValue(PropertyName.DeviceVideoStreamingQuality) as number;
    device3.videoRecordingQuality = device.getPropertyValue(PropertyName.DeviceVideoRecordingQuality) as number;
    device3.videoWDR = device.getPropertyValue(PropertyName.DeviceVideoWDR) as boolean;
    device3.lightSettingsEnable = device.getPropertyValue(PropertyName.DeviceLightSettingsEnable) as boolean;
    device3.lightSettingsBrightnessManual = device.getPropertyValue(PropertyName.DeviceLightSettingsBrightnessManual) as number;
    device3.lightSettingsBrightnessMotion = device.getPropertyValue(PropertyName.DeviceLightSettingsBrightnessMotion) as number;
    device3.lightSettingsBrightnessSchedule = device.getPropertyValue(PropertyName.DeviceLightSettingsBrightnessSchedule) as number;
    device3.lightSettingsMotionTriggered = device.getPropertyValue(PropertyName.DeviceLightSettingsMotionTriggered) as boolean;
    device3.lightSettingsMotionTriggeredDistance = device.getPropertyValue(PropertyName.DeviceLightSettingsMotionTriggeredDistance) as number;
    device3.lightSettingsMotionTriggeredTimer = device.getPropertyValue(PropertyName.DeviceLightSettingsMotionTriggeredTimer) as number;
    device3.chimeIndoor = device.getPropertyValue(PropertyName.DeviceChimeIndoor) as boolean;
    device3.chimeHomebase = device.getPropertyValue(PropertyName.DeviceChimeHomebase) as boolean;
    device3.chimeHomebaseRingtoneVolume = device.getPropertyValue(PropertyName.DeviceChimeHomebaseRingtoneVolume) as number;
    device3.chimeHomebaseRingtoneType = device.getPropertyValue(PropertyName.DeviceChimeHomebaseRingtoneType) as number;
    device3.notificationType = device.getPropertyValue(PropertyName.DeviceNotificationType) as number;
    device3.rotationSpeed = device.getPropertyValue(PropertyName.DeviceRotationSpeed) as number;
    device3.notificationPerson = device.getPropertyValue(PropertyName.DeviceNotificationPerson) as boolean;
    device3.notificationPet = device.getPropertyValue(PropertyName.DeviceNotificationPet) as boolean;
    device3.notificationAllOtherMotion = device.getPropertyValue(PropertyName.DeviceNotificationAllOtherMotion) as boolean;
    device3.notificationCrying = device.getPropertyValue(PropertyName.DeviceNotificationCrying) as boolean;
    device3.notificationAllSound = device.getPropertyValue(PropertyName.DeviceNotificationAllSound) as boolean;
    device3.notificationIntervalTime = device.getPropertyValue(PropertyName.DeviceNotificationIntervalTime) as boolean;
    device3.notificationRing = device.getPropertyValue(PropertyName.DeviceNotificationRing) as boolean;
    device3.notificationMotion = device.getPropertyValue(PropertyName.DeviceNotificationMotion) as boolean;
    if (schemaVersion === 3) {
        device3.motionDetectionSensivity = device.getPropertyValue(PropertyName.DeviceMotionDetectionSensitivity) as number;
        device3.soundDetectionSensivity = device.getPropertyValue(PropertyName.DeviceSoundDetectionSensitivity) as number;
        return device3;
    }

    const device4 = device3 as DeviceStateSchema4;
    device4.chirpVolume = device.getPropertyValue(PropertyName.DeviceChirpVolume) as number;
    device4.chirpTone = device.getPropertyValue(PropertyName.DeviceChirpTone) as number;
    device4.motionDetectionSensitivity = device.getPropertyValue(PropertyName.DeviceMotionDetectionSensitivity) as number;
    device4.soundDetectionSensitivity = device.getPropertyValue(PropertyName.DeviceSoundDetectionSensitivity) as number;
    device4.videoHdr = device.getPropertyValue(PropertyName.DeviceVideoHDR) as boolean;
    device4.videoDistortionCorrection = device.getPropertyValue(PropertyName.DeviceVideoDistortionCorrection) as boolean;
    device4.videoRingRecord = device.getPropertyValue(PropertyName.DeviceVideoRingRecord) as number;
    device4.statusLed = device.getPropertyValue(PropertyName.DeviceStatusLed) as boolean;
    device4.rtspStreamUrl = device.getPropertyValue(PropertyName.DeviceRTSPStreamUrl) as string;
    device4.chargingStatus = device.getPropertyValue(PropertyName.DeviceChargingStatus) as number;
    device4.wifiSignalLevel = device.getPropertyValue(PropertyName.DeviceWifiSignalLevel) as number;
    if (schemaVersion <= 4) {
        return device4;
    }

    const device5 = device4 as DeviceStateSchema5;
    device5.nightvision = device.getPropertyValue(PropertyName.DeviceNightvision) as number;
    device5.batteryIsCharging = device.getPropertyValue(PropertyName.DeviceBatteryIsCharging) as boolean;
    if (schemaVersion <= 5) {
        return device5;
    }

    const device6 = device5 as DeviceStateSchema6;
    device6.motionDetectionRange = device.getPropertyValue(PropertyName.DeviceMotionDetectionRange) as boolean;
    device6.motionDetectionRangeStandardSensitivity = device.getPropertyValue(PropertyName.DeviceMotionDetectionRangeStandardSensitivity) as number;
    device6.motionDetectionRangeAdvancedLeftSensitivity = device.getPropertyValue(PropertyName.DeviceMotionDetectionRangeAdvancedLeftSensitivity) as number;
    device6.motionDetectionRangeAdvancedMiddleSensitivity = device.getPropertyValue(PropertyName.DeviceMotionDetectionRangeAdvancedMiddleSensitivity) as number;
    device6.motionDetectionRangeAdvancedRightSensitivity = device.getPropertyValue(PropertyName.DeviceMotionDetectionRangeAdvancedRightSensitivity) as number;
    device6.motionDetectionTestMode = device.getPropertyValue(PropertyName.DeviceMotionDetectionTestMode) as boolean;
    device6.motionTrackingSensitivity = device.getPropertyValue(PropertyName.DeviceMotionTrackingSensitivity) as number;
    device6.motionAutoCruise = device.getPropertyValue(PropertyName.DeviceMotionAutoCruise) as boolean;
    device6.motionOutOfViewDetection = device.getPropertyValue(PropertyName.DeviceMotionOutOfViewDetection) as boolean;
    device6.lightSettingsColorTemperatureManual = device.getPropertyValue(PropertyName.DeviceLightSettingsColorTemperatureManual) as number;
    device6.lightSettingsColorTemperatureMotion = device.getPropertyValue(PropertyName.DeviceLightSettingsColorTemperatureMotion) as number;
    device6.lightSettingsColorTemperatureSchedule = device.getPropertyValue(PropertyName.DeviceLightSettingsColorTemperatureSchedule) as number;
    device6.lightSettingsMotionActivationMode = device.getPropertyValue(PropertyName.DeviceLightSettingsMotionActivationMode) as number;
    device6.videoNightvisionImageAdjustment = device.getPropertyValue(PropertyName.DeviceVideoNightvisionImageAdjustment) as boolean;
    device6.videoColorNightvision = device.getPropertyValue(PropertyName.DeviceVideoColorNightvision) as boolean;
    device6.autoCalibration = device.getPropertyValue(PropertyName.DeviceAutoCalibration) as boolean;
    if (schemaVersion <= 8) {
        return device6;
    }

    const device7 = device6 as DeviceStateSchema7;
    device7.lockSettingsAutoLock = device.getPropertyValue(PropertyName.DeviceAutoLock) as boolean;
    device7.lockSettingsAutoLockTimer = device.getPropertyValue(PropertyName.DeviceAutoLockTimer) as number;
    device7.lockSettingsAutoLockSchedule = device.getPropertyValue(PropertyName.DeviceAutoLockSchedule) as boolean;
    device7.lockSettingsAutoLockScheduleStartTime = device.getPropertyValue(PropertyName.DeviceAutoLockScheduleStartTime) as string;
    device7.lockSettingsAutoLockScheduleEndTime = device.getPropertyValue(PropertyName.DeviceAutoLockScheduleEndTime) as string;
    device7.lockSettingsOneTouchLocking = device.getPropertyValue(PropertyName.DeviceOneTouchLocking) as boolean;
    device7.lockSettingsWrongTryProtection = device.getPropertyValue(PropertyName.DeviceWrongTryProtection) as boolean;
    device7.lockSettingsWrongTryAttempts = device.getPropertyValue(PropertyName.DeviceWrongTryAttempts) as number;
    device7.lockSettingsWrongTryLockdownTime = device.getPropertyValue(PropertyName.DeviceWrongTryLockdownTime) as number;
    device7.lockSettingsScramblePasscode = device.getPropertyValue(PropertyName.DeviceScramblePasscode) as boolean;
    device7.lockSettingsSound = device.getPropertyValue(PropertyName.DeviceSound) as number;
    device7.lockSettingsNotification = device.getPropertyValue(PropertyName.DeviceNotification) as boolean;
    device7.lockSettingsNotificationUnlocked = device.getPropertyValue(PropertyName.DeviceNotificationUnlocked) as boolean;
    device7.lockSettingsNotificationLocked = device.getPropertyValue(PropertyName.DeviceNotificationLocked) as boolean;
    if (schemaVersion <= 9) {
        return device7;
    }

    const device8 = device7 as DeviceStateSchema8;
    device8.notificationRadarDetector = device.getPropertyValue(PropertyName.DeviceNotificationRadarDetector) as boolean;
    device8.continuousRecording = device.getPropertyValue(PropertyName.DeviceContinuousRecording) as boolean;
    device8.continuousRecordingType = device.getPropertyValue(PropertyName.DeviceContinuousRecordingType) as number;
    device8.loiteringDetection = device.getPropertyValue(PropertyName.DeviceLoiteringDetection) as boolean;
    device8.loiteringDetectionRange = device.getPropertyValue(PropertyName.DeviceLoiteringDetectionRange) as number;
    device8.loiteringDetectionLength = device.getPropertyValue(PropertyName.DeviceLoiteringDetectionLength) as number;
    device8.motionDetectionSensitivityMode = device.getPropertyValue(PropertyName.DeviceMotionDetectionSensitivityMode) as number;
    device8.motionDetectionSensitivityStandard = device.getPropertyValue(PropertyName.DeviceMotionDetectionSensitivityStandard) as number;
    device8.motionDetectionSensitivityAdvancedA = device.getPropertyValue(PropertyName.DeviceMotionDetectionSensitivityAdvancedA) as number;
    device8.motionDetectionSensitivityAdvancedB = device.getPropertyValue(PropertyName.DeviceMotionDetectionSensitivityAdvancedB) as number;
    device8.motionDetectionSensitivityAdvancedC = device.getPropertyValue(PropertyName.DeviceMotionDetectionSensitivityAdvancedC) as number;
    device8.motionDetectionSensitivityAdvancedD = device.getPropertyValue(PropertyName.DeviceMotionDetectionSensitivityAdvancedD) as number;
    device8.motionDetectionSensitivityAdvancedE = device.getPropertyValue(PropertyName.DeviceMotionDetectionSensitivityAdvancedE) as number;
    device8.motionDetectionSensitivityAdvancedF = device.getPropertyValue(PropertyName.DeviceMotionDetectionSensitivityAdvancedF) as number;
    device8.motionDetectionSensitivityAdvancedG = device.getPropertyValue(PropertyName.DeviceMotionDetectionSensitivityAdvancedG) as number;
    device8.motionDetectionSensitivityAdvancedH = device.getPropertyValue(PropertyName.DeviceMotionDetectionSensitivityAdvancedH) as number;
    device8.loiteringCustomResponsePhoneNotification = device.getPropertyValue(PropertyName.DeviceLoiteringCustomResponsePhoneNotification) as boolean;
    device8.loiteringCustomResponseAutoVoiceResponse = device.getPropertyValue(PropertyName.DeviceLoiteringCustomResponseAutoVoiceResponse) as boolean;
    device8.loiteringCustomResponseAutoVoiceResponseVoice = device.getPropertyValue(PropertyName.DeviceLoiteringCustomResponseAutoVoiceResponseVoice) as number;
    device8.loiteringCustomResponseHomeBaseNotification = device.getPropertyValue(PropertyName.DeviceLoiteringCustomResponseHomeBaseNotification) as boolean;
    device8.loiteringCustomResponseTimeFrom = device.getPropertyValue(PropertyName.DeviceLoiteringCustomResponseTimeFrom) as string;
    device8.loiteringCustomResponseTimeTo = device.getPropertyValue(PropertyName.DeviceLoiteringCustomResponseTimeTo) as string;
    device8.deliveryGuard = device.getPropertyValue(PropertyName.DeviceDeliveryGuard) as boolean;
    device8.deliveryGuardPackageGuarding = device.getPropertyValue(PropertyName.DeviceDeliveryGuardPackageGuarding) as boolean;
    device8.deliveryGuardPackageGuardingVoiceResponseVoice = device.getPropertyValue(PropertyName.DeviceDeliveryGuardPackageGuardingVoiceResponseVoice) as number;
    device8.deliveryGuardPackageGuardingActivatedTimeFrom = device.getPropertyValue(PropertyName.DeviceDeliveryGuardPackageGuardingActivatedTimeFrom) as string;
    device8.deliveryGuardPackageGuardingActivatedTimeTo = device.getPropertyValue(PropertyName.DeviceDeliveryGuardPackageGuardingActivatedTimeTo) as string;
    device8.deliveryGuardUncollectedPackageAlert = device.getPropertyValue(PropertyName.DeviceDeliveryGuardUncollectedPackageAlert) as boolean;
    device8.deliveryGuardUncollectedPackageAlertTimeToCheck = device.getPropertyValue(PropertyName.DeviceDeliveryGuardUncollectedPackageAlertTimeToCheck) as string;
    device8.deliveryGuardPackageLiveCheckAssistance = device.getPropertyValue(PropertyName.DeviceDeliveryGuardPackageLiveCheckAssistance) as boolean;
    device8.dualCamWatchViewMode = device.getPropertyValue(PropertyName.DeviceDualCamWatchViewMode) as number;
    device8.ringAutoResponse = device.getPropertyValue(PropertyName.DeviceRingAutoResponse) as boolean;
    device8.ringAutoResponseVoiceResponse = device.getPropertyValue(PropertyName.DeviceRingAutoResponseVoiceResponse) as boolean;
    device8.ringAutoResponseVoiceResponseVoice = device.getPropertyValue(PropertyName.DeviceRingAutoResponseVoiceResponseVoice) as number;
    device8.ringAutoResponseTimeFrom = device.getPropertyValue(PropertyName.DeviceRingAutoResponseTimeFrom) as string;
    device8.ringAutoResponseTimeTo = device.getPropertyValue(PropertyName.DeviceRingAutoResponseTimeTo) as string;
    device8.defaultAngle = device.getPropertyValue(PropertyName.DeviceDefaultAngle) as boolean;
    device8.defaultAngleIdleTime = device.getPropertyValue(PropertyName.DeviceDefaultAngleIdleTime) as number;
    device8.soundDetectionRoundLook = device.getPropertyValue(PropertyName.DeviceSoundDetectionRoundLook) as boolean;
    if (schemaVersion <= 10) {
        return device8;
    }

    // All schemas >= 11
    const device9 = device8 as DeviceStateSchema9;
    device9.imageMirrored = device.getPropertyValue(PropertyName.DeviceImageMirrored) as boolean;
    
    return device9;
};