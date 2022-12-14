// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore only ignore the type and ignore type checking in case the module doesn't exist
import type { IConfig } from "config";
import { optionalImport } from "./utils";

export const config = optionalImport<IConfig>("config");

export const VERSION = process.env.npm_package_version;
export const APP_NAME: string = process.env.APP_NAME || process.env.npm_package_name || (config?.has("appName") ? config.get("appName") : "toplo-utils");
export const NODE_ENV = process.env.NODE_ENV || "development";
export const LOG_LEVEL: string | undefined = process.env.LOG_LEVEL;
/**
 * @default 10000
 */
export const HOT_DEFAULT_HTTP_TIMEOUT: number = process.env.HOT_DEFAULT_HTTP_TIMEOUT ?
    Number(process.env.HOT_DEFAULT_HTTP_TIMEOUT) || 10000 :
    (config?.has("defaultHttpTimeout") ? config.get("defaultHttpTimeout") : 10000);

export const HOT_SERVER =  {
    /**
     * @default "localhost"
     */
    host: config?.has("server.host") ? config.get<string>("server.host") : "localhost",
    /**
     * @default 3336
     */
    port: config?.has("server.port") ? config.get<number>("server.port") : 3336,
};
