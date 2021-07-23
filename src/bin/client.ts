#!/usr/bin/env node

import ws from "ws";
import { Command, Option } from "commander";
import promptly from "promptly";
import c from "ansi-colors";
import { Logger } from "tslog";

import { maxSchemaVersion } from "../lib/const";
import { OutgoingEventMessage, OutgoingMessage } from "../lib/outgoing_message";
import { DriverCommand } from "../lib/driver/command";
import { DeviceCommand } from "../lib/device/command";
import { StationCommand } from "../lib/station/command";

const cmdHelp = (cmd: string): void => {
    switch (cmd) {
        case DriverCommand.setVerifyCode:
            console.log(`${cmd} <numeric_code>`);
            break;
        case DriverCommand.pollRefresh:
        case DriverCommand.isConnected:
        case DriverCommand.isPushConnected:
        case DriverCommand.connect:
        case DriverCommand.disconnect:
        case DriverCommand.getVideoEvents:
        case DriverCommand.getAlarmEvents:
        case DriverCommand.getHistoryEvents:
            console.log(`${cmd}`);
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
            console.log(`${cmd} <device_sn>`);
            break;
        case DeviceCommand.setProperty:
            console.log(`${cmd} <device_sn> <name> <value>`);
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
            console.log(`${cmd} <device_sn> <path> <cipherId>`);
            break;
        case DeviceCommand.hasProperty:
        case DeviceCommand.hasCommand:
            console.log(`${cmd} <device_sn> <name>`);
            break;
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
        /*case StationCommand.getCameraInfo:
        case StationCommand.getStorageInfo:
            console.log("Command not implemented.");
            break;*/
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

const program = new Command();
program
    .addOption(new Option("-s, --schemaVersion <host>", "Schema version the server should support").default(maxSchemaVersion, "max client supported version"))
    .addOption(new Option("-H, --host <host>", "Host to connecto to").default("localhost"))
    .addOption(new Option("-p, --port <port>", "Port to connecto to").default(3000))
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

if (!options.verbose) {
    console.info("Connecting to", url);
}

const logger = new Logger({ minLevel: options.verbose ? "silly" : "info", displayDateTime: false, displayFunctionName: false, displayLogLevel: false, displayFilePath: "hidden" });
const socket = new ws(url);

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

socket.on("message", (data) => {
    const msg = JSON.parse(data.toString()) as OutgoingMessage;

    if (msg.type === "event") {
        const event = msg as OutgoingEventMessage;
        if (event.event.source === "driver" && event.event.event === "verify code") {
            (async () => {
                const verifyCode = await promptly.prompt("Insert verify code: ");
                socket.send(JSON.stringify({
                    messageId: "set_verify_code",
                    command: "driver.set_verify_code",
                    verifyCode: verifyCode
                }));
            })();
        }
    }

    if (options.verbose) {
        //console.log(JSON.stringify(msg));
        logger.info("Response:", msg);
    } else {
        console.dir(msg);
    }
});

let closing = false;
const handleShutdown = () => {
    // Pressing ctrl+c twice.
    if (closing) {
        process.exit();
    }

    // Close gracefully
    closing = true;
    if (!options.verbose) {
        console.log("Shutting down");
    }
    socket.close();
    process.exit();
};
process.on("SIGINT", handleShutdown);
process.on("SIGTERM", handleShutdown);

(async () => {
    let cmd
    do {
        cmd = await promptly.prompt(c.cyan.bold("eufy-security>"));
        const args = cmd.split(" ");
        switch (args[0]) {
            case "help": 
                if (args.length <= 1 || args.length > 2) {
                    cmdHelp("");
                } else {
                    cmdHelp(args[1]);
                }
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
                }
                break;
            case DeviceCommand.setStatusLed:
                if (args.length === 3 && isTrueFalse(args[2])) {
                    socket.send(JSON.stringify({
                        messageId: DeviceCommand.setStatusLed.split(".")[1],
                        command: DeviceCommand.setStatusLed,
                        serialNumber: args[1],
                        value: args[2] === "true" ? true : false,
                    }));
                } else {
                    cmdHelp(args[0]);
                }
                break;
            case DeviceCommand.setAutoNightVision:
                if (args.length === 3 && isTrueFalse(args[2])) {
                    socket.send(JSON.stringify({
                        messageId: DeviceCommand.setAutoNightVision.split(".")[1],
                        command: DeviceCommand.setAutoNightVision,
                        serialNumber: args[1],
                        value: args[2] === "true" ? true : false,
                    }));
                } else {
                    cmdHelp(args[0]);
                }
                break;
            case DeviceCommand.setMotionDetection:
                if (args.length === 3 && isTrueFalse(args[2])) {
                    socket.send(JSON.stringify({
                        messageId: DeviceCommand.setMotionDetection.split(".")[1],
                        command: DeviceCommand.setMotionDetection,
                        serialNumber: args[1],
                        value: args[2] === "true" ? true : false,
                    }));
                } else {
                    cmdHelp(args[0]);
                }
                break;
            case DeviceCommand.setSoundDetection:
                if (args.length === 3 && isTrueFalse(args[2])) {
                    socket.send(JSON.stringify({
                        messageId: DeviceCommand.setSoundDetection.split(".")[1],
                        command: DeviceCommand.setSoundDetection,
                        serialNumber: args[1],
                        value: args[2] === "true" ? true : false,
                    }));
                } else {
                    cmdHelp(args[0]);
                }
                break;
            case DeviceCommand.setPetDetection:
                if (args.length === 3 && isTrueFalse(args[2])) {
                    socket.send(JSON.stringify({
                        messageId: DeviceCommand.setPetDetection.split(".")[1],
                        command: DeviceCommand.setPetDetection,
                        serialNumber: args[1],
                        value: args[2] === "true" ? true : false,
                    }));
                } else {
                    cmdHelp(args[0]);
                }
                break;
            case DeviceCommand.setRTSPStream:
                if (args.length === 3 && isTrueFalse(args[2])) {
                    socket.send(JSON.stringify({
                        messageId: DeviceCommand.setRTSPStream.split(".")[1],
                        command: DeviceCommand.setRTSPStream,
                        serialNumber: args[1],
                        value: args[2] === "true" ? true : false,
                    }));
                } else {
                    cmdHelp(args[0]);
                }
                break;
            case DeviceCommand.setAntiTheftDetection:
                if (args.length === 3 && isTrueFalse(args[2])) {
                    socket.send(JSON.stringify({
                        messageId: DeviceCommand.setAntiTheftDetection.split(".")[1],
                        command: DeviceCommand.setAntiTheftDetection,
                        serialNumber: args[1],
                        value: args[2] === "true" ? true : false,
                    }));
                } else {
                    cmdHelp(args[0]);
                }
                break;
            case DeviceCommand.enableDevice:
                if (args.length === 3 && isTrueFalse(args[2])) {
                    socket.send(JSON.stringify({
                        messageId: DeviceCommand.enableDevice.split(".")[1],
                        command: DeviceCommand.enableDevice,
                        serialNumber: args[1],
                        value: args[2] === "true" ? true : false,
                    }));
                } else {
                    cmdHelp(args[0]);
                }
                break;
            case DeviceCommand.lockDevice:
                if (args.length === 3 && isTrueFalse(args[2])) {
                    socket.send(JSON.stringify({
                        messageId: DeviceCommand.lockDevice.split(".")[1],
                        command: DeviceCommand.lockDevice,
                        serialNumber: args[1],
                        value: args[2] === "true" ? true : false,
                    }));
                } else {
                    cmdHelp(args[0]);
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
                }
                break;
            case DeviceCommand.getPropertiesMetadata:
                if (args.length === 2) {
                    socket.send(JSON.stringify({
                        messageId: DeviceCommand.getPropertiesMetadata.split(".")[1],
                        command: DeviceCommand.getPropertiesMetadata,
                        serialNumber: args[1],
                    }));
                } else {
                    cmdHelp(args[0]);
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
                }
                break;
            case DeviceCommand.setProperty:
                if (args.length === 4) {
                    socket.send(JSON.stringify({
                        messageId: DeviceCommand.setProperty.split(".")[1],
                        command: DeviceCommand.setProperty,
                        serialNumber: args[1],
                        name: args[2],
                        value: args[3],
                    }));
                } else {
                    cmdHelp(args[0]);
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
                }
                break;
            case DeviceCommand.startDownload:
                if (args.length === 4) {
                    socket.send(JSON.stringify({
                        messageId: DeviceCommand.startDownload.split(".")[1],
                        command: DeviceCommand.startDownload,
                        serialNumber: args[1],
                        path: args[2],
                        cipherId: Number.parseInt(args[3]),
                    }));
                } else {
                    cmdHelp(args[0]);
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
                }
                break;
            case StationCommand.getPropertiesMetadata:
                if (args.length === 2) {
                    socket.send(JSON.stringify({
                        messageId: StationCommand.getPropertiesMetadata.split(".")[1],
                        command: StationCommand.getPropertiesMetadata,
                        serialNumber: args[1],
                    }));
                } else {
                    cmdHelp(args[0]);
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
                }
                break;
            case StationCommand.setProperty:
                if (args.length === 4) {
                    socket.send(JSON.stringify({
                        messageId: StationCommand.setProperty.split(".")[1],
                        command: StationCommand.setProperty,
                        serialNumber: args[1],
                        name: args[2],
                        value: args[3],
                    }));
                } else {
                    cmdHelp(args[0]);
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
                }
                break;
            /*case StationCommand.getCameraInfo:
            case StationCommand.getStorageInfo:
                console.log("Command not implemented.");
                break;*/
        }
    } while(cmd !== "quit" && cmd !== "exit")
    handleShutdown();
})();