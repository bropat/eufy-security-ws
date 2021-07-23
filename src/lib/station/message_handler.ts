import { EufySecurity } from "eufy-security-client";
import { UnknownCommandError } from "../error";
import { Client } from "../server";
import { StationCommand } from "./command";
import { IncomingCommandSetProperty, IncomingCommandTriggerAlarm, IncomingCommandSetGuardMode, IncomingMessageStation, IncomingCommandHasCommand, IncomingCommandHasProperty } from "./incoming_message";
import { StationResultTypes } from "./outgoing_message";

export class StationMessageHandler {

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
            case StationCommand.isConnectedLegacy:
                const result = station.isConnected();
                return { connected: result };
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
                return { properties: properties };
            }
            case StationCommand.getProperties:
            {
                const properties = station.getProperties();
                return { properties: properties };
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
                    return { exists: result };
                }
            }
            case StationCommand.hasCommand:
            {
                if (client.schemaVersion >= 3) {
                    const result = station.hasCommand((message as IncomingCommandHasCommand).commandName);
                    return { exists: result };
                }
            }
            case StationCommand.getCommands:
            {
                if (client.schemaVersion >= 3) {
                    const result = station.getCommands();
                    return { commands: result };
                }
            }
            default:
                throw new UnknownCommandError(command);
        }
    }
}