import { CommandName } from "eufy-security-client";

import { StationCommand } from "./command";

export interface StationResultTypes {
    [StationCommand.reboot]: Record<string, never>;
    [StationCommand.setGuardMode]: Record<string, never>;
    [StationCommand.isConnected]: { serialNumber?: string; connected: boolean };
    [StationCommand.connect]: Record<string, never>;
    [StationCommand.disconnect]: Record<string, never>;
    [StationCommand.getPropertiesMetadata]: { serialNumber?: string; properties: Record<string, unknown>; };
    [StationCommand.getProperties]: { serialNumber?: string; properties: Record<string, unknown>; };
    [StationCommand.setProperty]: Record<string, never>;
    [StationCommand.triggerAlarm]: Record<string, never>;
    [StationCommand.resetAlarm]: Record<string, never>;
    [StationCommand.hasProperty]: { serialNumber?: string; exists: boolean };
    [StationCommand.hasCommand]: { serialNumber?: string; exists: boolean };
    [StationCommand.getCommands]: { serialNumber?: string; commands: Array<CommandName>; };
    /*[StationCommand.getCameraInfo]: Record<string, never>;
    [StationCommand.getStorageInfo]: Record<string, never>;*/

    //Legacy
    [StationCommand.isConnectedLegacy]: { connected: boolean };
}
