import babel from '@rollup/plugin-babel';

const config = {
  input: 'src/index.js',
  output: [
    {
      format: 'esm',
      file: 'demo/src/ez.esm.js',
      sourcemap: false
    }
  ],
  plugins: [
		babel({ babelHelpers: 'bundled' })
	]
};
 
export default config;