/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */
import { getBuilder } from '@nextcloud/browser-storage'
import { NextcloudUser } from './user'
import { emit } from '@nextcloud/event-bus'

const browserStorage = getBuilder('public').persist().build()

class GuestUser implements NextcloudUser {

	private _displayName: string | null
	readonly uid: string
	readonly isAdmin: boolean

	constructor() {
		if (!browserStorage.getItem('guestUid')) {
			browserStorage.setItem('guestUid', self.crypto.randomUUID())
		}

		this._displayName = browserStorage.getItem('guestNickname') || ''
		this.uid = browserStorage.getItem('guestUid') || self.crypto.randomUUID()
		this.isAdmin = false

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

let currentUser: GuestUser | undefined

/**
 * Get the currently Guest user or null if not logged in
 */
export function getGuestUser(): GuestUser {
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
 * @param nickname The nickname to set
 */
export function setGuestNickname(nickname: string): void {
	if (!nickname || nickname.trim().length === 0) {
		throw new Error('Nickname cannot be empty')
	}

	getGuestUser().displayName = nickname
}
