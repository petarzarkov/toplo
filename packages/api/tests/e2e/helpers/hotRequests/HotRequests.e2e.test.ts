import { HotLogger, HotRequests } from "../../../../src";

jest.mock("../../../../src/helpers/hotLogger/HotLogger.ts");
const localLogger = HotLogger.createLogger("test-requests");

describe("HotRequests E2E Test Suite", () => {
    it("Should return successful response and log", async () => {
        const result = await HotRequests.fetch({
            method: "GET",
            url: "http://google.com/",
            options: {
                eventName: "e2eTest",
                logger: localLogger,
                timeout: 5000,
            },
        });

        expect(result).toEqual(
            expect.objectContaining({
                success: true,
                status: 200,
                elapsed: expect.any(Number),
            }),
        );
    });

    it("Should time out", async () => {
        jest.spyOn(HotRequests, "parseResponse").mockImplementationOnce(() => {
            throw new Error("Some err");
        });

        const result = await HotRequests.get({
            url: "http://google.com/",
            options: {
                logger: localLogger,
                timeout: 1,
            },
        });

        expect(result).toEqual(
            expect.objectContaining({
                error: expect.stringContaining("operation was aborted"),
                stack: expect.stringContaining("operation was aborted"),
                elapsed: expect.any(Number),
            }),
        );
    });
});
