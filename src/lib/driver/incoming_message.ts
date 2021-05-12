import { DriverCommand } from "./command";
import { IncomingCommandBase } from "../incoming_message_base";

export interface IncomingCommandSetVerifyCode extends IncomingCommandBase {
    command: DriverCommand.setVerifyCode;
    verifyCode: string;
}

export interface IncomingCommandPollRefresh extends IncomingCommandBase {
    command: DriverCommand.pollRefresh;
}

export interface IncomingCommandIsConnected extends IncomingCommandBase {
    command: DriverCommand.isConnected;
}

export interface IncomingCommandIsPushConnected extends IncomingCommandBase {
    command: DriverCommand.isPushConnected;
}

export interface IncomingCommandConnect extends IncomingCommandBase {
    command: DriverCommand.connect;
}

export interface IncomingCommandDisconnect extends IncomingCommandBase {
    command: DriverCommand.disconnect;
}

export type IncomingMessageDriver =
    | IncomingCommandSetVerifyCode
    | IncomingCommandPollRefresh
    | IncomingCommandIsConnected
    | IncomingCommandIsPushConnected
    | IncomingCommandConnect
    | IncomingCommandDisconnect;