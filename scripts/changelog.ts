/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/indent */
import fs from "fs";
import { execSync, spawn } from "node:child_process";
import { getCommitPkgV, getFilesInACommit, getPackages, ParsedPackage } from "./releaseUtils";

const genChangeLog = async (pkg: ParsedPackage) => {
    try {
        console.log(`Starting generation of changelog for ${pkg.parsed.name}`);

        const branch = execSync("git rev-parse --abbrev-ref HEAD").toString().trim();
        const git = spawn("git", [
            "log",
            "origin/main",
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
            git.on("close", (_code) => {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                resolve(buf.toString().split("\n").map(e => JSON.parse(e)));
            });
        });

        if (!Array.isArray(initialChangelog)) {
            throw new Error(`Error generating changelog ${initialChangelog} for ${pkg.parsed.name}`);
        }

        const additionalChangelog = initialChangelog.map(log => {
            const branch = execSync(`git name-rev ${log.commit}`).toString().split(" ")[1].split("\n")[0] || "Deleted";
            const version = getCommitPkgV(log.commit, pkg.path) || pkg.parsed.version;
            const filechanges = getFilesInACommit(log.commit);
            if (!filechanges.includes(pkg.path)) {
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
        });

        fs.writeFileSync(`${pkg.path}CHANGELOG.md`, `# ${pkg.parsed.name} changelog

${additionalChangelog.map(acLog => {
    const ac = acLog as Record<string, string>;
    return `
## ${ac.subject} (${ac.date})

${Object.keys(ac).map(k => (`* ${[k]}: ${ac[k]}\n`)).toString().replace(/,/g, "")}
    `;
// eslint-disable-next-line no-regex-spaces
}).toString().replace(/    ,/g, "")}
`
    );

    if (process.env.CI) {
        execSync(`git add ${pkg.path}CHANGELOG.md`);
        execSync(`git commit -m "[branch|${branch}|${pkg.parsed.name}] changelog updated"`);
    }
    console.log(additionalChangelog);
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