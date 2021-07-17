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
    command: StationCommand.isConnected;
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

export interface IncomingCommandDeviceGetProperties extends IncomingCommandStationBase {
    command: StationCommand.getProperties;
}

export interface IncomingCommandDeviceSetProperty extends IncomingCommandStationBase {
    command: StationCommand.setProperty;
    name: string;
    value: unknown;
}

export interface IncomingCommandDeviceTriggerAlarm extends IncomingCommandStationBase {
    command: StationCommand.triggerAlarm;
    seconds: number;
}

export interface IncomingCommandDeviceResetAlarm extends IncomingCommandStationBase {
    command: StationCommand.resetAlarm;
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
  | IncomingCommandDeviceGetProperties
  | IncomingCommandDeviceSetProperty
  | IncomingCommandDeviceTriggerAlarm
  | IncomingCommandDeviceResetAlarm;
/*  | IncomingCommandGetCameraInfo
  | IncomingCommandGetStorageInfo;*/