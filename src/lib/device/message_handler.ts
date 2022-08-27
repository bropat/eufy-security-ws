import { CommandName, EufySecurity } from "eufy-security-client";
import { TalkbackStream } from "eufy-security-client/build/p2p/talkback";

import { DownloadAlreadyRunningError, DownloadNotRunningError, DownloadOnlyOneAtATimeError, LivestreamAlreadyRunningError, LivestreamNotRunningError, TalkbackAlreadyRunningError, TalkbackNotRunningError, TalkbackOnlyOneAtATimeError, UnknownCommandError } from "../error";
import { Client } from "../server";
import { convertCamelCaseToSnakeCase } from "../utils";
import { DeviceCommand } from "./command";
import { DeviceEvent } from "./event";
import { IncomingCommandDeviceEnableDevice, IncomingCommandDeviceLockDevice, IncomingCommandDeviceSetAntiTheftDetection, IncomingCommandDeviceSetAutoNightVision, IncomingCommandDeviceSetMotionDetection, IncomingCommandDeviceSetPetDetection, IncomingCommandDeviceSetProperty, IncomingCommandDeviceSetRTSPStream, IncomingCommandDeviceSetSoundDetection, IncomingCommandDeviceSetStatusLed, IncomingCommandDeviceSetWatermark, IncomingMessageDevice, IncomingCommandDeviceTriggerAlarm, IncomingCommandDevicePanAndTilt, IncomingCommandDeviceQuickResponse, IncomingCommandDeviceStartDownload, IncomingCommandDeviceHasProperty, IncomingCommandDeviceHasCommand, IncomingCommandDeviceTalkbackAudioData, IncomingCommandDeviceSnooze } from "./incoming_message";
import { DeviceResultTypes } from "./outgoing_message";
import { dumpDeviceProperties, dumpDevicePropertiesMetadata } from "./properties";

export class DeviceMessageHandler {

    private static streamingDevices: { [index: string]: Array<Client>} = {};
    private static downloadingDevices: { [index: string]: Array<Client>} = {};
    private static talkbackingDevices: { [index: string]: Array<Client>} = {};
    public static talkbackStream?: TalkbackStream;

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

    static getDownloadingDevices(stationSN: string): Array<Client> {
        if (DeviceMessageHandler.downloadingDevices[stationSN] !== undefined)
            return DeviceMessageHandler.downloadingDevices[stationSN];
        return [];
    }

    static removeDownloadingDevice(stationSN: string, client: Client): void {
        if (DeviceMessageHandler.downloadingDevices[stationSN] !== undefined)
            DeviceMessageHandler.downloadingDevices[stationSN] = DeviceMessageHandler.downloadingDevices[stationSN].filter((cl) => cl !== client);
    }

    static addDownloadingDevice(stationSN: string, client: Client): void {
        if (DeviceMessageHandler.downloadingDevices[stationSN] !== undefined && !DeviceMessageHandler.downloadingDevices[stationSN].includes(client))
            DeviceMessageHandler.downloadingDevices[stationSN].push(client);
        else if (DeviceMessageHandler.downloadingDevices[stationSN] === undefined)
            DeviceMessageHandler.downloadingDevices[stationSN] = [ client ];
    }

    static getTalkbackingDevices(stationSN: string): Array<Client> {
        if (DeviceMessageHandler.talkbackingDevices[stationSN] !== undefined)
            return DeviceMessageHandler.talkbackingDevices[stationSN];
        return [];
    }

    static removeTalkbackingDevice(stationSN: string, client: Client): void {
        if (DeviceMessageHandler.talkbackingDevices[stationSN] !== undefined)
            DeviceMessageHandler.talkbackingDevices[stationSN] = DeviceMessageHandler.talkbackingDevices[stationSN].filter((cl) => cl !== client);
    }

    static addTalkbackingDevice(stationSN: string, client: Client): void {
        if (DeviceMessageHandler.talkbackingDevices[stationSN] !== undefined && !DeviceMessageHandler.talkbackingDevices[stationSN].includes(client))
            DeviceMessageHandler.talkbackingDevices[stationSN].push(client);
        else if (DeviceMessageHandler.talkbackingDevices[stationSN] === undefined)
            DeviceMessageHandler.talkbackingDevices[stationSN] = [ client ];
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    static async handle(message: IncomingMessageDevice, driver: EufySecurity, client: Client): Promise<DeviceResultTypes[DeviceCommand]> {
        const { serialNumber, command } = message;

        const device = await driver.getDevice(serialNumber);
        const station = driver.getStation(device.getStationSerial());  

        switch (command) {
            case DeviceCommand.setStatusLed:
                if (client.schemaVersion <= 12) {
                    await station.setStatusLed(device, (message as IncomingCommandDeviceSetStatusLed).value).catch((error) => {
                        throw error;
                    });
                    return { };
                } else {
                    throw new UnknownCommandError(command);
                }
            case DeviceCommand.setAutoNightVision:
                if (client.schemaVersion <= 12) {
                    await station.setAutoNightVision(device, (message as IncomingCommandDeviceSetAutoNightVision).value).catch((error) => {
                        throw error;
                    });
                    return { };
                } else {
                    throw new UnknownCommandError(command);
                }
            case DeviceCommand.setMotionDetection:
                if (client.schemaVersion <= 12) {
                    await station.setMotionDetection(device, (message as IncomingCommandDeviceSetMotionDetection).value).catch((error) => {
                        throw error;
                    });
                    return { };
                } else {
                    throw new UnknownCommandError(command);
                }
            case DeviceCommand.setSoundDetection:
                if (client.schemaVersion <= 12) {
                    await station.setSoundDetection(device, (message as IncomingCommandDeviceSetSoundDetection).value).catch((error) => {
                        throw error;
                    });
                    return { };
                } else {
                    throw new UnknownCommandError(command);
                }
            case DeviceCommand.setPetDetection:
                if (client.schemaVersion <= 12) {
                    await station.setPetDetection(device, (message as IncomingCommandDeviceSetPetDetection).value).catch((error) => {
                        throw error;
                    });
                    return { };
                } else {
                    throw new UnknownCommandError(command);
                }
            case DeviceCommand.setRTSPStream:
                if (client.schemaVersion <= 12) {
                    await station.setRTSPStream(device, (message as IncomingCommandDeviceSetRTSPStream).value).catch((error) => {
                        throw error;
                    });
                    return { };
                } else {
                    throw new UnknownCommandError(command);
                }
            case DeviceCommand.setAntiTheftDetection:
                if (client.schemaVersion <= 12) {
                    await station.setAntiTheftDetection(device, (message as IncomingCommandDeviceSetAntiTheftDetection).value).catch((error) => {
                        throw error;
                    });
                    return { };
                } else {
                    throw new UnknownCommandError(command);
                }
            case DeviceCommand.setWatermark:
                if (client.schemaVersion <= 12) {
                    await station.setWatermark(device, (message as IncomingCommandDeviceSetWatermark).value).catch((error) => {
                        throw error;
                    });
                    return { };
                } else {
                    throw new UnknownCommandError(command);
                }
            case DeviceCommand.enableDevice:
                if (client.schemaVersion <= 12) {
                    await station.enableDevice(device, (message as IncomingCommandDeviceEnableDevice).value).catch((error) => {
                        throw error;
                    });
                    return { };
                } else {
                    throw new UnknownCommandError(command);
                }
            case DeviceCommand.lockDevice:
                if (client.schemaVersion <= 12) {
                    await station.lockDevice(device, (message as IncomingCommandDeviceLockDevice).value).catch((error) => {
                        throw error;
                    });
                    return { };
                } else {
                    throw new UnknownCommandError(command);
                }
            case DeviceCommand.getPropertiesMetadata:
            {
                const properties = device.getPropertiesMetadata();

                if (client.schemaVersion <= 3) {
                    return { properties: properties };
                } else if (client.schemaVersion >= 4 && client.schemaVersion <= 12) {
                    return {
                        serialNumber: device.getSerial(),
                        properties: properties
                    };
                } else {
                    return {
                        serialNumber: device.getSerial(),
                        properties: dumpDevicePropertiesMetadata(device, client.schemaVersion)
                    };
                }
            }
            case DeviceCommand.getProperties:
            {
                const properties = device.getProperties();

                if (client.schemaVersion <= 3) {
                    return { properties: properties };
                } else if (client.schemaVersion >= 4 && client.schemaVersion <= 12) {
                    return {
                        serialNumber: device.getSerial(),
                        properties: properties
                    };
                } else {
                    return {
                        serialNumber: device.getSerial(),
                        properties: dumpDeviceProperties(device, client.schemaVersion) as unknown as Record<string, unknown>
                    };
                }
            }
            case DeviceCommand.setProperty:
                await driver.setDeviceProperty(serialNumber, (message as IncomingCommandDeviceSetProperty).name, (message as IncomingCommandDeviceSetProperty).value).catch((error) => {
                    throw error;
                });
                return client.schemaVersion >= 13 ? { async: true } : {};
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
                    return client.schemaVersion >= 13 ? { async: true } : {};
                } else {
                    throw new UnknownCommandError(command);
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
                    return client.schemaVersion >= 13 ? { async: true } : {};
                } else {
                    throw new UnknownCommandError(command);
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
                } else {
                    throw new UnknownCommandError(command);
                }
            }
            case DeviceCommand.triggerAlarm:
                if (client.schemaVersion >= 3) {
                    await station.triggerDeviceAlarmSound(device, (message as IncomingCommandDeviceTriggerAlarm).seconds).catch((error) => {
                        throw error;
                    });
                    return client.schemaVersion >= 13 ? { async: true } : {};
                } else {
                    throw new UnknownCommandError(command);
                }
            case DeviceCommand.resetAlarm:
                if (client.schemaVersion >= 3) {
                    await station.resetDeviceAlarmSound(device).catch((error) => {
                        throw error;
                    });
                    return client.schemaVersion >= 13 ? { async: true } : {};
                } else {
                    throw new UnknownCommandError(command);
                }
            case DeviceCommand.panAndTilt:
                if (client.schemaVersion >= 3) {
                    await station.panAndTilt(device, (message as IncomingCommandDevicePanAndTilt).direction).catch((error) => {
                        throw error;
                    });
                    return client.schemaVersion >= 13 ? { async: true } : {};
                } else {
                    throw new UnknownCommandError(command);
                }
            case DeviceCommand.quickResponse:
                if (client.schemaVersion >= 3) {
                    await station.quickResponse(device, (message as IncomingCommandDeviceQuickResponse).voiceId).catch((error) => {
                        throw error;
                    });
                    return client.schemaVersion >= 13 ? { async: true } : {};
                } else {
                    throw new UnknownCommandError(command);
                }
            case DeviceCommand.startDownload:
                if (client.schemaVersion >= 3) {
                    if (!station.isDownloading(device)) {
                        await station.startDownload(device, (message as IncomingCommandDeviceStartDownload).path, (message as IncomingCommandDeviceStartDownload).cipherId).catch((error) => {
                            throw error;
                        });
                        client.receiveDownloadStream[serialNumber] = true;
                        DeviceMessageHandler.addDownloadingDevice(station.getSerial(), client);
                    } else if (client.receiveDownloadStream[serialNumber] !== true) {
                        throw new DownloadOnlyOneAtATimeError(`Download for device ${serialNumber} is already running from another client`);
                    } else {
                        throw new DownloadAlreadyRunningError(`Download for device ${serialNumber} is already running`);
                    }
                    return client.schemaVersion >= 13 ? { async: true } : {};
                } else {
                    throw new UnknownCommandError(command);
                }
            case DeviceCommand.cancelDownload:
                if (client.schemaVersion >= 3) {
                    if (!station.isDownloading(device)) {
                        throw new DownloadNotRunningError(`Download for device ${serialNumber} could not be cancelled, because it is not running`);
                    }
                    if (client.receiveDownloadStream[serialNumber] !== true) {
                        throw new DownloadNotRunningError(`This client has not requested the start of the download for the device ${serialNumber} and therefore cannot request its cancellation`);
                    }
                    if (DeviceMessageHandler.downloadingDevices[station.getSerial()] !== undefined && DeviceMessageHandler.downloadingDevices[station.getSerial()].includes(client)) {
                        if (DeviceMessageHandler.downloadingDevices[station.getSerial()].length === 1) {
                            DeviceMessageHandler.removeDownloadingDevice(station.getSerial(), client);
                            await station.cancelDownload(device).catch((error) => {
                                throw error;
                            });
                        }
                    }
                    return client.schemaVersion >= 13 ? { async: true } : {};
                } else {
                    throw new UnknownCommandError(command);
                }
            case DeviceCommand.isDownloading:
            {
                if (client.schemaVersion >= 13) {
                    const result = station.isDownloading(device);
                    return {
                        serialNumber: device.getSerial(),
                        downloading: result
                    };
                } else {
                    throw new UnknownCommandError(command);
                }
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
                } else {
                    throw new UnknownCommandError(command);
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
                } else {
                    throw new UnknownCommandError(command);
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
                } else {
                    throw new UnknownCommandError(command);
                }
            }
            case DeviceCommand.getCommands:
            {
                if (client.schemaVersion >= 3) {
                    const result = device.getCommands();

                    const commands: Array<string> = [];
                    result.forEach(command => {
                        commands.push(convertCamelCaseToSnakeCase(command.replace("device", "")));
                    });

                    if (client.schemaVersion === 3) {
                        return { commands: result };
                    } else if (client.schemaVersion >= 4) {
                        return {
                            serialNumber: device.getSerial(),
                            commands: commands as CommandName[]  //TODO: Convert to correct type
                        };
                    }
                } else {
                    throw new UnknownCommandError(command);
                }
            }
            case DeviceCommand.startRTSPLivestream:
                if (client.schemaVersion >= 6) {
                    await station.startRTSPStream(device).catch((error) => {
                        throw error;
                    });
                    return { };
                } else {
                    throw new UnknownCommandError(command);
                }
            case DeviceCommand.stopRTSPLivestream:
                if (client.schemaVersion >= 6) {
                    await station.stopRTSPStream(device).catch((error) => {
                        throw error;
                    });
                    return { };
                } else {
                    throw new UnknownCommandError(command);
                }
            case DeviceCommand.isRTSPLiveStreaming:
            {
                if (client.schemaVersion >= 6) {
                    const result = station.isRTSPLiveStreaming(device);
                    return {
                        serialNumber: device.getSerial(),
                        livestreaming: result
                    };
                } else {
                    throw new UnknownCommandError(command);
                }
            }
            case DeviceCommand.calibrateLock:
                if (client.schemaVersion >= 9) {
                    await station.calibrateLock(device).catch((error) => {
                        throw error;
                    });
                    return client.schemaVersion >= 13 ? { async: true } : {};
                } else {
                    throw new UnknownCommandError(command);
                }
            case DeviceCommand.calibrate:
                if (client.schemaVersion >= 10) {
                    await station.calibrate(device).catch((error) => {
                        throw error;
                    });
                    return client.schemaVersion >= 13 ? { async: true } : {};
                } else {
                    throw new UnknownCommandError(command);
                }
            case DeviceCommand.setDefaultAngle:
                if (client.schemaVersion >= 10) {
                    await station.setDefaultAngle(device).catch((error) => {
                        throw error;
                    });
                    return client.schemaVersion >= 13 ? { async: true } : {};
                } else {
                    throw new UnknownCommandError(command);
                }
            case DeviceCommand.setPrivacyAngle:
                if (client.schemaVersion >= 10) {
                    await station.setPrivacyAngle(device).catch((error) => {
                        throw error;
                    });
                    return client.schemaVersion >= 13 ? { async: true } : {};
                } else {
                    throw new UnknownCommandError(command);
                }
            case DeviceCommand.unlock:
                if (client.schemaVersion >= 13) {
                    await station.unlock(device).catch((error) => {
                        throw error;
                    });
                    return client.schemaVersion >= 13 ? { async: true } : {};
                } else {
                    throw new UnknownCommandError(command);
                }
            case DeviceCommand.startTalkback:
                if (client.schemaVersion >= 13) {
                    if (!station.isTalkbackOngoing(device)) {
                        await station.startTalkback(device).catch((error) => {
                            throw error;
                        });
                        client.sendTalkbackStream[serialNumber] = true;
                        DeviceMessageHandler.addTalkbackingDevice(station.getSerial(), client);
                    } else if (client.sendTalkbackStream[serialNumber] !== true) {
                        throw new TalkbackOnlyOneAtATimeError(`Talkback for device ${serialNumber} is already running from another client`);
                    } else {
                        throw new TalkbackAlreadyRunningError(`Talkback for device ${serialNumber} is already running`);
                    }
                    return client.schemaVersion >= 13 ? { async: true } : {};
                } else {
                    throw new UnknownCommandError(command);
                }
            case DeviceCommand.stopTalkback:
                if (client.schemaVersion >= 13) {
                    if (!station.isTalkbackOngoing(device)) {
                        throw new TalkbackNotRunningError(`Talkback for device ${serialNumber} could not be cancelled, because it is not running`);
                    }
                    if (client.sendTalkbackStream[serialNumber] !== true) {
                        throw new TalkbackNotRunningError(`This client has not requested the start of the talkback for the device ${serialNumber} and therefore cannot request its termination`);
                    }
                    if (DeviceMessageHandler.talkbackingDevices[station.getSerial()] !== undefined && DeviceMessageHandler.talkbackingDevices[station.getSerial()].includes(client)) {
                        if (DeviceMessageHandler.talkbackingDevices[station.getSerial()].length === 1) {
                            DeviceMessageHandler.talkbackStream?.end();
                            DeviceMessageHandler.talkbackStream = undefined;
                            DeviceMessageHandler.removeTalkbackingDevice(station.getSerial(), client);
                            await station.stopTalkback(device).catch((error) => {
                                throw error;
                            });
                        }
                    }
                    return client.schemaVersion >= 13 ? { async: true } : {};
                } else {
                    throw new UnknownCommandError(command);
                }
            case DeviceCommand.isTalkbackOngoing:
            {
                if (client.schemaVersion >= 13) {
                    const result = station.isTalkbackOngoing(device);
                    return {
                        serialNumber: device.getSerial(),
                        talkbackOngoing: result
                    };
                } else {
                    throw new UnknownCommandError(command);
                }
            }
            case DeviceCommand.talkbackAudioData:
                if (client.schemaVersion >= 13) {
                    if (!station.isTalkbackOngoing(device)) {
                        throw new TalkbackNotRunningError(`Talkback for device ${serialNumber} could not be cancelled, because it is not running`);
                    }
                    if (client.sendTalkbackStream[serialNumber] !== true) {
                        throw new TalkbackNotRunningError(`This client has not requested the start of the talkback for the device ${serialNumber} and therefore cannot send audio data`);
                    }
                    if (DeviceMessageHandler.talkbackingDevices[station.getSerial()] !== undefined && DeviceMessageHandler.talkbackingDevices[station.getSerial()].includes(client)) {
                        const audioDataBuffer = Buffer.from((message as IncomingCommandDeviceTalkbackAudioData).buffer);
                        this.talkbackStream?.write(audioDataBuffer);
                    }
                    return { };
                } else {
                    throw new UnknownCommandError(command);
                }
            case DeviceCommand.snooze:
                if (client.schemaVersion >= 13) {
                    await station.snooze(device, {
                        snooze_time: (message as IncomingCommandDeviceSnooze).snoozeTime,
                        snooze_chime: (message as IncomingCommandDeviceSnooze).snoozeChime,
                        snooze_motion: (message as IncomingCommandDeviceSnooze).snoozeMotion,
                        snooze_homebase: (message as IncomingCommandDeviceSnooze).snoozeHomebase,
                    }).catch((error) => {
                        throw error;
                    });
                    return client.schemaVersion >= 13 ? { async: true } : {};
                } else {
                    throw new UnknownCommandError(command);
                }
            default:
                throw new UnknownCommandError(command);
        }
    }
}