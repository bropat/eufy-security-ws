import { EufySecurity } from "eufy-security-client";
import { UnknownCommandError } from "../error";
import { Client } from "../server";
import { StationCommand } from "./command";
import { IncomingCommandDeviceSetProperty, IncomingCommandDeviceTriggerAlarm, IncomingCommandSetGuardMode, IncomingMessageStation } from "./incoming_message";
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
                await driver.setStationProperty(serialNumber, (message as IncomingCommandDeviceSetProperty).name, (message as IncomingCommandDeviceSetProperty).value).catch((error) => {
                    throw error;
                });
                return { };
            case StationCommand.triggerAlarm:
                await station.triggerStationAlarmSound((message as IncomingCommandDeviceTriggerAlarm).seconds).catch((error) => {
                    throw error;
                });
                return { };
            case StationCommand.resetAlarm:
                await station.resetStationAlarmSound().catch((error) => {
                    throw error;
                });
                return { };
            default:
                throw new UnknownCommandError(command);
        }
    }
}