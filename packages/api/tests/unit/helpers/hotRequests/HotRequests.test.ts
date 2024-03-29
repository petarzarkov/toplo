import { HotLogger, HotRequests } from "../../../../src";

const fetchFixture = {
    ok: true,
    status: 200,
    text: async () =>
        JSON.stringify({
            valid: "res",
        }),
};

jest.mock("../../../../src/helpers/hotLogger/HotLogger.ts");

describe("HotRequests Test Suite", () => {
    beforeEach(() => {
        global.fetch = jest.fn().mockImplementation(() => fetchFixture);
    });

    it("Should return successful response and log", async () => {
        const localLogger = HotLogger.createLogger("test-requests");

        const result = await HotRequests.fetch({
            method: "GET",
            url: "https://randomuser.me/api",
            options: {
                logger: localLogger,
            },
        });

        expect(result).toEqual(
            expect.objectContaining({
                success: true,
                status: 200,
                elapsed: expect.any(Number),
                result: {
                    valid: "res",
                },
            }),
        );
    });

    it("Should return unsuccessful response and log", async () => {
        fetchFixture.ok = false;
        fetchFixture.status = 500;
        const localLogger = HotLogger.createLogger("test-requests");

        const result = await HotRequests.get({
            url: "https://randomuser.me/api",
            options: {
                logger: localLogger,
            },
        });

        expect(result).toEqual(
            expect.objectContaining({
                success: false,
                status: 500,
                error: "Request unsuccessful",
                stack: expect.stringContaining("Error:"),
                elapsed: expect.any(Number),
                result: {
                    valid: "res",
                },
            }),
        );
    });

    it("Should return unsuccessful response on caught error", async () => {
        fetchFixture.ok = false;
        fetchFixture.status = 500;
        jest.spyOn(HotRequests, "parseResponse").mockImplementationOnce(() => {
            throw new Error("Some err");
        });
        const localLogger = HotLogger.createLogger("test-requests");

        const result = await HotRequests.get({
            url: "https://randomuser.me/api",
            options: {
                logger: localLogger,
                timeout: 1,
            },
        });

        expect(result).toEqual(
            expect.objectContaining({
                success: false,
                status: 500,
                error: "Some err",
                stack: expect.stringContaining("Error: Some err"),
                elapsed: expect.any(Number),
            }),
        );
    });
});
