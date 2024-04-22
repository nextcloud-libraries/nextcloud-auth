import type { UserConfig } from 'vite'
import viteConfig from './vite.config'

export default async (env) => {
	const config = typeof viteConfig === 'function' ? await viteConfig(env) : viteConfig
	// node-externals conflicts with vitest
	config.plugins = config.plugins!.filter((plugin) => plugin && (!('name' in plugin) || plugin?.name !== 'node-externals'))

	return {
		...config,
		test: {
			environment: 'happy-dom',
			coverage: {
				reporter: ['text', 'lcov'],
			},
		},
	} as UserConfig
}
