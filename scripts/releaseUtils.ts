import fs from "fs";
import globby from "globby";
import colors from "picocolors";
import { execSync } from "node:child_process";
import type { Colors, Formatter } from "picocolors/types";

export type ParsedPackage = { path: string; parsed: Record<string, unknown> & { name: string; version: string } };

export function step({
    msg,
    format = "cyan",
    info,
    err
}: { msg?: string; format?: keyof Colors; info?: Record<string, unknown>; err?: Error | unknown }): void {
    return console.log(colors[format] instanceof Function ?
        (colors[format] as Formatter)(JSON.stringify({
            msg,
            info,
            err
        }))
        :
        msg
    );
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
    const publicArgs = ["pnpm", "publish", "--access", "public"];
    if (tag) {
        publicArgs.push("--tag", tag);
    }

    execSync(publicArgs.join(" "), {
        cwd: pkdDir
    });
}

export const getCommitPkgV = (commit: string, path: string) => {
    try {
        const pkgBuff = execSync(`git show "${commit}:${path}package.json"`, { stdio: "pipe" });
        const version = (JSON.parse(pkgBuff.toString()) as { version?: string })?.version;
        step({ info: { commit, path, version } });
        return version || "unknown";
    } catch (err) {
        step({ msg: "getCommitPkgV error", err });
        return;
    }
};

export const getFilesInACommit = (commit: string) => {
    const files = execSync(`git ls-tree --name-only -r ${commit}`, { stdio: "pipe" }).toString();
    const parsed = JSON.stringify(files).replace(/"/g, "").replace(/\\n/g, ",").split(",").filter(Boolean);

    return parsed;
};

export const hasChangesInDir = (commit: string, dir: string) => {
    try {
        const fileChanges = getFilesInACommit(commit);

        return fileChanges.some(change => change.includes(dir));
    } catch (error) {
        return true;
    }
};