import { DriverCommand } from "./command";
import { IncomingCommandBase } from "../incoming_message_base";
import { EventFilterType } from "eufy-security-client";

export interface IncomingCommandSetVerifyCode extends IncomingCommandBase {
    command: DriverCommand.setVerifyCode;
    verifyCode: string;
}

export interface IncomingCommandPollRefresh extends IncomingCommandBase {
    command: DriverCommand.pollRefresh;
}

export interface IncomingCommandIsConnected extends IncomingCommandBase {
    command: DriverCommand.isConnected | DriverCommand.isConnectedLegacy;
}

export interface IncomingCommandIsPushConnected extends IncomingCommandBase {
    command: DriverCommand.isPushConnected | DriverCommand.isPushConnectedLegacy;
}

export interface IncomingCommandConnect extends IncomingCommandBase {
    command: DriverCommand.connect;
}

export interface IncomingCommandDisconnect extends IncomingCommandBase {
    command: DriverCommand.disconnect;
}

export interface IncomingCommandGetVideoEvents extends IncomingCommandBase {
    command: DriverCommand.getVideoEvents;
    startTimestampMs?: number;
    endTimestampMs?: number;
    filter?: EventFilterType;
    maxResults?: number;
}

export interface IncomingCommandGetAlarmEvents extends IncomingCommandBase {
    command: DriverCommand.getAlarmEvents;
    startTimestampMs?: number;
    endTimestampMs?: number;
    filter?: EventFilterType;
    maxResults?: number;
}

export interface IncomingCommandGetHistoryEvents extends IncomingCommandBase {
    command: DriverCommand.getHistoryEvents;
    startTimestampMs?: number;
    endTimestampMs?: number;
    filter?: EventFilterType;
    maxResults?: number;
}

export type IncomingMessageDriver =
    | IncomingCommandSetVerifyCode
    | IncomingCommandPollRefresh
    | IncomingCommandIsConnected
    | IncomingCommandIsPushConnected
    | IncomingCommandConnect
    | IncomingCommandDisconnect
    | IncomingCommandGetVideoEvents
    | IncomingCommandGetAlarmEvents
    | IncomingCommandGetHistoryEvents;