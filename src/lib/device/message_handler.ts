import { CommandName, EufySecurity, TalkbackStream } from "eufy-security-client";

import { DownloadAlreadyRunningError, DownloadNotRunningError, DownloadOnlyOneAtATimeError, LivestreamAlreadyRunningError, LivestreamNotRunningError, TalkbackAlreadyRunningError, TalkbackNotRunningError, TalkbackOnlyOneAtATimeError, UnknownCommandError } from "../error.js";
import { Client } from "../server.js";
import { convertCamelCaseToSnakeCase } from "../utils.js";
import { DeviceCommand } from "./command.js";
import { DeviceEvent } from "./event.js";
import { IncomingCommandDeviceEnableDevice, IncomingCommandDeviceLockDevice, IncomingCommandDeviceSetAntiTheftDetection, IncomingCommandDeviceSetAutoNightVision, IncomingCommandDeviceSetMotionDetection, IncomingCommandDeviceSetPetDetection, IncomingCommandDeviceSetProperty, IncomingCommandDeviceSetRTSPStream, IncomingCommandDeviceSetSoundDetection, IncomingCommandDeviceSetStatusLed, IncomingCommandDeviceSetWatermark, IncomingMessageDevice, IncomingCommandDeviceTriggerAlarm, IncomingCommandDevicePanAndTilt, IncomingCommandDeviceQuickResponse, IncomingCommandDeviceStartDownload, IncomingCommandDeviceHasProperty, IncomingCommandDeviceHasCommand, IncomingCommandDeviceTalkbackAudioData, IncomingCommandDeviceSnooze, IncomingCommandDeviceAddUser, IncomingCommandDeviceDeleteUser, IncomingCommandDeviceVerifyPIN, IncomingCommandDeviceUpdateUser, IncomingCommandDeviceUpdateUserPasscode, IncomingCommandDeviceUpdateUserSchedule, IncomingCommandDevicePresetPosition, IncomingCommandDeviceSavePresetPosition, IncomingCommandDeviceDeletePresetPosition } from "./incoming_message.js";
import { DeviceResultTypes } from "./outgoing_message.js";
import { dumpDeviceProperties, dumpDevicePropertiesMetadata } from "./properties.js";

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
        const station = await driver.getStation(device.getStationSerial());  

        switch (command) {
            case DeviceCommand.setStatusLed:
                if (client.schemaVersion <= 12) {
                    station.setStatusLed(device, (message as IncomingCommandDeviceSetStatusLed).value);
                    return { };
                } else {
                    throw new UnknownCommandError(command);
                }
            case DeviceCommand.setAutoNightVision:
                if (client.schemaVersion <= 12) {
                    station.setAutoNightVision(device, (message as IncomingCommandDeviceSetAutoNightVision).value);
                    return { };
                } else {
                    throw new UnknownCommandError(command);
                }
            case DeviceCommand.setMotionDetection:
                if (client.schemaVersion <= 12) {
                    station.setMotionDetection(device, (message as IncomingCommandDeviceSetMotionDetection).value);
                    return { };
                } else {
                    throw new UnknownCommandError(command);
                }
            case DeviceCommand.setSoundDetection:
                if (client.schemaVersion <= 12) {
                    station.setSoundDetection(device, (message as IncomingCommandDeviceSetSoundDetection).value);
                    return { };
                } else {
                    throw new UnknownCommandError(command);
                }
            case DeviceCommand.setPetDetection:
                if (client.schemaVersion <= 12) {
                    station.setPetDetection(device, (message as IncomingCommandDeviceSetPetDetection).value);
                    return { };
                } else {
                    throw new UnknownCommandError(command);
                }
            case DeviceCommand.setRTSPStream:
                if (client.schemaVersion <= 12) {
                    station.setRTSPStream(device, (message as IncomingCommandDeviceSetRTSPStream).value);
                    return { };
                } else {
                    throw new UnknownCommandError(command);
                }
            case DeviceCommand.setAntiTheftDetection:
                if (client.schemaVersion <= 12) {
                    station.setAntiTheftDetection(device, (message as IncomingCommandDeviceSetAntiTheftDetection).value);
                    return { };
                } else {
                    throw new UnknownCommandError(command);
                }
            case DeviceCommand.setWatermark:
                if (client.schemaVersion <= 12) {
                    station.setWatermark(device, (message as IncomingCommandDeviceSetWatermark).value);
                    return { };
                } else {
                    throw new UnknownCommandError(command);
                }
            case DeviceCommand.enableDevice:
                if (client.schemaVersion <= 12) {
                    station.enableDevice(device, (message as IncomingCommandDeviceEnableDevice).value);
                    return { };
                } else {
                    throw new UnknownCommandError(command);
                }
            case DeviceCommand.lockDevice:
                if (client.schemaVersion <= 12) {
                    station.lockDevice(device, (message as IncomingCommandDeviceLockDevice).value);
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
                        station.startLivestream(device);
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
                            station.stopLivestream(device);
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
                    station.triggerDeviceAlarmSound(device, (message as IncomingCommandDeviceTriggerAlarm).seconds);
                    return client.schemaVersion >= 13 ? { async: true } : {};
                } else {
                    throw new UnknownCommandError(command);
                }
            case DeviceCommand.resetAlarm:
                if (client.schemaVersion >= 3) {
                    station.resetDeviceAlarmSound(device);
                    return client.schemaVersion >= 13 ? { async: true } : {};
                } else {
                    throw new UnknownCommandError(command);
                }
            case DeviceCommand.panAndTilt:
                if (client.schemaVersion >= 3) {
                    station.panAndTilt(device, (message as IncomingCommandDevicePanAndTilt).direction);
                    return client.schemaVersion >= 13 ? { async: true } : {};
                } else {
                    throw new UnknownCommandError(command);
                }
            case DeviceCommand.quickResponse:
                if (client.schemaVersion >= 3) {
                    station.quickResponse(device, (message as IncomingCommandDeviceQuickResponse).voiceId);
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
                            station.cancelDownload(device);
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
                    station.startRTSPStream(device);
                    return { };
                } else {
                    throw new UnknownCommandError(command);
                }
            case DeviceCommand.stopRTSPLivestream:
                if (client.schemaVersion >= 6) {
                    station.stopRTSPStream(device);
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
                    station.calibrateLock(device);
                    return client.schemaVersion >= 13 ? { async: true } : {};
                } else {
                    throw new UnknownCommandError(command);
                }
            case DeviceCommand.calibrate:
                if (client.schemaVersion >= 10) {
                    station.calibrate(device);
                    return client.schemaVersion >= 13 ? { async: true } : {};
                } else {
                    throw new UnknownCommandError(command);
                }
            case DeviceCommand.setDefaultAngle:
                if (client.schemaVersion >= 10) {
                    station.setDefaultAngle(device);
                    return client.schemaVersion >= 13 ? { async: true } : {};
                } else {
                    throw new UnknownCommandError(command);
                }
            case DeviceCommand.setPrivacyAngle:
                if (client.schemaVersion >= 10) {
                    station.setPrivacyAngle(device);
                    return client.schemaVersion >= 13 ? { async: true } : {};
                } else {
                    throw new UnknownCommandError(command);
                }
            case DeviceCommand.unlock:
                if (client.schemaVersion >= 13) {
                    station.unlock(device);
                    return { async: true };
                } else {
                    throw new UnknownCommandError(command);
                }
            case DeviceCommand.startTalkback:
                if (client.schemaVersion >= 13) {
                    if (!station.isTalkbackOngoing(device)) {
                        station.startTalkback(device);
                        client.sendTalkbackStream[serialNumber] = true;
                        DeviceMessageHandler.addTalkbackingDevice(station.getSerial(), client);
                    } else if (client.sendTalkbackStream[serialNumber] !== true) {
                        throw new TalkbackOnlyOneAtATimeError(`Talkback for device ${serialNumber} is already running from another client`);
                    } else {
                        throw new TalkbackAlreadyRunningError(`Talkback for device ${serialNumber} is already running`);
                    }
                    return { async: true };
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
                            station.stopTalkback(device);
                        }
                    }
                    return { async: true };
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
                    station.snooze(device, {
                        snooze_time: (message as IncomingCommandDeviceSnooze).snoozeTime,
                        snooze_chime: (message as IncomingCommandDeviceSnooze).snoozeChime,
                        snooze_motion: (message as IncomingCommandDeviceSnooze).snoozeMotion,
                        snooze_homebase: (message as IncomingCommandDeviceSnooze).snoozeHomebase,
                    });
                    return { async: true };
                } else {
                    throw new UnknownCommandError(command);
                }
            case DeviceCommand.addUser:
                if (client.schemaVersion >= 13) {
                    const addUser = message as IncomingCommandDeviceAddUser;
                    await driver.addUser(device.getSerial(), addUser.username, addUser.passcode, addUser.schedule).catch((error) => {
                        throw error;
                    });
                    return { async: true };
                } else {
                    throw new UnknownCommandError(command);
                }
            case DeviceCommand.deleteUser:
                if (client.schemaVersion >= 13) {
                    const addUser = message as IncomingCommandDeviceDeleteUser;
                    await driver.deleteUser(device.getSerial(), addUser.username).catch((error) => {
                        throw error;
                    });
                    return { async: true };
                } else {
                    throw new UnknownCommandError(command);
                }
            case DeviceCommand.getUsers:
                if (client.schemaVersion >= 13) {
                    const users = await driver.getApi().getUsers(device.getSerial(), device.getStationSerial()).catch((error) => {
                        throw error;
                    });
                    return { users: users === null ? [] : users };
                } else {
                    throw new UnknownCommandError(command);
                }
            case DeviceCommand.updateUser:
                if (client.schemaVersion >= 13) {
                    const addUser = message as IncomingCommandDeviceUpdateUser;
                    await driver.updateUser(device.getSerial(), addUser.username, addUser.newUsername).catch((error) => {
                        throw error;
                    });
                    return { async: true };
                } else {
                    throw new UnknownCommandError(command);
                }
            case DeviceCommand.updateUserPasscode:
                if (client.schemaVersion >= 13) {
                    const addUser = message as IncomingCommandDeviceUpdateUserPasscode;
                    await driver.updateUserPasscode(device.getSerial(), addUser.username, addUser.passcode).catch((error) => {
                        throw error;
                    });
                    return { async: true };
                } else {
                    throw new UnknownCommandError(command);
                }
            case DeviceCommand.updateUserSchedule:
                if (client.schemaVersion >= 13) {
                    const addUser = message as IncomingCommandDeviceUpdateUserSchedule;
                    await driver.updateUserSchedule(device.getSerial(), addUser.username, addUser.schedule).catch((error) => {
                        throw error;
                    });
                    return { async: true };
                } else {
                    throw new UnknownCommandError(command);
                }
            case DeviceCommand.verifyPIN:
                if (client.schemaVersion >= 13) {
                    const verifyPIN = message as IncomingCommandDeviceVerifyPIN;
                    station.verifyPIN(device, verifyPIN.pin);
                    return { async: true };
                } else {
                    throw new UnknownCommandError(command);
                }
            case DeviceCommand.presetPosition:
                if (client.schemaVersion >= 21) {
                    const presetPosition = message as IncomingCommandDevicePresetPosition;
                    station.presetPosition(device, presetPosition.position);
                    return { async: true };
                } else {
                    throw new UnknownCommandError(command);
                }
            case DeviceCommand.savePresetPosition:
                if (client.schemaVersion >= 21) {
                    const savePresetPosition = message as IncomingCommandDeviceSavePresetPosition;
                    station.savePresetPosition(device, savePresetPosition.position);
                    return { async: true };
                } else {
                    throw new UnknownCommandError(command);
                }
            case DeviceCommand.deletePresetPosition:
                if (client.schemaVersion >= 21) {
                    const deletePresetPosition = message as IncomingCommandDeviceDeletePresetPosition;
                    station.deletePresetPosition(device, deletePresetPosition.position);
                    return { async: true };
                } else {
                    throw new UnknownCommandError(command);
                }
            case DeviceCommand.open:
                if (client.schemaVersion >= 21) {
                    station.open(device);
                    return { async: true };
                } else {
                    throw new UnknownCommandError(command);
                }
            default:
                throw new UnknownCommandError(command);
        }
    }
}