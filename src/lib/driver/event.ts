import { ILogObj } from "tslog";

import { OutgoingBaseEvent } from "../outgoing_message.js";
import { LogLevelName, LogMessage } from "../logging.js";

export enum DriverEvent {
    verifyCode = "verify code",
    captchaRequest = "captcha request",
    connected = "connected",
    connectionError = "connectionError",
    disconnected = "disconnected",
    pushConnected = "push connected",
    pushDisconnected = "push disconnected",
    mqttConnected = "mqtt connected",
    mqttDisconnected = "mqtt disconnected",
    logLevelChanged = "log level changed",
    logging = "logging"
}

export interface OutgoingEventDriverBase extends OutgoingBaseEvent {
    source: "driver";
    event: DriverEvent;
}

export interface OutgoingEventDriverCaptchaRequest extends OutgoingEventDriverBase {
    source: "driver";
    event: DriverEvent.captchaRequest;
    captchaId: string;
    captcha: string;
}

export interface OutgoingEventDriverLogLevelChanged extends OutgoingBaseEvent {
    source: "driver";
    event: DriverEvent.logLevelChanged;
    level: LogLevelName;
}

export interface OutgoingEventDriverLogging extends OutgoingBaseEvent {
    source: "driver";
    event: DriverEvent.logging;
    message: LogMessage;
}

export interface OutgoingEventDriverConnectionError extends OutgoingEventDriverBase {
    source: "driver";
    event: DriverEvent.connectionError;
    error: Error;
}

export type OutgoingEventDriver =
  | OutgoingEventDriverCaptchaRequest
  | OutgoingEventDriverLogLevelChanged
  | OutgoingEventDriverLogging
  | OutgoingEventDriverConnectionError;