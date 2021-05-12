import { EufySecurity } from "eufy-security-client";
import { UnknownCommandError } from "../error";
import { Client } from "../server";
import { DriverCommand } from "./command";
import { IncomingMessageDriver, IncomingCommandSetVerifyCode } from "./incoming_message";
import { DriverResultTypes } from "./outgoing_message";

export class DriverMessageHandler {

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    static async handle(message: IncomingMessageDriver, driver: EufySecurity, client: Client): Promise<DriverResultTypes[DriverCommand]> {
        const { command } = message;
        switch (command) {
            case DriverCommand.setVerifyCode:
            {
                const result = await driver.connect((message as IncomingCommandSetVerifyCode).verifyCode);
                return { result: result };
            }
            case DriverCommand.pollRefresh:
                await driver.refreshData();
                return { };
            case DriverCommand.isConnected:
            {
                const result = await driver.isConnected();
                return { connected: result };
            }
            case DriverCommand.isPushConnected:
            {
                const result = await driver.isPushConnected();
                return { connected: result };
            }
            case DriverCommand.connect:
            {
                const result = await driver.connect();
                return { connected: result };
            }
            case DriverCommand.disconnect:
                await driver.close();
                return { };
            default:
                throw new UnknownCommandError(command);
        }
    }
}
