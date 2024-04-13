import { get } from 'https';
import { dirname } from 'path';
import { createWriteStream, mkdirSync, existsSync, renameSync } from 'fs';
import { EXECUTABLE_PATH, EXECUTABLE_URL } from './constants';

function downloadStandaloneBinary() {
    try {
        mkdirSync(dirname(EXECUTABLE_PATH));
    } catch (e) {
        // dir already exists (e.code === 'EEXIST')
    }
    if (existsSync(EXECUTABLE_PATH)) {
        console.log('Post-install: Download skipped, executable already exists.');
        return;
    }
    const executableDownloadPartPath = `${EXECUTABLE_PATH}.part`;
    const file = createWriteStream(executableDownloadPartPath);
    console.log(`Post-install: Downloading standalone binary... ${EXECUTABLE_URL}`);
    get(EXECUTABLE_URL, (response) => {
        const realBinaryUrl = response.headers?.location || EXECUTABLE_URL;
        console.log(`Post-install: Downloading standalone binary... ${realBinaryUrl}`);
        get(realBinaryUrl, (response) => {
            console.log(`Post-install: Downloading standalone binary...`);
            response.pipe(file);
            file.on("finish", () => {
                file.close();
                renameSync(executableDownloadPartPath, EXECUTABLE_PATH);
                console.log('Post-install: Finished downloading standalone binary.');
            });
        });
    });
}

downloadStandaloneBinary();
