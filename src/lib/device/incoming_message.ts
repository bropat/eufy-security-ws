import { CommandName, PropertyName } from "eufy-security-client";
import { PanTiltDirection } from "eufy-security-client/build/p2p/types";

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

export interface IncomingCommandDeviceTriggerAlarm extends IncomingCommandDeviceBase {
    command: DeviceCommand.triggerAlarm;
    seconds: number;
}

export interface IncomingCommandDeviceResetAlarm extends IncomingCommandDeviceBase {
    command: DeviceCommand.resetAlarm;
}

export interface IncomingCommandDevicePanAndTilt extends IncomingCommandDeviceBase {
    command: DeviceCommand.panAndTilt;
    direction: PanTiltDirection;
}

export interface IncomingCommandDeviceQuickResponse extends IncomingCommandDeviceBase {
    command: DeviceCommand.quickResponse;
    voiceId: number;
}

export interface IncomingCommandDeviceStartDownload extends IncomingCommandDeviceBase {
    command: DeviceCommand.startDownload;
    path: string;
    cipherId: number;
}

export interface IncomingCommandDeviceCancelDownload extends IncomingCommandDeviceBase {
    command: DeviceCommand.cancelDownload;
    voiceId: number;
}

export interface IncomingCommandDeviceGetVoices extends IncomingCommandDeviceBase {
    command: DeviceCommand.getVoices;
}

export interface IncomingCommandDeviceHasProperty extends IncomingCommandDeviceBase {
    command: DeviceCommand.hasProperty;
    propertyName: PropertyName;
}

export interface IncomingCommandDeviceHasCommand extends IncomingCommandDeviceBase {
    command: DeviceCommand.hasCommand;
    commandName: CommandName;
}

export interface IncomingCommandDeviceGetCommands extends IncomingCommandDeviceBase {
    command: DeviceCommand.getCommands;
}

export interface IncomingCommandDeviceStartRTSPLivestream extends IncomingCommandDeviceBase {
    command: DeviceCommand.startRTSPLivestream;
}

export interface IncomingCommandDeviceStopRTSPLivestream extends IncomingCommandDeviceBase {
    command: DeviceCommand.stopRTSPLivestream;
}

export interface IncomingCommandDeviceIsRTSPLiveStreaming extends IncomingCommandDeviceBase {
    command: DeviceCommand.isRTSPLiveStreaming;
}

export interface IncomingCommandDeviceCalibrateLock extends IncomingCommandDeviceBase {
    command: DeviceCommand.calibrateLock;
}

export interface IncomingCommandDeviceCalibrate extends IncomingCommandDeviceBase {
    command: DeviceCommand.calibrate;
}

export interface IncomingCommandDeviceSetDefaultAngle extends IncomingCommandDeviceBase {
    command: DeviceCommand.setDefaultAngle;
}

export interface IncomingCommandDeviceSetPrivacyAngle extends IncomingCommandDeviceBase {
    command: DeviceCommand.setPrivacyAngle;
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
  | IncomingCommandDeviceIsLiveStreaming
  | IncomingCommandDeviceTriggerAlarm
  | IncomingCommandDeviceResetAlarm
  | IncomingCommandDevicePanAndTilt
  | IncomingCommandDeviceQuickResponse
  | IncomingCommandDeviceStartDownload
  | IncomingCommandDeviceCancelDownload
  | IncomingCommandDeviceGetVoices
  | IncomingCommandDeviceHasProperty
  | IncomingCommandDeviceHasCommand
  | IncomingCommandDeviceGetCommands
  | IncomingCommandDeviceStartRTSPLivestream
  | IncomingCommandDeviceStopRTSPLivestream
  | IncomingCommandDeviceIsRTSPLiveStreaming
  | IncomingCommandDeviceCalibrateLock
  | IncomingCommandDeviceCalibrate
  | IncomingCommandDeviceSetDefaultAngle
  | IncomingCommandDeviceSetPrivacyAngle;
