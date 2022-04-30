import type WebSocket from "ws";
import { WebSocketServer } from "ws"
import { Logger } from "tslog";
import { EventEmitter, once } from "events";
import { Server as HttpServer, createServer, IncomingMessage as HttpIncomingMessage } from "http";
import { DeviceNotFoundError, EufySecurity, InvalidCountryCodeError, InvalidLanguageCodeError, InvalidPropertyValueError, libVersion, NotSupportedError, ReadOnlyPropertyError, StationNotFoundError, WrongStationError, PropertyNotSupportedError, InvalidPropertyError, InvalidCommandValueError } from "eufy-security-client";

import { EventForwarder } from "./forward";
import type * as OutgoingMessages from "./outgoing_message";
import { IncomingMessage } from "./incoming_message";
import { version, minSchemaVersion, maxSchemaVersion } from "./const";
import { DeviceMessageHandler } from "./device/message_handler";
import { StationMessageHandler } from "./station/message_handler";
import { IncomingMessageStation } from "./station/incoming_message";
import { BaseError, ErrorCode, LivestreamAlreadyRunningError, LivestreamNotRunningError, SchemaIncompatibleError, UnknownCommandError } from "./error";
import { Instance } from "./instance";
import { IncomingMessageDevice } from "./device/incoming_message";
import { ServerCommand } from "./command";
import { DriverMessageHandler } from "./driver/message_handler";
import { IncomingMessageDriver } from "./driver/incoming_message";
import { dumpState } from "./state";
import { LoggingEventForwarder } from "./logging";
import { ServerEvent } from "./event";

export class Client {

    public receiveEvents = false;
    public receiveLogs = false;
    private _outstandingPing = false;
    public schemaVersion = minSchemaVersion;
    public receiveLivestream: {
        [index: string]: boolean;
    } = {};

    private instanceHandlers: Record<Instance, (message: IncomingMessage) => Promise<OutgoingMessages.OutgoingResultMessageSuccess["result"]>> = {
        [Instance.station]: (message) =>
            StationMessageHandler.handle(
                message as IncomingMessageStation,
                this.driver,
                this
            ),
        [Instance.driver]: (message) =>
            DriverMessageHandler.handle(
                message as IncomingMessageDriver,
                this.driver,
                this,
                this.clientsController,
                this.logger
            ),
        [Instance.device]: (message) =>
            DeviceMessageHandler.handle(
                message as IncomingMessageDevice,
                this.driver,
                this
            ),
    };

    constructor(private socket: WebSocket, private driver: EufySecurity, private logger: Logger, private clientsController: ClientsController) {
        socket.on("pong", () => {
            this._outstandingPing = false;
        });
        socket.on("message", (data: string) => this.receiveMessage(data));
    }

    get isConnected(): boolean {
        return this.socket.readyState === this.socket.OPEN;
    }

    async receiveMessage(data: string): Promise<void> {
        let msg: IncomingMessage;
        try {
            msg = JSON.parse(data);
        } catch (err) {
            // We don't have the message ID. Just close it.
            this.logger.debug(`Unable to parse data: ${data}`);
            this.socket.close();
            return;
        }

        try {
            if (msg.command === ServerCommand.setApiSchema) {
                // Handle schema version
                this.schemaVersion = msg.schemaVersion;
                if (this.schemaVersion < minSchemaVersion || this.schemaVersion > maxSchemaVersion) {
                    throw new SchemaIncompatibleError(this.schemaVersion);
                }
                this.sendResultSuccess(msg.messageId, {});
                return;
            }

            if (msg.command === ServerCommand.startListening) {
                this.sendResultSuccess(msg.messageId, {
                    state: dumpState(this.driver, this.schemaVersion),
                });
                this.receiveEvents = true;
                return;
            }

            const instance = msg.command.split(".")[0] as Instance;
            if (this.instanceHandlers[instance]) {
                return this.sendResultSuccess(
                    msg.messageId,
                    await this.instanceHandlers[instance](msg)
                );
            }

            throw new UnknownCommandError(msg.command);
        } catch (error: unknown) {
            if (error instanceof BaseError) {
                this.logger.error("Message error", error);
                return this.sendResultError(msg.messageId, error.errorCode);
            }
            if (error instanceof DeviceNotFoundError) {
                this.logger.error("Message error", error);
                return this.sendResultError(msg.messageId, ErrorCode.deviceNotFound);
            }
            if (error instanceof StationNotFoundError) {
                this.logger.error("Message error", error);
                return this.sendResultError(msg.messageId, ErrorCode.stationNotFound);
            }
            if (error instanceof NotSupportedError) {
                this.logger.error("Message error", error);
                return this.sendResultError(msg.messageId, ErrorCode.deviceNotSupported);
            }
            if (error instanceof WrongStationError) {
                this.logger.error("Message error", error);
                return this.sendResultError(msg.messageId, ErrorCode.deviceWrongStation);
            }
            if (error instanceof InvalidPropertyValueError) {
                this.logger.error("Message error", error);
                return this.sendResultError(msg.messageId, ErrorCode.deviceInvalidPropertyValue);
            }
            if (error instanceof ReadOnlyPropertyError) {
                this.logger.error("Message error", error);
                return this.sendResultError(msg.messageId, ErrorCode.deviceReadOnlyProperty);
            }
            if (error instanceof InvalidCountryCodeError) {
                this.logger.error("Message error", error);
                return this.sendResultError(msg.messageId, ErrorCode.invalidCountryCode);
            }
            if (error instanceof InvalidLanguageCodeError) {
                this.logger.error("Message error", error);
                return this.sendResultError(msg.messageId, ErrorCode.invalidLanguageCode);
            }
            if (error instanceof InvalidPropertyError) {
                this.logger.error("Message error", error);
                return this.sendResultError(msg.messageId, ErrorCode.deviceInvalidProperty);
            }
            if (error instanceof LivestreamAlreadyRunningError) {
                this.logger.error("Message error", error);
                return this.sendResultError(msg.messageId, ErrorCode.deviceLivestreamAlreadyRunning);
            }
            if (error instanceof LivestreamNotRunningError) {
                this.logger.error("Message error", error);
                return this.sendResultError(msg.messageId, ErrorCode.deviceLivestreamNotRunning);
            }
            if (error instanceof PropertyNotSupportedError) {
                this.logger.error("Message error", error);
                return this.sendResultError(msg.messageId, ErrorCode.devicePropertyNotSupported);
            }
            if (error instanceof InvalidCommandValueError) {
                this.logger.error("Message error", error);
                return this.sendResultError(msg.messageId, ErrorCode.deviceInvalidCommandValue);
            }

            this.logger.error("Unexpected error", error as Error);
            this.sendResultError(msg.messageId, ErrorCode.unknownError);
        }
    }

    sendVersion(): void {
        this.sendData({
            type: "version",
            driverVersion: libVersion,
            serverVersion: version,
            minSchemaVersion: minSchemaVersion,
            maxSchemaVersion: maxSchemaVersion,
        });
    }

    sendResultSuccess(messageId: string, result: OutgoingMessages.OutgoingResultMessageSuccess["result"]): void {
        this.sendData({
            type: "result",
            success: true,
            messageId,
            result,
        });
    }

    sendResultError(messageId: string, errorCode: string): void {
        this.sendData({
            type: "result",
            success: false,
            messageId,
            errorCode,
        });
    }

    sendEvent(event: OutgoingMessages.OutgoingEvent): void {
        this.sendData({
            type: "event",
            event,
        });
    }

    sendData(data: OutgoingMessages.OutgoingMessage): void {
        this.socket.send(JSON.stringify(data));
    }

    checkAlive(): void {
        if (this._outstandingPing) {
            this.disconnect();
            return;
        }
        this._outstandingPing = true;
        this.socket.ping();
    }

    disconnect(): void {
        this.socket.close();
    }
}

export class ClientsController {

    public clients: Array<Client> = [];
    private pingInterval?: NodeJS.Timeout;
    private eventForwarder?: EventForwarder;
    private cleanupScheduled = false;
    private loggingEventForwarder?: LoggingEventForwarder;

    constructor(public driver: EufySecurity, private logger: Logger) {}

    addSocket(socket: WebSocket, request: HttpIncomingMessage): void {
        this.logger.debug(`New client with ip: ${request.socket.remoteAddress} port: ${request.socket.remotePort}`);
        const client = new Client(socket, this.driver, this.logger, this);
        socket.on("error", (error) => {
            this.logger.error(`Client with ip: ${request.socket.remoteAddress} port: ${request.socket.remotePort} socket error`, error);
        });
        socket.on("close", (code, reason) => {
            this.logger.info(`Client disconnected with ip: ${request.socket.remoteAddress} port: ${request.socket.remotePort} code: ${code} reason: ${reason}`);
            this.scheduleClientCleanup();
        });
        client.sendVersion();
        this.clients.push(client);

        if (this.pingInterval === undefined) {
            this.pingInterval = setInterval(() => {
                const newClients = [];

                for (const client of this.clients) {
                    if (client.isConnected) {
                        newClients.push(client);
                    } else {
                        client.disconnect();
                    }
                }

                this.clients = newClients;
            }, 30000);
        }

        if (this.eventForwarder === undefined) {
            this.eventForwarder = new EventForwarder(this);
            this.eventForwarder.start();
        }
    }

    get loggingEventForwarderStarted(): boolean {
        return this.loggingEventForwarder?.started === true;
    }
    
    public restartLoggingEventForwarderIfNeeded(): void {
        this.loggingEventForwarder?.restartIfNeeded();
    }
    
    public configureLoggingEventForwarder(): void {
        if (this.loggingEventForwarder === undefined) {
            this.loggingEventForwarder = new LoggingEventForwarder(this, this.logger);
        }
        if (!this.loggingEventForwarderStarted) {
            this.loggingEventForwarder?.start();
        }
    }
    
    public cleanupLoggingEventForwarder(): void {
        if (this.clients.filter((cl) => cl.receiveLogs).length == 0 && this.loggingEventForwarderStarted) {
            this.loggingEventForwarder?.stop();
        }
    }

    private scheduleClientCleanup(): void {
        if (this.cleanupScheduled) {
            return;
        }
        this.cleanupScheduled = true;
        setTimeout(() => this.cleanupClients(), 0);
    }

    private cleanupClients(): void {
        this.cleanupScheduled = false;
        const disconnectedClients = this.clients.filter((cl) => cl.isConnected === false);
        this.clients = this.clients.filter((cl) => cl.isConnected);

        disconnectedClients.forEach(client => {
            Object.keys(client.receiveLivestream).forEach(serialNumber => {
                try {
                    const device = this.driver.getDevice(serialNumber);
                    const station = this.driver.getStation(device.getStationSerial());
                    const streamingDevices = DeviceMessageHandler.getStreamingDevices(station.getSerial());

                    if (client.receiveLivestream[serialNumber] === true && streamingDevices.length === 1 && streamingDevices.includes(client)) {
                        if (station.isLiveStreaming(device))
                            station.stopLivestream(device);
                    }

                    client.receiveLivestream[device.getSerial()] = false;
                    DeviceMessageHandler.removeStreamingDevice(station.getSerial(), client);
                } catch(error) {
                    this.logger.error(`Error doing cleanup of client`, error);
                }
            });
        });
        this.cleanupLoggingEventForwarder();
    }

    disconnect(): void {
        if (this.pingInterval !== undefined) {
            clearInterval(this.pingInterval);
        }
        this.pingInterval = undefined;
        this.clients.forEach((client) => {
            if (client.schemaVersion >= 10) {
                client.sendEvent({
                    source: "server",
                    event: ServerEvent.shutdown,
                });
            }
        });
        this.clients.forEach((client) => client.disconnect());
        this.clients = [];
        this.cleanupLoggingEventForwarder();
    }
}

interface EufySecurityServerOptions {
    host: string;
    port: number;
    logger?: Logger;
}

export interface  EufySecurityServer {
    start(): void;
    destroy(): void;
    on(event: "listening", listener: () => void): this;
    on(event: "error", listener: (error: Error) => void): this;
}

export class  EufySecurityServer extends EventEmitter {

    private server?: HttpServer;
    private wsServer?: WebSocketServer;
    private sockets?: ClientsController;
    private logger: Logger;

    constructor(private driver: EufySecurity, private options:  EufySecurityServerOptions) {
        super();
        this.logger = options.logger ?? new Logger();
    }

    async start(): Promise<void> {
        this.server = createServer();
        this.wsServer = new WebSocketServer({ server: this.server });
        this.sockets = new ClientsController(this.driver, this.logger);
        this.wsServer.on("connection", (socket, request) => this.sockets?.addSocket(socket, request));

        this.logger.debug(`Starting server on host ${this.options.host}, port ${this.options.port}`);

        this.server.on("error", this.onError.bind(this));
        this.server.listen(this.options.port, this.options.host);
        await once(this.server, "listening");
        this.emit("listening");
        this.logger.info(`Eufy Security server listening on host ${this.options.host}, port ${this.options.port}`);
        await this.driver.connect()
    }

    private onError(error: Error) {
        this.emit("error", error);
        this.logger.error(error);
    }

    async destroy(): Promise<void> {
        this.logger.debug(`Closing server...`);
        if (this.sockets) {
            this.sockets.disconnect();
        }
        if (this.server) {
            this.server.close();
            await once(this.server, "close");
        }

        this.logger.info(`Server closed`);
    }

}
