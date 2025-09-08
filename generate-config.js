const fs = require('fs');
const path = require('path');
const esbuild = require('esbuild');

const outputDir = 'dist';

async function buildApp() {
    try {
        console.log('Starting build process...');

        // 1. Clean and create the output directory.
        if (fs.existsSync(outputDir)) {
            fs.rmSync(outputDir, { recursive: true, force: true });
        }
        fs.mkdirSync(outputDir, { recursive: true });
        console.log(`Output directory '${outputDir}' created.`);

        // 2. Bundle the application using esbuild.
        // We mark the CDN packages as external so esbuild doesn't try to bundle them.
        await esbuild.build({
            entryPoints: ['index.tsx'],
            bundle: true,
            outfile: path.join(outputDir, 'bundle.js'),
            format: 'esm',
            jsx: 'automatic',
            loader: { '.ts': 'tsx' }, // Ensure .ts files are also handled correctly
            external: ['react', 'react-dom/*', '@google/genai'],
        });
        console.log('Application bundled successfully.');

        // 3. Get API key from environment variables and create config.js.
        const apiKey = process.env.API_KEY;
        if (!apiKey) {
            console.error("Build failed: The API_KEY environment variable is not set.");
            process.exit(1);
        }
        const configContent = `window.GEMINI_API_KEY = "${apiKey}";`;
        fs.writeFileSync(path.join(outputDir, 'config.js'), configContent);
        console.log(`'config.js' created successfully in '${outputDir}'.`);

        // 4. Copy static assets to the output directory.
        const staticAssets = ['index.html', 'manifest.json', 'sw.js', 'metadata.json'];
        staticAssets.forEach(asset => {
            const sourcePath = path.resolve(__dirname, asset);
            if (fs.existsSync(sourcePath)) {
                const destPath = path.resolve(__dirname, outputDir, asset);
                fs.copyFileSync(sourcePath, destPath);
            } else {
                console.warn(`Warning: Asset '${asset}' not found. Skipping.`);
            }
        });
        console.log('Static assets copied successfully.');

        console.log('Build process completed successfully.');

    } catch (error) {
        console.error('An error occurred during the build process:', error);
        process.exit(1);
    }
}

buildApp();
