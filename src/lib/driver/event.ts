import { ILogObject, TLogLevelName } from "tslog";
import { OutgoingBaseEvent } from "../outgoing_message";

export enum DriverEvent {
    verifyCode = "verify code",
    captchaRequest = "captcha request",
    connected = "connected",
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
    event: DriverEvent;
    captchaId: string;
    captcha: string;
}

export interface OutgoingEventDriverLogLevelChanged extends OutgoingBaseEvent {
    source: "driver";
    event: DriverEvent;
    level: TLogLevelName;
}

export interface OutgoingEventDriverLogging extends OutgoingBaseEvent {
    source: "driver";
    event: DriverEvent;
    message: ILogObject;
}

export type OutgoingEventDriver =
  | OutgoingEventDriverCaptchaRequest
  | OutgoingEventDriverLogLevelChanged
  | OutgoingEventDriverLogging;