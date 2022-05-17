import { DeviceType, PropertyName, Station } from "eufy-security-client"

import { Modify } from "../state";

export interface StationStateSchema0 {
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
}

type StationStateSchema1 = Modify<
StationStateSchema0,
{
    type: DeviceType 
}>;

type StationStateSchema3 = Modify<
StationStateSchema1,
{
    timeFormat?: number;
    alarmVolume?: number;
    alarmTone?: number;
    promptVolume?: number;
    notificationSwitchModeSchedule?: boolean;
    notificationSwitchModeGeofence?: boolean;
    notificationSwitchModeApp?: boolean;
    notificationSwitchModeKeypad?: boolean;
    notificationStartAlarmDelay?: boolean;
}>;

type StationStateSchema5 = Modify<
StationStateSchema3,
{
    switchModeWithAccessCode?: boolean;
    autoEndAlarm?: boolean;
    turnOffAlarmWithButton?: boolean;
}>;

export type StationState = 
 | StationStateSchema0
 | StationStateSchema1
 | StationStateSchema3
 | StationStateSchema5;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const dumpStation = (station: Station, schemaVersion: number): StationState => {
    const base: Partial<StationStateSchema0> = {
        name: station.getPropertyValue(PropertyName.Name) as string,
        model: station.getPropertyValue(PropertyName.Model) as string,
        serialNumber: station.getPropertyValue(PropertyName.SerialNumber) as string,
        hardwareVersion: station.getPropertyValue(PropertyName.HardwareVersion) as string,
        softwareVersion: station.getPropertyValue(PropertyName.SoftwareVersion) as string,
        lanIpAddress: station.getPropertyValue(PropertyName.StationLANIpAddress) as string,
        macAddress: station.getPropertyValue(PropertyName.StationMacAddress) as string,
        currentMode: station.getPropertyValue(PropertyName.StationCurrentMode) as number,
        guardMode: station.getPropertyValue(PropertyName.StationGuardMode) as number,
        connected: station.isConnected(),
    };

    if (schemaVersion == 0) {
        return base as StationStateSchema0;
    }

    const station1 = base as StationStateSchema1;
    station1.type = station.getPropertyValue(PropertyName.Type) as number;
    if (schemaVersion <= 2) {
        return station1;
    }
    
    const station3 = station1 as StationStateSchema3;
    station3.timeFormat = station.getPropertyValue(PropertyName.StationTimeFormat) as number;
    station3.alarmVolume = station.getPropertyValue(PropertyName.StationAlarmVolume) as number;
    station3.alarmTone = station.getPropertyValue(PropertyName.StationAlarmTone) as number;
    station3.promptVolume = station.getPropertyValue(PropertyName.StationPromptVolume) as number;
    station3.notificationSwitchModeSchedule = station.getPropertyValue(PropertyName.StationNotificationSwitchModeSchedule) as boolean;
    station3.notificationSwitchModeGeofence = station.getPropertyValue(PropertyName.StationNotificationSwitchModeGeofence) as boolean;
    station3.notificationSwitchModeApp = station.getPropertyValue(PropertyName.StationNotificationSwitchModeApp) as boolean;
    station3.notificationSwitchModeKeypad = station.getPropertyValue(PropertyName.StationNotificationSwitchModeKeypad) as boolean;
    station3.notificationStartAlarmDelay = station.getPropertyValue(PropertyName.StationNotificationStartAlarmDelay) as boolean;
    if (schemaVersion <= 4) {
        return station3;
    }

    // All schemas >= 5
    const station5 = station3 as StationStateSchema5;
    station5.switchModeWithAccessCode = station.getPropertyValue(PropertyName.StationSwitchModeWithAccessCode) as boolean;
    station5.autoEndAlarm = station.getPropertyValue(PropertyName.StationAutoEndAlarm) as boolean;
    station5.turnOffAlarmWithButton = station.getPropertyValue(PropertyName.StationTurnOffAlarmWithButton) as boolean;

    return station5;
};