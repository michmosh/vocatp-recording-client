import { resultServerToken} from './config'
export class ResultServer {
    async options(resultServerAddress) {
        console.log(`Result Server: send OPTIONS to https://${resultServerAddress}/hrec`);
        try {
            let response = await fetch(`https://${resultServerAddress}/hrec`, {
                method: "OPTIONS",
                mode: "cors",
                headers: {
                    "Authorization": `Bearer ${resultServerToken}`,
                    "Content-Type": "multipart/form-data"
                },
            });
            console.log(`Result server: response ${response.ok ? 'OK' : 'Non-OK'}`);
            return response.ok;
        } catch (e) {
            console.log('Result server: cannot send OPTIONS');
            return false;
        }
    }

    async post(resultServerAddress, { metadata, recognized, waveUrl }) {
        console.log(`Result Server: send POST to https://${resultServerAddress}/hrec`);
        let formdata = new FormData();
        formdata.append('blob', new Blob([metadata], { type: "application/json" }), "metadata.json");
        formdata.append('blob', new Blob([recognized], { type: "application/json" }), "recognized.json");
        formdata.append('wave_url', waveUrl);

        try {
            let response = await fetch(`https://${resultServerAddress}/hrec`, {
                method: "POST",
                mode: "cors",
                headers: {
                    "Authorization": `Bearer ${resultServerToken}`,
                },
                body: formdata
            });

            console.log(`response status=${response.status}`);
            if (response.status !== 200) {
                console.log(`Bad response. status code=${response.status}`);
                return false;
            } else {
                console.log('OK response');
                return true;
            }
        } catch (e) {
            console.log('POST results error', e);
            return false;
        }
    }

    // If result server is offline we save data to download files.
    saveToFile(data, fileName) {
        console.log(`Result server: save to file ${fileName}`);
        const link = document.createElement('a')
        link.setAttribute('target', '_blank');
        const blob = new Blob([data], { type: 'text/plain' });
        link.setAttribute('href', URL.createObjectURL(blob));
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}


