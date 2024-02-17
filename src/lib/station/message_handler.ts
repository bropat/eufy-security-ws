import { EufySecurity } from "eufy-security-client";
import date from "date-and-time";

import { UnknownCommandError } from "../error.js";
import { Client } from "../server.js";
import { StationCommand } from "./command.js";
import { IncomingCommandSetProperty, IncomingCommandTriggerAlarm, IncomingCommandSetGuardMode, IncomingMessageStation, IncomingCommandHasCommand, IncomingCommandHasProperty, IncomingCommandChime, IncomingCommandDownloadImage, IncomingCommandDatabaseQueryLocal, IncomingCommandDatabaseCountByDate, IncomingCommandDatabaseDelete } from "./incoming_message.js";
import { StationResultTypes } from "./outgoing_message.js";
import { dumpStationProperties, dumpStationPropertiesMetadata } from "./properties.js";

export class StationMessageHandler {

    static async handle(message: IncomingMessageStation, driver: EufySecurity, client: Client): Promise<StationResultTypes[StationCommand]> {
        const { serialNumber, command } = message;

        const station = await driver.getStation(serialNumber);
        switch (command) {
            case StationCommand.reboot:
                station.rebootHUB();
                return client.schemaVersion >= 13 ? { async: true } : {};
            case StationCommand.setGuardMode:
                if (client.schemaVersion <= 12) {
                    station.setGuardMode((message as IncomingCommandSetGuardMode).mode);
                    return { };
                } else {
                    throw new UnknownCommandError(command);
                }
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
                } else {
                    throw new UnknownCommandError(command);
                }
            }
            case StationCommand.isConnectedLegacy:
            {
                if (client.schemaVersion <= 12) {
                    const result = station.isConnected();
                    return { connected: result };
                } else {
                    throw new UnknownCommandError(command);
                }
            }
            /*case StationCommand.getCameraInfo:
                await station.getCameraInfo().catch((error) => {
                    throw error;
                });
                return client.schemaVersion >= 13 ? { async: true } : {};
            case StationCommand.getStorageInfo:
                await station.getStorageInfo().catch((error) => {
                    throw error;
                });
                return client.schemaVersion >= 13 ? { async: true } : {};*/
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
                } else {
                    return {
                        serialNumber: station.getSerial(),
                        properties: dumpStationPropertiesMetadata(station, client.schemaVersion)
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
                } else {
                    return {
                        serialNumber: station.getSerial(),
                        properties: dumpStationProperties(station, client.schemaVersion) as unknown as Record<string, unknown>
                    };
                }
            }
            case StationCommand.setProperty:
                await driver.setStationProperty(serialNumber, (message as IncomingCommandSetProperty).name, (message as IncomingCommandSetProperty).value).catch((error) => {
                    throw error;
                });
                return client.schemaVersion >= 13 ? { async: true } : {};
            case StationCommand.triggerAlarm:
                if (client.schemaVersion >= 3) {
                    station.triggerStationAlarmSound((message as IncomingCommandTriggerAlarm).seconds);
                    return client.schemaVersion >= 13 ? { async: true } : {};
                } else {
                    throw new UnknownCommandError(command);
                }
            case StationCommand.resetAlarm:
                if (client.schemaVersion >= 3) {
                    station.resetStationAlarmSound();
                    return client.schemaVersion >= 13 ? { async: true } : {};
                } else {
                    throw new UnknownCommandError(command);
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
                    } else {
                        throw new UnknownCommandError(command);
                    }
                } else {
                    throw new UnknownCommandError(command);
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
                    } else {
                        throw new UnknownCommandError(command);
                    }
                } else {
                    throw new UnknownCommandError(command);
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
                    } else {
                        throw new UnknownCommandError(command);
                    }
                } else {
                    throw new UnknownCommandError(command);
                }
            }
            case StationCommand.chime:
                if (client.schemaVersion >= 15) {
                    const ringtone = (message as IncomingCommandChime).ringtone;
                    station.chimeHomebase(ringtone !== undefined ? ringtone : 0);
                    return { async: true };
                } else {
                    throw new UnknownCommandError(command);
                }
            case StationCommand.downloadImage:
                if (client.schemaVersion >= 17) {
                    const file = (message as IncomingCommandDownloadImage).file;
                    station.downloadImage(file);
                    return { async: true };
                } else {
                    throw new UnknownCommandError(command);
                }
            case StationCommand.databaseQueryLatestInfo:
                if (client.schemaVersion >= 18) {
                    station.databaseQueryLatestInfo();
                    return { async: true };
                } else {
                    throw new UnknownCommandError(command);
                }
            case StationCommand.databaseQueryLocal:
                if (client.schemaVersion >= 18) {
                    const serialNumbers = (message as IncomingCommandDatabaseQueryLocal).serialNumbers;
                    const startDate = date.parse((message as IncomingCommandDatabaseQueryLocal).startDate, "YYYYMMDD");
                    const endDate = date.parse((message as IncomingCommandDatabaseQueryLocal).endDate, "YYYYMMDD");
                    const eventType = (message as IncomingCommandDatabaseQueryLocal).eventType;
                    const detectionType = (message as IncomingCommandDatabaseQueryLocal).detectionType;
                    const storageType = (message as IncomingCommandDatabaseQueryLocal).storageType;
                    station.databaseQueryLocal(serialNumbers, startDate, endDate, eventType, detectionType, storageType);
                    return { async: true };
                } else {
                    throw new UnknownCommandError(command);
                }
            case StationCommand.databaseCountByDate:
                if (client.schemaVersion >= 18) {
                    const startDate = date.parse((message as IncomingCommandDatabaseCountByDate).startDate, "YYYYMMDD");
                    const endDate = date.parse((message as IncomingCommandDatabaseCountByDate).endDate, "YYYYMMDD");
                    station.databaseCountByDate(startDate, endDate);
                    return { async: true };
                } else {
                    throw new UnknownCommandError(command);
                }
            case StationCommand.databaseDelete:
                if (client.schemaVersion >= 18) {
                    const ids = (message as IncomingCommandDatabaseDelete).ids;
                    station.databaseDelete(ids);
                    return { async: true };
                } else {
                    throw new UnknownCommandError(command);
                }
            default:
                throw new UnknownCommandError(command);
        }
    }
}