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

export type StationState = 
 | StationStateSchema0
 | StationStateSchema1;

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

    // All schemas >= 1
    const station1 = base as StationStateSchema1;
    station1.type = station.getPropertyValue(PropertyName.Type).value as number;

    return station1;
};