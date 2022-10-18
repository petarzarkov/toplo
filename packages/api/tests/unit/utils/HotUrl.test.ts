import { HotUrl } from "../../../src/utils/HotUrl";

describe("HotUrl Test Suite", () => {
    test("build query", async () => {
        const someParams = {
            prop: "val"
        };

        const resultUrl = HotUrl.buildQuery("https://toplo-utils.com/", someParams);
        const resultUrlTwo = HotUrl.buildQuery("https://toplo-utils.com", someParams);

        expect(resultUrl).toEqual(`https://toplo-utils.com/?prop=${someParams.prop}`);
        expect(resultUrlTwo).toEqual(`https://toplo-utils.com/?prop=${someParams.prop}`);
    });

    test("replace path params", async () => {
        const someParams = {
            prop: "val"
        };

        const resultUrl = HotUrl.replacePathParams("https://toplo-utils.com/{prop}", someParams);

        expect(resultUrl).toEqual(`https://toplo-utils.com/${someParams.prop}`);
    });

    it("builds URL from string", async () => {
        const resultUrl = HotUrl.buildFromString("https://toplo-utils.com", "somePath1");
        const resultUrlTwo = HotUrl.buildFromString("https://toplo-utils.com/", "/somePath2");
        const resultUrlThree = HotUrl.buildFromString("https://toplo-utils.com/?", "/somePath3");

        expect(resultUrl).toEqual(new URL(`https://toplo-utils.com/somePath1`));
        expect(resultUrlTwo).toEqual(new URL(`https://toplo-utils.com/somePath2`));
        expect(resultUrlThree).toEqual(new URL(`https://toplo-utils.com/somePath3`));
    });
});
