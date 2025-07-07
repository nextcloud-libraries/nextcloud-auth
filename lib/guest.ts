/*!
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import type { NextcloudUser } from './user.ts'

import { getBuilder } from '@nextcloud/browser-storage'
import { emit, subscribe } from '@nextcloud/event-bus'

const browserStorage = getBuilder('public').persist().build()

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
 * Get the currently Guest user or null if not logged in
 */
export function getGuestUser(): NextcloudUser {
	if (!currentUser) {
		currentUser = new GuestUser()
	}

	return currentUser
}

/**
 * Get the guest nickname for public pages
 */
export function getGuestNickname(): string | null {
	return getGuestUser()?.displayName || null
}

/**
 * Set the guest nickname for public pages
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
 * Generate a random UUID (version 4) if the crypto API is not available.
 * If the crypto API is available, it uses the less secure `randomUUID` method.
 * Crypto API is available in modern browsers on secure contexts (HTTPS).
 *
 * @return A random UUID.
 */
function randomUUID(): string {
	// Use the crypto API if available
	if (globalThis.crypto?.randomUUID) {
		return globalThis.crypto.randomUUID()
	}

	// Generate a random UUID (version 4)
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
		const r = Math.random() * 16 | 0
		const v = c === 'x' ? r : (r & 0x3 | 0x8)
		return v.toString(16)
	})
}
