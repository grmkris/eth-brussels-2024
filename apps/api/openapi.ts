import { write } from 'bun';

async function fetchAndSave() {
    // read path from the command line
    // const path = process.argv[3];
    try {
        const response = await fetch('http://localhost:3001/doc');
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }

        const jsonData = await response.json();

        // Convert JSON data to a string and format it for TypeScript
        const tsContent = `export default ${JSON.stringify(jsonData, null, 2)} as const;`;

        // get current working directory and instead of using path, use this script's directory as the base
        const path = Bun.argv[2];

        console.log('Path:', path);
        console.log("argv:", Bun.argv);
        const target = path ? path : '../frontend/src/openapi.ts';
        // Write the TypeScript content to openapi.ts file using Bun's write API
        console.log('Writing to:', target);
        await write(target, tsContent);

        console.log('openapi.ts has been created successfully.');
    } catch (error) {
        console.error('Error fetching JSON:', error);
    }
}

fetchAndSave();