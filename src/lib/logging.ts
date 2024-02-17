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

export const convertLogLevel = function(level: LogLevelName): number {
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
    return EufyLogLevel.Off;
}

export class LoggingEventForwarder {

    private clients: ClientsController;

    constructor(clients: ClientsController, private logger: Logger<ILogObj>) {
        this.clients = clients;
    }

    public get started(): boolean {
        return this.logger.settings.attachedTransports.length !== 0;
    }

    public start(): void {
        this.logger.info("Starting logging event forwarder");
        this.logger.attachTransport((logObj) => {
            this.logToTransport(this.clients.clients, logObj);
        });
    }

    public stop(): void {
        this.logger.info("Stopping logging event forwarder");
        this.logger.settings.attachedTransports = [];
    }

    public restartIfNeeded(): void {
        //TODO: Finish migration to new tslog
        /*const level = this.logger.settings.minLevel;
        if (this.started && this.transport?.minLevel != level) {
            this.stop();
            this.start();
        }*/
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
                    message: {
                        ...logObject
                    },
                })
            );
    }
}