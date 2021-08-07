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


export type DeviceState = 
  | DeviceStateSchema0
  | DeviceStateSchema1
  | DeviceStateSchema3
  | DeviceStateSchema4;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const dumpDevice = (device: Device, schemaVersion: number): DeviceState => {
    const base: DeviceStateSchema0 = {
        name: device.getPropertyValue(PropertyName.Name)?.value as string,
        model: device.getPropertyValue(PropertyName.Model)?.value as string,
        serialNumber: device.getPropertyValue(PropertyName.SerialNumber)?.value as string,
        hardwareVersion: device.getPropertyValue(PropertyName.HardwareVersion)?.value as string,
        softwareVersion: device.getPropertyValue(PropertyName.SoftwareVersion)?.value as string,
        stationSerialNumber: device.getPropertyValue(PropertyName.DeviceStationSN)?.value as string,
        enabled: device.getPropertyValue(PropertyName.DeviceEnabled)?.value as boolean,
        state: device.getPropertyValue(PropertyName.DeviceState)?.value as number,
        battery: device.getPropertyValue(PropertyName.DeviceBattery)?.value as number,
        batteryTemperature: device.getPropertyValue(PropertyName.DeviceBatteryTemp)?.value as number,
        batteryLow: device.getPropertyValue(PropertyName.DeviceBatteryLow)?.value as boolean,
        lastChargingDays: device.getPropertyValue(PropertyName.DeviceLastChargingDays)?.value as number,
        lastChargingTotalEvents: device.getPropertyValue(PropertyName.DeviceLastChargingTotalEvents)?.value as number,
        lastChargingRecordedEvents: device.getPropertyValue(PropertyName.DeviceLastChargingRecordedEvents)?.value as number,
        lastChargingFalseEvents: device.getPropertyValue(PropertyName.DeviceLastChargingFalseEvents)?.value as number,
        batteryUsageLastWeek: device.getPropertyValue(PropertyName.DeviceBatteryUsageLastWeek)?.value as number,
        motionDetected: device.getPropertyValue(PropertyName.DeviceMotionDetected)?.value as boolean,
        personDetected: device.getPropertyValue(PropertyName.DevicePersonDetected)?.value as boolean,
        personName: device.getPropertyValue(PropertyName.DevicePersonName)?.value as string,
        soundDetected: device.getPropertyValue(PropertyName.DeviceSoundDetected)?.value as boolean,
        petDetected: device.getPropertyValue(PropertyName.DevicePetDetected)?.value as boolean,
        cryingDetected: device.getPropertyValue(PropertyName.DeviceCryingDetected)?.value as boolean,
        ringing: device.getPropertyValue(PropertyName.DeviceRinging)?.value as boolean,
        locked: device.getPropertyValue(PropertyName.DeviceLocked)?.value as boolean,
        antitheftDetection: device.getPropertyValue(PropertyName.DeviceAntitheftDetection)?.value as boolean,
        autoNightvision: device.getPropertyValue(PropertyName.DeviceAutoNightvision)?.value as boolean,
        motionDetection: device.getPropertyValue(PropertyName.DeviceMotionDetection)?.value as boolean,
        soundDetection: device.getPropertyValue(PropertyName.DeviceSoundDetection)?.value as boolean,
        petDetection: device.getPropertyValue(PropertyName.DevicePetDetection)?.value as boolean,
        rtspStream: device.getPropertyValue(PropertyName.DeviceRTSPStream)?.value as boolean,
        watermark: device.getPropertyValue(PropertyName.DeviceWatermark)?.value as number,
        lockStatus: device.getPropertyValue(PropertyName.DeviceLockStatus)?.value as number,
        motionSensorPIREvent: device.getPropertyValue(PropertyName.DeviceMotionSensorPIREvent)?.value as number,
        wifiRSSI: device.getPropertyValue(PropertyName.DeviceWifiRSSI)?.value as number,
        pictureUrl: device.getPropertyValue(PropertyName.DevicePictureUrl)?.value as string,
        sensorOpen: device.getPropertyValue(PropertyName.DeviceSensorOpen)?.value as boolean,
        sensorChangeTime: device.getPropertyValue(PropertyName.DeviceSensorChangeTime)?.value as number,
    };

    if (schemaVersion == 0) {
        base.ledStatus = device.getPropertyValue(PropertyName.DeviceStatusLed)?.value as boolean;
        return base as DeviceStateSchema0;
    }

    const device1 = base as DeviceStateSchema1;
    device1.type = device.getPropertyValue(PropertyName.Type).value as number;
    if (schemaVersion <= 2) {
        return device1;
    }

    const device3 = device1 as DeviceStateSchema3;
    device3.motionDetectionType = device.getPropertyValue(PropertyName.DeviceMotionDetectionType)?.value as number;
    device3.motionTracking = device.getPropertyValue(PropertyName.DeviceMotionTracking)?.value as boolean;
    device3.soundDetectionType = device.getPropertyValue(PropertyName.DeviceSoundDetectionType)?.value as number;
    device3.light = device.getPropertyValue(PropertyName.DeviceLight)?.value as boolean;
    device3.microphone = device.getPropertyValue(PropertyName.DeviceMicrophone)?.value as boolean;
    device3.speaker = device.getPropertyValue(PropertyName.DeviceSpeaker)?.value as boolean;
    device3.speakerVolume = device.getPropertyValue(PropertyName.DeviceSpeakerVolume)?.value as number;
    device3.ringtoneVolume = device.getPropertyValue(PropertyName.DeviceRingtoneVolume)?.value as number;
    device3.audioRecording = device.getPropertyValue(PropertyName.DeviceAudioRecording)?.value as boolean;
    device3.powerSource = device.getPropertyValue(PropertyName.DevicePowerSource)?.value as number;
    device3.powerWorkingMode = device.getPropertyValue(PropertyName.DevicePowerWorkingMode)?.value as number;
    device3.recordingEndClipMotionStops = device.getPropertyValue(PropertyName.DeviceRecordingEndClipMotionStops)?.value as boolean;
    device3.recordingClipLength = device.getPropertyValue(PropertyName.DeviceRecordingClipLength)?.value as number;
    device3.recordingRetriggerInterval = device.getPropertyValue(PropertyName.DeviceRecordingRetriggerInterval)?.value as number;
    device3.videoStreamingQuality = device.getPropertyValue(PropertyName.DeviceVideoStreamingQuality)?.value as number;
    device3.videoRecordingQuality = device.getPropertyValue(PropertyName.DeviceVideoRecordingQuality)?.value as number;
    device3.videoWDR = device.getPropertyValue(PropertyName.DeviceVideoWDR)?.value as boolean;
    device3.lightSettingsEnable = device.getPropertyValue(PropertyName.DeviceLightSettingsEnable)?.value as boolean;
    device3.lightSettingsBrightnessManual = device.getPropertyValue(PropertyName.DeviceLightSettingsBrightnessManual)?.value as number;
    device3.lightSettingsBrightnessMotion = device.getPropertyValue(PropertyName.DeviceLightSettingsBrightnessMotion)?.value as number;
    device3.lightSettingsBrightnessSchedule = device.getPropertyValue(PropertyName.DeviceLightSettingsBrightnessSchedule)?.value as number;
    device3.lightSettingsMotionTriggered = device.getPropertyValue(PropertyName.DeviceLightSettingsMotionTriggered)?.value as boolean;
    device3.lightSettingsMotionTriggeredDistance = device.getPropertyValue(PropertyName.DeviceLightSettingsMotionTriggeredDistance)?.value as number;
    device3.lightSettingsMotionTriggeredTimer = device.getPropertyValue(PropertyName.DeviceLightSettingsMotionTriggeredTimer)?.value as number;
    device3.chimeIndoor = device.getPropertyValue(PropertyName.DeviceChimeIndoor)?.value as boolean;
    device3.chimeHomebase = device.getPropertyValue(PropertyName.DeviceChimeHomebase)?.value as boolean;
    device3.chimeHomebaseRingtoneVolume = device.getPropertyValue(PropertyName.DeviceChimeHomebaseRingtoneVolume)?.value as number;
    device3.chimeHomebaseRingtoneType = device.getPropertyValue(PropertyName.DeviceChimeHomebaseRingtoneType)?.value as number;
    device3.notificationType = device.getPropertyValue(PropertyName.DeviceNotificationType)?.value as number;
    device3.rotationSpeed = device.getPropertyValue(PropertyName.DeviceRotationSpeed)?.value as number;
    device3.notificationPerson = device.getPropertyValue(PropertyName.DeviceNotificationPerson)?.value as boolean;
    device3.notificationPet = device.getPropertyValue(PropertyName.DeviceNotificationPet)?.value as boolean;
    device3.notificationAllOtherMotion = device.getPropertyValue(PropertyName.DeviceNotificationAllOtherMotion)?.value as boolean;
    device3.notificationCrying = device.getPropertyValue(PropertyName.DeviceNotificationCrying)?.value as boolean;
    device3.notificationAllSound = device.getPropertyValue(PropertyName.DeviceNotificationAllSound)?.value as boolean;
    device3.notificationIntervalTime = device.getPropertyValue(PropertyName.DeviceNotificationIntervalTime)?.value as boolean;
    device3.notificationRing = device.getPropertyValue(PropertyName.DeviceNotificationRing)?.value as boolean;
    device3.notificationMotion = device.getPropertyValue(PropertyName.DeviceNotificationMotion)?.value as boolean;
    if (schemaVersion === 3) {
        device3.motionDetectionSensivity = device.getPropertyValue(PropertyName.DeviceMotionDetectionSensitivity)?.value as number;
        device3.soundDetectionSensivity = device.getPropertyValue(PropertyName.DeviceSoundDetectionSensitivity)?.value as number;
        return device3;
    }

    // All schemas >= 4
    const device4 = device3 as DeviceStateSchema4;
    device4.chirpVolume = device.getPropertyValue(PropertyName.DeviceChirpVolume)?.value as number;
    device4.chirpTone = device.getPropertyValue(PropertyName.DeviceChirpTone)?.value as number;
    device4.motionDetectionSensitivity = device.getPropertyValue(PropertyName.DeviceMotionDetectionSensitivity)?.value as number;
    device4.soundDetectionSensitivity = device.getPropertyValue(PropertyName.DeviceSoundDetectionSensitivity)?.value as number;
    device4.videoHdr = device.getPropertyValue(PropertyName.DeviceVideoHDR)?.value as boolean;
    device4.videoDistortionCorrection = device.getPropertyValue(PropertyName.DeviceVideoDistortionCorrection)?.value as boolean;
    device4.videoRingRecord = device.getPropertyValue(PropertyName.DeviceVideoRingRecord)?.value as number;
    device4.statusLed = device.getPropertyValue(PropertyName.DeviceStatusLed)?.value as boolean;
    device4.rtspStreamUrl = device.getPropertyValue(PropertyName.DeviceRTSPStreamUrl)?.value as string;
    device4.chargingStatus = device.getPropertyValue(PropertyName.DeviceChargingStatus)?.value as number;
    device4.wifiSignalLevel = device.getPropertyValue(PropertyName.DeviceWifiSignalLevel)?.value as number;

    return device4;
    
};