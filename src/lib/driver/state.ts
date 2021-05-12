import { EufySecurity } from "eufy-security-client";

export interface DriverStateSchema0 {
    version: string;
    connected: boolean;
    pushConnected: boolean;
    //TODO: Finish implementation

}

export type DriverState = 
  | DriverStateSchema0;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const dumpDriver = (driver: EufySecurity, schemaVersion: number): DriverState => {
    const base: Partial<DriverStateSchema0> = {
        version: driver.getVersion(),
        connected: driver.isConnected(),
        pushConnected: driver.isPushConnected(),
        //TODO: Finish Implementation
    };

    return base as DriverStateSchema0;
};