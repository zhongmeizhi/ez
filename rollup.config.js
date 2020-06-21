import babel from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser'

const config = {
  input: 'src/index.js',
  output: [
    {
      format: 'umd',
      file: 'dist/ez.js',
      name: 'ez',
      sourcemap: true
    },
    {
      format: 'esm',
      file: 'dist/ez.esm.js',
      sourcemap: false
    }
  ],
  plugins: [
		terser({
			include: ['ez.js'],
		}),
		babel({ babelHelpers: 'bundled' })
	]
};
 
export default config;