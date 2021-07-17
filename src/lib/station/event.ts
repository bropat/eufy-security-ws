import { AlarmEvent } from "eufy-security-client";

import { JSONValue, OutgoingBaseEvent } from "../outgoing_message";

export enum StationEvent {
    stationAdded = "station added",
    stationRemoved = "station removed",
    guardModeChanged = "guard mode changed",
    currentModeChanged = "current mode changed",
    commandResult = "command result",
    connected = "connected",
    disconnected = "disconnected",
    propertyChanged = "property changed",
    alarmEvent = "alarm event",
}

export interface OutgoingEventStationBase extends OutgoingBaseEvent {
    source: "station";
    event: StationEvent;
    serialNumber: string;
}

export interface OutgoingEventStationAdded extends OutgoingBaseEvent {
    source: "station";
    event: StationEvent.stationAdded;
    station: JSONValue;
}

export interface OutgoingEventStationRemoved extends OutgoingBaseEvent {
    source: "station";
    event: StationEvent.stationRemoved;
    station: JSONValue;
}

export interface OutgoingEventStationGuardModeChanged extends OutgoingEventStationBase {
    source: "station";
    event: StationEvent.guardModeChanged;
    serialNumber: string;
    guardMode: number;
}

export interface OutgoingEventStationCurrentModeChanged extends OutgoingEventStationBase {
    source: "station";
    event: StationEvent.currentModeChanged;
    serialNumber: string;
    currentMode: number;
}

export interface OutgoingEventStationCommandResult extends OutgoingEventStationBase {
    source: "station";
    event: StationEvent.commandResult;
    serialNumber: string;
    command: string;
    returnCode: number;
    returnCodeName: string;
}

export interface OutgoingEventStationConnected extends OutgoingEventStationBase {
    source: "station";
    event: StationEvent.connected;
    serialNumber: string;
}

export interface OutgoingEventStationDisconnected extends OutgoingEventStationBase {
    source: "station";
    event: StationEvent.disconnected;
    serialNumber: string;
}

export interface OutgoingEventStationPropertyChanged extends OutgoingEventStationBase {
    source: "station";
    event: StationEvent.propertyChanged;
    serialNumber: string;
    name: string;
    value: JSONValue;
    timestamp: number;
}

export interface OutgoingEventStationAlarmEvent extends OutgoingEventStationBase {
    source: "station";
    event: StationEvent.alarmEvent;
    serialNumber: string;
    alarmEvent: AlarmEvent;
}

export type OutgoingEventStation =
  | OutgoingEventStationAdded
  | OutgoingEventStationRemoved
  | OutgoingEventStationGuardModeChanged
  | OutgoingEventStationCurrentModeChanged
  | OutgoingEventStationCommandResult
  | OutgoingEventStationConnected
  | OutgoingEventStationDisconnected
  | OutgoingEventStationPropertyChanged
  | OutgoingEventStationAlarmEvent;