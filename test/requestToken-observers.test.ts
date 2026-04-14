/**
 * SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { emit } from '@nextcloud/event-bus'
import { beforeEach, describe, expect, it, test, vi } from 'vitest'

test('it does set the new token form legacy event', async () => {
	const { getRequestToken } = await import('../lib/requestToken.ts')
	mockToken('old-token')

	// older server versions emitted the event directly without using this libary
	emit('csrf-token-update', { token: 'new-token' })
	expect(getRequestToken()).toBe('new-token')
})

describe('request token observers', () => {
	beforeEach(() => {
		vi.resetModules()
		vi.resetAllMocks()
		mockToken(undefined)
	})

	it('request token observer is called', async () => {
		const { onRequestTokenUpdate, setRequestToken } = await import('../lib/requestToken.ts')
		const observer = vi.fn(() => { })

		onRequestTokenUpdate(observer)
		expect(observer).not.toHaveBeenCalled()

		setRequestToken('token123')
		expect(observer).toHaveBeenCalledTimes(1)
		expect(observer).toHaveBeenCalledWith('token123')
	})

	it('request token observer can be unsubscribed', async () => {
		const { onRequestTokenUpdate, setRequestToken } = await import('../lib/requestToken.ts')
		const observer = vi.fn(() => { })

		const unsubscribe = onRequestTokenUpdate(observer)
		expect(observer).not.toHaveBeenCalled()

		setRequestToken('token123')
		expect(observer).toHaveBeenCalledTimes(1)
		expect(observer).toHaveBeenCalledWith('token123')

		unsubscribe()
		setRequestToken('token456')
		expect(observer).toHaveBeenCalledTimes(1) // Should not be called again
	})

	it('handle exception in observer', async () => {
		const { onRequestTokenUpdate, setRequestToken } = await import('../lib/requestToken.ts')
		const spy = vi.spyOn(window.console, 'error')
		const observer = vi.fn(() => {
			throw new Error('!Error!')
		})
		// silence the console
		spy.mockImplementationOnce(() => {})

		onRequestTokenUpdate(observer)
		setRequestToken('token123')

		expect(observer).toHaveBeenCalledTimes(1)
		expect(spy).toHaveBeenCalledOnce()
	})
})

/**
 * Mock the request token directly so we can it reading it.
 *
 * @param token - The CSRF token to mock
 */
function mockToken(token?: string) {
	if (token === undefined) {
		delete document.head.dataset.requesttoken
		delete globalThis._nc_auth_requestToken
	} else {
		document.head.dataset.requesttoken = token
		globalThis._nc_auth_requestToken = token
	}
}
