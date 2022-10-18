import { execSync } from "node:child_process";
import { getPackages, ParsedPackage, step } from "./releaseUtils";

// eslint-disable-next-line @typescript-eslint/require-await
const genChangeLog = async (pkg: ParsedPackage) => {
    try {
        step(`Starting generation of changelog for ${pkg.parsed.name}`);

        const changelogArgs = [
            "npx",
            "conventional-changelog",
            "-p",
            "angular",
            "-i",
            "CHANGELOG.md",
            "-s",
            "--commit-path",
            "."
        ];

        execSync(changelogArgs.join(" "), { cwd: pkg.path });
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