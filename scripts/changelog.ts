/* eslint-disable @typescript-eslint/restrict-template-expressions */
import fs from "fs";
import { execSync } from "node:child_process";
import { getCommitPkgV, getPackages, hasChangesInDir, ParsedPackage, step } from "./releaseUtils";
import { Octokit } from "@octokit/core";
import type { components } from "@octokit/openapi-types/types";

if (process.env.CI && !process.env.GH_API_TOKEN) {
    throw new Error("process.env.GH_API_TOKEN missing!");
}

const octokit = new Octokit({
    auth: process.env.GH_API_TOKEN
});

const writeLog = (name: string, path: string, logItems: Record<string, string>[]) => {
    fs.writeFileSync(
        `${path}CHANGELOG.md`, `# ${name} changelog
    ${logItems.map(ac => {
        return `\n## ${ac.subject} (${ac.date})
${Object.keys(ac).map(k => (`* ${[k]}: ${ac[k]}\n`)).toString().replace(/,/g, "")}`;
    }).toString().replace(/,/g, "")}`
    );
};

const genChangeLog = (pkg: ParsedPackage, data: components["schemas"]["commit"][]) => {
    try {
        step({ msg: `Starting generation of changelog for ${pkg.parsed.name}` });
        const branch = execSync("git rev-parse --abbrev-ref HEAD").toString().trim();

        step({ msg: `InitialChangelogLength: ${data.length}`, format: "green" });
        const cleanChangelog = data.map(log => {
            const commitSha = log.sha;
            const branch = execSync(`git name-rev ${commitSha}`)?.toString()?.split(" ")?.[1]?.split("\n")?.[0] || "main";
            const version = getCommitPkgV(commitSha, pkg.path) || pkg.parsed.version;
            if (!hasChangesInDir(commitSha, pkg.path)) {
                step({ msg: `No file changes for ${pkg.parsed.name}, skipping`, format: "magenta" });
                return;
            }

            return {
                version,
                branch,
                subject: `${version} ${log.commit.message}`,
                message: log.commit.message,
                author: log.commit.author?.name,
                email: log.commit.author?.email,
                date: log.commit.author?.date,
                commit: `[${commitSha}](${log.html_url})`
            } as Record<string, string>;
        }).filter(l => {
            if (!l) return false;
            if (l.subject.includes("[branch|") || l.message.includes("Merge") || l.message.includes("generated-changelog")) {
                return false;
            }
            return true;
        }) as Record<string, string>[];

        step({ msg: `cleanChangelogLength: ${cleanChangelog.length}`, format: "green" });
        writeLog(pkg.parsed.name, pkg.path, cleanChangelog);

        if (process.env.CI) {
            execSync(`git add ${pkg.path}CHANGELOG.md`);
            execSync(`git commit -m "[branch|${branch}|${pkg.parsed.name}] changelog updated"`);
        }
    } catch (err) {
        step({ msg: `Error on generating changelog for ${pkg.parsed.name}`, err });
    }
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
    const packages = await getPackages(true);
    const commitRes = await octokit.request("GET /repos/{owner}/{repo}/commits", {
        owner: "petarzarkov",
        repo: "toplo",
        per_page: 100,
    });

    if (commitRes.status !== 200 || !commitRes.data.length) {
        step({ msg: "Bad response from github api", format: "red" });
        step({ info: commitRes, format: "bgYellow" });
        return;
    }

    for (const pkg of packages) {
        genChangeLog(pkg, commitRes.data);
    }

})();