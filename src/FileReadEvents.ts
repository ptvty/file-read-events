import { EventEmitter } from "tsee";
import { resolve, join } from 'path';
import { spawn, ChildProcessWithoutNullStreams } from 'child_process';
import { FileReadEventEmitterTypes } from './types';
import { EXECUTABLE_PATH, CONSOLE_TAGS, ERROR_EVENT, EXIT_EVENT, READY_EVENT, READ_EVENT } from "./constants";

export class FileReadEvents extends EventEmitter<FileReadEventEmitterTypes> {
    private filePath: string;
    private targetByteOffset: number | undefined;
    private child: ChildProcessWithoutNullStreams | null = null;

    constructor(filePath: string, targetByteOffset?: number) {
        super();
        this.filePath = filePath;
        this.targetByteOffset = targetByteOffset;
    }

    start() {
        const absoluteExecutablePath = resolve(join(__dirname, '..', EXECUTABLE_PATH));        
        this.child = spawn(absoluteExecutablePath, [this.filePath]);
        this.child.on('exit', () => {
            this.emit(EXIT_EVENT);
        });
        this.child.stdout.on('data', (data) => {
            data = `${data}`.trim();            
            const lines = data.split('\n');            
            for (const line of lines) {
                this.processLine(line);
            }
        });
    }

    end() {
        this.child?.kill();
    }

    processLine (line: string) {        
        if (line.startsWith(CONSOLE_TAGS.EVENT)) {            
            const lineParts = line.substring(CONSOLE_TAGS.EVENT.length).split('|');
            const offset = +lineParts[0];
            const ioSize = +lineParts[1];
            const path = lineParts[2];

            let isTargetByte = false;
            if (this.targetByteOffset !== undefined &&
                this.targetByteOffset >= +offset &&
                this.targetByteOffset < +offset + +ioSize) {
                isTargetByte = true;
            }
            
            this.emit(READ_EVENT, { offset, ioSize, path, isTargetByte });
            return;
        }
        if (line.startsWith(CONSOLE_TAGS.ERROR)) {
            this.emit(ERROR_EVENT, line);
        }
        if (line.startsWith(CONSOLE_TAGS.READY)) {
            this.emit(READY_EVENT);
        }
        if (line.startsWith(CONSOLE_TAGS.BREAK)) {
            this.emit(EXIT_EVENT);
        }
    }
}
