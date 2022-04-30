import { EufySecurity } from "eufy-security-client";

import { UnknownCommandError } from "../error";
import { Client } from "../server";
import { StationCommand } from "./command";
import { IncomingCommandSetProperty, IncomingCommandTriggerAlarm, IncomingCommandSetGuardMode, IncomingMessageStation, IncomingCommandHasCommand, IncomingCommandHasProperty } from "./incoming_message";
import { StationResultTypes } from "./outgoing_message";

export class StationMessageHandler {

    static async handle(message: IncomingMessageStation, driver: EufySecurity, client: Client): Promise<StationResultTypes[StationCommand]> {
        const { serialNumber, command } = message;

        const station = driver.getStation(serialNumber);
        switch (command) {
            case StationCommand.reboot:
                await station.rebootHUB().catch((error) => {
                    throw error;
                });
                return { };
            case StationCommand.setGuardMode:
                await station.setGuardMode((message as IncomingCommandSetGuardMode).mode).catch((error) => {
                    throw error;
                });
                return { };
            case StationCommand.isConnected:
            {
                const result = station.isConnected();

                if (client.schemaVersion <= 3) {
                    return { connected: result };
                } else if (client.schemaVersion >= 4) {
                    return {
                        serialNumber: station.getSerial(),
                        connected: result
                    };
                }
            }
            case StationCommand.isConnectedLegacy:
            {
                const result = station.isConnected();
                return { connected: result };
            }
            /*case StationCommand.getCameraInfo:
                await station.getCameraInfo().catch((error) => {
                    throw error;
                });
                return { };
            case StationCommand.getStorageInfo:
                await station.getStorageInfo().catch((error) => {
                    throw error;
                });
                return { };*/
            case StationCommand.connect:
                await station.connect().catch((error) => {
                    throw error;
                });
                return { };
            case StationCommand.disconnect:
                station.close();
                return { };
            case StationCommand.getPropertiesMetadata:
            {
                const properties = station.getPropertiesMetadata();

                if (client.schemaVersion <= 3) {
                    return { properties: properties };
                } else if (client.schemaVersion >= 4) {
                    return {
                        serialNumber: station.getSerial(),
                        properties: properties
                    };
                }
            }
            case StationCommand.getProperties:
            {
                const properties = station.getProperties();

                if (client.schemaVersion <= 3) {
                    return { properties: properties };
                } else if (client.schemaVersion >= 4) {
                    return {
                        serialNumber: station.getSerial(),
                        properties: properties
                    };
                }
            }
            case StationCommand.setProperty:
                await driver.setStationProperty(serialNumber, (message as IncomingCommandSetProperty).name, (message as IncomingCommandSetProperty).value).catch((error) => {
                    throw error;
                });
                return { };
            case StationCommand.triggerAlarm:
                if (client.schemaVersion >= 3) {
                    await station.triggerStationAlarmSound((message as IncomingCommandTriggerAlarm).seconds).catch((error) => {
                        throw error;
                    });
                    return { };
                }
            case StationCommand.resetAlarm:
                if (client.schemaVersion >= 3) {
                    await station.resetStationAlarmSound().catch((error) => {
                        throw error;
                    });
                    return { };
                }
            case StationCommand.hasProperty:
            {
                if (client.schemaVersion >= 3) {
                    const result = station.hasProperty((message as IncomingCommandHasProperty).propertyName);

                    if (client.schemaVersion === 3) {
                        return { exists: result };
                    } else if (client.schemaVersion >= 4) {
                        return {
                            serialNumber: station.getSerial(),
                            exists: result
                        };
                    }
                }
            }
            case StationCommand.hasCommand:
            {
                if (client.schemaVersion >= 3) {
                    const result = station.hasCommand((message as IncomingCommandHasCommand).commandName);
                    
                    if (client.schemaVersion === 3) {
                        return { exists: result };
                    } else if (client.schemaVersion >= 4) {
                        return {
                            serialNumber: station.getSerial(),
                            exists: result
                        };
                    }
                }
            }
            case StationCommand.getCommands:
            {
                if (client.schemaVersion >= 3) {
                    const result = station.getCommands();

                    if (client.schemaVersion === 3) {
                        return { commands: result };
                    } else if (client.schemaVersion >= 4) {
                        return {
                            serialNumber: station.getSerial(),
                            commands: result
                        };
                    }
                }
            }
            default:
                throw new UnknownCommandError(command);
        }
    }
}