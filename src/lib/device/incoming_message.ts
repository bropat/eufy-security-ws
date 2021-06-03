import { IncomingCommandBase } from "../incoming_message_base";
import { DeviceCommand } from "./command";

export interface IncomingCommandDeviceBase extends IncomingCommandBase {
    serialNumber: string;
}

export interface IncomingCommandDeviceSetStatusLed extends IncomingCommandDeviceBase {
    command: DeviceCommand.setStatusLed;
    value: boolean;
}

export interface IncomingCommandDeviceSetAutoNightVision extends IncomingCommandDeviceBase {
    command: DeviceCommand.setAutoNightVision;
    value: boolean;
}

export interface IncomingCommandDeviceSetMotionDetection extends IncomingCommandDeviceBase {
    command: DeviceCommand.setMotionDetection;
    value: boolean;
}

export interface IncomingCommandDeviceSetSoundDetection extends IncomingCommandDeviceBase {
    command: DeviceCommand.setSoundDetection;
    value: boolean;
}

export interface IncomingCommandDeviceSetPetDetection extends IncomingCommandDeviceBase {
    command: DeviceCommand.setPetDetection;
    value: boolean;
}

export interface IncomingCommandDeviceSetRTSPStream extends IncomingCommandDeviceBase {
    command: DeviceCommand.setRTSPStream;
    value: boolean;
}

export interface IncomingCommandDeviceSetAntiTheftDetection extends IncomingCommandDeviceBase {
    command: DeviceCommand.setAntiTheftDetection;
    value: boolean;
}

export interface IncomingCommandDeviceSetWatermark extends IncomingCommandDeviceBase {
    command: DeviceCommand.setWatermark;
    value: number;
}

export interface IncomingCommandDeviceEnableDevice extends IncomingCommandDeviceBase {
    command: DeviceCommand.enableDevice;
    value: boolean;
}

export interface IncomingCommandDeviceLockDevice extends IncomingCommandDeviceBase {
    command: DeviceCommand.lockDevice;
    value: boolean;
}

export interface IncomingCommandDeviceGetPropertiesMetadata extends IncomingCommandDeviceBase {
    command: DeviceCommand.getPropertiesMetadata;
}

export interface IncomingCommandDeviceGetProperties extends IncomingCommandDeviceBase {
    command: DeviceCommand.getProperties;
}

export interface IncomingCommandDeviceSetProperty extends IncomingCommandDeviceBase {
    command: DeviceCommand.setProperty;
    name: string;
    value: unknown;
}

export interface IncomingCommandDeviceStartLivestream extends IncomingCommandDeviceBase {
    command: DeviceCommand.startLivestream;
}

export interface IncomingCommandDeviceStopLivestream extends IncomingCommandDeviceBase {
    command: DeviceCommand.stopLivestream;
}

export interface IncomingCommandDeviceIsLiveStreaming extends IncomingCommandDeviceBase {
    command: DeviceCommand.isLiveStreaming;
}

export type IncomingMessageDevice =
  | IncomingCommandDeviceSetStatusLed
  | IncomingCommandDeviceSetAutoNightVision
  | IncomingCommandDeviceSetMotionDetection
  | IncomingCommandDeviceSetSoundDetection
  | IncomingCommandDeviceSetPetDetection
  | IncomingCommandDeviceSetRTSPStream
  | IncomingCommandDeviceSetAntiTheftDetection
  | IncomingCommandDeviceSetWatermark
  | IncomingCommandDeviceEnableDevice
  | IncomingCommandDeviceLockDevice
  | IncomingCommandDeviceGetPropertiesMetadata
  | IncomingCommandDeviceGetProperties
  | IncomingCommandDeviceSetProperty
  | IncomingCommandDeviceStartLivestream
  | IncomingCommandDeviceStopLivestream
  | IncomingCommandDeviceIsLiveStreaming;
