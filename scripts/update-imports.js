const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

// Map of old package names to new paths
const PACKAGE_MAPPING = {
  // Core packages
  '@snipkit/snipkit': '@snipkit/core/snipkit',
  '@snipkit/protocol': '@snipkit/protocol',
  '@snipkit/runtime': '@snipkit/core/runtime',
  
  // Framework packages
  '@snipkit/astro': '@snipkit/frameworks/snipkit-astro',
  '@snipkit/bun': '@snipkit/frameworks/snipkit-bun',
  '@snipkit/deno': '@snipkit/frameworks/snipkit-deno',
  '@snipkit/nest': '@snipkit/frameworks/snipkit-nest',
  '@snipkit/next': '@snipkit/frameworks/snipkit-next',
  '@snipkit/node': '@snipkit/frameworks/snipkit-node',
  '@snipkit/remix': '@snipkit/frameworks/snipkit-remix',
  '@snipkit/sveltekit': '@snipkit/frameworks/snipkit-sveltekit',
  
  // Utility packages
  '@snipkit/body': '@snipkit/utils/body',
  '@snipkit/decorate': '@snipkit/utils/decorate',
  '@snipkit/duration': '@snipkit/utils/duration',
  '@snipkit/env': '@snipkit/utils/env',
  '@snipkit/headers': '@snipkit/utils/headers',
  '@snipkit/inspect': '@snipkit/utils/inspect',
  '@snipkit/ip': '@snipkit/utils/ip',
  '@snipkit/logger': '@snipkit/utils/logger',
  '@snipkit/redact': '@snipkit/utils/redact',
  '@snipkit/stable-hash': '@snipkit/utils/stable-hash',
  '@snipkit/transport': '@snipkit/utils/transport',
  
  // WASM packages
  '@snipkit/analyze-wasm': '@snipkit/wasm/analyze-wasm',
  '@snipkit/redact-wasm': '@snipkit/redact-wasm',
};

// File extensions to process
const FILE_EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs'];

async function processFile(filePath) {
  try {
    const content = await readFile(filePath, 'utf8');
    let updated = false;
    
    // Process import/export statements
    const updatedContent = content.replace(
      /(import|export)([\s\{]*[\w\s{},*\n]+[\s\}]*from\s*[\'\"])(@snipkit\/[\w-]+)([\'\"])/g,
      (match, impExp, prefix, pkg, suffix) => {
        const newPkg = PACKAGE_MAPPING[pkg];
        if (newPkg) {
          updated = true;
          return `${impExp}${prefix}${newPkg}${suffix}`;
        }
        return match;
      }
    );

    // Process require statements
    const finalContent = updatedContent.replace(
      /(require\s*\(\s*[\'\"])(@snipkit\/[\w-]+)([\'\"]\s*\))/g,
      (match, prefix, pkg, suffix) => {
        const newPkg = PACKAGE_MAPPING[pkg];
        if (newPkg) {
          updated = true;
          return `${prefix}${newPkg}${suffix}`;
        }
        return match;
      }
    );

    if (updated) {
      await writeFile(filePath, finalContent, 'utf8');
      console.log(`Updated imports in ${filePath}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
    return false;
  }
}

async function processDirectory(directory) {
  try {
    const entries = await readdir(directory, { withFileTypes: true });
    let updatedCount = 0;
    
    for (const entry of entries) {
      const fullPath = path.join(directory, entry.name);
      
      // Skip node_modules and dist directories
      if (entry.isDirectory()) {
        if (['node_modules', 'dist', '.git', '.next', '.svelte-kit'].includes(entry.name)) {
          continue;
        }
        updatedCount += await processDirectory(fullPath);
      } else if (FILE_EXTENSIONS.includes(path.extname(entry.name).toLowerCase())) {
        const wasUpdated = await processFile(fullPath);
        if (wasUpdated) updatedCount++;
      }
    }
    
    return updatedCount;
  } catch (error) {
    console.error(`Error processing directory ${directory}:`, error);
    return 0;
  }
}

async function main() {
  const startTime = Date.now();
  console.log('Starting import path updates...');
  
  const updatedCount = await processDirectory(path.join(__dirname, '..', 'packages'));
  
  const endTime = Date.now();
  console.log(`\n✅ Updated ${updatedCount} files in ${((endTime - startTime) / 1000).toFixed(2)} seconds`);
  console.log('\nNote: Please verify the changes and run tests to ensure everything works as expected.');
}

main().catch(console.error);
