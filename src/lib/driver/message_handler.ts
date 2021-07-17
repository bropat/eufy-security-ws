import { EufySecurity } from "eufy-security-client";
import { UnknownCommandError } from "../error";
import { Client } from "../server";
import { DriverCommand } from "./command";
import { IncomingMessageDriver, IncomingCommandSetVerifyCode, IncomingCommandGetVideoEvents } from "./incoming_message";
import { DriverResultTypes } from "./outgoing_message";

export class DriverMessageHandler {

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    static async handle(message: IncomingMessageDriver, driver: EufySecurity, client: Client): Promise<DriverResultTypes[DriverCommand]> {
        const { command } = message;
        switch (command) {
            case DriverCommand.setVerifyCode:
            {
                const result = await driver.connect((message as IncomingCommandSetVerifyCode).verifyCode).catch((error) => {
                    throw error;
                });
                return { result: result };
            }
            case DriverCommand.pollRefresh:
                await driver.refreshData().catch((error) => {
                    throw error;
                });
                return { };
            case DriverCommand.isConnected:
            {
                const result = driver.isConnected();
                return { connected: result };
            }
            case DriverCommand.isPushConnected:
            {
                const result = driver.isPushConnected();
                return { connected: result };
            }
            case DriverCommand.connect:
            {
                const result = await driver.connect().catch((error) => {
                    throw error;
                });
                return { connected: result };
            }
            case DriverCommand.disconnect:
                driver.close();
                return { };
            case DriverCommand.getVideoEvents:
            {
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
            case DriverCommand.getAlarmEvents:
            {
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
            case DriverCommand.getHistoryEvents:
            {
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
            default:
                throw new UnknownCommandError(command);
        }
    }
}
