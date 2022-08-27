export enum ErrorCode {
    unknownError = "unknown_error",
    unknownCommand = "unknown_command",
    invalidCountryCode = "invalid_country_code",
    invalidLanguageCode = "invalid_language_code",
    stationNotFound = "station_not_found",
    stationNotConnected = "station_not_connected",
    stationConnectionTimeout = "station_connection_timeout",
    deviceNotFound = "device_not_found",
    deviceWrongStation = "device_wrong_station",
    deviceInvalidProperty = "device_invalid_property",
    deviceInvalidPropertyValue = "device_invalid_property_value",
    devicePropertyNotSupported = "device_property_not_supported",
    deviceReadOnlyProperty = "device_property_readonly",
    deviceNotSupported = "device_not_supported",
    deviceInvalidCommandValue = "device_invalid_command_value",
    deviceLivestreamAlreadyRunning = "device_livestream_already_running",
    deviceLivestreamNotRunning = "device_livestream_not_running",
    schemaIncompatible = "schema_incompatible",
    deviceDownloadAlreadyRunning = "device_download_already_running",
    deviceDownloadNotRunning = "device_download_not_running",
    deviceOnlyOneDownloadAtATime = "device_only_one_download_at_a_time",
    deviceTalkbackAlreadyRunning = "device_talkback_already_running",
    deviceTalkbackNotRunning = "device_talkback_not_running",
    deviceOnlyOneTalkbackAtATime = "device_only_one_talkback_at_a_time",
    deviceRTSPPropertyNotEnabled = "device_rtsp_property_not_enabled",
}

export class BaseError extends Error {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    errorCode: ErrorCode;
}

export class UnknownError extends BaseError {
    errorCode = ErrorCode.unknownError;

    constructor(public error: Error) {
        super();
    }
}

export class UnknownCommandError extends BaseError {
    errorCode = ErrorCode.unknownCommand;

    constructor(public command: string) {
        super();
    }
}

export class SchemaIncompatibleError extends BaseError {
    errorCode = ErrorCode.schemaIncompatible;

    constructor(public schemaId: number) {
        super();
    }
}

export class LivestreamAlreadyRunningError extends Error {
    constructor(message?: string) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
        this.name = LivestreamAlreadyRunningError.name;
    }
}

export class LivestreamNotRunningError extends Error {
    constructor(message?: string) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
        this.name = LivestreamNotRunningError.name;
    }
}

export class DownloadAlreadyRunningError extends Error {
    constructor(message?: string) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
        this.name = DownloadAlreadyRunningError.name;
    }
}

export class DownloadNotRunningError extends Error {
    constructor(message?: string) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
        this.name = DownloadNotRunningError.name;
    }
}

export class DownloadOnlyOneAtATimeError extends Error {
    constructor(message?: string) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
        this.name = DownloadOnlyOneAtATimeError.name;
    }
}

export class TalkbackAlreadyRunningError extends Error {
    constructor(message?: string) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
        this.name = TalkbackAlreadyRunningError.name;
    }
}

export class TalkbackNotRunningError extends Error {
    constructor(message?: string) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
        this.name = TalkbackNotRunningError.name;
    }
}

export class TalkbackOnlyOneAtATimeError extends Error {
    constructor(message?: string) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
        this.name = TalkbackOnlyOneAtATimeError.name;
    }
}