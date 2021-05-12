import { Device, PropertyName } from "eufy-security-client"

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

export type DeviceState = 
  | DeviceStateSchema0;

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
        ledStatus: device.getPropertyValue(PropertyName.DeviceStatusLed)?.value as boolean,
        motionDetection: device.getPropertyValue(PropertyName.DeviceMotionDetection)?.value as boolean,
        soundDetection: device.getPropertyValue(PropertyName.DeviceSoundDetection)?.value as boolean,
        petDetection: device.getPropertyValue(PropertyName.DevicePetDetection)?.value as boolean,
        rtspStream: device.getPropertyValue(PropertyName.DeviceRTSPStream)?.value as boolean,
        watermark: device.getPropertyValue(PropertyName.DeviceWatermark)?.value as number,
        lockStatus: device.getPropertyValue(PropertyName.DeviceLockStatus)?.value as number,
        motionSensorPIREvent: device.getPropertyValue(PropertyName.DeviceMotionSensorPIREvent)?.value as number,
        wifiRSSI: device.getPropertyValue(PropertyName.DeviceWifiRSSI)?.value as number,
        pictureUrl: device.getPropertyValue(PropertyName.DevicePictureUrl)?.value as string,
    };

    return base as DeviceStateSchema0;
};