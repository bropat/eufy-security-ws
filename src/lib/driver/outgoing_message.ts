import { EventRecordResponse } from "eufy-security-client";
import { DriverCommand } from "./command";

export interface DriverResultTypes {
    [DriverCommand.setVerifyCode]: { result: boolean };
    [DriverCommand.setCaptcha]: { result: boolean };
    [DriverCommand.pollRefresh]: Record<string, never>;
    [DriverCommand.isConnected]: { connected: boolean };
    [DriverCommand.isPushConnected]: { connected: boolean };
    [DriverCommand.connect]: { result: boolean };
    [DriverCommand.disconnect]: Record<string, never>;
    [DriverCommand.getVideoEvents]: { events: Array<EventRecordResponse> };
    [DriverCommand.getAlarmEvents]: { events: Array<EventRecordResponse> };
    [DriverCommand.getHistoryEvents]: { events: Array<EventRecordResponse> };

    //Legacy
    [DriverCommand.isConnectedLegacy]: { connected: boolean };
    [DriverCommand.isPushConnectedLegacy]: { connected: boolean };
}
