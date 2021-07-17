import { EufySecurity } from "eufy-security-client";
import { LivestreamAlreadyRunningError, LivestreamNotRunningError, UnknownCommandError } from "../error";
import { Client } from "../server";
import { DeviceCommand } from "./command";
import { DeviceEvent } from "./event";
import { IncomingCommandDeviceEnableDevice, IncomingCommandDeviceLockDevice, IncomingCommandDeviceSetAntiTheftDetection, IncomingCommandDeviceSetAutoNightVision, IncomingCommandDeviceSetMotionDetection, IncomingCommandDeviceSetPetDetection, IncomingCommandDeviceSetProperty, IncomingCommandDeviceSetRTSPStream, IncomingCommandDeviceSetSoundDetection, IncomingCommandDeviceSetStatusLed, IncomingCommandDeviceSetWatermark, IncomingMessageDevice, IncomingCommandDeviceTriggerAlarm, IncomingCommandDevicePanAndTilt, IncomingCommandDeviceQuickResponse, IncomingCommandDeviceStartDownload } from "./incoming_message";
import { DeviceResultTypes } from "./outgoing_message";

export class DeviceMessageHandler {

    private static streamingDevices: { [index: string]: Array<Client>} = {};

    static getStreamingDevices(stationSN: string): Array<Client> {
        if (DeviceMessageHandler.streamingDevices[stationSN] !== undefined)
            return DeviceMessageHandler.streamingDevices[stationSN];
        return [];
    }

    static removeStreamingDevice(stationSN: string, client: Client): void {
        if (DeviceMessageHandler.streamingDevices[stationSN] !== undefined)
            DeviceMessageHandler.streamingDevices[stationSN] = DeviceMessageHandler.streamingDevices[stationSN].filter((cl) => cl !== client);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    static async handle(message: IncomingMessageDevice, driver: EufySecurity, client: Client): Promise<DeviceResultTypes[DeviceCommand]> {
        const { serialNumber, command } = message;

        const device = driver.getDevice(serialNumber);
        const station = driver.getStation(device.getStationSerial());  

        switch (command) {
            case DeviceCommand.setStatusLed:
                await station.setStatusLed(device, (message as IncomingCommandDeviceSetStatusLed).value).catch((error) => {
                    throw error;
                });
                return { };
            case DeviceCommand.setAutoNightVision:
                await station.setAutoNightVision(device, (message as IncomingCommandDeviceSetAutoNightVision).value).catch((error) => {
                    throw error;
                });
                return { };
            case DeviceCommand.setMotionDetection:
                await station.setMotionDetection(device, (message as IncomingCommandDeviceSetMotionDetection).value).catch((error) => {
                    throw error;
                });
                return { };
            case DeviceCommand.setSoundDetection:
                await station.setSoundDetection(device, (message as IncomingCommandDeviceSetSoundDetection).value).catch((error) => {
                    throw error;
                });
                return { };
            case DeviceCommand.setPetDetection:
                await station.setPetDetection(device, (message as IncomingCommandDeviceSetPetDetection).value).catch((error) => {
                    throw error;
                });
                return { };
            case DeviceCommand.setRTSPStream:
                await station.setRTSPStream(device, (message as IncomingCommandDeviceSetRTSPStream).value).catch((error) => {
                    throw error;
                });
                return { };
            case DeviceCommand.setAntiTheftDetection:
                await station.setAntiTheftDetection(device, (message as IncomingCommandDeviceSetAntiTheftDetection).value).catch((error) => {
                    throw error;
                });
                return { };
            case DeviceCommand.setWatermark:
                await station.setWatermark(device, (message as IncomingCommandDeviceSetWatermark).value).catch((error) => {
                    throw error;
                });
                return { };
            case DeviceCommand.enableDevice:
                await station.enableDevice(device, (message as IncomingCommandDeviceEnableDevice).value).catch((error) => {
                    throw error;
                });
                return { };
            case DeviceCommand.lockDevice:
                await station.lockDevice(device, (message as IncomingCommandDeviceLockDevice).value).catch((error) => {
                    throw error;
                });
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
                await driver.setDeviceProperty(serialNumber, (message as IncomingCommandDeviceSetProperty).name, (message as IncomingCommandDeviceSetProperty).value).catch((error) => {
                    throw error;
                });
                return { };
            case DeviceCommand.startLivestream:
                if (!station.isLiveStreaming(device)) {
                    await station.startLivestream(device).catch((error) => {
                        throw error;
                    });
                    client.receiveLivestream[serialNumber] = true;
                    DeviceMessageHandler.streamingDevices[station.getSerial()] = [ client ];
                } else if (client.receiveLivestream[serialNumber] !== true) {
                    //TODO: Cache last received I-Frame and send that with the rest to the new client
                    client.sendEvent({
                        source: "device",
                        event: DeviceEvent.livestreamStarted,
                        serialNumber: serialNumber,
                    })
                    client.receiveLivestream[serialNumber] = true;
                    if (DeviceMessageHandler.streamingDevices[station.getSerial()] !== undefined)
                        DeviceMessageHandler.streamingDevices[station.getSerial()].push(client);
                } else {
                    throw new LivestreamAlreadyRunningError(`Livestream for device ${serialNumber} is already running`);
                }
                return { };
            case DeviceCommand.stopLivestream:
                if (client.receiveLivestream[serialNumber] !== true) {
                    throw new LivestreamNotRunningError(`Start of livestream for device ${serialNumber} was not also requested by this client`);
                }
                if (DeviceMessageHandler.streamingDevices[station.getSerial()] !== undefined && DeviceMessageHandler.streamingDevices[station.getSerial()].includes(client)) {
                    if (DeviceMessageHandler.streamingDevices[station.getSerial()].length === 1) {
                        await station.stopLivestream(device).catch((error) => {
                            throw error;
                        });
                        delete DeviceMessageHandler.streamingDevices[station.getSerial()];
                    } else {
                        client.receiveLivestream[serialNumber] = false;
                        DeviceMessageHandler.streamingDevices[station.getSerial()] = DeviceMessageHandler.streamingDevices[station.getSerial()].filter((cl) => cl !== client);
                        client.sendEvent({
                            source: "device",
                            event: DeviceEvent.livestreamStopped,
                            serialNumber: serialNumber,
                        });
                    }
                }
                
                return { };
            case DeviceCommand.isLiveStreaming:
            {
                const result = station.isLiveStreaming(device);
                return { livestreaming: result };
            }
            case DeviceCommand.triggerAlarm:
                await station.triggerDeviceAlarmSound(device, (message as IncomingCommandDeviceTriggerAlarm).seconds).catch((error) => {
                    throw error;
                });
                return { };
            case DeviceCommand.resetAlarm:
                await station.resetDeviceAlarmSound(device).catch((error) => {
                    throw error;
                });
                return { };
            case DeviceCommand.panAndTilt:
                await station.panAndTilt(device, (message as IncomingCommandDevicePanAndTilt).direction).catch((error) => {
                    throw error;
                });
                return { };
            case DeviceCommand.quickResponse:
                await station.quickResponse(device, (message as IncomingCommandDeviceQuickResponse).voiceId).catch((error) => {
                    throw error;
                });
                return { };
            case DeviceCommand.startDownload:
                await station.startDownload(device, (message as IncomingCommandDeviceStartDownload).path, (message as IncomingCommandDeviceStartDownload).cipherId).catch((error) => {
                    throw error;
                });
                return { };
            case DeviceCommand.cancelDownload:
                await station.cancelDownload(device).catch((error) => {
                    throw error;
                });
                return { };
            case DeviceCommand.getVoices:
                const voices = await driver.getApi().getVoices(device.getSerial()).catch((error) => {
                    throw error;
                });
                return { voices: voices };
            default:
                throw new UnknownCommandError(command);
        }
    }
}