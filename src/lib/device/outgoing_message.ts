import { Voices, CommandName } from "eufy-security-client";
import { DeviceCommand } from "./command";

export interface DeviceResultTypes {
    [DeviceCommand.setStatusLed]: Record<string, never>;
    [DeviceCommand.setAutoNightVision]: Record<string, never>;
    [DeviceCommand.setMotionDetection]: Record<string, never>;
    [DeviceCommand.setSoundDetection]: Record<string, never>;
    [DeviceCommand.setPetDetection]: Record<string, never>;
    [DeviceCommand.setRTSPStream]: Record<string, never>;
    [DeviceCommand.setAntiTheftDetection]: Record<string, never>;
    [DeviceCommand.setWatermark]: Record<string, never>;
    [DeviceCommand.enableDevice]: Record<string, never>;
    [DeviceCommand.lockDevice]: Record<string, never>;
    [DeviceCommand.getPropertiesMetadata]: { serialNumber?: string; properties: Record<string, unknown>; };
    [DeviceCommand.getProperties]: { serialNumber?: string; properties: Record<string, unknown>; };
    [DeviceCommand.setProperty]: Record<string, never>;
    [DeviceCommand.startLivestream]: Record<string, never>;
    [DeviceCommand.stopLivestream]: Record<string, never>;
    [DeviceCommand.isLiveStreaming]: { serialNumber?: string; livestreaming: boolean };
    [DeviceCommand.triggerAlarm]: Record<string, never>;
    [DeviceCommand.resetAlarm]: Record<string, never>;
    [DeviceCommand.panAndTilt]: Record<string, never>;
    [DeviceCommand.quickResponse]: Record<string, never>;
    [DeviceCommand.startDownload]: Record<string, never>;
    [DeviceCommand.cancelDownload]: Record<string, never>;
    [DeviceCommand.getVoices]: { serialNumber?: string; voices: Voices };
    [DeviceCommand.hasProperty]: { serialNumber?: string; exists: boolean };
    [DeviceCommand.hasCommand]: { serialNumber?: string; exists: boolean };
    [DeviceCommand.getCommands]: { serialNumber?: string; commands: Array<CommandName>; };
    [DeviceCommand.startRTSPLivestream]: Record<string, never>;
    [DeviceCommand.stopRTSPLivestream]: Record<string, never>;
    [DeviceCommand.isRTSPLiveStreaming]: { serialNumber?: string; livestreaming: boolean };
    [DeviceCommand.calibrateLock]: Record<string, never>;

}
