import fs from 'fs';

export default file => {
    const fileContents = fs.readFileSync(file, 'utf8');
    return fileContents.match(/Version:\s*(\d{1,2}\.\d{1,2}\.\d{1,3})/i)[1];
};