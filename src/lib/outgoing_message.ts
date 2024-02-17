import { StationResultTypes } from "./station/outgoing_message.js";
import { DeviceResultTypes } from "./device/outgoing_message.js";
import { ServerCommand } from "./command.js";
import { DriverResultTypes } from "./driver/outgoing_message.js";
import { DeviceEvent, OutgoingEventDevice } from "./device/event.js";
import { OutgoingEventStation, StationEvent } from "./station/event.js";
import { DriverEvent, OutgoingEventDriver } from "./driver/event.js";
import { ServerEvent, OutgoingEventServer } from "./event.js";

// https://github.com/microsoft/TypeScript/issues/1897#issuecomment-822032151
export type JSONValue =
  | string
  | number
  | boolean
  | null
  | JSONValue[]
  | { [key: string]: JSONValue };

export interface OutgoingBaseEvent {
    source: "driver" | "station" | "device" | "server";
    event: DeviceEvent | StationEvent | DriverEvent | ServerEvent;
}

export type OutgoingEvent = 
  | OutgoingBaseEvent
  | OutgoingEventDriver
  | OutgoingEventDevice
  | OutgoingEventStation
  | OutgoingEventServer;

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
