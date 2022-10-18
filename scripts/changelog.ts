/* eslint-disable @typescript-eslint/restrict-template-expressions */
import fs from "fs";
import { execSync, spawn } from "node:child_process";
import { getCommitPkgV, getPackages, hasChangesInDir, ParsedPackage, step } from "./releaseUtils";

const writeLog = (name: string, path: string, logItems: Record<string, string>[]) => {
    fs.writeFileSync(
        `${path}CHANGELOG.md`, `# ${name} changelog
    ${logItems.map(ac => {
        return `\n## ${ac.subject} (${ac.date})
${Object.keys(ac).map(k => (`* ${[k]}: ${ac[k]}\n`)).toString().replace(/,/g, "")}`;
    }).toString().replace(/,/g, "")}`
    );
};

const genChangeLog = async (pkg: ParsedPackage) => {
    try {
        step(`Starting generation of changelog for ${pkg.parsed.name}`);

        const branch = execSync("git rev-parse --abbrev-ref HEAD").toString().trim();
        const git = spawn("git", [
            "log",
            "--pretty=format:{\"commit\": \"%H\",\"authorName\": \"%an\",\"authorEmail\": \"%aE\",\"date\": \"%ad\",\"subject\": \"%s\",\"message\": \"%f\"}"
        ]);

        const initialChangelog: string | Record<string, string>[] = await new Promise((resolve, reject) => {
            let buf = Buffer.alloc(0);

            git.stdout.on("data", (data) => {
                buf = Buffer.concat([buf, data]);
            });
            git.stderr.on("data", (data: Buffer) => {
                reject(data.toString());
            });
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            git.on("close", (code, signal) => {
                const closeBuf = buf.toString();
                step(`Changelog close event, code: ${code}, signal: ${signal}`, "underline");
                // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                resolve(closeBuf?.split("\n").map(e => {
                    try {
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                        return JSON.parse(e);
                    } catch (error) {
                        return e;
                    }
                }));
            });
        });

        if (!Array.isArray(initialChangelog)) {
            throw new Error(`Error generating changelog ${initialChangelog} for ${pkg.parsed.name}`);
        }

        if (!initialChangelog.length) {
            throw new Error("Empty changelog");
        }

        step(`InitialChangelogLength: ${initialChangelog.length}`, "green");
        const additionalChangelog = initialChangelog.map(log => {
            const branch = execSync(`git name-rev ${log.commit}`).toString().split(" ")[1].split("\n")[0] || "Deleted";
            const version = getCommitPkgV(log.commit, pkg.path) || pkg.parsed.version;
            if (!hasChangesInDir(log.commit, pkg.path)) {
                step(`No file changes for ${pkg.parsed.name}, skipping`, "magenta");
                return;
            }
            return {
                version,
                branch,
                ...log,
                subject: `${version} ${log.subject}`,
                commit: `[${log.commit}](https://github.com/petarzarkov/toplo/commit/${log.commit})`
            } as Record<string, string>;
        }).filter(l => {
            if (!l) return false;
            if (l.subject.includes("[branch|") || l.message.includes("Merge") || l.message.includes("generated-changelog")) {
                return false;
            }
            return true;
        }) as Record<string, string>[];

        step(`AdditionalChangelogLength: ${additionalChangelog.length}`, "green");
        writeLog(pkg.parsed.name, pkg.path, additionalChangelog);

        if (process.env.CI) {
            execSync(`git add ${pkg.path}CHANGELOG.md`);
            execSync(`git commit -m "[branch|${branch}|${pkg.parsed.name}] changelog updated"`);
        }
    } catch (error) {
        console.log({ message: `Error on generating changelog for ${pkg.parsed.name}`, error });
    }
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
    const packages = await getPackages(true);
    for (const pkg of packages) {
        await genChangeLog(pkg);
    }

})();