/**
 * SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { fetchRequestToken, getRequestToken, setRequestToken } from '../lib/requestToken.ts'

const eventbus = vi.hoisted(() => ({ emit: vi.fn(), subscribe: vi.fn() }))
vi.mock('@nextcloud/event-bus', () => eventbus)

const server = setupServer()

describe('getRequestToken', () => {
	it('can read the token from DOM', () => {
		mockToken('tokenmock-123', undefined)
		expect(getRequestToken()).toBe('tokenmock-123')
	})

	it('can handle missing token', () => {
		mockToken(undefined)
		expect(getRequestToken()).toBeNull()
	})

	it('can handle cache token', () => {
		mockToken('cached-token')
		expect(getRequestToken()).toBe('cached-token')
	})

	it('prioritizes cached token', () => {
		mockToken('dom-token', 'cached-token')
		expect(getRequestToken()).toBe('cached-token')
	})
})

describe('setRequestToken', () => {
	beforeEach(() => {
		vi.resetAllMocks()
	})

	it('does emit an event on change', () => {
		setRequestToken('new-token')
		expect(eventbus.emit).toBeCalledTimes(1)
		expect(eventbus.emit).toBeCalledWith('csrf-token-update', expect.objectContaining({ token: 'new-token' }))
	})

	it('does set the new token to the DOM', () => {
		setRequestToken('new-token')
		expect(document.head.dataset.requesttoken).toBe('new-token')
	})

	it('does remember the new token', () => {
		mockToken('old-token')
		setRequestToken('new-token')
		expect(getRequestToken()).toBe('new-token')
	})

	it('throws if the token is not a string', () => {
		// @ts-expect-error it invalid values
		expect(() => setRequestToken(123)).toThrowError('Invalid CSRF token given')
	})

	it('throws if the token is not valid', () => {
		expect(() => setRequestToken('')).toThrowError('Invalid CSRF token given')
	})

	it('does not emit an event if the token is not valid', () => {
		expect(() => setRequestToken('')).toThrowError('Invalid CSRF token given')
		expect(eventbus.emit).not.toBeCalled()
	})
})

describe('fetchRequestToken', () => {
	const successfullCsrf = http.get('/index.php/csrftoken', () => {
		return HttpResponse.json({ token: 'new-token' })
	})
	const forbiddenCsrf = http.get('/index.php/csrftoken', () => {
		return HttpResponse.json([], { status: 403 })
	})
	const serverErrorCsrf = http.get('/index.php/csrftoken', () => {
		return HttpResponse.json([], { status: 500 })
	})
	const networkErrorCsrf = http.get('/index.php/csrftoken', () => {
		return new HttpResponse(null, { type: 'error' })
	})

	beforeAll(() => {
		server.listen()
		;(window as unknown as Record<string, unknown>)._oc_webroot = ''
	})

	beforeEach(() => {
		vi.resetAllMocks()
		mockToken('oldToken')
	})

	it('correctly parses response', async () => {
		server.use(successfullCsrf)

		const token = await fetchRequestToken()
		expect(token).toBe('new-token')
	})

	it('sets the token', async () => {
		server.use(successfullCsrf)

		await fetchRequestToken()
		expect(getRequestToken()).toBe('new-token')
	})

	it('does emit an event', async () => {
		server.use(successfullCsrf)

		await fetchRequestToken()
		expect(eventbus.emit).toHaveBeenCalledOnce()
		expect(eventbus.emit).toBeCalledWith('csrf-token-update', expect.objectContaining({ token: 'new-token' }))
	})

	it('handles 403 error due to invalid cookies', async () => {
		server.use(forbiddenCsrf)

		mockToken('oldToken')
		await expect(() => fetchRequestToken()).rejects.toThrowError('Could not fetch CSRF token from API')
		expect(getRequestToken()).toBe('oldToken')
	})

	it('handles server error', async () => {
		server.use(serverErrorCsrf)

		mockToken('oldToken')
		await expect(() => fetchRequestToken()).rejects.toThrowError('Could not fetch CSRF token from API')
		expect(getRequestToken()).toBe('oldToken')
	})

	it('handles network error', async () => {
		server.use(networkErrorCsrf)

		mockToken('oldToken')
		await expect(() => fetchRequestToken()).rejects.toThrow()
		expect(getRequestToken()).toBe('oldToken')
	})
})

/**
 * Mock the request token directly so we can it reading it.
 *
 * @param token - The CSRF token to mock
 * @param internalToken - The internal (cached version of the DOM token) token to mock, if null the `token` will be used as internal token
 */
function mockToken(token?: string, internalToken: string | undefined | null = null) {
	if (token === undefined) {
		delete document.head.dataset.requesttoken
	} else {
		document.head.dataset.requesttoken = token
	}

	if (internalToken === null) {
		globalThis._nc_auth_requestToken = token
	} else {
		globalThis._nc_auth_requestToken = internalToken
	}
}
