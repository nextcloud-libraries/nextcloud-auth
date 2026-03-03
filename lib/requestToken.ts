/**
 * SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { emit, subscribe } from '@nextcloud/event-bus'
import { generateUrl } from '@nextcloud/router'

export interface CsrfTokenObserver {
	(token: string): void
}

/**
 * Get current request token
 *
 * @return Current request token or null if not set
 */
export function getRequestToken(): string | null {
	if (globalThis.document) {
		return document.head.dataset.requesttoken ?? null
	}
	// for service workers or other contexts without DOM, we keep the token in memory
	return globalThis._nc_auth_requestToken ?? null
}

/**
 * Set a new CSRF token (e.g. because of session refresh).
 * This also emits an event bus event for the updated token.
 *
 * @param token - The new token
 * @fires Error - If the passed token is not a potential valid token
 */
export function setRequestToken(token: string): void {
	if (!token || typeof token !== 'string') {
		throw new Error('Invalid CSRF token given', { cause: { token } })
	}

	if (globalThis.document) {
		document.head.dataset.requesttoken = token
	} else {
		globalThis._nc_auth_requestToken = token
	}
	emit('csrf-token-update', { token })
}

/**
 * Fetch the request token from the API.
 * This does also set it on the current context, see `setRequestToken`.
 *
 * @fires Error - If the request failed
 */
export async function fetchRequestToken(): Promise<string> {
	const url = generateUrl('/csrftoken')

	const response = await fetch(url)
	if (!response.ok) {
		throw new Error('Could not fetch CSRF token from API', { cause: response })
	}

	const { token } = await response.json()
	setRequestToken(token)
	return token
}

const _observers: CsrfTokenObserver[] = []
/**
 * Add an observer which is called when the CSRF token changes
 *
 * @param observer The observer
 */
export function onRequestTokenUpdate(observer: CsrfTokenObserver): void {
	_subscribeToTokenUpdates()
	_observers.push(observer)
}

let _initialized = false
/**
 * Subscribe to token update events from server.
 *
 * This is legacy and not needed once all supported server versions use `setRequestToken` of this library.
 */
function _subscribeToTokenUpdates(): void {
	if (_initialized) {
		return
	}

	_initialized = true
	// Listen to server event and keep token in sync
	subscribe('csrf-token-update', (event) => {
		setRequestToken(event.token)
		for (const observer of _observers) {
			try {
				observer(event.token)
			} catch (error) {
				// we cannot use the logger as the logger uses this library = circular dependency
				// eslint-disable-next-line no-console
				console.error('Error updating CSRF token observer', error)
			}
		}
	})
}
