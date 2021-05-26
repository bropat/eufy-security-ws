import { EufySecurity } from "eufy-security-client";
import { DeviceState, dumpDevice } from "./device/state";
import { DriverState } from "./driver/state"
import { dumpStation, StationState } from "./station/state";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type Modify<T, R> = Omit<T, keyof R> & R;

//TODO: Finish Implementation
export interface EufySecurityStateSchema0 {
    driver: DriverState,
    stations: Array<StationState>,
    devices: Array<DeviceState>,
}

export type EufySecurityState = 
 | EufySecurityStateSchema0;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const dumpState = (driver: EufySecurity, schemaVersion: number): EufySecurityState => {
    const base: Partial<EufySecurityStateSchema0> = {
        driver: {
            version: driver.getVersion(),
            connected: driver.isConnected(),
            pushConnected: driver.isPushConnected(),
        },
        stations: Array.from(driver.getStations(), (station) =>
            dumpStation(station, schemaVersion)
        ),
        devices: Array.from(driver.getDevices(), (device) =>
            dumpDevice(device, schemaVersion)
        ),
    };

    return base as EufySecurityStateSchema0;
};