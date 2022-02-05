export { EufySecurityServer } from "./server";
export * from "./state";
export * from "./driver/state";
export * from "./station/state";
export * from "./device/state";

// eslint-disable-next-line @typescript-eslint/no-var-requires
export const serverVersion: string = require("../../package.json").version;
