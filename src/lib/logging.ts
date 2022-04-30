import { ILogObject, Logger } from "tslog";
import { ITransportProvider } from "tslog/dist/types/interfaces";

import { DriverEvent } from "./driver/event";
import { Client, ClientsController } from "./server";

export class LoggingEventForwarder {

    private transport?: ITransportProvider;
    private clients: ClientsController;

    constructor(clients: ClientsController, private logger: Logger) {
        this.clients = clients;
    }

    public get started(): boolean {
        return this.transport !== undefined;
    }

    public start(): void {
        const level = this.logger.settings.minLevel;
        this.logger.info("Starting logging event forwarder at " + level + " level");
        this.transport = {
            transportLogger: {
                silly: (message) => { this.logToTransport(this.clients.clients, message); },
                debug: (message) => { this.logToTransport(this.clients.clients, message); },
                trace: (message) => { this.logToTransport(this.clients.clients, message); },
                info: (message) =>  { this.logToTransport(this.clients.clients, message); },
                warn: (message) =>  { this.logToTransport(this.clients.clients, message); },
                error: (message) => { this.logToTransport(this.clients.clients, message); },
                fatal: (message) => { this.logToTransport(this.clients.clients, message); },
            },
            minLevel: level
        };
        this.logger.attachTransport(this.transport.transportLogger, this.transport.minLevel);
    }

    public stop(): void {
        this.logger.info("Stopping logging event forwarder");
        this.logger.setSettings({
            attachedTransports: []
        });
        delete this.transport;
    }

    public restartIfNeeded(): void {
        const level = this.logger.settings.minLevel;
        if (this.started && this.transport?.minLevel != level) {
            this.stop();
            this.start();
        }
    }

    private logToTransport(clients: Array<Client>, logObject: ILogObject): void {
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