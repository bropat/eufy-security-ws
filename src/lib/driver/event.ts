import { OutgoingBaseEvent } from "../outgoing_message";

export enum DriverEvent {
    verifyCode = "verify code",
    captchaRequest = "captcha request",
    connected = "connected",
    disconnected = "disconnected",
    pushConnected = "push connected",
    pushDisconnected = "push disconnected",
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


export type OutgoingEventDriver =
  | OutgoingEventDriverCaptchaRequest;