/*!
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { playwright } from '@vitest/browser-playwright'
import { msw } from 'msw/vite'
import { defineConfig } from 'vitest/config'

export default defineConfig({
	// Vitest 5 no longer serves mockServiceWorker.js for setupWorker()
	plugins: [msw({ mode: 'worker-only' })],
	test: {
		browser: {
			enabled: true,
			headless: true,
			provider: playwright(),
			instances: [
				{ browser: 'chromium' },
			],
		},
		coverage: {
			reporter: ['text', 'lcov'],
		},
	},
})
