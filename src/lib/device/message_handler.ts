import { EufySecurity } from "eufy-security-client";

import { LivestreamAlreadyRunningError, LivestreamNotRunningError, UnknownCommandError } from "../error";
import { Client } from "../server";
import { DeviceCommand } from "./command";
import { DeviceEvent } from "./event";
import { IncomingCommandDeviceEnableDevice, IncomingCommandDeviceLockDevice, IncomingCommandDeviceSetAntiTheftDetection, IncomingCommandDeviceSetAutoNightVision, IncomingCommandDeviceSetMotionDetection, IncomingCommandDeviceSetPetDetection, IncomingCommandDeviceSetProperty, IncomingCommandDeviceSetRTSPStream, IncomingCommandDeviceSetSoundDetection, IncomingCommandDeviceSetStatusLed, IncomingCommandDeviceSetWatermark, IncomingMessageDevice, IncomingCommandDeviceTriggerAlarm, IncomingCommandDevicePanAndTilt, IncomingCommandDeviceQuickResponse, IncomingCommandDeviceStartDownload, IncomingCommandDeviceHasProperty, IncomingCommandDeviceHasCommand } from "./incoming_message";
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

    static addStreamingDevice(stationSN: string, client: Client): void {
        if (DeviceMessageHandler.streamingDevices[stationSN] !== undefined && !DeviceMessageHandler.streamingDevices[stationSN].includes(client))
            DeviceMessageHandler.streamingDevices[stationSN].push(client);
        else if (DeviceMessageHandler.streamingDevices[stationSN] === undefined)
            DeviceMessageHandler.streamingDevices[stationSN] = [ client ];
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    static async handle(message: IncomingMessageDevice, driver: EufySecurity, client: Client): Promise<DeviceResultTypes[DeviceCommand]> {
        const { serialNumber, command } = message;

        const device = await driver.getDevice(serialNumber);
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

                if (client.schemaVersion <= 3) {
                    return { properties: properties };
                } else if (client.schemaVersion >= 4) {
                    return {
                        serialNumber: device.getSerial(),
                        properties: properties
                    };
                }
            }
            case DeviceCommand.getProperties:
            {
                const properties = device.getProperties();

                if (client.schemaVersion <= 3) {
                    return { properties: properties };
                } else if (client.schemaVersion >= 4) {
                    return {
                        serialNumber: device.getSerial(),
                        properties: properties
                    };
                }
            }
            case DeviceCommand.setProperty:
                await driver.setDeviceProperty(serialNumber, (message as IncomingCommandDeviceSetProperty).name, (message as IncomingCommandDeviceSetProperty).value).catch((error) => {
                    throw error;
                });
                return { };
            case DeviceCommand.startLivestream:
                if (client.schemaVersion >= 2) {
                    if (!station.isLiveStreaming(device)) {
                        await station.startLivestream(device).catch((error) => {
                            throw error;
                        });
                        client.receiveLivestream[serialNumber] = true;
                        DeviceMessageHandler.addStreamingDevice(station.getSerial(), client);
                    } else if (client.receiveLivestream[serialNumber] !== true) {
                        //TODO: Cache last received I-Frame and send that with the rest to the new client
                        client.sendEvent({
                            source: "device",
                            event: DeviceEvent.livestreamStarted,
                            serialNumber: serialNumber,
                        })
                        client.receiveLivestream[serialNumber] = true;
                        DeviceMessageHandler.addStreamingDevice(station.getSerial(), client);
                    } else {
                        throw new LivestreamAlreadyRunningError(`Livestream for device ${serialNumber} is already running`);
                    }
                    return { };
                }
            case DeviceCommand.stopLivestream:
                if (client.schemaVersion >= 2) {
                    if (!station.isLiveStreaming(device)) {
                        throw new LivestreamNotRunningError(`Livestream for device ${serialNumber} could not be stopped, because it is not running`);
                    }
                    if (client.receiveLivestream[serialNumber] !== true) {
                        throw new LivestreamNotRunningError(`This client has not requested the start of the live stream for the device ${serialNumber} and therefore cannot request its termination`);
                    }
                    if (DeviceMessageHandler.streamingDevices[station.getSerial()] !== undefined && DeviceMessageHandler.streamingDevices[station.getSerial()].includes(client)) {
                        if (DeviceMessageHandler.streamingDevices[station.getSerial()].length === 1) {
                            DeviceMessageHandler.removeStreamingDevice(station.getSerial(), client);
                            await station.stopLivestream(device).catch((error) => {
                                throw error;
                            });
                        } else {
                            client.receiveLivestream[serialNumber] = false;
                            DeviceMessageHandler.removeStreamingDevice(station.getSerial(), client);
                            client.sendEvent({
                                source: "device",
                                event: DeviceEvent.livestreamStopped,
                                serialNumber: serialNumber,
                            });
                        }
                    }
                    
                    return { };
                }
            case DeviceCommand.isLiveStreaming:
            {
                if (client.schemaVersion >= 2) {
                    const result = station.isLiveStreaming(device);

                    if (client.schemaVersion >= 2 && client.schemaVersion <= 3) {
                        return { livestreaming: result };
                    } else if (client.schemaVersion >= 4) {
                        return {
                            serialNumber: device.getSerial(),
                            livestreaming: result
                        };
                    }
                }
            }
            case DeviceCommand.triggerAlarm:
                if (client.schemaVersion >= 3) {
                    await station.triggerDeviceAlarmSound(device, (message as IncomingCommandDeviceTriggerAlarm).seconds).catch((error) => {
                        throw error;
                    });
                    return { };
                }
            case DeviceCommand.resetAlarm:
                if (client.schemaVersion >= 3) {
                    await station.resetDeviceAlarmSound(device).catch((error) => {
                        throw error;
                    });
                    return { };
                }
            case DeviceCommand.panAndTilt:
                if (client.schemaVersion >= 3) {
                    await station.panAndTilt(device, (message as IncomingCommandDevicePanAndTilt).direction).catch((error) => {
                        throw error;
                    });
                    return { };
                }
            case DeviceCommand.calibrate:
                if (client.schemaVersion >= 9) {
                    await station.calibrate(device).catch((error) => {
                        throw error;
                    });
                    return { };
                }
            case DeviceCommand.quickResponse:
                if (client.schemaVersion >= 3) {
                    await station.quickResponse(device, (message as IncomingCommandDeviceQuickResponse).voiceId).catch((error) => {
                        throw error;
                    });
                    return { };
                }
            case DeviceCommand.startDownload:
                if (client.schemaVersion >= 3) {
                    await station.startDownload(device, (message as IncomingCommandDeviceStartDownload).path, (message as IncomingCommandDeviceStartDownload).cipherId).catch((error) => {
                        throw error;
                    });
                    return { };
                }
            case DeviceCommand.cancelDownload:
                if (client.schemaVersion >= 3) {
                    await station.cancelDownload(device).catch((error) => {
                        throw error;
                    });
                    return { };
                }
            case DeviceCommand.getVoices:
                if (client.schemaVersion >= 3) {
                    const voices = await driver.getApi().getVoices(device.getSerial()).catch((error) => {
                        throw error;
                    });

                    if (client.schemaVersion === 3) {
                        return {
                            serialNumber: device.getSerial(),
                            voices: voices
                        };
                    } else if (client.schemaVersion >= 4) {
                        return {
                            serialNumber: device.getSerial(),
                            voices: voices
                        };
                    }
                }
            case DeviceCommand.hasProperty:
            {
                if (client.schemaVersion >= 3) {
                    const result = device.hasProperty((message as IncomingCommandDeviceHasProperty).propertyName);

                    if (client.schemaVersion === 3) {
                        return { exists: result };
                    } else if (client.schemaVersion >= 4) {
                        return {
                            serialNumber: device.getSerial(),
                            exists: result
                        };
                    }
                }
            }
            case DeviceCommand.hasCommand:
            {
                if (client.schemaVersion >= 3) {
                    const result = device.hasCommand((message as IncomingCommandDeviceHasCommand).commandName);

                    if (client.schemaVersion === 3) {
                        return { exists: result };
                    } else if (client.schemaVersion >= 4) {
                        return {
                            serialNumber: device.getSerial(),
                            exists: result
                        };
                    }
                }
            }
            case DeviceCommand.getCommands:
            {
                if (client.schemaVersion >= 3) {
                    const result = device.getCommands();

                    if (client.schemaVersion === 3) {
                        return { commands: result };
                    } else if (client.schemaVersion >= 4) {
                        return {
                            serialNumber: device.getSerial(),
                            commands: result
                        };
                    }
                }
            }
            case DeviceCommand.startRTSPLivestream:
                if (client.schemaVersion >= 6) {
                    await station.startRTSPStream(device).catch((error) => {
                        throw error;
                    });
                    return { };
                }
            case DeviceCommand.stopRTSPLivestream:
                if (client.schemaVersion >= 6) {
                    await station.stopRTSPStream(device).catch((error) => {
                        throw error;
                    });
                    return { };
                }
            case DeviceCommand.isRTSPLiveStreaming:
            {
                if (client.schemaVersion >= 6) {
                    const result = station.isRTSPLiveStreaming(device);
                    return {
                        serialNumber: device.getSerial(),
                        livestreaming: result
                    };
                }
            }
            case DeviceCommand.calibrateLock:
                if (client.schemaVersion >= 9) {
                    await station.calibrateLock(device).catch((error) => {
                        throw error;
                    });
                    return { };
                }
            case DeviceCommand.calibrate:
                if (client.schemaVersion >= 10) {
                    await station.calibrate(device).catch((error) => {
                        throw error;
                    });
                    return { };
                }
            case DeviceCommand.setDefaultAngle:
                if (client.schemaVersion >= 10) {
                    await station.setDefaultAngle(device).catch((error) => {
                        throw error;
                    });
                    return { };
                }
            case DeviceCommand.setPrivacyAngle:
                if (client.schemaVersion >= 10) {
                    await station.setPrivacyAngle(device).catch((error) => {
                        throw error;
                    });
                    return { };
                }
            default:
                throw new UnknownCommandError(command);
        }
    }
}