import { Station, IndexedProperty, PropertyName } from "eufy-security-client"
import { Modify } from "../state";

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

export type StationProperties = 
  | StationPropertiesSchema0
  | StationPropertiesSchema1;

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

    // All schemas >= 14
    const stationProperties1 = base as StationPropertiesSchema1;
    stationProperties1.alarm = station.getPropertyValue(PropertyName.StationAlarm) as boolean;
    stationProperties1.alarmType = station.getPropertyValue(PropertyName.StationAlarmType) as number;
    stationProperties1.alarmArmed = station.getPropertyValue(PropertyName.StationAlarmArmed) as boolean;
    stationProperties1.alarmArmDelay = station.getPropertyValue(PropertyName.StationAlarmArmDelay) as number;
    stationProperties1.alarmDelay = station.getPropertyValue(PropertyName.StationAlarmDelay) as number;
    stationProperties1.alarmDelayType = station.getPropertyValue(PropertyName.StationAlarmDelayType) as number;

    return stationProperties1;
}

export const dumpStationPropertiesMetadata = (station: Station, schemaVersion: number): IndexedProperty => {
    const properties = dumpStationProperties(station, schemaVersion);
    const metadata = station.getPropertiesMetadata();

    const result: IndexedProperty = {};

    Object.keys(metadata).forEach((property) => {
        if (Object.keys(properties).includes(property))
            result[property] = metadata[property];
    });

    return result;
}