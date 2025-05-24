import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';
import { babel } from '@rollup/plugin-babel';
import json from '@rollup/plugin-json';

export function createConfig(pkg, options = {}) {
  const {
    input = 'src/index.ts',
    outputDir = 'dist',
    minify = false,
    isBrowser = false,
    external = [],
  } = options;

  const extensions = ['.js', '.jsx', '.ts', '.tsx'];
  const defaultExternal = [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {}),
    ...external,
  ];

  const plugins = [
    resolve({ extensions }),
    commonjs(),
    typescript({
      tsconfig: './tsconfig.json',
      exclude: ['**/*.test.ts', '**/*.test.tsx'],
    }),
    babel({
      babelHelpers: 'bundled',
      exclude: 'node_modules/**',
      extensions,
    }),
    json(),
  ];

  if (minify) {
    plugins.push(terser());
  }

  const output = [
    {
      file: `${outputDir}/index.cjs.js`,
      format: 'cjs',
      sourcemap: true,
      exports: 'named',
    },
    {
      file: `${outputDir}/index.esm.js`,
      format: 'esm',
      sourcemap: true,
    },
  ];

  if (isBrowser) {
    output.push({
      file: `${outputDir}/index.umd.js`,
      format: 'umd',
      name: pkg.name
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(''),
      sourcemap: true,
    });
  }

  return {
    input,
    output,
    plugins,
    external: (id) =>
      defaultExternal.some(
        (dep) => id === dep || id.startsWith(`${dep}/`)
      ),
  };
}
