#!/usr/bin/env node

import { WebSocket } from "ws";
import { Command, Option } from "commander";
import * as c from "ansi-colors";
import { Logger } from "tslog";
import * as readline from "readline";
import { EventEmitter } from "events";
import date from "date-and-time";

import { maxSchemaVersion } from "../lib/const";
import { OutgoingEventMessage, OutgoingMessage, OutgoingResultMessageSuccess } from "../lib/outgoing_message";
import { DriverCommand } from "../lib/driver/command";
import { DeviceCommand } from "../lib/device/command";
import { StationCommand } from "../lib/station/command";
import { convertCamelCaseToSnakeCase, waitForEvent } from "../lib/utils";
import { OutgoingEventDeviceCommandResult } from "../lib/device/event";
import { OutgoingEventStationCommandResult } from "../lib/station/event";
import { IncomingCommandDeviceAddUser, IncomingCommandDeviceUpdateUser, IncomingCommandDeviceUpdateUserPasscode, IncomingCommandDeviceUpdateUserSchedule } from "../lib/device/incoming_message";
import { IndexedProperty, Schedule } from "eufy-security-client";
import { IncomingCommandChime, IncomingCommandDatabaseQueryLocal, IncomingCommandDownloadImage } from "../lib/station/incoming_message";

const commands = (Object.values(DriverCommand) as Array<string>).concat(Object.values(DeviceCommand) as Array<string>).concat(Object.values(StationCommand) as Array<string>).concat(["quit", "exit"]);
const devicePropertiesMetadata: { [index: string]: IndexedProperty; } = {};
const stationPropertiesMetadata: { [index: string]: IndexedProperty; } = {};
const emitter = new EventEmitter();

const parsePropertyValue = (property: string, value: string, serialNumber: string, propertiesMetadata: { [index: string]: IndexedProperty; }): number | boolean | string => {
    try {
        if (propertiesMetadata[serialNumber] !== undefined && propertiesMetadata[serialNumber][property] !== undefined) {
            switch(propertiesMetadata[serialNumber][property].type) {
                case "boolean":
                    return value.toLowerCase() === "true" ? true : false;
                case "number":
                    return Number.parseInt(value);
                case "object":
                    return JSON.parse(value);
                case "string":
                default:
                    return value;
            }

        }
    } catch (error) {
        console.log("ERROR", error);
    }
    return value;
};

const cmdHelp = (cmd: string): void => {
    switch (cmd) {
        case DriverCommand.setVerifyCode:
            console.log(`${cmd} <numeric_code>`);
            break;
        case DriverCommand.setCaptcha:
            console.log(`${cmd} <captcha> [<id>]`);
            break;
        case DriverCommand.pollRefresh:
        case DriverCommand.isConnected:
        case DriverCommand.isPushConnected:
        case DriverCommand.connect:
        case DriverCommand.disconnect:
        case DriverCommand.getVideoEvents:
        case DriverCommand.getAlarmEvents:
        case DriverCommand.getHistoryEvents:
        case DriverCommand.getLogLevel:
        case DriverCommand.startListeningLogs:
        case DriverCommand.stopListeningLogs:
            console.log(`${cmd}`);
            break;
        case DriverCommand.setLogLevel:
            console.log(`${cmd} <loglevel>`);
            break;
        case DeviceCommand.setStatusLed:
        case DeviceCommand.setAutoNightVision:
        case DeviceCommand.setMotionDetection:
        case DeviceCommand.setSoundDetection:
        case DeviceCommand.setPetDetection:
        case DeviceCommand.setRTSPStream:
        case DeviceCommand.setAntiTheftDetection:
        case DeviceCommand.enableDevice:
        case DeviceCommand.lockDevice:
            console.log(`${cmd} <device_sn> <true|false>`);
            break;
        case DeviceCommand.setWatermark:
            console.log(`${cmd} <device_sn> <numeric_option>`);
            break;
        case DeviceCommand.getPropertiesMetadata:
        case DeviceCommand.getProperties:
        case DeviceCommand.startLivestream:
        case DeviceCommand.stopLivestream:
        case DeviceCommand.resetAlarm:
        case DeviceCommand.getVoices:
        case DeviceCommand.cancelDownload:
        case DeviceCommand.isLiveStreaming:
        case DeviceCommand.getCommands:
        case DeviceCommand.startRTSPLivestream:
        case DeviceCommand.stopRTSPLivestream:
        case DeviceCommand.isRTSPLiveStreaming:
        case DeviceCommand.calibrateLock:
        case DeviceCommand.calibrate:
        case DeviceCommand.setDefaultAngle:
        case DeviceCommand.setPrivacyAngle:
        case DeviceCommand.unlock:
        case DeviceCommand.startTalkback:
        case DeviceCommand.stopTalkback:
        case DeviceCommand.isTalkbackOngoing:
        case DeviceCommand.isDownloading:
        case DeviceCommand.getUsers:
            console.log(`${cmd} <device_sn>`);
            break;
        case DeviceCommand.verifyPIN:
            console.log(`${cmd} <device_sn> <pin>`);
            break;
        case DeviceCommand.setProperty:
            console.log(`${cmd} <device_sn> <name> <value>|<json_string>`);
            break;
        case DeviceCommand.triggerAlarm:
            console.log(`${cmd} <device_sn> <seconds>`);
            break;
        case DeviceCommand.panAndTilt:
            console.log(`${cmd} <device_sn> <direction>`);
            break;
        case DeviceCommand.quickResponse:
            console.log(`${cmd} <device_sn> <voiceId>`);
            break;
        case DeviceCommand.startDownload:
            console.log(`${cmd} <device_sn> <path> [cipherId]`);
            break;
        case DeviceCommand.hasProperty:
        case DeviceCommand.hasCommand:
            console.log(`${cmd} <device_sn> <name>`);
            break;
        case DeviceCommand.snooze:
            console.log(`${cmd} <device_sn> <snooze_time> [snooze_chime] [snooze_motion] [snooze_homebase]`);
            break;
        case DeviceCommand.addUser:
            console.log(`${cmd} <device_sn> <username> <passcode> [schedule]`);
        case DeviceCommand.deleteUser:
            console.log(`${cmd} <device_sn> <username>`);
        case DeviceCommand.updateUser:
            console.log(`${cmd} <device_sn> <username> <new_username>`);
        case DeviceCommand.updateUserSchedule:
            console.log(`${cmd} <device_sn> <username> <schedule>`);
        case DeviceCommand.updateUserPasscode:
            console.log(`${cmd} <device_sn> <username> <passcode>`);
        case StationCommand.setGuardMode:
            console.log(`${cmd} <station_sn> <numeric_code>`);
            break;
        case StationCommand.isConnected:
        case StationCommand.connect:
        case StationCommand.disconnect:
        case StationCommand.resetAlarm:
        case StationCommand.reboot:
        case StationCommand.getCommands:
            console.log(`${cmd} <station_sn>`);
            break;
        case StationCommand.getPropertiesMetadata:
        case StationCommand.getProperties:
            console.log(`${cmd} <station_sn>`);
            break;
        case StationCommand.setProperty:
            console.log(`${cmd} <station_sn> <name> <value>`);
            break;
        case StationCommand.triggerAlarm:
            console.log(`${cmd} <station_sn> <seconds>`);
            break;
        case StationCommand.hasProperty:
        case StationCommand.hasCommand:
            console.log(`${cmd} <station_sn> <name>`);
            break;
        case StationCommand.chime:
            console.log(`${cmd} <station_sn> [ringtone]`);
            break;
        case StationCommand.downloadImage:
            console.log(`${cmd} <station_sn> <file>`);
            break;
        case StationCommand.databaseQueryLatestInfo:
            console.log(`${cmd} <station_sn>`);
            break;
        case StationCommand.databaseQueryLocal:
            console.log(`${cmd} <station_sn> <device_sn1,device_sn2,...> <startDate (YYYYMMDD)> <endDate (YYYYMMDD)> [eventType] [detectionType] [storageType]`);
            break;
        case StationCommand.databaseCountByDate:
            console.log(`${cmd} <station_sn> <startDate (YYYYMMDD)> <endDate (YYYYMMDD)>`);
            break;
        case StationCommand.databaseDelete:
            console.log(`${cmd} <station_sn> <id1> [<id2> ...]`);
            break;
        default:
            console.log(`Type HELP "command name" to display more information about a specific command.`);
            Object.values(DriverCommand).forEach((cmd) => {
                console.log(cmd);
            });
            Object.values(DeviceCommand).forEach((cmd) => {
                console.log(cmd);
            });
            Object.values(StationCommand).forEach((cmd) => {
                console.log(cmd);
            });
            console.log("exit");
            console.log("quit");
            break;
    }
};

const cmd = async(args: Array<string>, silent = false, internal = false): Promise<string[]> => {
    switch (args[0]) {
        case "help": 
            if (args.length <= 1 || args.length > 2) {
                cmdHelp("");
            } else {
                cmdHelp(args[1]);
            }
            break;
        case "exit":
        case "quit":
            break;
        case DriverCommand.setVerifyCode:
            if (args.length === 2 && isNumber(args[1])) {
                socket.send(JSON.stringify({
                    messageId: DriverCommand.setVerifyCode.split(".")[1],
                    command: DriverCommand.setVerifyCode,
                    verifyCode: args[1]
                }));
            } else {
                cmdHelp(args[0]);
                if (silent)
                    handleShutdown(1);
            }
            break;
        case DriverCommand.setCaptcha:
            if (args.length === 2 || args.length === 3) {
                socket.send(JSON.stringify({
                    messageId: DriverCommand.setCaptcha.split(".")[1],
                    command: DriverCommand.setCaptcha,
                    captchaId: args.length === 3 ? args[2] : undefined,
                    captcha: args[1]
                }));
            } else {
                cmdHelp(args[0]);
                if (silent)
                    handleShutdown(1);
            }
            break;
        case DriverCommand.pollRefresh:
            if (args.length === 1) {
                socket.send(JSON.stringify({
                    messageId: DriverCommand.pollRefresh.split(".")[1],
                    command: DriverCommand.pollRefresh
                }));
            } else {
                cmdHelp(args[0]);
                if (silent)
                    handleShutdown(1);
            }
            break;
        case DriverCommand.isConnected:
            if (args.length === 1) {
                socket.send(JSON.stringify({
                    messageId: DriverCommand.isConnected.split(".")[1],
                    command: DriverCommand.isConnected
                }));
            } else {
                cmdHelp(args[0]);
                if (silent)
                    handleShutdown(1);
            }
            break;
        case DriverCommand.isPushConnected:
            if (args.length === 1) {
                socket.send(JSON.stringify({
                    messageId: DriverCommand.isPushConnected.split(".")[1],
                    command: DriverCommand.isPushConnected
                }));
            } else {
                cmdHelp(args[0]);
                if (silent)
                    handleShutdown(1);
            }
            break;
        case DriverCommand.connect:
            if (args.length === 1) {
                socket.send(JSON.stringify({
                    messageId: DriverCommand.connect.split(".")[1],
                    command: DriverCommand.connect
                }));
            } else {
                cmdHelp(args[0]);
                if (silent)
                    handleShutdown(1);
            }
            break;
        case DriverCommand.disconnect:
            if (args.length === 1) {
                socket.send(JSON.stringify({
                    messageId: DriverCommand.disconnect.split(".")[1],
                    command: DriverCommand.disconnect
                }));
            } else {
                cmdHelp(args[0]);
                if (silent)
                    handleShutdown(1);
            }
            break;
        case DriverCommand.getVideoEvents:
            if (args.length === 1) {
                socket.send(JSON.stringify({
                    messageId: DriverCommand.getVideoEvents.split(".")[1],
                    command: DriverCommand.getVideoEvents
                }));
            } else {
                cmdHelp(args[0]);
                if (silent)
                    handleShutdown(1);
            }
            break;
        case DriverCommand.getAlarmEvents:
            if (args.length === 1) {
                socket.send(JSON.stringify({
                    messageId: DriverCommand.getAlarmEvents.split(".")[1],
                    command: DriverCommand.getAlarmEvents
                }));
            } else {
                cmdHelp(args[0]);
                if (silent)
                    handleShutdown(1);
            }
            break;
        case DriverCommand.getHistoryEvents:
            if (args.length === 1) {
                socket.send(JSON.stringify({
                    messageId: DriverCommand.getHistoryEvents.split(".")[1],
                    command: DriverCommand.getHistoryEvents
                }));
            } else {
                cmdHelp(args[0]);
                if (silent)
                    handleShutdown(1);
            }
            break;
        case DriverCommand.getLogLevel:
            if (args.length === 1) {
                socket.send(JSON.stringify({
                    messageId: DriverCommand.getLogLevel.split(".")[1],
                    command: DriverCommand.getLogLevel
                }));
            } else {
                cmdHelp(args[0]);
                if (silent)
                    handleShutdown(1);
            }
            break;
        case DriverCommand.startListeningLogs:
            if (args.length === 1) {
                socket.send(JSON.stringify({
                    messageId: DriverCommand.startListeningLogs.split(".")[1],
                    command: DriverCommand.startListeningLogs
                }));
            } else {
                cmdHelp(args[0]);
                if (silent)
                    handleShutdown(1);
            }
            break;
        case DriverCommand.stopListeningLogs:
            if (args.length === 1) {
                socket.send(JSON.stringify({
                    messageId: DriverCommand.stopListeningLogs.split(".")[1],
                    command: DriverCommand.stopListeningLogs
                }));
            } else {
                cmdHelp(args[0]);
                if (silent)
                    handleShutdown(1);
            }
            break;
        case DriverCommand.setLogLevel:
            if (args.length === 2) {
                socket.send(JSON.stringify({
                    messageId: DriverCommand.setLogLevel.split(".")[1],
                    command: DriverCommand.setLogLevel,
                    level: args[1]
                }));
            } else {
                cmdHelp(args[0]);
                if (silent)
                    handleShutdown(1);
            }
            break;
        case DeviceCommand.setStatusLed:
            if (args.length === 3 && isTrueFalse(args[2])) {
                socket.send(JSON.stringify({
                    messageId: DeviceCommand.setStatusLed.split(".")[1],
                    command: DeviceCommand.setStatusLed,
                    serialNumber: args[1],
                    value: args[2].toLowerCase() === "true" ? true : false,
                }));
            } else {
                cmdHelp(args[0]);
                if (silent)
                    handleShutdown(1);
            }
            break;
        case DeviceCommand.setAutoNightVision:
            if (args.length === 3 && isTrueFalse(args[2])) {
                socket.send(JSON.stringify({
                    messageId: DeviceCommand.setAutoNightVision.split(".")[1],
                    command: DeviceCommand.setAutoNightVision,
                    serialNumber: args[1],
                    value: args[2].toLowerCase() === "true" ? true : false,
                }));
            } else {
                cmdHelp(args[0]);
                if (silent)
                    handleShutdown(1);
            }
            break;
        case DeviceCommand.setMotionDetection:
            if (args.length === 3 && isTrueFalse(args[2])) {
                socket.send(JSON.stringify({
                    messageId: DeviceCommand.setMotionDetection.split(".")[1],
                    command: DeviceCommand.setMotionDetection,
                    serialNumber: args[1],
                    value: args[2].toLowerCase() === "true" ? true : false,
                }));
            } else {
                cmdHelp(args[0]);
                if (silent)
                    handleShutdown(1);
            }
            break;
        case DeviceCommand.setSoundDetection:
            if (args.length === 3 && isTrueFalse(args[2])) {
                socket.send(JSON.stringify({
                    messageId: DeviceCommand.setSoundDetection.split(".")[1],
                    command: DeviceCommand.setSoundDetection,
                    serialNumber: args[1],
                    value: args[2].toLowerCase() === "true" ? true : false,
                }));
            } else {
                cmdHelp(args[0]);
                if (silent)
                    handleShutdown(1);
            }
            break;
        case DeviceCommand.setPetDetection:
            if (args.length === 3 && isTrueFalse(args[2])) {
                socket.send(JSON.stringify({
                    messageId: DeviceCommand.setPetDetection.split(".")[1],
                    command: DeviceCommand.setPetDetection,
                    serialNumber: args[1],
                    value: args[2].toLowerCase() === "true" ? true : false,
                }));
            } else {
                cmdHelp(args[0]);
                if (silent)
                    handleShutdown(1);
            }
            break;
        case DeviceCommand.setRTSPStream:
            if (args.length === 3 && isTrueFalse(args[2])) {
                socket.send(JSON.stringify({
                    messageId: DeviceCommand.setRTSPStream.split(".")[1],
                    command: DeviceCommand.setRTSPStream,
                    serialNumber: args[1],
                    value: args[2].toLowerCase() === "true" ? true : false,
                }));
            } else {
                cmdHelp(args[0]);
                if (silent)
                    handleShutdown(1);
            }
            break;
        case DeviceCommand.setAntiTheftDetection:
            if (args.length === 3 && isTrueFalse(args[2])) {
                socket.send(JSON.stringify({
                    messageId: DeviceCommand.setAntiTheftDetection.split(".")[1],
                    command: DeviceCommand.setAntiTheftDetection,
                    serialNumber: args[1],
                    value: args[2].toLowerCase() === "true" ? true : false,
                }));
            } else {
                cmdHelp(args[0]);
                if (silent)
                    handleShutdown(1);
            }
            break;
        case DeviceCommand.enableDevice:
            if (args.length === 3 && isTrueFalse(args[2])) {
                socket.send(JSON.stringify({
                    messageId: DeviceCommand.enableDevice.split(".")[1],
                    command: DeviceCommand.enableDevice,
                    serialNumber: args[1],
                    value: args[2].toLowerCase() === "true" ? true : false,
                }));
            } else {
                cmdHelp(args[0]);
                if (silent)
                    handleShutdown(1);
            }
            break;
        case DeviceCommand.lockDevice:
            if (args.length === 3 && isTrueFalse(args[2])) {
                socket.send(JSON.stringify({
                    messageId: DeviceCommand.lockDevice.split(".")[1],
                    command: DeviceCommand.lockDevice,
                    serialNumber: args[1],
                    value: args[2].toLowerCase() === "true" ? true : false,
                }));
            } else {
                cmdHelp(args[0]);
                if (silent)
                    handleShutdown(1);
            }
            break;
        case DeviceCommand.setWatermark:
            if (args.length === 3 && isNumber(args[2])) {
                socket.send(JSON.stringify({
                    messageId: DeviceCommand.setWatermark.split(".")[1],
                    command: DeviceCommand.setWatermark,
                    serialNumber: args[1],
                    value: Number.parseInt(args[2]),
                }));
            } else {
                cmdHelp(args[0]);
                if (silent)
                    handleShutdown(1);
            }
            break;
        case DeviceCommand.getPropertiesMetadata:
            if (args.length === 2) {
                socket.send(JSON.stringify({
                    messageId: internal ? `internal_${DeviceCommand.getPropertiesMetadata}` : DeviceCommand.getPropertiesMetadata.split(".")[1],
                    command: DeviceCommand.getPropertiesMetadata,
                    serialNumber: args[1],
                }));
            } else {
                cmdHelp(args[0]);
                if (silent)
                    handleShutdown(1);
            }
            break;
        case DeviceCommand.getProperties:
            if (args.length === 2) {
                socket.send(JSON.stringify({
                    messageId: DeviceCommand.getProperties.split(".")[1],
                    command: DeviceCommand.getProperties,
                    serialNumber: args[1],
                }));
            } else {
                cmdHelp(args[0]);
                if (silent)
                    handleShutdown(1);
            }
            break;
        case DeviceCommand.setProperty:
            if (args.length === 4) {
                if (devicePropertiesMetadata[args[1]] === undefined) {
                    await cmd(["device.get_properties_metadata", args[1]], false, true);
                    await waitForEvent(emitter, `device.get_properties_metadata.${args[1]}`, 10000).catch(); //TODO: Handle better the timeout exception
                }
                socket.send(JSON.stringify({
                    messageId: DeviceCommand.setProperty.split(".")[1],
                    command: DeviceCommand.setProperty,
                    serialNumber: args[1],
                    name: args[2],
                    value: parsePropertyValue(args[2], args[3], args[1], devicePropertiesMetadata),
                }));
            } else {
                cmdHelp(args[0]);
                if (silent)
                    handleShutdown(1);
            }
            break;
        case DeviceCommand.startLivestream:
            if (args.length === 2) {
                socket.send(JSON.stringify({
                    messageId: DeviceCommand.startLivestream.split(".")[1],
                    command: DeviceCommand.startLivestream,
                    serialNumber: args[1],
                }));
            } else {
                cmdHelp(args[0]);
                if (silent)
                    handleShutdown(1);
            }
            break;
        case DeviceCommand.stopLivestream:
            if (args.length === 2) {
                socket.send(JSON.stringify({
                    messageId: DeviceCommand.stopLivestream.split(".")[1],
                    command: DeviceCommand.stopLivestream,
                    serialNumber: args[1],
                }));
            } else {
                cmdHelp(args[0]);
                if (silent)
                    handleShutdown(1);
            }
            break;
        case DeviceCommand.isLiveStreaming:
            if (args.length === 2) {
                socket.send(JSON.stringify({
                    messageId: DeviceCommand.isLiveStreaming.split(".")[1],
                    command: DeviceCommand.isLiveStreaming,
                    serialNumber: args[1],
                }));
            } else {
                cmdHelp(args[0]);
                if (silent)
                    handleShutdown(1);
            }
            break;
        case DeviceCommand.triggerAlarm:
            if (args.length === 3) {
                socket.send(JSON.stringify({
                    messageId: DeviceCommand.triggerAlarm.split(".")[1],
                    command: DeviceCommand.triggerAlarm,
                    serialNumber: args[1],
                    seconds: Number.parseInt(args[2]),
                }));
            } else {
                cmdHelp(args[0]);
                if (silent)
                    handleShutdown(1);
            }
            break;
        case DeviceCommand.panAndTilt:
            if (args.length === 3) {
                socket.send(JSON.stringify({
                    messageId: DeviceCommand.panAndTilt.split(".")[1],
                    command: DeviceCommand.panAndTilt,
                    serialNumber: args[1],
                    direction: Number.parseInt(args[2]),
                }));
            } else {
                cmdHelp(args[0]);
                if (silent)
                    handleShutdown(1);
            }
            break;
        case DeviceCommand.quickResponse:
            if (args.length === 3) {
                socket.send(JSON.stringify({
                    messageId: DeviceCommand.quickResponse.split(".")[1],
                    command: DeviceCommand.quickResponse,
                    serialNumber: args[1],
                    voiceId: Number.parseInt(args[2]),
                }));
            } else {
                cmdHelp(args[0]);
                if (silent)
                    handleShutdown(1);
            }
            break;
        case DeviceCommand.resetAlarm:
            if (args.length === 2) {
                socket.send(JSON.stringify({
                    messageId: DeviceCommand.resetAlarm.split(".")[1],
                    command: DeviceCommand.resetAlarm,
                    serialNumber: args[1],
                }));
            } else {
                cmdHelp(args[0]);
                if (silent)
                    handleShutdown(1);
            }
            break;
        case DeviceCommand.getVoices:
            if (args.length === 2) {
                socket.send(JSON.stringify({
                    messageId: DeviceCommand.getVoices.split(".")[1],
                    command: DeviceCommand.getVoices,
                    serialNumber: args[1],
                }));
            } else {
                cmdHelp(args[0]);
                if (silent)
                    handleShutdown(1);
            }
            break;
        case DeviceCommand.startDownload:
            if ((args.length === 3) ||
                (args.length === 4 && isNumber(args[3]))) {
                socket.send(JSON.stringify({
                    messageId: DeviceCommand.startDownload.split(".")[1],
                    command: DeviceCommand.startDownload,
                    serialNumber: args[1],
                    path: args[2],
                    cipherId: args.length === 4 ? Number.parseInt(args[3]) : undefined,
                }));
            } else {
                cmdHelp(args[0]);
                if (silent)
                    handleShutdown(1);
            }
            break;
        case DeviceCommand.cancelDownload:
            if (args.length === 2) {
                socket.send(JSON.stringify({
                    messageId: DeviceCommand.cancelDownload.split(".")[1],
                    command: DeviceCommand.cancelDownload,
                    serialNumber: args[1],
                }));
            } else {
                cmdHelp(args[0]);
                if (silent)
                    handleShutdown(1);
            }
            break;
        case DeviceCommand.hasProperty:
            if (args.length === 3) {
                socket.send(JSON.stringify({
                    messageId: DeviceCommand.hasProperty.split(".")[1],
                    command: DeviceCommand.hasProperty,
                    serialNumber: args[1],
                    propertyName: args[2],
                }));
            } else {
                cmdHelp(args[0]);
                if (silent)
                    handleShutdown(1);
            }
            break;
        case DeviceCommand.getCommands:
            if (args.length === 2) {
                socket.send(JSON.stringify({
                    messageId: DeviceCommand.getCommands.split(".")[1],
                    command: DeviceCommand.getCommands,
                    serialNumber: args[1],
                }));
            } else {
                cmdHelp(args[0]);
                if (silent)
                    handleShutdown(1);
            }
            break;
        case DeviceCommand.hasCommand:
            if (args.length === 3) {
                socket.send(JSON.stringify({
                    messageId: DeviceCommand.hasCommand.split(".")[1],
                    command: DeviceCommand.hasCommand,
                    serialNumber: args[1],
                    commandName: args[2],
                }));
            } else {
                cmdHelp(args[0]);
                if (silent)
                    handleShutdown(1);
            }
            break;
        case DeviceCommand.startRTSPLivestream:
            if (args.length === 2) {
                socket.send(JSON.stringify({
                    messageId: DeviceCommand.startRTSPLivestream.split(".")[1],
                    command: DeviceCommand.startRTSPLivestream,
                    serialNumber: args[1],
                }));
            } else {
                cmdHelp(args[0]);
                if (silent)
                    handleShutdown(1);
            }
            break;
        case DeviceCommand.stopRTSPLivestream:
            if (args.length === 2) {
                socket.send(JSON.stringify({
                    messageId: DeviceCommand.stopRTSPLivestream.split(".")[1],
                    command: DeviceCommand.stopRTSPLivestream,
                    serialNumber: args[1],
                }));
            } else {
                cmdHelp(args[0]);
                if (silent)
                    handleShutdown(1);
            }
            break;
        case DeviceCommand.isRTSPLiveStreaming:
            if (args.length === 2) {
                socket.send(JSON.stringify({
                    messageId: DeviceCommand.isRTSPLiveStreaming.split(".")[1],
                    command: DeviceCommand.isRTSPLiveStreaming,
                    serialNumber: args[1],
                }));
            } else {
                cmdHelp(args[0]);
                if (silent)
                    handleShutdown(1);
            }
            break;
        case DeviceCommand.calibrateLock:
            if (args.length === 2) {
                socket.send(JSON.stringify({
                    messageId: DeviceCommand.calibrateLock.split(".")[1],
                    command: DeviceCommand.calibrateLock,
                    serialNumber: args[1],
                }));
            } else {
                cmdHelp(args[0]);
                if (silent)
                    handleShutdown(1);
            }
            break;
        case DeviceCommand.calibrate:
            if (args.length === 2) {
                socket.send(JSON.stringify({
                    messageId: DeviceCommand.calibrate.split(".")[1],
                    command: DeviceCommand.calibrate,
                    serialNumber: args[1],
                }));
            } else {
                cmdHelp(args[0]);
                if (silent)
                    handleShutdown(1);
            }
            break;
        case DeviceCommand.setDefaultAngle:
            if (args.length === 2) {
                socket.send(JSON.stringify({
                    messageId: DeviceCommand.setDefaultAngle.split(".")[1],
                    command: DeviceCommand.setDefaultAngle,
                    serialNumber: args[1],
                }));
            } else {
                cmdHelp(args[0]);
                if (silent)
                    handleShutdown(1);
            }
            break;
        case DeviceCommand.setPrivacyAngle:
            if (args.length === 2) {
                socket.send(JSON.stringify({
                    messageId: DeviceCommand.setPrivacyAngle.split(".")[1],
                    command: DeviceCommand.setPrivacyAngle,
                    serialNumber: args[1],
                }));
            } else {
                cmdHelp(args[0]);
                if (silent)
                    handleShutdown(1);
            }
            break;
        case DeviceCommand.unlock:
            if (args.length === 2) {
                socket.send(JSON.stringify({
                    messageId: DeviceCommand.unlock.split(".")[1],
                    command: DeviceCommand.unlock,
                    serialNumber: args[1],
                }));
            } else {
                cmdHelp(args[0]);
                if (silent)
                    handleShutdown(1);
            }
            break;
        case DeviceCommand.startTalkback:
            if (args.length === 2) {
                socket.send(JSON.stringify({
                    messageId: DeviceCommand.startTalkback.split(".")[1],
                    command: DeviceCommand.startTalkback,
                    serialNumber: args[1],
                }));
            } else {
                cmdHelp(args[0]);
                if (silent)
                    handleShutdown(1);
            }
            break;
        case DeviceCommand.stopTalkback:
            if (args.length === 2) {
                socket.send(JSON.stringify({
                    messageId: DeviceCommand.stopTalkback.split(".")[1],
                    command: DeviceCommand.stopTalkback,
                    serialNumber: args[1],
                }));
            } else {
                cmdHelp(args[0]);
                if (silent)
                    handleShutdown(1);
            }
            break;
        case DeviceCommand.isTalkbackOngoing:
            if (args.length === 2) {
                socket.send(JSON.stringify({
                    messageId: DeviceCommand.isTalkbackOngoing.split(".")[1],
                    command: DeviceCommand.isTalkbackOngoing,
                    serialNumber: args[1],
                }));
            } else {
                cmdHelp(args[0]);
                if (silent)
                    handleShutdown(1);
            }
            break;
        case DeviceCommand.isDownloading:
            if (args.length === 2) {
                socket.send(JSON.stringify({
                    messageId: DeviceCommand.isDownloading.split(".")[1],
                    command: DeviceCommand.isDownloading,
                    serialNumber: args[1],
                }));
            } else {
                cmdHelp(args[0]);
                if (silent)
                    handleShutdown(1);
            }
            break;
        case DeviceCommand.snooze:
            if ((args.length === 3 && isNumber(args[2])) ||
                (args.length === 4 && isNumber(args[2]) && isTrueFalse(args[3])) ||
                (args.length === 5 && isNumber(args[2]) && isTrueFalse(args[3]) && isTrueFalse(args[4])) ||
                (args.length === 6 && isNumber(args[2]) && isTrueFalse(args[3]) && isTrueFalse(args[4]) && isTrueFalse(args[5]))) {
                socket.send(JSON.stringify({
                    messageId: DeviceCommand.snooze.split(".")[1],
                    command: DeviceCommand.snooze,
                    serialNumber: args[1],
                    snoozeTime: Number.parseInt(args[2]),
                    snoozeChime: args.length >= 4 && args[3].toLowerCase() === "true" ? true : false,
                    snoozeMotion: args.length >= 5 && args[4].toLowerCase() === "true" ? true : false,
                    snoozeHomebase: args.length === 6 && args[5].toLowerCase() === "true" ? true : false,
                }));
            } else {
                cmdHelp(args[0]);
                if (silent)
                    handleShutdown(1);
            }
            break;
        case DeviceCommand.addUser:
            if (args.length === 4 || args.length === 5) {
                const command: IncomingCommandDeviceAddUser = {
                    messageId: DeviceCommand.addUser.split(".")[1],
                    command: DeviceCommand.addUser,
                    serialNumber: args[1],
                    username: args[2],
                    passcode: args[3]
                };
                if (args.length === 5) {
                    //TODO: Correct type casting etc.
                    command.schedule = args[5] as Schedule
                }
                socket.send(JSON.stringify(command));
            } else {
                cmdHelp(args[0]);
                if (silent)
                    handleShutdown(1);
            }
            break;
        case DeviceCommand.deleteUser:
            if (args.length === 3) {
                socket.send(JSON.stringify({
                    messageId: DeviceCommand.deleteUser.split(".")[1],
                    command: DeviceCommand.deleteUser,
                    serialNumber: args[1],
                    username: args[2],
                }));
            } else {
                cmdHelp(args[0]);
                if (silent)
                    handleShutdown(1);
            }
            break;
        case DeviceCommand.getUsers:
            if (args.length === 2) {
                socket.send(JSON.stringify({
                    messageId: DeviceCommand.getUsers.split(".")[1],
                    command: DeviceCommand.getUsers,
                    serialNumber: args[1],
                }));
            } else {
                cmdHelp(args[0]);
                if (silent)
                    handleShutdown(1);
            }
            break;
        case DeviceCommand.updateUser:
            if (args.length === 4) {
                const command: IncomingCommandDeviceUpdateUser = {
                    messageId: DeviceCommand.updateUser.split(".")[1],
                    command: DeviceCommand.updateUser,
                    serialNumber: args[1],
                    username: args[2],
                    newUsername: args[3]
                };
                socket.send(JSON.stringify(command));
            } else {
                cmdHelp(args[0]);
                if (silent)
                    handleShutdown(1);
            }
            break;
        case DeviceCommand.updateUserPasscode:
            if (args.length === 4 && isNumber(args[3])) {
                const command: IncomingCommandDeviceUpdateUserPasscode = {
                    messageId: DeviceCommand.updateUserPasscode.split(".")[1],
                    command: DeviceCommand.updateUserPasscode,
                    serialNumber: args[1],
                    username: args[2],
                    passcode: args[3]
                };
                socket.send(JSON.stringify(command));
            } else {
                cmdHelp(args[0]);
                if (silent)
                    handleShutdown(1);
            }
            break;
        case DeviceCommand.updateUserSchedule:
            if (args.length === 4) {
                const command: IncomingCommandDeviceUpdateUserSchedule = {
                    messageId: DeviceCommand.updateUserSchedule.split(".")[1],
                    command: DeviceCommand.updateUserSchedule,
                    serialNumber: args[1],
                    username: args[2],
                    schedule: args[3] as Schedule, //TODO: Correct type casting etc.
                };
                socket.send(JSON.stringify(command));
            } else {
                cmdHelp(args[0]);
                if (silent)
                    handleShutdown(1);
            }
            break;
        case DeviceCommand.verifyPIN:
            if (args.length === 3) {
                socket.send(JSON.stringify({
                    messageId: DeviceCommand.verifyPIN.split(".")[1],
                    command: DeviceCommand.verifyPIN,
                    serialNumber: args[1],
                    pin: args[2],
                }));
            } else {
                cmdHelp(args[0]);
                if (silent)
                    handleShutdown(1);
            }
            break;
        case StationCommand.setGuardMode:
            if (args.length === 3 && isNumber(args[2])) {
                socket.send(JSON.stringify({
                    messageId: StationCommand.setGuardMode.split(".")[1],
                    command: StationCommand.setGuardMode,
                    serialNumber: args[1],
                    mode: Number.parseInt(args[2]),
                }));
            } else {
                cmdHelp(args[0]);
                if (silent)
                    handleShutdown(1);
            }
            break;
        case StationCommand.reboot:
            if (args.length === 2) {
                socket.send(JSON.stringify({
                    messageId: StationCommand.reboot.split(".")[1],
                    command: StationCommand.reboot,
                    serialNumber: args[1],
                }));
            } else {
                cmdHelp(args[0]);
                if (silent)
                    handleShutdown(1);
            }
            break;
        case StationCommand.isConnected:
            if (args.length === 2) {
                socket.send(JSON.stringify({
                    messageId: StationCommand.isConnected.split(".")[1],
                    command: StationCommand.isConnected,
                    serialNumber: args[1],
                }));
            } else {
                cmdHelp(args[0]);
                if (silent)
                    handleShutdown(1);
            }
            break;
        case StationCommand.connect:
            if (args.length === 2) {
                socket.send(JSON.stringify({
                    messageId: StationCommand.connect.split(".")[1],
                    command: StationCommand.connect,
                    serialNumber: args[1],
                }));
            } else {
                cmdHelp(args[0]);
                if (silent)
                    handleShutdown(1);
            }
            break;
        case StationCommand.disconnect:
            if (args.length === 2) {
                socket.send(JSON.stringify({
                    messageId: StationCommand.disconnect.split(".")[1],
                    command: StationCommand.disconnect,
                    serialNumber: args[1],
                }));
            } else {
                cmdHelp(args[0]);
                if (silent)
                    handleShutdown(1);
            }
            break;
        case StationCommand.getPropertiesMetadata:
            if (args.length === 2) {
                socket.send(JSON.stringify({
                    messageId: internal ? `internal_${StationCommand.getPropertiesMetadata}` : StationCommand.getPropertiesMetadata.split(".")[1],
                    command: StationCommand.getPropertiesMetadata,
                    serialNumber: args[1],
                }));
            } else {
                cmdHelp(args[0]);
                if (silent)
                    handleShutdown(1);
            }
            break;
        case StationCommand.getProperties:
            if (args.length === 2) {
                socket.send(JSON.stringify({
                    messageId: StationCommand.getProperties.split(".")[1],
                    command: StationCommand.getProperties,
                    serialNumber: args[1],
                }));
            } else {
                cmdHelp(args[0]);
                if (silent)
                    handleShutdown(1);
            }
            break;
        case StationCommand.setProperty:
            if (args.length === 4) {
                if (stationPropertiesMetadata[args[1]] === undefined) {
                    await cmd(["station.get_properties_metadata", args[1]], false, true);
                    await waitForEvent(emitter, `station.get_properties_metadata.${args[1]}`, 10000).catch(); //TODO: Handle better the timeout exception
                }
                socket.send(JSON.stringify({
                    messageId: StationCommand.setProperty.split(".")[1],
                    command: StationCommand.setProperty,
                    serialNumber: args[1],
                    name: args[2],
                    value: parsePropertyValue(args[2], args[3], args[1], stationPropertiesMetadata),
                }));
            } else {
                cmdHelp(args[0]);
                if (silent)
                    handleShutdown(1);
            }
            break;
        case StationCommand.triggerAlarm:
            if (args.length === 3) {
                socket.send(JSON.stringify({
                    messageId: StationCommand.triggerAlarm.split(".")[1],
                    command: StationCommand.triggerAlarm,
                    serialNumber: args[1],
                    seconds: Number.parseInt(args[2]),
                }));
            } else {
                cmdHelp(args[0]);
                if (silent)
                    handleShutdown(1);
            }
            break;
        case StationCommand.resetAlarm:
            if (args.length === 2) {
                socket.send(JSON.stringify({
                    messageId: StationCommand.resetAlarm.split(".")[1],
                    command: StationCommand.resetAlarm,
                    serialNumber: args[1],
                }));
            } else {
                cmdHelp(args[0]);
                if (silent)
                    handleShutdown(1);
            }
            break;
        case StationCommand.getCommands:
            if (args.length === 2) {
                socket.send(JSON.stringify({
                    messageId: StationCommand.getCommands.split(".")[1],
                    command: StationCommand.getCommands,
                    serialNumber: args[1],
                }));
            } else {
                cmdHelp(args[0]);
                if (silent)
                    handleShutdown(1);
            }
            break;
        case StationCommand.hasProperty:
            if (args.length === 3) {
                socket.send(JSON.stringify({
                    messageId: StationCommand.hasProperty.split(".")[1],
                    command: StationCommand.hasProperty,
                    serialNumber: args[1],
                    propertyName: args[2],
                }));
            } else {
                cmdHelp(args[0]);
                if (silent)
                    handleShutdown(1);
            }
            break;
        case StationCommand.hasCommand:
            if (args.length === 3) {
                socket.send(JSON.stringify({
                    messageId: StationCommand.hasCommand.split(".")[1],
                    command: StationCommand.hasCommand,
                    serialNumber: args[1],
                    commandName: args[2],
                }));
            } else {
                cmdHelp(args[0]);
                if (silent)
                    handleShutdown(1);
            }
            break;
        case StationCommand.chime:
            if (args.length === 2 || (args.length === 3 && isNumber(args[2]))) {
                const command: IncomingCommandChime = {
                    messageId: StationCommand.chime.split(".")[1],
                    command: StationCommand.chime,
                    serialNumber: args[1],
                };
                if (args.length === 3) {
                    command.ringtone = Number.parseInt(args[2]);
                }
                socket.send(JSON.stringify(command));
            } else {
                cmdHelp(args[0]);
                if (silent)
                    handleShutdown(1);
            }
            break;
        case StationCommand.downloadImage:
            if (args.length === 3) {
                const command: IncomingCommandDownloadImage = {
                    messageId: StationCommand.downloadImage.split(".")[1],
                    command: StationCommand.downloadImage,
                    serialNumber: args[1],
                    file: args[2]
                };
                socket.send(JSON.stringify(command));
            } else {
                cmdHelp(args[0]);
                if (silent)
                    handleShutdown(1);
            }
            break;
        case StationCommand.databaseQueryLatestInfo:
            if (args.length === 2) {
                socket.send(JSON.stringify({
                    messageId: StationCommand.databaseQueryLatestInfo.split(".")[1],
                    command: StationCommand.databaseQueryLatestInfo,
                    serialNumber: args[1],
                }));
            } else {
                cmdHelp(args[0]);
                if (silent)
                    handleShutdown(1);
            }
            break;
        case StationCommand.databaseQueryLocal:
            if ((args.length === 5 && isDate(args[3]) && isDate(args[4])) ||
                (args.length === 6 && isDate(args[3]) && isDate(args[4]) && isNumber(args[5])) ||
                (args.length === 7 && isDate(args[3]) && isDate(args[4]) && isNumber(args[5]) && isNumber(args[6])) ||
                (args.length === 8 && isDate(args[3]) && isDate(args[4]) && isNumber(args[5]) && isNumber(args[6]) && isNumber(args[7]))) {
                const command: IncomingCommandDatabaseQueryLocal = {
                    messageId: StationCommand.databaseQueryLocal.split(".")[1],
                    command: StationCommand.databaseQueryLocal,
                    serialNumber: args[1],
                    serialNumbers: args[2].split(","),
                    startDate: args[3],
                    endDate: args[4]
                };
                if (args.length === 6) {
                    command.eventType = Number.parseInt(args[5]);
                }
                if (args.length === 7) {
                    command.detectionType = Number.parseInt(args[6]);
                }
                if (args.length === 8) {
                    command.storageType = Number.parseInt(args[7]);
                }
                socket.send(JSON.stringify(command));
            } else {
                cmdHelp(args[0]);
                if (silent)
                    handleShutdown(1);
            }
            break;
        case StationCommand.databaseCountByDate:
            if (args.length === 4 && isDate(args[2]) && isDate(args[3])) {
                socket.send(JSON.stringify({
                    messageId: StationCommand.databaseCountByDate.split(".")[1],
                    command: StationCommand.databaseCountByDate,
                    serialNumber: args[1],
                    startDate: args[2],
                    endDate: args[3]
                }));
            } else {
                cmdHelp(args[0]);
                if (silent)
                    handleShutdown(1);
            }
            break;
        case StationCommand.databaseDelete:
            if (args.length >= 3) {
                let argsOk = true;
                const ids: Array<number> = [];
                for(const arg of args.slice(2)) {
                    if (!isNumber(arg)) {
                        argsOk = false;
                        break;
                    } else {
                        ids.push(Number.parseInt(arg));
                    }
                }
                if (argsOk) {
                    socket.send(JSON.stringify({
                        messageId: StationCommand.databaseDelete.split(".")[1],
                        command: StationCommand.databaseDelete,
                        serialNumber: args[1],
                        ids: ids
                    }));
                } else {
                    cmdHelp(args[0]);
                    if (silent)
                        handleShutdown(1);
                }
            } else {
                cmdHelp(args[0]);
                if (silent)
                    handleShutdown(1);
            }
            break;
        default:
            if (args[0] !== "")
                cmdHelp("");
            if (silent)
                handleShutdown(1);
            break;
    }
    return args;
};

const isNumber = (value: string): boolean => {
    try {
        Number.parseInt(value);
        return true;
    } catch (error) {
        return false;
    }
};

const isTrueFalse = (value: string): boolean => {
    if (value.toLowerCase() === "true" || value.toLowerCase() === "false") {
        return true;
    }
    return false;
}

const isDate = (value: string): boolean => {
    return !isNaN(date.parse(value, "YYYYMMDD").getTime());
}

const program = new Command();
program
    .addOption(new Option("-s, --schemaVersion <host>", "Schema version the server should support").default(maxSchemaVersion, "max client supported version"))
    .addOption(new Option("-H, --host <host>", "Host to connect to").default("localhost"))
    .addOption(new Option("-p, --port <port>", "Port to connect to").default(3000))
    .addOption(new Option("-c, --command <command_name>", "Silent command to execute").choices(commands))
    .addOption(new Option("-a, --arguments <args...>", "Arguments for silent command if expected"))
    .addOption(new Option("-t, --timeout <seconds>", "Silent command timeout seconds").default(30))
    .addOption(new Option("-v, --verbose"));

program.parse(process.argv);

const options = program.opts();

const schemaVersion = options.schemaVersion
    ? Number(options.schemaVersion)
    : maxSchemaVersion;
const url = `ws://${options.host}:${options.port}`;

if (isNaN(schemaVersion) || schemaVersion > maxSchemaVersion || schemaVersion < 0) {
    console.log("Schema version must be between 0 and ", maxSchemaVersion);
    process.exit();
}

if (options.verbose) {
    console.info("Connecting to", url);
}

const logger = new Logger({ minLevel: options.verbose ? "silly" : "info", displayDateTime: false, displayFunctionName: false, displayLogLevel: false, displayFilePath: "hidden" });
const socket = new WebSocket(url, { handshakeTimeout: options.timeout * 1000 });

socket.on("open", function open() {
    socket.send(
        JSON.stringify({
            messageId: "api-schema-id",
            command: "set_api_schema",
            schemaVersion: schemaVersion,
        })
    );
    socket.send(
        JSON.stringify({
            messageId: "start-listening-result",
            command: "start_listening",
        })
    );
});

let rl: readline.Interface;
let silendCommandTimeout: NodeJS.Timeout | undefined;

socket.on("message", (data) => {
    const msg = JSON.parse(data.toString()) as OutgoingMessage;

    if (msg.type === "event") {
        const event = msg as OutgoingEventMessage;
        if (event.event.source === "server" && event.event.event === "shutdown") {
            handleShutdown(options.command === undefined ? 0 : 2);
        } else if (options.command !== undefined && event.event.event === "command result") {
            const source = options.command.split(".")[0];
            const command = options.command.split(".")[1];
            if (source === "device") {
                const deviceEvent = event.event as OutgoingEventDeviceCommandResult;
                if (deviceEvent.source === source && deviceEvent.command === command) {
                    if (silendCommandTimeout) {
                        clearTimeout(silendCommandTimeout)
                        silendCommandTimeout = undefined;
                    }
                    handleShutdown(deviceEvent.returnCode === 0 ? 0 : 2);
                }
            } else if (source === "station") {
                const stationEvent = event.event as OutgoingEventStationCommandResult;
                if (stationEvent.source === source && stationEvent.command === command) {
                    if (silendCommandTimeout) {
                        clearTimeout(silendCommandTimeout)
                        silendCommandTimeout = undefined;
                    }
                    handleShutdown(stationEvent.returnCode === 0 ? 0 : 2);
                }
            }
            
        }
    } else if (msg.type === "result") {
        const resultMsg = msg as OutgoingResultMessageSuccess;
        switch (resultMsg.messageId) {
            case "start-listening-result":
            {
                if (options.command === undefined) {
                    rl = readline.createInterface({
                        input: process.stdin,
                        output: process.stdout,
                        terminal: true,
                        prompt: c.cyan.bold("eufy-security> "),
                        completer: (line: string) => {
                            const hits = commands.filter((c) => c.startsWith(line) && line.substring(c.length) === "");
                            return [ hits, line]
                        }
                    });

                    rl.prompt(true);

                    rl.on("line", (line) => {
                        cmd(line.split(" ")).then((args) => {
                            switch (args[0]) {
                                case "exit":
                                case "quit":
                                    rl.close();
                                    break;
                            }
                            rl.prompt(true);
                        }).catch();
                    }).on("close", () => {
                        handleShutdown();
                    });
                } else {
                    cmd([options.command as string].concat(options.arguments !== undefined ? options.arguments as Array<string> : []), options.command !== undefined);
                }
                break;
            }
            case `internal_${DeviceCommand.getPropertiesMetadata}`:{
                const result = resultMsg.result as { serialNumber?: string; properties: Record<string, unknown>; };
                if (result.serialNumber !== undefined) {
                    devicePropertiesMetadata[result.serialNumber] = result.properties as IndexedProperty;
                    emitter.emit(`device.get_properties_metadata.${result.serialNumber}`);
                }
                break;
            }
            case `internal_${StationCommand.getPropertiesMetadata}`:
                const result = resultMsg.result as { serialNumber?: string; properties: Record<string, unknown>; };
                if (result.serialNumber !== undefined) {
                    stationPropertiesMetadata[result.serialNumber] = result.properties as IndexedProperty;
                    emitter.emit(`station.get_properties_metadata.${result.serialNumber}`);
                }
                break;
            case convertCamelCaseToSnakeCase(options.command?.split(".")[1]):
                if (resultMsg.success) {
                    const msgSuccess = (msg as OutgoingResultMessageSuccess);
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    if (msgSuccess.result && (msgSuccess.result as any).async === undefined) {
                        logger.info(msgSuccess.result);
                        handleShutdown(msg.success ? 0 : 2);
                    } else {
                        silendCommandTimeout = setTimeout(() => {
                            handleShutdown(3);
                        }, options.timeout * 1000);
                    }
                } else {
                    handleShutdown(msg.success ? 0 : 2);
                }
                break;
        }
    }

    if ((msg.type === "result" && !msg.messageId.startsWith("internal_")) || msg.type !== "result") {
        if (options.command === undefined) {
            if (options.verbose) {
                if (rl)
                    console.log();
                logger.info("Response:", msg);
            } else {
                if (rl)
                    console.log();
                console.dir(msg, { depth: 10 });
            }
            rl?.prompt(true);
        } else if (options.verbose) {
            logger.info("Response:", msg);
        }
    }
});

socket.on("error", (error: Error) => {
    if (options.verbose) {
        console.log(error);
    }
    handleShutdown(4);
});

let closing = false;
const handleShutdown = (exitcode=0) => {
    if (silendCommandTimeout) {
        clearTimeout(silendCommandTimeout)
        silendCommandTimeout = undefined;
    }

    // Pressing ctrl+c twice.
    if (closing) {
        process.exit();
    }

    // Close gracefully
    closing = true;
    if (options.verbose) {
        console.log("Shutting down");
    }
    socket.close(1000);
    process.exit(exitcode);
};
process.on("SIGINT", handleShutdown);
process.on("SIGTERM", handleShutdown);