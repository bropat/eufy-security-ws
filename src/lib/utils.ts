import { EventEmitter } from "events";
import { inspect } from "util";

export const convertCamelCaseToSnakeCase = function (value: string): string {
    return value !== undefined ? value.replace(/[A-Z]/g, (letter, index) => {
        return index == 0 ? letter.toLowerCase() : "_" + letter.toLowerCase();
    }) : "";
};

export const waitForEvent = function <T>(emitter: EventEmitter, event: string, timeout?: number): Promise<T> {
    return new Promise((resolve, reject) => {
        let internalTimeout: NodeJS.Timeout | undefined = undefined;

        const success = (val: T) => {
            emitter.off("error", fail);
            resolve(val);
        };
        const fail = (err: Error) => {
            emitter.off(event, success);
            reject(err);
        };
        emitter.once(event, success);
        emitter.once("error", fail);
        
        if (internalTimeout)
            clearTimeout(internalTimeout);
        if (timeout) {
            internalTimeout = setTimeout(() => {
                emitter.off(event, success);
                emitter.off("error", fail);
                reject(new Error("Timeout reached"));
            }, timeout);
        }
    });
}

export const initializeInspectStyles = function(): void {
    inspect.styles.special = "cyan";
    inspect.styles.number = "green";
    inspect.styles.bigint = "green";
    inspect.styles.boolean = "yellow";
    inspect.styles.undefined = "grey";
    inspect.styles.null = "bold";
    inspect.styles.string = "red";
    inspect.styles.symbol = "green";
    inspect.styles.date = "magenta";
    inspect.styles.regexp = "red";
    inspect.styles.module = "underline";
}