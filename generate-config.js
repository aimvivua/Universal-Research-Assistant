const fs = require('fs');

const apiKey = process.env.API_KEY;

if (!apiKey) {
  console.error("Build failed: The API_KEY environment variable is not set in Vercel.");
  // Exit with a non-zero code to fail the Vercel build, preventing a broken deployment.
  process.exit(1);
}

// This creates a simple JavaScript file that assigns the API key to a global window variable.
const content = `window.GEMINI_API_KEY = "${apiKey}";`;

// Vercel runs the build script from the project root.
// This will create a `config.js` file in the root, which will be deployed alongside index.html.
fs.writeFileSync('config.js', content);

console.log('Successfully generated config.js with API key.');
