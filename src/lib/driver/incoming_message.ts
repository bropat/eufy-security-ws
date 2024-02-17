import { EventFilterType } from "eufy-security-client";

import { DriverCommand } from "./command.js";
import { IncomingCommandBase } from "../incoming_message_base.js";
import { LogLevelName } from "../logging.js";

export interface IncomingCommandSetVerifyCode extends IncomingCommandBase {
    command: DriverCommand.setVerifyCode;
    verifyCode: string;
}

export interface IncomingCommandSetCaptcha extends IncomingCommandBase {
    command: DriverCommand.setCaptcha;
    captchaId?: string;
    captcha: string;
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

export interface IncomingCommandSetLogLevel extends IncomingCommandBase {
    command: DriverCommand.setLogLevel;
    level: LogLevelName;
}

export interface IncomingCommandGetLogLevel extends IncomingCommandBase {
    command: DriverCommand.getLogLevel;
}

export interface IncomingCommandStartListeningLogs extends IncomingCommandBase {
    command: DriverCommand.startListeningLogs;
}
  
export interface IncomingCommandStopListeningLogs extends IncomingCommandBase {
    command: DriverCommand.stopListeningLogs;
}

export interface IncomingCommandIsMqttConnected extends IncomingCommandBase {
    command: DriverCommand.isMqttConnected;
}

export type IncomingMessageDriver =
    | IncomingCommandSetVerifyCode
    | IncomingCommandSetCaptcha
    | IncomingCommandPollRefresh
    | IncomingCommandIsConnected
    | IncomingCommandIsPushConnected
    | IncomingCommandConnect
    | IncomingCommandDisconnect
    | IncomingCommandGetVideoEvents
    | IncomingCommandGetAlarmEvents
    | IncomingCommandGetHistoryEvents
    | IncomingCommandSetLogLevel
    | IncomingCommandGetLogLevel
    | IncomingCommandStartListeningLogs
    | IncomingCommandStopListeningLogs
    | IncomingCommandIsMqttConnected;