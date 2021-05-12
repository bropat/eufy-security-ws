import { Camera, CommandResult, CommandType, Device, DoorbellCamera, EntrySensor, ErrorCode, IndoorCamera, MotionSensor, ParamType, PropertyValue, Station } from "eufy-security-client";

import { OutgoingEvent } from "./outgoing_message";
import { dumpStation } from "./station/state";
import { StationEvent } from "./station/event";
import { dumpDevice } from "./device/state";
import { DeviceEvent } from "./device/event";
import { DriverEvent } from "./driver/event";
import { Client, ClientsController } from "./server";
import { StationCommand } from "./station/command";
import { DeviceCommand } from "./device/command";

export class EventForwarder {

    constructor(private clients: ClientsController) {}

    public start(): void {

        this.clients.driver.on("tfa request", () => {
            this.forwardEvent({
                source: "driver",
                event: DriverEvent.verifyCode,
            });
        });

        this.clients.driver.on("station added", (station: Station) => {
            this.clients.clients.forEach((client) =>
                this.sendEvent(client, {
                    source: "driver",
                    event: StationEvent.stationAdded,
                    station: dumpStation(station, client.schemaVersion),
                })
            );
            this.setupStation(station);
        });

        this.clients.driver.on("station removed", (station: Station) => {
            this.clients.clients.forEach((client) =>
                this.sendEvent(client, {
                    source: "driver",
                    event: StationEvent.stationRemoved,
                    station: dumpStation(station, client.schemaVersion),
                })
            );
        });

        this.clients.driver.on("device added", (device: Device) => {
            this.clients.clients.forEach((client) =>
                this.sendEvent(client, {
                    source: "driver",
                    event: DeviceEvent.deviceAdded,
                    device: dumpDevice(device, client.schemaVersion),
                })
            );
            this.setupDevice(device);
        });

        this.clients.driver.on("device removed", (device: Device) => {
            this.clients.clients.forEach((client) =>
                this.sendEvent(client, {
                    source: "driver",
                    event: DeviceEvent.deviceRemoved,
                    device: dumpDevice(device, client.schemaVersion),
                })
            );
        });

        this.clients.driver.on("connect", () => {
            this.clients.clients.forEach((client) =>
                this.sendEvent(client, {
                    source: "driver",
                    event: DriverEvent.connected,
                })
            );
        });

        this.clients.driver.on("close", () => {
            this.clients.clients.forEach((client) =>
                this.sendEvent(client, {
                    source: "driver",
                    event: DriverEvent.disconnected,
                })
            );
        });

        this.clients.driver.on("push connect", () => {
            this.clients.clients.forEach((client) =>
                this.sendEvent(client, {
                    source: "driver",
                    event: DriverEvent.pushConnected,
                })
            );
        });

        this.clients.driver.on("push close", () => {
            this.clients.clients.forEach((client) =>
                this.sendEvent(client, {
                    source: "driver",
                    event: DriverEvent.pushDisconnected,
                })
            );
        });

        this.clients.driver.getStations().forEach(station => {
            this.setupStation(station);
        });

        this.clients.driver.getDevices().forEach(device => {
            this.setupDevice(device);
        });

    }

    private forwardEvent(data: OutgoingEvent): void {
        // Forward event to all connected clients
        this.clients.clients.forEach((client) => this.sendEvent(client, data));
    }

    private sendEvent(client: Client, data: OutgoingEvent): void {
        // Send event to connected client only
        if (client.receiveEvents && client.isConnected) {
            client.sendEvent(data);
        }
    }

    private setupStation(station: Station):void {
        station.on("connect", () => {
            this.forwardEvent({
                source: "station",
                event: StationEvent.connected,
                serialNumber: station.getSerial()
            });
        });

        station.on("close", () => {
            this.forwardEvent({
                source: "station",
                event: StationEvent.disconnected,
                serialNumber: station.getSerial()
            });
        });

        station.on("guard mode", (station: Station, guardMode: number, currentMode: number) => {
            this.forwardEvent({
                source: "station",
                event: StationEvent.guardModeChanged,
                serialNumber: station.getSerial(),
                guardMode: guardMode,
                currentMode: currentMode,
            });
        });

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        station.on("rtsp url", (station: Station, channel:number, value: string, modified: number) => {
            const device = this.clients.driver.getStationDevice(station.getSerial(), channel);
            this.forwardEvent({
                source: "device",
                event: DeviceEvent.gotRtspUrl,
                serialNumber: device.getSerial(),
                rtspUrl: value,
            });
        });

        station.on("command result", (station: Station, result: CommandResult) => {
            if (result.channel === Station.CHANNEL) {
                //Station command result
                let command: string | undefined = undefined;
                switch (result.command_type) {
                    case CommandType.CMD_HUB_REBOOT:
                        command = StationCommand.reboot;
                        break;
                    case CommandType.CMD_SET_ARMING:
                        command = StationCommand.setGuardMode;
                        break;
                }
                if (command !== undefined) {
                    this.forwardEvent({
                        source: "station",
                        event: StationEvent.commandResult,
                        serialNumber: station.getSerial(),
                        command: command.split(".")[1],
                        returnCode: result.return_code,
                        returnCodeName: ErrorCode[result.return_code] !== undefined ? ErrorCode[result.return_code] : "UNKNOWN",
                    });
                }
            } else {
                // Device command result
                let command: string | undefined = undefined;
                switch (result.command_type as number) {
                    case CommandType.CMD_DEVS_SWITCH:
                        command = DeviceCommand.enableDevice;
                        break;
                    case CommandType.CMD_DOORLOCK_DATA_PASS_THROUGH:
                        command = DeviceCommand.lockDevice;
                        break;
                    case CommandType.CMD_EAS_SWITCH:
                        command = DeviceCommand.setAntiTheftDetection;
                        break;
                    case CommandType.CMD_IRCUT_SWITCH:
                        command = DeviceCommand.setAutoNightVision;
                        break;
                    case CommandType.CMD_PIR_SWITCH:
                    case CommandType.CMD_INDOOR_DET_SET_MOTION_DETECT_ENABLE:
                    case ParamType.COMMAND_MOTION_DETECTION_PACKAGE:
                        command = DeviceCommand.setMotionDetection;
                        break;
                    case CommandType.CMD_INDOOR_DET_SET_PET_ENABLE:
                        command = DeviceCommand.setPetDetection;
                        break;
                    case CommandType.CMD_NAS_SWITCH:
                        command = DeviceCommand.setRTSPStream;
                        break;
                    case CommandType.CMD_INDOOR_DET_SET_SOUND_DETECT_ENABLE:
                        command = DeviceCommand.setSoundDetection;
                        break;
                    case CommandType.CMD_DEV_LED_SWITCH:
                    case CommandType.CMD_INDOOR_LED_SWITCH:
                    case CommandType.CMD_BAT_DOORBELL_SET_LED_ENABLE:
                    case ParamType.COMMAND_LED_NIGHT_OPEN:
                        command = DeviceCommand.setStatusLed;
                    case CommandType.CMD_SET_DEVS_OSD:
                        command = DeviceCommand.setWatermark;
                        break;
                        break;
                }
                if (command !== undefined) {
                    const device = this.clients.driver.getStationDevice(station.getSerial(), result.channel);
                    this.forwardEvent({
                        source: "device",
                        event: DeviceEvent.commandResult,
                        serialNumber: device.getSerial(),
                        command: command.split(".")[1],
                        returnCode: result.return_code,
                        returnCodeName: ErrorCode[result.return_code] !== undefined ? ErrorCode[result.return_code] : "UNKNOWN",
                    });
                }
            }
        });

        station.on("property changed", (station: Station, name: string, value: PropertyValue) => {
            this.forwardEvent({
                source: "station",
                event: StationEvent.propertyChanged,
                serialNumber: station.getSerial(),
                name: name,
                value: value.value,
                timestamp: value.timestamp
            });
        });

    }

    private setupDevice(device: Device): void {
        if (device instanceof Camera) {
            device.on("motion detected", (device: Device, state: boolean) => {
                this.clients.clients.forEach((client) =>
                    this.sendEvent(client, {
                        source: "device",
                        event: DeviceEvent.motionDetected,
                        serialNumber: device.getSerial(),
                        state: state,
                    })
                );
            });

            device.on("person detected", (device: Device, state: boolean, person: string) => {
                this.clients.clients.forEach((client) =>
                    this.sendEvent(client, {
                        source: "device",
                        event: DeviceEvent.personDetected,
                        serialNumber: device.getSerial(),
                        state: state,
                        person: person,
                    })
                );
            });
        } else if (device instanceof IndoorCamera) {
            device.on("crying detected", (device: Device, state: boolean) => {
                this.clients.clients.forEach((client) =>
                    this.sendEvent(client, {
                        source: "device",
                        event: DeviceEvent.cryingDetected,
                        serialNumber: device.getSerial(),
                        state: state
                    })
                );
            });
    
            device.on("pet detected", (device: Device, state: boolean) => {
                this.clients.clients.forEach((client) =>
                    this.sendEvent(client, {
                        source: "device",
                        event: DeviceEvent.petDetected,
                        serialNumber: device.getSerial(),
                        state: state,
                    })
                );
            });
    
            device.on("sound detected", (device: Device, state: boolean) => {
                this.clients.clients.forEach((client) =>
                    this.sendEvent(client, {
                        source: "device",
                        event: DeviceEvent.soundDetected,
                        serialNumber: device.getSerial(),
                        state: state,
                    })
                );
            });
        } else if (device instanceof DoorbellCamera) {
            device.on("rings", (device: Device, state: boolean) => {
                this.clients.clients.forEach((client) =>
                    this.sendEvent(client, {
                        source: "device",
                        event: DeviceEvent.rings,
                        serialNumber: device.getSerial(),
                        state: state,
                    })
                );
            });
        } else if (device instanceof EntrySensor) {
            device.on("open", (device: Device, state: boolean) => {
                this.clients.clients.forEach((client) =>
                    this.sendEvent(client, {
                        source: "device",
                        event: DeviceEvent.sensorOpen,
                        serialNumber: device.getSerial(),
                        state: state,
                    })
                );
            });
        } else if (device instanceof MotionSensor) {
            device.on("motion detected", (device: Device, state: boolean) => {
                this.clients.clients.forEach((client) =>
                    this.sendEvent(client, {
                        source: "device",
                        event: DeviceEvent.motionDetected,
                        serialNumber: device.getSerial(),
                        state: state,
                    })
                );
            });
        }

        device.on("property changed", (device: Device, name: string, value: PropertyValue) => {
            this.forwardEvent({
                source: "device",
                event: DeviceEvent.propertyChanged,
                serialNumber: device.getSerial(),
                name: name,
                value: value.value,
                timestamp: value.timestamp
            });
        });
    }

}