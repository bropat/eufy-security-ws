import { EufySecurity } from "eufy-security-client";
import { UnknownCommandError } from "../error";
import { Client } from "../server";
import { StationCommand } from "./command";
import { IncomingCommandDeviceSetProperty, IncomingCommandSetGuardMode, IncomingMessageStation } from "./incoming_message";
import { StationResultTypes } from "./outgoing_message";

export class StationMessageHandler {

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    static async handle(message: IncomingMessageStation, driver: EufySecurity, client: Client): Promise<StationResultTypes[StationCommand]> {
        const { serialNumber, command } = message;

        const station = driver.getStation(serialNumber);
        switch (command) {
            case StationCommand.reboot:
                await station.rebootHUB();
                return { };
            case StationCommand.setGuardMode:
                await station.setGuardMode((message as IncomingCommandSetGuardMode).mode);
                return { };
            case StationCommand.isConnected:
                const result = await station.isConnected();
                return { connected: result };
            /*case StationCommand.getCameraInfo:
                await station.getCameraInfo();
                return { };
            case StationCommand.getStorageInfo:
                await station.getStorageInfo();
                return { };*/
            case StationCommand.connect:
                await station.connect(driver.getConfig().p2pConnectionSetup, true);
                return { };
            case StationCommand.disconnect:
                await station.close();
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
                driver.setStationProperty(serialNumber, (message as IncomingCommandDeviceSetProperty).name, (message as IncomingCommandDeviceSetProperty).value);
                return { };
            default:
                throw new UnknownCommandError(command);
        }
    }
}