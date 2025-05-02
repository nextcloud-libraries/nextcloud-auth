/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */
import type { ComponentProps } from 'vue-component-type-helpers'
import { defineAsyncComponent } from 'vue'
import { getBuilder } from '@nextcloud/browser-storage'
import { spawnDialog } from '@nextcloud/vue'
import { TypedEventTarget } from 'typescript-event-target'

import PublicAuthPrompt from './components/PublicAuthPrompt.vue'

const browserStorage = getBuilder('public').persist().build()

/**
 * This event is emitted when the list of registered views is changed
 */
interface UpdateGuestDisplayName extends CustomEvent<never> {
	type: 'updateDisplayName'
}

class GuestUser extends TypedEventTarget<{ updateDisplayName: UpdateGuestDisplayName }> {

	displayName: string | null
	readonly uid: string
	readonly isAdmin: boolean

	constructor() {
		super()
		this.displayName = browserStorage.getItem('guestNickname') || ''
		this.uid = browserStorage.getItem('guestUid') || self.crypto.randomUUID()
		this.isAdmin = false
	}

	setDisplayName(displayName: string): void {
		this.displayName = displayName
		browserStorage.setItem('guestNickname', displayName)
		this.dispatchTypedEvent('updateDisplayName', new CustomEvent('updateDisplayName') as UpdateGuestDisplayName)
	}

}

let currentUser: GuestUser | null | undefined

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

	getGuestUser().setDisplayName(nickname)
}

type PublicAuthPromptProps = ComponentProps<typeof PublicAuthPrompt>

/**
 * Show the public auth prompt dialog
 * This is used to ask the current user their nickname
 * as well as show some additional contextual information
 * @param props The props to pass to the dialog, see PublicAuthPrompt.vue for details
 */
export function showGuestUserPrompt(props: PublicAuthPromptProps): void {
	spawnDialog(
		defineAsyncComponent(() => import('./components/PublicAuthPrompt.vue')),
		props,
	)
}
