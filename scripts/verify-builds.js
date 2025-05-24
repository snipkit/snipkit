const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

// Get all package directories
async function getPackageDirs() {
  const packageDirs = [];
  
  const categories = ['core', 'frameworks', 'utils', 'wasm'];
  
  for (const category of categories) {
    const categoryPath = path.join(__dirname, '..', 'packages', category);
    
    try {
      const entries = await readdir(categoryPath, { withFileTypes: true });
      
      for (const entry of entries) {
        if (entry.isDirectory()) {
          const pkgPath = path.join(categoryPath, entry.name);
          const pkgJsonPath = path.join(pkgPath, 'package.json');
          
          if (fs.existsSync(pkgJsonPath)) {
            packageDirs.push({
              name: entry.name,
              path: pkgPath,
              category
            });
          }
        }
      }
    } catch (err) {
      console.error(`Error reading ${category} directory:`, err);
    }
  }
  
  return packageDirs;
}

// Build a package
function buildPackage(pkgDir) {
  console.log(`\n🔨 Building ${pkgDir.name}...`);
  
  try {
    execSync('npm run build', {
      cwd: pkgDir.path,
      stdio: 'inherit',
      env: {
        ...process.env,
        // Ensure we're using the local versions
        NODE_ENV: 'production',
        FORCE_COLOR: '1'
      }
    });
    
    console.log(`✅ Successfully built ${pkgDir.name}`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to build ${pkgDir.name}`);
    return false;
  }
}

// Link packages locally for testing
async function linkPackages() {
  console.log('\n🔗 Linking packages...');
  
  try {
    // Create a global node_modules directory
    const globalNodeModules = path.join(__dirname, '..', 'node_modules');
    if (!fs.existsSync(globalNodeModules)) {
      fs.mkdirSync(globalNodeModules, { recursive: true });
    }
    
    // Link each package
    const packageDirs = await getPackageDirs();
    
    for (const pkgDir of packageDirs) {
      const pkgJson = require(path.join(pkgDir.path, 'package.json'));
      const pkgName = pkgJson.name;
      
      // Create symlink in the root node_modules
      const linkPath = path.join(globalNodeModules, pkgName);
      const targetPath = path.relative(path.dirname(linkPath), pkgDir.path);
      
      try {
        if (fs.existsSync(linkPath)) {
          fs.unlinkSync(linkPath);
        }
        
        fs.symlinkSync(targetPath, linkPath, 'junction');
        console.log(`  🔗 Linked ${pkgName} -> ${targetPath}`);
      } catch (error) {
        console.error(`  ❌ Failed to link ${pkgName}:`, error.message);
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error linking packages:', error);
    return false;
  }
}

// Main function
async function main() {
  console.log('🚀 Starting build verification...');
  
  // 1. Build all packages
  const packageDirs = await getPackageDirs();
  let allBuilt = true;
  
  for (const pkgDir of packageDirs) {
    const success = buildPackage(pkgDir);
    if (!success) {
      allBuilt = false;
      console.error(`❌ Build failed for ${pkgDir.name}`);
    }
  }
  
  if (!allBuilt) {
    console.error('\n❌ Some packages failed to build');
    process.exit(1);
  }
  
  // 2. Link packages
  const linked = await linkPackages();
  if (!linked) {
    console.error('\n❌ Failed to link packages');
    process.exit(1);
  }
  
  console.log('\n✅ All packages built and linked successfully!');
  console.log('\nYou can now test the packages by running:');
  console.log('  npm test --workspaces');
}

// Run the script
main().catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
});
