import { get } from 'https';
import { createWriteStream } from 'fs';
import { BINARY_PATH, BINARY_URL } from './constants';

function downloadStandaloneBinary() {
    const file = createWriteStream(BINARY_PATH);
    console.log(`Post-install: Downloading standalone binary... ${BINARY_URL}`);
    get(BINARY_URL, (response) => {
        const realBinaryUrl = response.headers?.location || BINARY_URL;
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
