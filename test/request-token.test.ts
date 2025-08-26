/**
 * SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { emit } from '@nextcloud/event-bus'
import { beforeEach, describe, expect, test, vi } from 'vitest'

describe('request token', () => {
	beforeEach(() => {
		vi.resetModules()
		vi.resetAllMocks()
		delete document.head.dataset.requesttoken
	})

	test('return null if no token found', async () => {
		const { getRequestToken } = await import('../lib/index.ts')
		expect(getRequestToken()).toBe(null)
	})

	test('read initial token', async () => {
		document.head.dataset.requesttoken = 'random-token'
		const { getRequestToken } = await import('../lib/index.ts')
		expect(getRequestToken()).toBe('random-token')
	})

	test('can update token by event', async () => {
		const { getRequestToken } = await import('../lib/index.ts')

		emit('csrf-token-update', {
			token: 'token123',
		})

		expect(getRequestToken()).toBe('token123')
	})

	test('request token observer is called', async () => {
		const { onRequestTokenUpdate } = await import('../lib/index.ts')
		const observer = vi.fn(() => { })

		onRequestTokenUpdate(observer)
		emit('csrf-token-update', {
			token: 'token123',
		})

		expect(observer.mock.calls.length).toBe(1)
	})

	test('handle exception in observer', async () => {
		const spy = vi.spyOn(window.console, 'error')
		const { onRequestTokenUpdate } = await import('../lib/index.ts')
		const observer = vi.fn(() => {
			throw new Error('!Error!')
		})
		// silence the console
		spy.mockImplementationOnce(() => {})

		onRequestTokenUpdate(observer)
		emit('csrf-token-update', {
			token: 'token123',
		})

		expect(observer.mock.calls.length).toBe(1)
		expect(spy).toHaveBeenCalledOnce()
	})
})
