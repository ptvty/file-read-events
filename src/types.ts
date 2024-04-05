import { ERROR_EVENT, EXIT_EVENT, READY_EVENT, READ_EVENT } from "./constants";

export type ReadEvent = {
    offset: number,
    ioSize: number,
    path: string,
    isTargetByte: boolean,
};

export type FileReadEventEmitterTypes = {
    [READY_EVENT]: () => void;
    [ERROR_EVENT]: (message: string) => void;
    [READ_EVENT]: (event: ReadEvent) => void;
    [EXIT_EVENT]: () => void;
};
