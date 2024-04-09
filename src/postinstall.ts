import { get } from 'https';
import { dirname } from 'path';
import { createWriteStream, mkdirSync } from 'fs';
import { EXECUTABLE_PATH, EXECUTABLE_URL } from './constants';

function downloadStandaloneBinary() {
    mkdirSync(dirname(EXECUTABLE_PATH));
    const file = createWriteStream(EXECUTABLE_PATH);
    console.log(`Post-install: Downloading standalone binary... ${EXECUTABLE_URL}`);
    get(EXECUTABLE_URL, (response) => {
        const realBinaryUrl = response.headers?.location || EXECUTABLE_URL;
        console.log(`Post-install: Downloading standalone binary... ${realBinaryUrl}`);
        get(realBinaryUrl, (response) => {
            console.log(`Post-install: Downloading standalone binary...`);
            response.pipe(file);
            file.on("finish", () => {
                file.close();
                console.log('Post-install: Finished downloading standalone binary.');
            });
        });
    });
}

downloadStandaloneBinary();
