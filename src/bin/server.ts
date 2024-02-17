#!/usr/bin/env node

import { resolve } from "path";
import { Command, Option } from "commander";
import { ILogObj, Logger } from "tslog";
import { EufySecurity, EufySecurityConfig, LogLevel } from "eufy-security-client"
import { createRequire } from "module";

import { EufySecurityServer } from "../lib/server.js";
import { initializeInspectStyles } from "../lib/utils.js";

initializeInspectStyles();

const require = createRequire(import.meta.url);
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

    if (args.verbose) {
        config.logging = {
            level: LogLevel.Debug
        };
    }

    const logger = new Logger<ILogObj>({
        prefix: ["server"],
        minLevel: args.verbose ? 0 /* silly */ : 3 /* info */,
        prettyLogTemplate: "{{yyyy}}.{{mm}}.{{dd}} {{hh}}:{{MM}}:{{ss}}:{{ms}}\t{{logLevelName}}\t",
        type: args.quiet ? "hidden" : "pretty",
        hideLogPositionForProduction: true,
    });
    const driver: EufySecurity = await EufySecurity.initialize(config, logger.getSubLogger({ prefix: ["driver"] }));

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
