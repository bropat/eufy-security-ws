import { EufySecurity } from "eufy-security-client";
import { UnknownCommandError } from "../error";
import { Client } from "../server";
import { DeviceCommand } from "./command";
import { IncomingCommandDeviceEnableDevice, IncomingCommandDeviceLockDevice, IncomingCommandDeviceSetAntiTheftDetection, IncomingCommandDeviceSetAutoNightVision, IncomingCommandDeviceSetMotionDetection, IncomingCommandDeviceSetPetDetection, IncomingCommandDeviceSetProperty, IncomingCommandDeviceSetRTSPStream, IncomingCommandDeviceSetSoundDetection, IncomingCommandDeviceSetStatusLed, IncomingCommandDeviceSetWatermark, IncomingMessageDevice } from "./incoming_message";
import { DeviceResultTypes } from "./outgoing_message";

export class DeviceMessageHandler {

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    static async handle(message: IncomingMessageDevice, driver: EufySecurity, client: Client): Promise<DeviceResultTypes[DeviceCommand]> {
        const { serialNumber, command } = message;

        const device = driver.getDevice(serialNumber);
        const station = driver.getStation(device.getStationSerial());  

        switch (command) {
            case DeviceCommand.setStatusLed:
                await station.setStatusLed(device, (message as IncomingCommandDeviceSetStatusLed).value);
                return { };
            case DeviceCommand.setAutoNightVision:
                await station.setAutoNightVision(device, (message as IncomingCommandDeviceSetAutoNightVision).value);
                return { };
            case DeviceCommand.setMotionDetection:
                await station.setMotionDetection(device, (message as IncomingCommandDeviceSetMotionDetection).value);
                return { };
            case DeviceCommand.setSoundDetection:
                await station.setSoundDetection(device, (message as IncomingCommandDeviceSetSoundDetection).value);
                return { };
            case DeviceCommand.setPetDetection:
                await station.setPetDetection(device, (message as IncomingCommandDeviceSetPetDetection).value);
                return { };
            case DeviceCommand.setRTSPStream:
                await station.setRTSPStream(device, (message as IncomingCommandDeviceSetRTSPStream).value);
                return { };
            case DeviceCommand.setAntiTheftDetection:
                await station.setAntiTheftDetection(device, (message as IncomingCommandDeviceSetAntiTheftDetection).value);
                return { };
            case DeviceCommand.setWatermark:
                await station.setWatermark(device, (message as IncomingCommandDeviceSetWatermark).value);
                return { };
            case DeviceCommand.enableDevice:
                await station.enableDevice(device, (message as IncomingCommandDeviceEnableDevice).value);
                return { };
            case DeviceCommand.lockDevice:
                await station.lockDevice(device, (message as IncomingCommandDeviceLockDevice).value);
                return { };
            case DeviceCommand.getPropertiesMetadata:
            {
                const properties = device.getPropertiesMetadata();
                return { properties: properties };
            }
            case DeviceCommand.getProperties:
            {
                const properties = device.getProperties();
                return { properties: properties };
            }
            case DeviceCommand.setProperty:
                driver.setDeviceProperty(serialNumber, (message as IncomingCommandDeviceSetProperty).name, (message as IncomingCommandDeviceSetProperty).value);
                return { };
            default:
                throw new UnknownCommandError(command);
        }
    }
}