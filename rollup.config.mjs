import typescript from '@rollup/plugin-typescript'

const external = ['@nextcloud/event-bus']

export default [
	{
		input: './lib/index.ts',
		external,
		plugins: [
			typescript({
				tsconfig: './tsconfig.json',
				compilerOptions: { target: 'es5' },
			}),
		],
		output: [
			{
				dir: 'dist',
				format: 'cjs',
				sourcemap: true,
			},
		],
	},
	{
		input: 'lib/index.ts',
		external,
		plugins: [typescript()],
		output: [
			{
				file: 'dist/index.es.mjs',
				format: 'esm',
				sourcemap: true,
			},
		],
	},
]
