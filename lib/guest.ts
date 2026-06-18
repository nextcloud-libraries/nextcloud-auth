/*!
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import type { NextcloudUser } from './user.ts'

import { getBuilder } from '@nextcloud/browser-storage'
import { emit, subscribe } from '@nextcloud/event-bus'

const browserStorage = getBuilder('public').persist().build()

/**
 * Client-side guest user implementation for public pages.
 *
 * Persists a generated guest UID and nickname in browser storage and
 * emits updates when the guest display name changes.
 */
class GuestUser implements NextcloudUser {
	private _displayName: string | null
	readonly uid: string
	readonly isAdmin: boolean

	constructor() {
		if (!browserStorage.getItem('guestUid')) {
			browserStorage.setItem('guestUid', randomUUID())
		}

		this._displayName = browserStorage.getItem('guestNickname') || ''
		this.uid = browserStorage.getItem('guestUid') || randomUUID()
		this.isAdmin = false

		subscribe('user:info:changed', (guest) => {
			this._displayName = guest.displayName
			browserStorage.setItem('guestNickname', guest.displayName || '')
		})
	}

	get displayName(): string | null {
		return this._displayName
	}

	set displayName(displayName: string) {
		this._displayName = displayName
		browserStorage.setItem('guestNickname', displayName)
		emit('user:info:changed', this)
	}
}

let currentUser: NextcloudUser | undefined

/**
 * Get the current guest user for public pages.
 */
export function getGuestUser(): NextcloudUser {
	if (!currentUser) {
		currentUser = new GuestUser()
	}

	return currentUser
}

/**
 * Get the guest nickname for public pages.
 */
export function getGuestNickname(): string | null {
	return getGuestUser().displayName || null
}

/**
 * Set the guest nickname for public pages.
 *
 * @param nickname - The nickname to set
 */
export function setGuestNickname(nickname: string): void {
	if (!nickname || nickname.trim().length === 0) {
		throw new Error('Nickname cannot be empty')
	}

	getGuestUser().displayName = nickname
}

/**
 * Reset the guest user state.
 *
 * @internal
 */
export function resetGuestUser(): void {
	currentUser = undefined
	browserStorage.removeItem('guestUid')
	browserStorage.removeItem('guestNickname')
}

/**
 * Generate a UUID v4 for identifying a guest user.
 *
 * Uses `crypto.randomUUID()` when available, falls back to
 * `crypto.getRandomValues()`, and finally to a non-cryptographic
 * `Math.random()` implementation when needed.
 *
 * @returns A UUID string.
 */
function randomUUID(): string {
	// Use the native crypto API when available.
	if (globalThis.crypto?.randomUUID) {
		return globalThis.crypto.randomUUID()
	}

	// Fall back to generating a UUID v4 from random bytes.
	if (globalThis.crypto?.getRandomValues) {
		const bytes = new Uint8Array(16)
		globalThis.crypto.getRandomValues(bytes)

		// Set the UUID version (4) and variant bits.
		bytes[6] = (bytes[6] & 0x0f) | 0x40
		bytes[8] = (bytes[8] & 0x3f) | 0x80

		const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0'))

		return [
			hex.slice(0, 4).join(''),
			hex.slice(4, 6).join(''),
			hex.slice(6, 8).join(''),
			hex.slice(8, 10).join(''),
			hex.slice(10, 16).join(''),
		].join('-')
	}

	// Final fallback for environments without the crypto API.
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
		const r = Math.random() * 16 | 0
		const v = c === 'x' ? r : (r & 0x3 | 0x8)
		return v.toString(16)
	})
}
