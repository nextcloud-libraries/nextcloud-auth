/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import type { UserConfig } from 'vite'

import viteConfig from './vite.config'

export default async (env) => {
	const config = typeof viteConfig === 'function' ? await viteConfig(env) : viteConfig

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
