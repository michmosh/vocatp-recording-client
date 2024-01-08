
const { lexiconServerAddress, lexiconServerToken} = window.BASE_CONFIG

export class LexiconServer {
    async fetch(url, token) {
        let response = await fetch(url, {
            method: "GET",
            mode: "cors",
            headers: {
                'Accept': 'application/json',
                'x-api-key': token,
            }
        });
        if( response.status === 404)
          return null;
        if( response.status !== 200) console.error(`Wrong response status ${response.status}`);
        
        let obj = await response.json();
        return this.base64toString(obj.b64Content);
    }
    
    
    base64toString(base64) {
        const binString = atob(base64);
        const bytes = Uint8Array.from(binString, (m) => m.codePointAt(0));
        return (new TextDecoder()).decode(bytes);
    }
    
    lexiconToJson(lexicon) {
        const lines = lexicon.split('\n');
        const result = {};
    
        lines.forEach((line) => {
            const parts = line.trim().split('\t');
            if (parts.length >= 2) {
                const key = parts[0];
                const values = parts.slice(1).join(' ').split(',').map((item) => item.trim());
                if (result[key]) {
                    // If the key already exists in the result, append values to the existing array
                    result[key].push(...values);
                } else {
                    // Otherwise, create a new entry in the JSON object with the key and values
                    result[key] = values;
                }
            }
        });
        return result;
    }
    
    glossaryToJson(glossary) {
        const lines = glossary.split('\n');
        const result = [];
        lines.forEach((line) => {
            line = line.trim();
            if( line !== '')
              result.push(line);
        });
        return result;
    }
    
    async get() {
        let lexiconText = await this.fetch(`https://${lexiconServerAddress}/api/miscFiles/lexicon`, lexiconServerToken);
        let glossaryText = await this.fetch(`https://${lexiconServerAddress}/api/miscFiles/glossary`, lexiconServerToken);
        let lexicon = lexiconText !== null ? this.lexiconToJson(lexiconText) : null;
        let glossary = glossaryText !== null ? this.glossaryToJson(glossaryText) : null;
        return { lexicon, glossary };
    }
}