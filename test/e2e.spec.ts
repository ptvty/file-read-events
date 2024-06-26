import { resolve } from 'path';
import { createReadStream } from 'fs';
import { FileReadEvents } from "../src/FileReadEvents";
import { ERROR_EVENT, READY_EVENT, READ_EVENT, TEST_TARGET_PATH } from "../src/constants";


describe('e2e', () => {
    const absolutePath = resolve(TEST_TARGET_PATH);

    it('should emit read event when the file is read', (done) => {
        const fileEvents = new FileReadEvents(absolutePath);
        const callback = () => {
            expect(readyCallbackMock).toHaveBeenCalled();
            fileEvents.end();
            done();
        };
        fileEvents.on(READ_EVENT, callback);
        fileEvents.start();

        const readyCallbackMock = jest.fn();
        fileEvents.on(READY_EVENT, () => {
            readyCallbackMock();
            createReadStream(absolutePath, { start: 0, end: 0 }).on("data", () => {});
        });
        fileEvents.on(ERROR_EVENT, (e) => {
            done(e);
        });
    });

    it('should emit correct isTargetByte when the target byte is read', (done) => {
        // watch the third byte of the file
        const fileEvents = new FileReadEvents(absolutePath, 2);
        fileEvents.on(READ_EVENT, (e) => {
            expect(readyCallbackMock).toHaveBeenCalled();
            expect(e.isTargetByte).toBe(true);
            fileEvents.end();
            done();
        });
        fileEvents.start();

        const readyCallbackMock = jest.fn();
        // read the third byte of the file via node fs
        fileEvents.on(READY_EVENT, () => {
            readyCallbackMock();
            createReadStream(absolutePath, { start: 2, end: 2 }).on("data", () => {});
        });
        fileEvents.on(ERROR_EVENT, (e) => {
            done(e);
        });
    });

    it('should emit correct isTargetByte when a non target byte is read', (done) => {
        // watch the third byte of the file
        const fileEvents = new FileReadEvents(absolutePath, 0);
        fileEvents.on(READ_EVENT, (e) => {
            expect(readyCallbackMock).toHaveBeenCalled();
            expect(e.isTargetByte).toBe(false);
            fileEvents.end();
            done();
        });
        fileEvents.start();

        const readyCallbackMock = jest.fn();
        // read the third byte of the file via node fs
        fileEvents.on(READY_EVENT, () => {
            readyCallbackMock();
            createReadStream(absolutePath, { start: 1, end: 1 }).on("data", () => {});
        });
        fileEvents.on(ERROR_EVENT, (e) => {
            done(e);
        });
    });

});