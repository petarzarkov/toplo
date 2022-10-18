import { getPackages, publishPackage } from "./releaseUtils";

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
    const packages = await getPackages();
    for (const pkg of packages) {
        try {
            console.log(`Starting publish of ${pkg.parsed.name}...`);
            if (!pkg.parsed.version) {
                throw new Error("Missing pkg version!");
            }

            publishPackage(pkg.path);
            console.log(`Finished publishing of ${pkg.parsed.name}`);

        } catch (error) {
            console.log({ message: `Error on publishing ${pkg.parsed.name}`, error });
            process.exit(1);
        }
    }
})();