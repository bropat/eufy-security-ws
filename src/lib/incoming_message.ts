import { IncomingMessageStation } from "./station/incoming_message";
import { ServerCommand } from "./command";
import { IncomingCommandBase } from "./incoming_message_base";
import { IncomingMessageDevice } from "./device/incoming_message";
import { IncomingMessageDriver } from "./driver/incoming_message";

interface IncomingCommandStartListening extends IncomingCommandBase {
    command: ServerCommand.startListening;
}

interface IncomingCommandSetApiSchema extends IncomingCommandBase {
    command: ServerCommand.setApiSchema;
    schemaVersion: number;
}

export type IncomingMessage =
  | IncomingCommandStartListening
  | IncomingCommandSetApiSchema
  | IncomingMessageDevice
  | IncomingMessageStation
  | IncomingMessageDriver;
