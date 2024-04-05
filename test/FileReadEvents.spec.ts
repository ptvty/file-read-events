import { FileReadEvents } from "../src/FileReadEvents";
import { READ_EVENT } from "../src/constants";
import { ChildProcessStub } from "./ChildProcessStub";

jest.mock('child_process', () => ({
    spawn: (_command: string, args?: readonly string[] | undefined) => {
        const child = new ChildProcessStub();
        const line = `[EVENT] 0|0|${args?.[0]}`;
        setTimeout(() => {            
            child.stdout.emit('data', line);
        }, 1000);
        return child;
    }
}));  

describe('FileReadEvents', () => {    
    it('should emit read event whenever stdout of the spawned child process emits data event with [event] line', (done) => {        
        const callbackMock = jest.fn();
        const callback = () => {            
            callbackMock();
            expect(callbackMock).toHaveBeenCalled();
            fileEvents.end();
            done();
        };
        const fileEvents = new FileReadEvents('test.txt');
        fileEvents.on(READ_EVENT, callback);
        fileEvents.start();
    });
});