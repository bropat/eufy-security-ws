export enum ErrorCode {
    unknownError = "unknown_error",
    unknownCommand = "unknown_command",
    invalidCountryCode = "invalid_country_code",
    invalidLanguageCode = "invalid_language_code",
    stationNotFound = "station_not_found",
    stationNotConnected = "station_not_connected",
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
    deviceRTSPLivestreamAlreadyRunning = "device_rtsp_livestream_already_running",
    deviceRTSPLivestreamNotRunning = "device_rtsp_livestream_not_running",
    schemaIncompatible = "schema_incompatible",
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

export class RTSPLivestreamAlreadyRunningError extends Error {
    constructor(message?: string) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
        this.name = RTSPLivestreamAlreadyRunningError.name;
    }
}

export class RTSPLivestreamNotRunningError extends Error {
    constructor(message?: string) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
        this.name = RTSPLivestreamNotRunningError.name;
    }
}