import fs from "fs";
import globby from "globby";
import colors from "picocolors";
import { execSync } from "node:child_process";

export type ParsedPackage = { path: string; parsed: Record<string, unknown> & { name: string; version: string } };

export function step(msg: string): void {
    return console.log(colors.cyan(msg));
}

export async function getPackages(ignoreRoot = true): Promise<ParsedPackage[]> {
    const packagePaths = await globby(ignoreRoot ? ["packages/*/package.json"]: ["./package.json", "packages/*/package.json"], {
        ignore: ["**/node_modules/**", "**/examples/**", "**/fixtures/**"],
    });
    const packages = packagePaths.map((p: string) => ({
        path: p.replace("package.json", ""),
        parsed: JSON.parse(fs.readFileSync(p, "utf-8")) as ParsedPackage["parsed"]
    }));

    return packages;
}

export function publishPackage(
    pkdDir: string,
    tag?: string
) {
    const publicArgs = ["npm", "publish", "--access", "public"];
    if (tag) {
        publicArgs.push("--tag", tag);
    }

    execSync(publicArgs.join(" "), {
        cwd: pkdDir
    });
}