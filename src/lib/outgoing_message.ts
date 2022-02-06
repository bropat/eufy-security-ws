import { StationResultTypes } from "./station/outgoing_message";
import { DeviceResultTypes } from "./device/outgoing_message";
import { ServerCommand } from "./command";
import { DriverResultTypes } from "./driver/outgoing_message";
import { DeviceEvent, OutgoingEventDevice } from "./device/event";
import { OutgoingEventStation, StationEvent } from "./station/event";
import { DriverEvent, OutgoingEventDriver } from "./driver/event";

// https://github.com/microsoft/TypeScript/issues/1897#issuecomment-822032151
export type JSONValue =
  | string
  | number
  | boolean
  | null
  | JSONValue[]
  | { [key: string]: JSONValue };

export interface OutgoingBaseEvent {
    source: "driver" | "station" | "device";
    event: DeviceEvent | StationEvent | DriverEvent;
}

export type OutgoingEvent = 
  | OutgoingBaseEvent
  | OutgoingEventDriver
  | OutgoingEventDevice
  | OutgoingEventStation;

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
