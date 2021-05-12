import { PropertyName, Station } from "eufy-security-client"

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

export type StationState = 
 | StationStateSchema0;

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

    return base as StationStateSchema0;
};