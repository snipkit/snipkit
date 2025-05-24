const fs = require('fs');
const path = require('path');

const PACKAGE_DIRS = [
  'packages/core',
  'packages/frameworks',
  'packages/utils',
  'packages/wasm'
];

// Update package.json files
function updatePackageJson(pkgPath) {
  const pkgJsonPath = path.join(pkgPath, 'package.json');
  
  if (!fs.existsSync(pkgJsonPath)) return;
  
  const pkg = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'));
  
  // Update scripts
  pkg.scripts = pkg.scripts || {};
  pkg.scripts = {
    "build": "rollup -c",
    "dev": "rollup -c -w",
    "test": "jest",
    "lint": "eslint src --ext .ts,.tsx",
    "typecheck": "tsc --noEmit",
    ...pkg.scripts
  };
  
  // Update devDependencies
  pkg.devDependencies = {
    ...pkg.devDependencies,
    "@rollup/plugin-commonjs": "^25.0.7",
    "@rollup/plugin-node-resolve": "^15.2.3",
    "@rollup/plugin-typescript": "^11.1.4",
    "@types/jest": "^29.5.5",
    "@types/node": "^20.5.7",
    "@typescript-eslint/eslint-plugin": "^6.11.0",
    "@typescript-eslint/parser": "^6.11.0",
    "eslint": "^8.54.0",
    "eslint-config-prettier": "^9.0.0",
    "eslint-plugin-import": "^2.28.1",
    "jest": "^29.7.0",
    "prettier": "^3.1.0",
    "rollup": "^3.29.4",
    "rollup-plugin-terser": "^7.0.2",
    "ts-jest": "^29.1.1",
    "typescript": "^5.2.2"
  };
  
  // Update tsconfig.json if it exists
  const tsconfigPath = path.join(pkgPath, 'tsconfig.json');
  if (!fs.existsSync(tsconfigPath)) {
    fs.writeFileSync(
      tsconfigPath,
      JSON.stringify({
        extends: "../../config/tsconfig/node.json",
        compilerOptions: {
          outDir: "./dist",
          rootDir: "./src"
        },
        include: ["src/**/*"],
        exclude: ["node_modules", "dist"]
      }, null, 2) + '\n'
    );
  }
  
  // Create basic rollup.config.js if it doesn't exist
  const rollupConfigPath = path.join(pkgPath, 'rollup.config.js');
  if (!fs.existsSync(rollupConfigPath)) {
    fs.writeFileSync(
      rollupConfigPath,
      `import pkg from './package.json';
import { createConfig } from '../../config/rollup/base.config';

export default createConfig(pkg, {
  // Add package-specific config here
});
`
    );
  }
  
  // Create basic .eslintrc.js if it doesn't exist
  const eslintrcPath = path.join(pkgPath, '.eslintrc.js');
  if (!fs.existsSync(eslintrcPath)) {
    fs.writeFileSync(
      eslintrcPath,
      `module.exports = {
  extends: ['../../config/eslint/base.js'],
  // Add package-specific rules here
};
`
    );
  }
  
  // Save updated package.json
  fs.writeFileSync(pkgJsonPath, JSON.stringify(pkg, null, 2) + '\n');
  
  console.log(`Updated ${pkg.name}`);
}

// Process all packages
PACKAGE_DIRS.forEach(dir => {
  if (fs.existsSync(dir)) {
    fs.readdirSync(dir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .forEach(dirent => {
        const pkgPath = path.join(dir, dirent.name);
        updatePackageJson(pkgPath);
      });
  }
});

console.log('All package.jsons have been updated!');
