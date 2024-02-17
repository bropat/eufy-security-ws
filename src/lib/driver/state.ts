import { EufySecurity } from "eufy-security-client";

import { Modify } from "../state.js";

export interface DriverStateSchema0 {
    version: string;
    connected: boolean;
    pushConnected: boolean;
}

type DriverStateSchema1 = Modify<
DriverStateSchema0,
{ mqttConnected: boolean }
>;


export type DriverState = 
  | DriverStateSchema0
  | DriverStateSchema1;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const dumpDriver = (driver: EufySecurity, schemaVersion: number): DriverState => {
    const base: Partial<DriverStateSchema0> = {
        version: driver.getVersion(),
        connected: driver.isConnected(),
        pushConnected: driver.isPushConnected(),
    };

    if (schemaVersion <= 8) {
        return base as DriverStateSchema0;
    }

    // All schemas >= 9
    const driver1 = base as DriverStateSchema1;
    driver1.mqttConnected = driver.isMQTTConnected();

    return driver1;
};