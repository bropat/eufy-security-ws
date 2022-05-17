import { EufySecurity, LoginOptions } from "eufy-security-client";
import { Logger } from "tslog";

import { UnknownCommandError } from "../error";
import { Client, ClientsController } from "../server";
import { DriverCommand } from "./command";
import { DriverEvent } from "./event";
import { IncomingMessageDriver, IncomingCommandSetVerifyCode, IncomingCommandGetVideoEvents, IncomingCommandSetCaptcha, IncomingCommandSetLogLevel } from "./incoming_message";
import { DriverResultTypes } from "./outgoing_message";

export class DriverMessageHandler {

    static captchaId: string | null = null;

    static async handle(message: IncomingMessageDriver, driver: EufySecurity, client: Client, clientsController: ClientsController, logger: Logger): Promise<DriverResultTypes[DriverCommand]> {
        const { command } = message;
        switch (command) {
            case DriverCommand.setVerifyCode:
            {
                let result = true;
                try {
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
                    this.captchaId = null;
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
                }
            }
            case DriverCommand.getAlarmEvents:
            {
                if (client.schemaVersion >= 3) {
                    const fifthyYearsInMilliseconds = 15 * 365 * 24 * 60 * 60 * 1000;
                    const alarmMessage = message as IncomingCommandGetVideoEvents;
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
                }
            }
            case DriverCommand.getHistoryEvents:
            {
                if (client.schemaVersion >= 3) {
                    const fifthyYearsInMilliseconds = 15 * 365 * 24 * 60 * 60 * 1000;
                    const historyMessage = message as IncomingCommandGetVideoEvents;
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
                }
            }
            case DriverCommand.getLogLevel:
                return { level: logger.settings.minLevel };
            case DriverCommand.setLogLevel:
                // If the logging event forwarder is enabled, we need to restart
                // it so that it picks up the new config.
                logger.setSettings({
                    minLevel: (message as IncomingCommandSetLogLevel).level
                });
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
                clientsController.configureLoggingEventForwarder();
                return {};
            case DriverCommand.stopListeningLogs:
                client.receiveLogs = false;
                clientsController.cleanupLoggingEventForwarder();
                return {};
            case DriverCommand.isMqttConnected:
            {
                const result = driver.isMQTTConnected();
                return { connected: result };
            }
            default:
                throw new UnknownCommandError(command);
        }
    }
}
