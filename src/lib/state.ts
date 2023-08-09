import { EufySecurity } from "eufy-security-client";

import { DeviceState, dumpDevice } from "./device/state";
import { DriverState, dumpDriver } from "./driver/state"
import { dumpStation, StationState } from "./station/state";

export type Modify<T, R> = Omit<T, keyof R> & R;

export interface EufySecurityStateSchema0 {
    driver: DriverState,
    stations: Array<StationState>,
    devices: Array<DeviceState>,
}

type EufySecurityStateSchema1 = Modify<Omit<
EufySecurityStateSchema0, "stations" | "devices">,
{
    stations: Array<string>,
    devices: Array<string>,
}>;

export type EufySecurityState = 
 | EufySecurityStateSchema0
 | EufySecurityStateSchema1;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const dumpState = async (driver: EufySecurity, schemaVersion: number): Promise<EufySecurityState> => {
    const base: Partial<EufySecurityStateSchema0> = {
        driver: dumpDriver(driver, schemaVersion),
        stations: driver.isConnected() ? Array.from(await driver.getStations(), (station) =>
            dumpStation(station, schemaVersion)
        ) : [],
        devices: driver.isConnected() ? Array.from(await driver.getDevices(), (device) =>
            dumpDevice(device, schemaVersion)
        ) : [],
    };

    if (schemaVersion < 13)
        return base as EufySecurityStateSchema0;
    
    const base1 = base as unknown as EufySecurityStateSchema1;
    base1.stations = driver.isConnected() ? Array.from(await driver.getStations(), (station) =>
        station.getSerial()
    ) : [];
    base1.devices = driver.isConnected() ? Array.from(await driver.getDevices(), (device) =>
        device.getSerial()
    ) : [];

    return base1;
};