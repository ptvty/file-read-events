# file-read-events

Watch for read events on the given file and byte


## Purpose

In certain scenarios, it becomes essential to track the bytes read from a file by the operating system's file system. This module aims to provide a solution by providing a mechanism to receive events whenever a read operation occurs on a specified file, including details such as the number of bytes read and the read offset.

A major use case is end-to-end and integration tests. You can check if a specific part of the file is read (or is *not* read), so you can assert that your code is working as intended in terms of correct file access.

## Installation

    npm install file-read-events

## Basic Usage

    import { FileReadEvents } from "../src/FileReadEvents";
 
    const fileEvents = new FileReadEvents('C:/temp/target-file.txt');

    fileEvents.on('read', ({ offset, ioSize, path }) => {
        console.log(offset, ioSize, path); 
        // 0 2048 C:/temp/target-file.txt
    });

    // start watching
    fileEvents.start(); 

Close the watcher process at the cleanup.

    fileEvents.end();

## API

With specifying target byte.

    const fileEvents = new FileReadEvents('C:/temp/target-file.txt', 1234);
    fileEvents.on('read', ({ offset, ioSize, path, isTargetByte }) => {
        console.log(offset, ioSize, path, isTargetByte); 
    });
    fileEvents.start();

### Methods

Method | Description
--- | ---
`constructor` | The first parameter is the path to the file to watch. The second parameter (optional) is the target byte (zero-indexed)
`start` | Start the watcher process
`end` | End the watcher process
`on`, `off` | `FileReadEvents` extends `EventEmitter`, so you can use `on` and `off` to manage event handlers.

### Events

Event name | Description
--- | ---
`ready` | The process is launched and ready to watch
`error` | Encountered an error
`read` | A read event was observed on the target file
`exit` | The process was killed

### `read` Event properties

The handlers you add for the read event are called with an event object as their only argument. This object has the following properties:

Property | Description
--- | ---
`offset` | Number of bytes skipped from the beginning of the file
`ioSize` | Number of bytes that has been read by the file system
`path` | Absolute path to the file being read
`isTargetByte` | Is the specified target byte read in this event

### Example

Without specifying target byte.

    const fileEvents = new FileReadEvents('C:/temp/target-file.txt');
    fileEvents.on('read', ({ offset, ioSize, path }) => {
        console.log(offset, ioSize, path); 
    });
    fileEvents.start();

## Compatibility

This is currently working on Windows, contributions are welcome if you can help with adding support for other operating systems. Read "How does it work" section below for more details on this.

## How does it work

This package essentially serves as a wrapper around [WinFileReadEvents](https://github.com/ptvty/WinFileReadEvents), a Windows CLI utility written in C#. It utilizes Event Tracing for Windows (ETW) to capture these events from the operating system. The precompiled standalone binary is downloaded to the `bin` directory during the `postinstall` script of this package.

**IMPORTANT**: Due to Windows restrictions, the executable must be run as an administrator. Please ensure that you run the code in a terminal with administrator privileges; otherwise, it will emit an `error` event and will not work.