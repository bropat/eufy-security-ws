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
{ type: DeviceType }
>;

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

export type StationState = 
 | StationStateSchema0
 | StationStateSchema1
 | StationStateSchema3;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const dumpStation = (station: Station, schemaVersion: number): StationState => {
    const base: Partial<StationStateSchema0> = {
        name: station.getPropertyValue(PropertyName.Name)?.value as string,
        model: station.getPropertyValue(PropertyName.Model)?.value as string,
        serialNumber: station.getPropertyValue(PropertyName.SerialNumber)?.value as string,
        hardwareVersion: station.getPropertyValue(PropertyName.HardwareVersion)?.value as string,
        softwareVersion: station.getPropertyValue(PropertyName.SoftwareVersion)?.value as string,
        lanIpAddress: station.getPropertyValue(PropertyName.StationLANIpAddress)?.value as string,
        macAddress: station.getPropertyValue(PropertyName.StationMacAddress)?.value as string,
        currentMode: station.getPropertyValue(PropertyName.StationCurrentMode)?.value as number,
        guardMode: station.getPropertyValue(PropertyName.StationGuardMode)?.value as number,
        connected: station.isConnected(),
    };

    if (schemaVersion == 0) {
        return base as StationStateSchema0;
    }

    if (schemaVersion <= 2) {
        const station1 = base as StationStateSchema1;
        station1.type = station.getPropertyValue(PropertyName.Type).value as number;
        return station1;
    }
    
    // All schemas >= 3
    const station3 = base as StationStateSchema3;
    station3.timeFormat = station.getPropertyValue(PropertyName.StationTimeFormat)?.value as number;
    station3.alarmVolume = station.getPropertyValue(PropertyName.StationAlarmVolume)?.value as number;
    station3.alarmTone = station.getPropertyValue(PropertyName.StationAlarmTone)?.value as number;
    station3.promptVolume = station.getPropertyValue(PropertyName.StationPromptVolume)?.value as number;
    station3.notificationSwitchModeSchedule = station.getPropertyValue(PropertyName.StationNotificationSwitchModeSchedule)?.value as boolean;
    station3.notificationSwitchModeGeofence = station.getPropertyValue(PropertyName.StationNotificationSwitchModeGeofence)?.value as boolean;
    station3.notificationSwitchModeApp = station.getPropertyValue(PropertyName.StationNotificationSwitchModeApp)?.value as boolean;
    station3.notificationSwitchModeKeypad = station.getPropertyValue(PropertyName.StationNotificationSwitchModeKeypad)?.value as boolean;
    station3.notificationStartAlarmDelay = station.getPropertyValue(PropertyName.StationNotificationStartAlarmDelay)?.value as boolean;

    return station3;
};