import { CommandName, PropertyName } from "eufy-security-client";

import { IncomingCommandBase } from "../incoming_message_base";
import { StationCommand } from "./command";

export interface IncomingCommandStationBase extends IncomingCommandBase {
    serialNumber: string;
}

export interface IncomingCommandStationReboot extends IncomingCommandStationBase {
    command: StationCommand.reboot;
}

export interface IncomingCommandSetGuardMode extends IncomingCommandStationBase {
    command: StationCommand.setGuardMode;
    mode: number;
}

export interface IncomingCommandIsConnected extends IncomingCommandStationBase {
    command: StationCommand.isConnected | StationCommand.isConnectedLegacy;
}

export interface IncomingCommandConnect extends IncomingCommandStationBase {
    command: StationCommand.connect;
}

export interface IncomingCommandDisconnect extends IncomingCommandStationBase {
    command: StationCommand.disconnect;
}

export interface IncomingCommandGetPropertiesMetadata extends IncomingCommandStationBase {
    command: StationCommand.getPropertiesMetadata;
}

export interface IncomingCommandGetProperties extends IncomingCommandStationBase {
    command: StationCommand.getProperties;
}

export interface IncomingCommandSetProperty extends IncomingCommandStationBase {
    command: StationCommand.setProperty;
    name: string;
    value: unknown;
}

export interface IncomingCommandTriggerAlarm extends IncomingCommandStationBase {
    command: StationCommand.triggerAlarm;
    seconds: number;
}

export interface IncomingCommandResetAlarm extends IncomingCommandStationBase {
    command: StationCommand.resetAlarm;
}

export interface IncomingCommandHasProperty extends IncomingCommandStationBase {
    command: StationCommand.hasProperty;
    propertyName: PropertyName;
}

export interface IncomingCommandHasCommand extends IncomingCommandStationBase {
    command: StationCommand.hasCommand;
    commandName: CommandName;
}

export interface IncomingCommandGetCommands extends IncomingCommandStationBase {
    command: StationCommand.getCommands;
}

export interface IncomingCommandChime extends IncomingCommandStationBase {
    command: StationCommand.chime;
    ringtone?: number;
}

/*export interface IncomingCommandGetCameraInfo extends IncomingCommandStationBase {
    command: StationCommand.getCameraInfo;
}

export interface IncomingCommandGetStorageInfo extends IncomingCommandStationBase {
    command: StationCommand.getStorageInfo;
}*/

export type IncomingMessageStation =
  | IncomingCommandStationReboot
  | IncomingCommandSetGuardMode
  | IncomingCommandIsConnected
  | IncomingCommandConnect
  | IncomingCommandDisconnect
  | IncomingCommandGetPropertiesMetadata
  | IncomingCommandGetProperties
  | IncomingCommandSetProperty
  | IncomingCommandTriggerAlarm
  | IncomingCommandResetAlarm
  | IncomingCommandHasProperty
  | IncomingCommandHasCommand
  | IncomingCommandGetCommands
  | IncomingCommandChime;
/*  | IncomingCommandGetCameraInfo
  | IncomingCommandGetStorageInfo;*/