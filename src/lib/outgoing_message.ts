import { StationResultTypes } from "./station/outgoing_message";
import { DeviceResultTypes } from "./device/outgoing_message";
import { ServerCommand } from "./command";
import { DriverResultTypes } from "./driver/outgoing_message";

export interface OutgoingEvent {
    source: "driver" | "station" | "device";
    event: string;
    [key: string]: unknown;
}

export interface OutgoingVersionMessage {
    type: "version";
    driverVersion: string;
    serverVersion: string;
    minSchemaVersion: number;
    maxSchemaVersion: number;
}

export interface OutgoingEventMessage {
    type: "event";
    event: OutgoingEvent;
}

export interface OutgoingResultMessageError {
    type: "result";
    messageId: string;
    success: false;
    errorCode: string;
}

export interface ServerResultTypes {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [ServerCommand.startListening]: { state: Record<string, any>; };
    [ServerCommand.setApiSchema]: Record<string, never>;
}

export type ResultTypes = ServerResultTypes & StationResultTypes & DeviceResultTypes & DriverResultTypes;

export interface OutgoingResultMessageSuccess {
    type: "result";
    messageId: string;
    success: true;
    result: ResultTypes[keyof ResultTypes];
}

export type OutgoingMessage = OutgoingVersionMessage | OutgoingEventMessage | OutgoingResultMessageSuccess | OutgoingResultMessageError;
