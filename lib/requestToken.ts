/**
 * SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { emit, subscribe } from '@nextcloud/event-bus'
import { generateUrl } from '@nextcloud/router'

export interface CsrfTokenObserver {
	(token: string): void
}

_subscribeToTokenUpdates() // TODO: remove once we drop support for Nextcloud 33.0.1 and before

/**
 * Get current request token
 *
 * @return Current request token or null if not set
 */
export function getRequestToken(): string | null {
	if (globalThis._nc_auth_requestToken) {
		return globalThis._nc_auth_requestToken
	}

	if (globalThis.document) {
		// for service workers or other contexts without DOM we need to safeguard this
		return document.head.dataset.requesttoken ?? null
	}
	return null
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

	if (globalThis._nc_auth_requestToken === token) {
		// token is the same as before, no need to update and especially no need to notify the observers
		return
	}

	globalThis._nc_auth_requestToken = token
	if (globalThis.document) {
		// For DOM environments we also set the token to the DOM, so it is available for legacy code
		document.head.dataset.requesttoken = token
	}

	emit('csrf-token-update', { token, _internal: true })
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

/**
 * Add an observer which is called when the CSRF token changes
 *
 * @param observer The observer
 */
export function onRequestTokenUpdate(observer: CsrfTokenObserver): void {
	subscribe('csrf-token-update', async ({ token }) => {
		try {
			observer(token)
		} catch (error) {
			// we cannot use the logger as the logger uses this library = circular dependency
			// eslint-disable-next-line no-console
			console.error('Error updating CSRF token observer', error)
		}
	})
}

/**
 * Subscribe to token update events from server.
 *
 * @todo - This is legacy and not needed once all supported server versions use `setRequestToken` of this library.
 */
function _subscribeToTokenUpdates(): void {
	// Listen to server event and keep token in sync
	subscribe('csrf-token-update', ({ token, _internal }) => {
		if (!_internal) {
			// Only update the token if the event is not emitted from this library, otherwise we would end in a loop
			setRequestToken(token)
		}
	})
}
