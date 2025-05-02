/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */
import type { UserConfig } from 'vite'
import viteConfig from './vite.config'
// eslint-disable-next-line n/no-extraneous-import
import replace from '@rollup/plugin-replace'

export default async (env) => {
	const config = typeof viteConfig === 'function' ? await viteConfig(env) : viteConfig
	// node-externals conflicts with vitest
	config.plugins = config.plugins!.filter((plugin) => plugin && (!('name' in plugin) || plugin?.name !== 'node-externals'))

	config.plugins!.push(replace({
		values: {
			appName: JSON.stringify('auth'),
		},
	}))

	return {
		...config,
		test: {
			environment: 'happy-dom',
			coverage: {
				reporter: ['text', 'lcov'],
			},
			deps: {
				inline: ['@nextcloud/vue'],
			},
		},
	} as UserConfig
}
