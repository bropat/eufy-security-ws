import { Station, IndexedProperty, PropertyName } from "eufy-security-client"

import { Modify } from "../state.js";

export interface StationPropertiesSchema0 {
    name: string;
    model: string;
    serialNumber: string;
    hardwareVersion: string;
    softwareVersion: string;
    type: number;
    lanIpAddress: string;
    macAddress: string;
    guardMode: number;
    currentMode: number;
    timeFormat: number;
    alarmVolume: number;
    alarmTone: number;
    promptVolume: number;
    notificationSwitchModeSchedule: boolean;
    notificationSwitchModeGeofence: boolean;
    notificationSwitchModeApp: boolean;
    notificationSwitchModeKeypad: boolean;
    notificationStartAlarmDelay: boolean;
    switchModeWithAccessCode: boolean;
    autoEndAlarm: boolean;
    turnOffAlarmWithButton: boolean;
    stationHomeSecuritySettings: string;
    stationAwaySecuritySettings: string;
    stationCustom1SecuritySettings: string;
    stationCustom2SecuritySettings: string;
    stationCustom3SecuritySettings: string;
    stationOffSecuritySettings: string;
}

type StationPropertiesSchema1 = Modify<
StationPropertiesSchema0,
{
    alarm?: boolean;
    alarmType?: number;
    alarmArmed?: boolean;
    alarmArmDelay?: number;
    alarmDelay?: number;
    alarmDelayType?: number;
}>;

type StationPropertiesSchema2 = Modify<
StationPropertiesSchema1,
{
    storageInfoEmmc: object;
    storageInfoHdd: object;
    crossCameraTracking: boolean;
    continuousTrackingTime: number;
    trackingAssistance: boolean;
    crossTrackingCameraList: object;
    crossTrackingGroupList: object;
}>;

export type StationProperties = 
  | StationPropertiesSchema0
  | StationPropertiesSchema1
  | StationPropertiesSchema2;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const dumpStationProperties = (station: Station, schemaVersion: number): StationProperties => {
    const base: StationPropertiesSchema0 = {
        name: station.getPropertyValue(PropertyName.Name) as string,
        model: station.getPropertyValue(PropertyName.Model) as string,
        serialNumber: station.getPropertyValue(PropertyName.SerialNumber) as string,
        hardwareVersion: station.getPropertyValue(PropertyName.HardwareVersion) as string,
        softwareVersion: station.getPropertyValue(PropertyName.SoftwareVersion) as string,
        type: station.getPropertyValue(PropertyName.Type) as number,
        lanIpAddress: station.getPropertyValue(PropertyName.StationLANIpAddress) as string,
        macAddress: station.getPropertyValue(PropertyName.StationMacAddress) as string,
        guardMode: station.getPropertyValue(PropertyName.StationGuardMode) as number,
        currentMode: station.getPropertyValue(PropertyName.StationCurrentMode) as number,
        timeFormat: station.getPropertyValue(PropertyName.StationTimeFormat) as number,
        alarmVolume: station.getPropertyValue(PropertyName.StationAlarmVolume) as number,
        alarmTone: station.getPropertyValue(PropertyName.StationAlarmTone) as number,
        promptVolume: station.getPropertyValue(PropertyName.StationPromptVolume) as number,
        notificationSwitchModeSchedule: station.getPropertyValue(PropertyName.StationNotificationSwitchModeSchedule) as boolean,
        notificationSwitchModeGeofence: station.getPropertyValue(PropertyName.StationNotificationSwitchModeGeofence) as boolean,
        notificationSwitchModeApp: station.getPropertyValue(PropertyName.StationNotificationSwitchModeApp) as boolean,
        notificationSwitchModeKeypad: station.getPropertyValue(PropertyName.StationNotificationSwitchModeKeypad) as boolean,
        notificationStartAlarmDelay: station.getPropertyValue(PropertyName.StationNotificationStartAlarmDelay) as boolean,
        switchModeWithAccessCode: station.getPropertyValue(PropertyName.StationSwitchModeWithAccessCode) as boolean,
        autoEndAlarm: station.getPropertyValue(PropertyName.StationAutoEndAlarm) as boolean,
        turnOffAlarmWithButton: station.getPropertyValue(PropertyName.StationTurnOffAlarmWithButton) as boolean,
        stationHomeSecuritySettings: station.getPropertyValue(PropertyName.StationHomeSecuritySettings) as string,
        stationAwaySecuritySettings: station.getPropertyValue(PropertyName.StationAwaySecuritySettings) as string,
        stationCustom1SecuritySettings: station.getPropertyValue(PropertyName.StationCustom1SecuritySettings) as string,
        stationCustom2SecuritySettings: station.getPropertyValue(PropertyName.StationCustom2SecuritySettings) as string,
        stationCustom3SecuritySettings: station.getPropertyValue(PropertyName.StationCustom3SecuritySettings) as string,
        stationOffSecuritySettings: station.getPropertyValue(PropertyName.StationOffSecuritySettings) as string,
    }

    if (schemaVersion <= 13) {
        return base;
    }

    const stationProperties1 = base as StationPropertiesSchema1;
    stationProperties1.alarm = station.getPropertyValue(PropertyName.StationAlarm) as boolean;
    stationProperties1.alarmType = station.getPropertyValue(PropertyName.StationAlarmType) as number;
    stationProperties1.alarmArmed = station.getPropertyValue(PropertyName.StationAlarmArmed) as boolean;
    stationProperties1.alarmArmDelay = station.getPropertyValue(PropertyName.StationAlarmArmDelay) as number;
    stationProperties1.alarmDelay = station.getPropertyValue(PropertyName.StationAlarmDelay) as number;
    stationProperties1.alarmDelayType = station.getPropertyValue(PropertyName.StationAlarmDelayType) as number;

    if (schemaVersion <= 20) {
        return stationProperties1;
    }

    // All schemas >= 21
    const stationProperties2 = base as StationPropertiesSchema2;
    stationProperties2.storageInfoEmmc = station.getPropertyValue(PropertyName.StationStorageInfoEmmc) as object;
    stationProperties2.storageInfoHdd = station.getPropertyValue(PropertyName.StationStorageInfoHdd) as object;
    stationProperties2.crossCameraTracking = station.getPropertyValue(PropertyName.StationCrossCameraTracking) as boolean;
    stationProperties2.continuousTrackingTime = station.getPropertyValue(PropertyName.StationContinuousTrackingTime) as number;
    stationProperties2.trackingAssistance = station.getPropertyValue(PropertyName.StationTrackingAssistance) as boolean;
    stationProperties2.crossTrackingCameraList = station.getPropertyValue(PropertyName.StationCrossTrackingCameraList) as object;
    stationProperties2.crossTrackingGroupList = station.getPropertyValue(PropertyName.StationCrossTrackingGroupList) as object;

    return stationProperties2;
}

export const dumpStationPropertiesMetadata = (station: Station, schemaVersion: number): IndexedProperty => {
    const metadata = station.getPropertiesMetadata(true);
    const result: IndexedProperty = {
        name: metadata[PropertyName.Name],
        model: metadata[PropertyName.Model],
        serialNumber: metadata[PropertyName.SerialNumber],
        hardwareVersion: metadata[PropertyName.HardwareVersion],
        softwareVersion: metadata[PropertyName.SoftwareVersion],
        type: metadata[PropertyName.Type],
        lanIpAddress: metadata[PropertyName.StationLANIpAddress],
        macAddress: metadata[PropertyName.StationMacAddress],
        guardMode: metadata[PropertyName.StationGuardMode],
        currentMode: metadata[PropertyName.StationCurrentMode],
        timeFormat: metadata[PropertyName.StationTimeFormat],
        alarmVolume: metadata[PropertyName.StationAlarmVolume],
        alarmTone: metadata[PropertyName.StationAlarmTone],
        promptVolume: metadata[PropertyName.StationPromptVolume],
        notificationSwitchModeSchedule: metadata[PropertyName.StationNotificationSwitchModeSchedule],
        notificationSwitchModeGeofence: metadata[PropertyName.StationNotificationSwitchModeGeofence],
        notificationSwitchModeApp: metadata[PropertyName.StationNotificationSwitchModeApp],
        notificationSwitchModeKeypad: metadata[PropertyName.StationNotificationSwitchModeKeypad],
        notificationStartAlarmDelay: metadata[PropertyName.StationNotificationStartAlarmDelay],
        switchModeWithAccessCode: metadata[PropertyName.StationSwitchModeWithAccessCode],
        autoEndAlarm: metadata[PropertyName.StationAutoEndAlarm],
        turnOffAlarmWithButton: metadata[PropertyName.StationTurnOffAlarmWithButton],
        homeSecuritySettings: metadata[PropertyName.StationHomeSecuritySettings],
        awaySecuritySettings: metadata[PropertyName.StationAwaySecuritySettings],
        custom1SecuritySettings: metadata[PropertyName.StationCustom1SecuritySettings],
        custom2SecuritySettings: metadata[PropertyName.StationCustom2SecuritySettings],
        custom3SecuritySettings: metadata[PropertyName.StationCustom3SecuritySettings],
        offSecuritySettings: metadata[PropertyName.StationOffSecuritySettings],
    }

    if (schemaVersion <= 13) {
        return result;
    }

    result["alarm"] = metadata[PropertyName.StationAlarm];
    result["alarmType"] = metadata[PropertyName.StationAlarmType];
    result["alarmArmed"] = metadata[PropertyName.StationAlarmArmed];
    result["alarmArmDelay"] = metadata[PropertyName.StationAlarmArmDelay];
    result["alarmDelay"] = metadata[PropertyName.StationAlarmDelay];
    result["alarmDelayType"] = metadata[PropertyName.StationAlarmDelayType];

    if (schemaVersion <= 20) {
        return result;
    }

    // All schemas >= 21
    result["storageInfoEmmc"] = metadata[PropertyName.StationStorageInfoEmmc];
    result["storageInfoHdd"] = metadata[PropertyName.StationStorageInfoHdd];
    result["crossCameraTracking"] = metadata[PropertyName.StationCrossCameraTracking];
    result["continuousTrackingTime"] = metadata[PropertyName.StationContinuousTrackingTime];
    result["trackingAssistance"] = metadata[PropertyName.StationTrackingAssistance];
    result["crossTrackingCameraList"] = metadata[PropertyName.StationCrossTrackingCameraList];
    result["crossTrackingGroupList"] = metadata[PropertyName.StationCrossTrackingGroupList];

    return result;
}