import { OutgoingBaseEvent } from "./outgoing_message";

export enum ServerEvent {
    shutdown = "shutdown",
}

export interface OutgoingEventServerBase extends OutgoingBaseEvent {
    source: "server";
    event: ServerEvent;
}

export type OutgoingEventServer = OutgoingEventServerBase;