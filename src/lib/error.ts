export enum ErrorCode {
    unknownError = "unknown_error",
    unknownCommand = "unknown_command",
    stationNotFound = "station_not_found",
    stationNotConnected = "station_not_connected",
    deviceNotFound = "device_not_found",
    deviceNotSupportedFeature = "device_not_supported_feature",
    deviceWrongStation = "device_wrong_station",
    stationNotSupportedGuardMode = "station_not_supported_guardmode",
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