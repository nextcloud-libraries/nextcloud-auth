/**
 * SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */
import { subscribe } from '@nextcloud/event-bus'

export interface CsrfTokenObserver {
	(token: string): void;
}

let token: string | null | undefined
const observers: CsrfTokenObserver[] = []

/**
 * Get current request token
 *
 * @return {string|null} Current request token or null if not set
 */
export function getRequestToken(): string | null {
	if (token === undefined) {
		// Only on first load, try to get token from document
		token = document.head.dataset.requesttoken ?? null
	}
	return token
}

/**
 * Add an observer which is called when the CSRF token changes
 *
 * @param observer The observer
 */
export function onRequestTokenUpdate(observer: CsrfTokenObserver): void {
	observers.push(observer)
}

// Listen to server event and keep token in sync
subscribe('csrf-token-update', (e: unknown) => {
	token = (e as { token: string }).token

	observers.forEach((observer) => {
		try {
			observer(token!)
		} catch (e) {
			console.error('Error updating CSRF token observer', e)
		}
	})
})
