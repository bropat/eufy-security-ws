import { ILogObj, Logger } from "tslog";
import { LogLevel as EufyLogLevel } from "eufy-security-client";

import { DriverEvent } from "./driver/event.js";
import { Client, ClientsController } from "./server.js";

export enum LogLevel {
    silly,
    trace,
    debug,
    info,
    warn,
    error,
    fatal
};

export type LogLevelName = keyof typeof LogLevel;

export const convertLogLevelToDriver = function(level: LogLevelName): EufyLogLevel {
    switch(LogLevel[level]) {
        case LogLevel.silly:
        case LogLevel.trace:
            return EufyLogLevel.Trace;
        case LogLevel.debug:
            return EufyLogLevel.Debug;
        case LogLevel.info:
            return EufyLogLevel.Info;
        case LogLevel.warn:
            return EufyLogLevel.Warn;
        case LogLevel.error:
            return EufyLogLevel.Error;
        case LogLevel.fatal:
            return EufyLogLevel.Fatal;
    }
}

export const convertLogLevelToServer = function(level: EufyLogLevel): LogLevel {
    switch(level) {
        case EufyLogLevel.Trace:
            return LogLevel.silly;
        case EufyLogLevel.Debug:
            return LogLevel.debug;
        case EufyLogLevel.Info:
            return LogLevel.info;
        case EufyLogLevel.Warn:
            return LogLevel.warn;
        case EufyLogLevel.Error:
            return LogLevel.error;
        case EufyLogLevel.Fatal:
            return LogLevel.fatal;
        default:
            return LogLevel.fatal;
    }
}

export interface LogMessageSchema0 {
    hostname: string;
    date: string;
    logLevel: string;
    logLevelId: number;
    filePath: string;
    fullFilePath: string;
    fileName: string;
    lineNumber: number;
    columnNumber: number;
    isConstructor: boolean;
    functionName: string;
    typeName: string;
    methodName: string;
    argumentsArray: Array<string>;
}

export interface LogMessageArguments {
    [name: string]: unknown;
}

export interface LogMessageSchema1 {
    message: string;
    arguments?: LogMessageArguments;
    meta: {
        runtime: string;
        runtimeVersion: string;
        hostname: string;
        date: string;
        logLevel: string;
        driverVersion: string;
    }
}

export type LogMessage = 
  | LogMessageSchema0
  | LogMessageSchema1;

export class LoggingEventForwarder {

    private clients: ClientsController;
    private driverLogger?: Logger<ILogObj>;

    constructor(clients: ClientsController, private logger: Logger<ILogObj>) {
        this.clients = clients;
    }

    get started(): boolean {
        if (this.driverLogger)
            return this.driverLogger.settings.attachedTransports.length !== 0;
        return false;
    }

    public start(): void {
        this.logger.info("Starting logging event forwarder");
        this.driverLogger = this.logger.getSubLogger({ name: "eufy-security-client", minLevel: convertLogLevelToServer(this.clients.driver.getLoggingLevel("all")) });
        this.driverLogger.attachTransport((logObj) => {
            this.logToTransport(this.clients.clients, logObj);
        });
        this.clients.driver.setInternalLogger(this.driverLogger);
    }

    public stop(): void {
        this.logger.info("Stopping logging event forwarder");
        if (this.driverLogger)
            this.driverLogger.settings.attachedTransports = [];
    }

    public restartIfNeeded(): void {
        const level = convertLogLevelToServer(this.clients.driver.getLoggingLevel("all"));
        if (this.started && this.driverLogger && this.driverLogger.settings.minLevel != level) {
            this.stop();
            this.start();
        }
    }

    private logToTransport(clients: Array<Client>, logObject: ILogObj): void {
        // Forwarding logs to clients that are currently
        // receiving logs
        clients
            .filter((cl) => cl.receiveLogs && cl.isConnected)
            .forEach((client) =>
                client.sendEvent({
                    source: "driver",
                    event: DriverEvent.logging,
                    message: this.getMessage(logObject, client.schemaVersion),
                })
            );
    }

    private getMessage(logObject: ILogObj, schemaVersion: number): LogMessage {
        const meta = logObject["_meta"] as { [name: string]: unknown };
        if (schemaVersion <= 20) {
            const matches = (logObject["0"] as string)?.match(/\[([0-9a-zA-Z]+)\] \[([0-9a-zA-Z.]+)\]/)
            let functionName = "";
            let typeName = "";
            if (matches !== null && matches !== undefined && matches.length >= 3) {
                const helper = matches[2]?.split(".");
                if (helper[0] !== undefined)
                    typeName = helper[0];
                if (helper[1] !== undefined)
                    functionName = helper[1]
            }
            return {
                hostname: meta["hostname"] as string,
                date: meta["date"] as string,
                logLevel: (meta["logLevelName"] as string)?.toLocaleLowerCase(),
                logLevelId: meta["logLevelId"] as number,
                filePath: "",
                fullFilePath: "",
                fileName: "",
                lineNumber: -1,
                columnNumber: -1,
                isConstructor: false,
                functionName: functionName,
                typeName: typeName,
                methodName: functionName,
                argumentsArray: [
                    logObject["0"] as string,
                ]
            };
        }
        return {
            message: logObject["0"] as string,
            arguments: logObject["1"] as LogMessageArguments,
            meta: {
                hostname: meta["hostname"] as string,
                date: meta["date"] as string,
                logLevel: meta["logLevelName"] as string,
                runtime: meta["runtime"] as string,
                runtimeVersion: meta["runtimeVersion"] as string,
                driverVersion: this.clients.driver.getVersion(),
            }
        };
    }
}