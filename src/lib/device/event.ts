import { CustomData, Schedule, SmartSafeAlarm911Event, SmartSafeShakeAlarmEvent } from "eufy-security-client";

import { JSONValue, OutgoingBaseEvent } from "../outgoing_message.js";

export enum DeviceEvent {
    deviceAdded = "device added",
    deviceRemoved = "device removed",
    motionDetected = "motion detected",
    personDetected = "person detected",
    cryingDetected = "crying detected",
    soundDetected = "sound detected",
    petDetected = "pet detected",
    vehicleDetected = "vehicle detected",
    dogDetected = "dog detected",
    dogLickDetected = "dog lick detected",
    dogPoopDetected = "dog poop detected",
    strangerPersonDetected = "stranger person detected",
    rings = "rings",
    sensorOpen = "sensor open",
    gotRtspUrl = "got rtsp url",
    commandResult = "command result",
    propertyChanged = "property changed",
    livestreamStarted = "livestream started",
    livestreamStopped = "livestream stopped",
    livestreamVideoData = "livestream video data",
    livestreamAudioData = "livestream audio data",
    downloadStarted = "download started",
    downloadFinished = "download finished",
    downloadVideoData = "download video data",
    downloadAudioData = "download audio data",
    rtspLivestreamStarted = "rtsp livestream started",
    rtspLivestreamStopped = "rtsp livestream stopped",
    locked = "locked",
    packageDelivered = "package delivered",
    packageStranded = "package stranded",
    packageTaken = "package taken",
    someoneLoitering = "someone loitering",
    radarMotionDetected = "radar motion detected",
    alarm911 = "alarm 911",
    shakeAlarm = "shake alarm",
    wrongTryProtectAlarm = "wrong try-protect alarm",
    LongTimeNotClose = "long time not close",
    lowBattery = "low battery",
    jammed = "jammed",
    talkbackStarted = "talkback started",
    talkbackStopped = "talkback stopped",
    userAdded = "user added",
    userDeleted = "user deleted",
    userError = "user error",
    userUsernameUpdated = "user username updated",
    userScheduleUpdated = "user schedule updated",
    userPasscodeUpdated = "user passcode updated",
    pinVerified = "pin verified",
    open = "open",
    tampering = "tampering",
    lowTemperature = "low temperature",
    highTemperature = "high temperature",
    lidStuck = "lid stuck",
    pinIncorrect = "pin incorrect",
    batteryFullyCharged = "battery fully charged",
}

export interface OutgoingEventDeviceBase extends OutgoingBaseEvent {
    source: "device";
    event: DeviceEvent;
    serialNumber: string;
}

export interface OutgoingEventDeviceAdded extends OutgoingBaseEvent {
    source: "device";
    event: DeviceEvent.deviceAdded;
    device: JSONValue;
}

export interface OutgoingEventDeviceRemoved extends OutgoingBaseEvent {
    source: "device";
    event: DeviceEvent.deviceRemoved;
    device: JSONValue;
}

export interface OutgoingEventDeviceMotionDetected extends OutgoingEventDeviceBase {
    source: "device";
    event: DeviceEvent.motionDetected;
    serialNumber: string;
    state: boolean;
}

export interface OutgoingEventDevicePersonDetected extends OutgoingEventDeviceBase {
    source: "device";
    event: DeviceEvent.personDetected;
    serialNumber: string;
    state: boolean;
    person: string;
}

export interface OutgoingEventDeviceCryingDetected extends OutgoingEventDeviceBase {
    source: "device";
    event: DeviceEvent.cryingDetected;
    state: boolean;
    serialNumber: string;
}

export interface OutgoingEventDeviceSoundDetected extends OutgoingEventDeviceBase {
    source: "device";
    event: DeviceEvent.soundDetected;
    state: boolean;
    serialNumber: string;
}

export interface OutgoingEventDevicePetDetected extends OutgoingEventDeviceBase {
    source: "device";
    event: DeviceEvent.petDetected;
    state: boolean;
    serialNumber: string;
}

export interface OutgoingEventDeviceVehicleDetected extends OutgoingEventDeviceBase {
    source: "device";
    event: DeviceEvent.vehicleDetected;
    state: boolean;
    serialNumber: string;
}

export interface OutgoingEventDeviceRings extends OutgoingEventDeviceBase {
    source: "device";
    event: DeviceEvent.rings;
    state: boolean;
    serialNumber: string;
}

export interface OutgoingEventDeviceSensorOpen extends OutgoingEventDeviceBase {
    source: "device";
    event: DeviceEvent.sensorOpen;
    state: boolean;
    serialNumber: string;
}

export interface OutgoingEventDeviceGotRtspUrl extends OutgoingEventDeviceBase {
    source: "device";
    event: DeviceEvent.gotRtspUrl;
    serialNumber: string;
    rtspUrl: string;
}

export interface OutgoingEventDeviceCommandResult extends OutgoingEventDeviceBase {
    source: "device";
    event: DeviceEvent.commandResult;
    serialNumber: string;
    propertyName: string;
    command: string;
    returnCode: number;
    returnCodeName: string;
    customData?: CustomData;
}

export interface OutgoingEventDevicePropertyChanged extends OutgoingEventDeviceBase {
    source: "device";
    event: DeviceEvent.propertyChanged;
    serialNumber: string;
    name: string;
    value: JSONValue;
    timestamp: number;
}

export interface OutgoingEventDeviceLivestreamStarted extends OutgoingEventDeviceBase {
    source: "device";
    event: DeviceEvent.livestreamStarted;
    serialNumber: string;
}

export interface OutgoingEventDeviceLivestreamStopped extends OutgoingEventDeviceBase {
    source: "device";
    event: DeviceEvent.livestreamStopped;
    serialNumber: string;
}

export interface OutgoingEventDeviceLivestreamVideoData extends OutgoingEventDeviceBase {
    source: "device";
    event: DeviceEvent.livestreamVideoData;
    serialNumber: string;
    buffer: JSONValue,
    metadata: { 
        videoCodec: string;
        videoFPS: number;
        videoHeight: number;
        videoWidth: number;
    }
}

export interface OutgoingEventDeviceLivestreamAudioData extends OutgoingEventDeviceBase {
    source: "device";
    event: DeviceEvent.livestreamAudioData;
    serialNumber: string;
    buffer: JSONValue,
    metadata: { 
        audioCodec: string;
    }
}

export interface OutgoingEventDeviceDownloadStarted extends OutgoingEventDeviceBase {
    source: "device";
    event: DeviceEvent.downloadStarted;
    serialNumber: string;
}

export interface OutgoingEventDeviceDownloadFinished extends OutgoingEventDeviceBase {
    source: "device";
    event: DeviceEvent.downloadFinished;
    serialNumber: string;
}

export interface OutgoingEventDeviceDownloadVideoData extends OutgoingEventDeviceBase {
    source: "device";
    event: DeviceEvent.downloadVideoData;
    serialNumber: string;
    buffer: JSONValue,
    metadata: { 
        videoCodec: string;
        videoFPS: number;
        videoHeight: number;
        videoWidth: number;
    }
}

export interface OutgoingEventDeviceDownloadAudioData extends OutgoingEventDeviceBase {
    source: "device";
    event: DeviceEvent.downloadAudioData;
    serialNumber: string;
    buffer: JSONValue,
    metadata: { 
        audioCodec: string;
    }
}

export interface OutgoingEventDeviceRTSPLivestreamStarted extends OutgoingEventDeviceBase {
    source: "device";
    event: DeviceEvent.rtspLivestreamStarted;
    serialNumber: string;
}

export interface OutgoingEventDeviceRTSPLivestreamStopped extends OutgoingEventDeviceBase {
    source: "device";
    event: DeviceEvent.rtspLivestreamStopped;
    serialNumber: string;
}

export interface OutgoingEventDeviceLocked extends OutgoingEventDeviceBase {
    source: "device";
    event: DeviceEvent.locked;
    serialNumber: string;
    state: boolean;
}

export interface OutgoingEventDevicePackageDelivered extends OutgoingEventDeviceBase {
    source: "device";
    event: DeviceEvent.packageDelivered;
    serialNumber: string;
    state: boolean;
}

export interface OutgoingEventDevicePackageStranded extends OutgoingEventDeviceBase {
    source: "device";
    event: DeviceEvent.packageStranded;
    serialNumber: string;
    state: boolean;
}

export interface OutgoingEventDevicePackageTaken extends OutgoingEventDeviceBase {
    source: "device";
    event: DeviceEvent.packageTaken;
    serialNumber: string;
    state: boolean;
}

export interface OutgoingEventDeviceSomeoneLoitering extends OutgoingEventDeviceBase {
    source: "device";
    event: DeviceEvent.someoneLoitering;
    serialNumber: string;
    state: boolean;
}

export interface OutgoingEventDeviceRadarMotionDetected extends OutgoingEventDeviceBase {
    source: "device";
    event: DeviceEvent.radarMotionDetected;
    serialNumber: string;
    state: boolean;
}

export interface OutgoingEventDeviceAlarm911 extends OutgoingEventDeviceBase {
    source: "device";
    event: DeviceEvent.alarm911;
    serialNumber: string;
    state: boolean;
    detail: SmartSafeAlarm911Event;
}

export interface OutgoingEventDeviceShakeAlarm extends OutgoingEventDeviceBase {
    source: "device";
    event: DeviceEvent.shakeAlarm;
    serialNumber: string;
    state: boolean;
    detail: SmartSafeShakeAlarmEvent;
}

export interface OutgoingEventDeviceWrongTryProtectAlarm extends OutgoingEventDeviceBase {
    source: "device";
    event: DeviceEvent.wrongTryProtectAlarm;
    serialNumber: string;
    state: boolean;
}

export interface OutgoingEventDeviceLongTimeNotClose extends OutgoingEventDeviceBase {
    source: "device";
    event: DeviceEvent.LongTimeNotClose;
    serialNumber: string;
    state: boolean;
}

export interface OutgoingEventDeviceLowBattery extends OutgoingEventDeviceBase {
    source: "device";
    event: DeviceEvent.lowBattery;
    serialNumber: string;
    state: boolean;
}

export interface OutgoingEventDeviceJammed extends OutgoingEventDeviceBase {
    source: "device";
    event: DeviceEvent.jammed;
    serialNumber: string;
    state: boolean;
}

export interface OutgoingEventDeviceTalkbackStarted extends OutgoingEventDeviceBase {
    source: "device";
    event: DeviceEvent.talkbackStarted;
    serialNumber: string;
}

export interface OutgoingEventDeviceTalkbackStopped extends OutgoingEventDeviceBase {
    source: "device";
    event: DeviceEvent.talkbackStopped;
    serialNumber: string;
}

export interface OutgoingEventDevicePinVerified extends OutgoingEventDeviceBase {
    source: "device";
    event: DeviceEvent.pinVerified;
    serialNumber: string;
    successfull: boolean;
}

export interface OutgoingEventDeviceUserAdded extends OutgoingEventDeviceBase {
    source: "device";
    event: DeviceEvent.userAdded;
    serialNumber: string;
    username: string;
    schedule?: Schedule;
}

export interface OutgoingEventDeviceUserDeleted extends OutgoingEventDeviceBase {
    source: "device";
    event: DeviceEvent.userDeleted;
    serialNumber: string;
    username: string;
}

export interface OutgoingEventDeviceUserError extends OutgoingEventDeviceBase {
    source: "device";
    event: DeviceEvent.userError;
    serialNumber: string;
    username: string;
    error: Error;
}

export interface OutgoingEventDeviceUserUsernameUpdated extends OutgoingEventDeviceBase {
    source: "device";
    event: DeviceEvent.userUsernameUpdated;
    serialNumber: string;
    username: string;
}

export interface OutgoingEventDeviceUserScheduleUpdated extends OutgoingEventDeviceBase {
    source: "device";
    event: DeviceEvent.userScheduleUpdated;
    serialNumber: string;
    username: string;
    schedule: Schedule;
}

export interface OutgoingEventDeviceUserPasscodeUpdated extends OutgoingEventDeviceBase {
    source: "device";
    event: DeviceEvent.userPasscodeUpdated;
    serialNumber: string;
    username: string;
}

export interface OutgoingEventDeviceStrangerPersonDetected extends OutgoingEventDeviceBase {
    source: "device";
    event: DeviceEvent.strangerPersonDetected;
    serialNumber: string;
    state: boolean;
}

export interface OutgoingEventDeviceDogDetected extends OutgoingEventDeviceBase {
    source: "device";
    event: DeviceEvent.dogDetected;
    serialNumber: string;
    state: boolean;
}

export interface OutgoingEventDeviceDogLickDetected extends OutgoingEventDeviceBase {
    source: "device";
    event: DeviceEvent.dogLickDetected;
    serialNumber: string;
    state: boolean;
}

export interface OutgoingEventDeviceDogPoopDetected extends OutgoingEventDeviceBase {
    source: "device";
    event: DeviceEvent.dogPoopDetected;
    serialNumber: string;
    state: boolean;
}

export interface OutgoingEventDeviceOpen extends OutgoingEventDeviceBase {
    source: "device";
    event: DeviceEvent.open;
    serialNumber: string;
    state: boolean;
}

export interface OutgoingEventDeviceTampering extends OutgoingEventDeviceBase {
    source: "device";
    event: DeviceEvent.tampering;
    serialNumber: string;
    state: boolean;
}

export interface OutgoingEventDeviceLowTemperature extends OutgoingEventDeviceBase {
    source: "device";
    event: DeviceEvent.lowTemperature;
    serialNumber: string;
    state: boolean;
}

export interface OutgoingEventDeviceHighTemperature extends OutgoingEventDeviceBase {
    source: "device";
    event: DeviceEvent.highTemperature;
    serialNumber: string;
    state: boolean;
}

export interface OutgoingEventDeviceLidStuck extends OutgoingEventDeviceBase {
    source: "device";
    event: DeviceEvent.lidStuck;
    serialNumber: string;
    state: boolean;
}

export interface OutgoingEventDevicePinIncorrect extends OutgoingEventDeviceBase {
    source: "device";
    event: DeviceEvent.pinIncorrect;
    serialNumber: string;
    state: boolean;
}

export interface OutgoingEventDeviceBatteryFullyCharged extends OutgoingEventDeviceBase {
    source: "device";
    event: DeviceEvent.batteryFullyCharged;
    serialNumber: string;
    state: boolean;
}

export type OutgoingEventDevice =
  | OutgoingEventDeviceAdded
  | OutgoingEventDeviceRemoved
  | OutgoingEventDeviceMotionDetected
  | OutgoingEventDevicePersonDetected
  | OutgoingEventDeviceCryingDetected
  | OutgoingEventDeviceSoundDetected
  | OutgoingEventDevicePetDetected
  | OutgoingEventDeviceVehicleDetected
  | OutgoingEventDeviceRings
  | OutgoingEventDeviceSensorOpen
  | OutgoingEventDeviceGotRtspUrl
  | OutgoingEventDeviceCommandResult
  | OutgoingEventDevicePropertyChanged
  | OutgoingEventDeviceLivestreamStarted
  | OutgoingEventDeviceLivestreamStopped
  | OutgoingEventDeviceLivestreamVideoData
  | OutgoingEventDeviceLivestreamAudioData
  | OutgoingEventDeviceDownloadStarted
  | OutgoingEventDeviceDownloadFinished
  | OutgoingEventDeviceDownloadVideoData
  | OutgoingEventDeviceDownloadAudioData
  | OutgoingEventDeviceRTSPLivestreamStarted
  | OutgoingEventDeviceRTSPLivestreamStopped
  | OutgoingEventDeviceLocked
  | OutgoingEventDevicePackageDelivered
  | OutgoingEventDevicePackageStranded
  | OutgoingEventDevicePackageTaken
  | OutgoingEventDeviceSomeoneLoitering
  | OutgoingEventDeviceRadarMotionDetected
  | OutgoingEventDeviceAlarm911
  | OutgoingEventDeviceShakeAlarm
  | OutgoingEventDeviceWrongTryProtectAlarm
  | OutgoingEventDeviceLongTimeNotClose
  | OutgoingEventDeviceLowBattery
  | OutgoingEventDeviceJammed
  | OutgoingEventDeviceTalkbackStarted
  | OutgoingEventDeviceTalkbackStopped
  | OutgoingEventDevicePinVerified
  | OutgoingEventDeviceUserAdded
  | OutgoingEventDeviceUserDeleted
  | OutgoingEventDeviceUserError
  | OutgoingEventDeviceUserUsernameUpdated
  | OutgoingEventDeviceUserPasscodeUpdated
  | OutgoingEventDeviceUserScheduleUpdated
  | OutgoingEventDeviceStrangerPersonDetected
  | OutgoingEventDeviceDogDetected
  | OutgoingEventDeviceDogLickDetected
  | OutgoingEventDeviceDogPoopDetected
  | OutgoingEventDeviceOpen
  | OutgoingEventDeviceTampering
  | OutgoingEventDeviceLowTemperature
  | OutgoingEventDeviceHighTemperature
  | OutgoingEventDeviceLidStuck
  | OutgoingEventDevicePinIncorrect
  | OutgoingEventDeviceBatteryFullyCharged;
