import { execSync } from "child_process";
import { getPackages, step } from "./releaseUtils";

export const getNewVersion = (version: string) => {
    let [major, minor, patch] = version.split(".").map(v => parseInt(v));

    let patched = false;
    let minored = false;

    if (patch === 9) {
        if (minor <= 8) {
            minor += 1;
            minored = true;
        }
        patch = 0;
        patched = true;
    }

    if (minor === 9 && !minored) {
        major += 1;
        minor = 0;
    }

    if (patch <= 8 && !patched) {
        patch += 1;
    }

    return [major, minor, patch].join(".");
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
    const packages = await getPackages();
    for (const pkg of packages) {
        try {
            step(`Starting versioning for ${pkg.parsed.name}...`);
            if (!pkg.parsed.version) {
                throw new Error("Missing pkg version!");
            }
            // const changes = execSync(`git diff --name-only origin/main...origin/main | cut -s -d/ -f 1 | uniq | grep ${pkg.path}`).toString();
            // console.log("changes:", changes);
            console.log("Path:", pkg.path);
            console.log("Current Version:", pkg.parsed.version);
            const newVersion = getNewVersion(pkg.parsed.version);
            console.log("New Version:", newVersion);

            execSync(`npm --prefix ${pkg.path} version ${newVersion} --no-git-tag-version`).toString();
            const branch = execSync("git rev-parse --abbrev-ref HEAD").toString().trim();

            if (process.env.CI) {
                execSync(`git add ${pkg.path}/package.json`);
                execSync(`git tag ${pkg.parsed.name}@${newVersion}`);
                execSync(`git commit -am "[branch|${branch}] version of ${pkg.parsed.name} bumped to ${newVersion}"`);
            }

            console.log(`Finished versioning for ${pkg.parsed.name}, version bumped to ${newVersion}!`);

        } catch (error) {
            console.log({ message: `Error on versioning ${pkg.parsed.name}`, error });
        }
    }

})();