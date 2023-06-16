import { getPackages, publishPackage, step } from "./releaseUtils";

const packages = await getPackages();
for (const pkg of packages) {
    try {
        step({ msg: `Starting publish of ${pkg.parsed.name}...` });
        if (!pkg.parsed.version) {
            throw new Error("Missing pkg version!");
        }

        publishPackage(pkg.path);
        step({ msg: `Finished publishing of ${pkg.parsed.name}`} );

    } catch (err) {
        step({ msg: `Error on publishing ${pkg.parsed.name}`, err });
        process.exit(1);
    }
}