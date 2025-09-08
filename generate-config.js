
const fs = require('fs');
const path = require('path');

/**
 * A simple build script for Vercel.
 * 1. Creates a `dist` directory (the output directory).
 * 2. Generates `config.js` with the API key inside `dist`.
 * 3. Copies all necessary source files and folders into `dist`.
 */

const outputDir = 'dist';

// List of all files and top-level directories to be copied to the output directory.
const assets = [
    'index.html',
    'manifest.json',
    'sw.js',
    'metadata.json',
    'index.tsx',
    'App.tsx',
    'types.ts',
    'constants.ts',
    'hooks',
    'services',
    'components'
];

try {
    console.log('Starting build process...');

    // 1. Clean and create the output directory.
    if (fs.existsSync(outputDir)) {
        fs.rmSync(outputDir, { recursive: true, force: true });
    }
    fs.mkdirSync(outputDir, { recursive: true });
    console.log(`Output directory '${outputDir}' created.`);

    // 2. Get API key from environment variables.
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
        console.error("Build failed: The API_KEY environment variable is not set.");
        process.exit(1); // Fail the build
    }

    // 3. Create the config.js file inside the output directory.
    const configContent = `window.GEMINI_API_KEY = "${apiKey}";`;
    fs.writeFileSync(path.join(outputDir, 'config.js'), configContent);
    console.log(`'config.js' created successfully in '${outputDir}'.`);

    // 4. Copy all required assets to the output directory.
    assets.forEach(asset => {
        const sourcePath = path.resolve(__dirname, asset);
        if (fs.existsSync(sourcePath)) {
            const destPath = path.resolve(__dirname, outputDir, asset);
            console.log(`Copying '${asset}' to '${outputDir}'...`);
            // fs.cpSync is available in Node.js 16.7+ (Vercel uses 18.x by default)
            fs.cpSync(sourcePath, destPath, { recursive: true });
        } else {
            console.warn(`Warning: Asset '${asset}' not found. Skipping.`);
        }
    });

    console.log('Build process completed successfully.');

} catch (error) {
    console.error('An error occurred during the build process:', error);
    process.exit(1); // Fail the build on any error
}
