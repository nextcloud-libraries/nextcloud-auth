/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */
import { randomBytes } from 'crypto'
import { beforeEach, describe, expect, test, vi } from 'vitest'

/**
 * Mock `<meta>` element with nonce
 */
function mockNonce() {
	const nonce = randomBytes(16).toString('base64')
	const el = document.createElement('meta')
	el.name = 'csp-nonce'
	el.nonce = nonce
	document.head.appendChild(el)
	return nonce
}

describe('CSP nonce', () => {
	beforeEach(() => {
		vi.resetModules()
		// reset document
		document.head.innerHTML = ''
		delete document.head.dataset.requesttoken
	})

	test('read nonce from meta element', async () => {
		const { getCSPNonce } = await import('../lib/index.ts')
		const nonce = mockNonce()
		expect(getCSPNonce()).toBe(nonce)
	})

	test('prefer nonce over csrf token', async () => {
		const { getCSPNonce } = await import('../lib/index.ts')

		const nonce = mockNonce()
		document.head.dataset.requesttoken = 'csrf-token'
		expect(getCSPNonce()).toBe(nonce)
	})

	test('fall back to csrf token for legacy Nextcloud versions', async () => {
		const { getCSPNonce } = await import('../lib/index.ts')

		document.head.dataset.requesttoken = 'csrf-token'
		expect(getCSPNonce()).toBe(btoa('csrf-token'))
	})

	test('return undefined if neither csp nonce nor csrf token is set', async () => {
		const { getCSPNonce } = await import('../lib/index.ts')

		expect(getCSPNonce()).toBe(undefined)
	})
})
