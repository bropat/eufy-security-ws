import { DriverCommand } from "./command";

export interface DriverResultTypes {
    [DriverCommand.setVerifyCode]: { result: boolean };
    [DriverCommand.pollRefresh]: Record<string, never>;
    [DriverCommand.isConnected]: { connected: boolean };
    [DriverCommand.isPushConnected]: { connected: boolean };
    [DriverCommand.connect]: { result: boolean };
    [DriverCommand.disconnect]: Record<string, never>;
}
