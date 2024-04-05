import { EventEmitter } from "tsee";

export class ChildProcessStub extends EventEmitter {
    stdout: EventEmitter;
    kill: () => void;
    constructor() {
        super();
        this.stdout = new EventEmitter();
        this.kill = () => {};
    }
}