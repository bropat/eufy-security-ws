import { IncomingMessageStation } from "./station/incoming_message.js";
import { ServerCommand } from "./command.js";
import { IncomingCommandBase } from "./incoming_message_base.js";
import { IncomingMessageDevice } from "./device/incoming_message.js";
import { IncomingMessageDriver } from "./driver/incoming_message.js";

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
