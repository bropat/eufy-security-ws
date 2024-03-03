import { EufySecurity, LoginOptions } from "eufy-security-client";
import { ILogObj, Logger } from "tslog";

import { UnknownCommandError } from "../error.js";
import { Client, ClientsController } from "../server.js";
import { DriverCommand } from "./command.js";
import { DriverEvent } from "./event.js";
import { IncomingMessageDriver, IncomingCommandSetVerifyCode, IncomingCommandGetVideoEvents, IncomingCommandSetCaptcha, IncomingCommandSetLogLevel, IncomingCommandGetAlarmEvents, IncomingCommandGetHistoryEvents } from "./incoming_message.js";
import { DriverResultTypes } from "./outgoing_message.js";
import { LogLevel, LogLevelName, convertLogLevelToDriver, convertLogLevelToServer } from "../logging.js";

export class DriverMessageHandler {

    public static captchaId: string | null = null;
    public static captcha: string | null = null;
    public static tfa = false;

    static async handle(message: IncomingMessageDriver, driver: EufySecurity, client: Client, clientsController: ClientsController, logger: Logger<ILogObj>): Promise<DriverResultTypes[DriverCommand]> {
        const { command } = message;
        switch (command) {
            case DriverCommand.setVerifyCode:
            {
                let result = true;
                try {
                    DriverMessageHandler.tfa = false;
                    await driver.connect({
                        verifyCode: (message as IncomingCommandSetVerifyCode).verifyCode
                    } as LoginOptions);
                } catch (error) {
                    result = false
                }
                if (client.schemaVersion <= 9) {
                    return { result: result };
                }
                return { };
            }
            case DriverCommand.setCaptcha:
            {
                let result = true;
                try {
                    const captchaId = (message as IncomingCommandSetCaptcha).captchaId ? (message as IncomingCommandSetCaptcha).captchaId : DriverMessageHandler.captchaId;
                    DriverMessageHandler.captchaId = null;
                    DriverMessageHandler.captcha = null;
                    if (captchaId) {
                        await driver.connect({
                            captcha: {
                                captchaCode: (message as IncomingCommandSetCaptcha).captcha,
                                captchaId: captchaId
                            }
                        } as LoginOptions);
                    }
                } catch (error) {
                    result = false
                }
                if (client.schemaVersion <= 9) {
                    return { result: result };
                }
                return { };
            }
            case DriverCommand.pollRefresh:
                await driver.refreshCloudData().catch((error) => {
                    throw error;
                });
                return { };
            case DriverCommand.isConnected:
            case DriverCommand.isConnectedLegacy:
            {
                const result = driver.isConnected();
                return { connected: result };
            }
            case DriverCommand.isPushConnected:
            case DriverCommand.isPushConnectedLegacy:
            {
                const result = driver.isPushConnected();
                return { connected: result };
            }
            case DriverCommand.connect:
            {
                let result = true;
                try {
                    await driver.connect();
                } catch (error) {
                    result = false
                }
                if (client.schemaVersion <= 9) {
                    return { result: result };
                }
                return { };
            }
            case DriverCommand.disconnect:
                driver.close();
                return { };
            case DriverCommand.getVideoEvents:
            {
                if (client.schemaVersion >= 3) {
                    const fifthyYearsInMilliseconds = 15 * 365 * 24 * 60 * 60 * 1000;
                    const videoMessage = message as IncomingCommandGetVideoEvents;
                    let startTime = new Date(new Date().getTime() - fifthyYearsInMilliseconds);
                    let endTime = new Date();
                    if (videoMessage.startTimestampMs !== undefined) {
                        startTime = new Date(videoMessage.startTimestampMs);
                    }
                    if (videoMessage.endTimestampMs !== undefined) {
                        endTime = new Date(videoMessage.endTimestampMs);
                    }
                    const events = await driver.getApi().getVideoEvents(startTime, endTime, videoMessage.filter, videoMessage.maxResults);
                    return { events: events };
                } else {
                    throw new UnknownCommandError(command);
                }
            }
            case DriverCommand.getAlarmEvents:
            {
                if (client.schemaVersion >= 3) {
                    const fifthyYearsInMilliseconds = 15 * 365 * 24 * 60 * 60 * 1000;
                    const alarmMessage = message as IncomingCommandGetAlarmEvents;
                    let startTime = new Date(new Date().getTime() - fifthyYearsInMilliseconds);
                    let endTime = new Date();
                    if (alarmMessage.startTimestampMs !== undefined) {
                        startTime = new Date(alarmMessage.startTimestampMs);
                    }
                    if (alarmMessage.endTimestampMs !== undefined) {
                        endTime = new Date(alarmMessage.endTimestampMs);
                    }
                    const events = await driver.getApi().getAlarmEvents(startTime, endTime, alarmMessage.filter, alarmMessage.maxResults);
                    return { events: events };
                } else {
                    throw new UnknownCommandError(command);
                }
            }
            case DriverCommand.getHistoryEvents:
            {
                if (client.schemaVersion >= 3) {
                    const fifthyYearsInMilliseconds = 15 * 365 * 24 * 60 * 60 * 1000;
                    const historyMessage = message as IncomingCommandGetHistoryEvents;
                    let startTime = new Date(new Date().getTime() - fifthyYearsInMilliseconds);
                    let endTime = new Date();
                    if (historyMessage.startTimestampMs !== undefined) {
                        startTime = new Date(historyMessage.startTimestampMs);
                    }
                    if (historyMessage.endTimestampMs !== undefined) {
                        endTime = new Date(historyMessage.endTimestampMs);
                    }
                    const events = await driver.getApi().getHistoryEvents(startTime, endTime, historyMessage.filter, historyMessage.maxResults);
                    return { events: events };
                } else {
                    throw new UnknownCommandError(command);
                }
            }
            case DriverCommand.getLogLevel:
                return { level: LogLevel[convertLogLevelToServer(driver.getLoggingLevel("all"))] as LogLevelName };
            case DriverCommand.setLogLevel:
                driver.setLoggingLevel("all", convertLogLevelToDriver((message as IncomingCommandSetLogLevel).level));
                clientsController.restartLoggingEventForwarderIfNeeded();
                clientsController.clients.forEach((client) => {
                    client.sendEvent({
                        source: "driver",
                        event: DriverEvent.logLevelChanged,
                        level: (message as IncomingCommandSetLogLevel).level,
                    });
                });
                return {};
            case DriverCommand.startListeningLogs:
                client.receiveLogs = true;
                clientsController.startLoggingEventForwarder();
                return {};
            case DriverCommand.stopListeningLogs:
                client.receiveLogs = false;
                clientsController.stopLoggingEventForwarder();
                return {};
            case DriverCommand.isMqttConnected:
            {
                const result = driver.isMQTTConnected();
                return { connected: result };
            }
            case DriverCommand.isListeningLogs:
            {
                if (client.schemaVersion >= 21) {
                    return { started: clientsController.loggingEventForwarderStarted };
                } else {
                    throw new UnknownCommandError(command);
                }
            }
            default:
                throw new UnknownCommandError(command);
        }
    }
}
