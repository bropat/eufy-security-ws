#!/usr/bin/env node

import { resolve } from "path";
import { Command, Option } from "commander";
import { Logger } from "tslog";

import { EufySecurityServer } from "../lib/server";
import { EufySecurity, EufySecurityConfig } from "eufy-security-client"

const program = new Command();
program
    .addOption(new Option("-c, --config <file>", "Configuration file").default("config.json", "looks in current directory"))
    .addOption(new Option("-p, --port <port>", "Listening port").default(3000))
    .addOption(new Option("-H, --host <host>", "Listening Host").default("localhost"))
    .addOption(new Option("-v, --verbose"))
    .addOption(new Option("-q, --quiet"));

program.parse(process.argv);

const args = program.opts();


(async () => {

    let configPath = args.config;
    if (configPath && configPath.substring(0, 1) !== "/") {
        configPath = resolve(process.cwd(), configPath);
    }

    let config: EufySecurityConfig;

    if (configPath) {
        try {
            config = require(configPath);

            if (config.username === undefined) {
                console.error("Error: Username for Eufy Cloud is missing!");
                return;
            }
            if (config.password === undefined) {
                console.error("Error: Password for Eufy Cloud is missing!");
                return;
            }
        } catch (err) {
            console.error(`Error: failed loading config file ${configPath}`);
            console.error(err);
            return;
        }
    } else {
        console.error(`Error: failed loading config file ${configPath}`);
        return;
    }

    const logger = new Logger({
        minLevel: args.verbose ? "silly" : "info",
        suppressStdOutput: args.quiet ? true : false,
        displayFilePath: args.verbose ? "hideNodeModulesOnly" : "hidden",
        displayFunctionName: args.verbose ? true : false
    });
    const driver: EufySecurity = new EufySecurity(config, logger);

    let server: EufySecurityServer;

    try {
        server = new EufySecurityServer(driver, { port: args.port, host: args.host, logger: logger });
        await server.start();
    } catch (error) {
        logger.error("Unable to start Server", error);
    }

    let closing = false;

    const handleShutdown = async () => {
        driver.close();

        // Pressing ctrl+c twice.
        if (closing) {
            process.exit();
        }

        // Close gracefully
        closing = true;
        console.log("Shutting down");
        if (server) {
            await server.destroy();
        }
        process.exit();
    };

    process.on("SIGINT", handleShutdown);
    process.on("SIGTERM", handleShutdown);
})().catch((err) => {
    console.error("Unable to start driver", err);
});
