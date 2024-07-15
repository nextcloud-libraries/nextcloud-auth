/**
 * SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */
declare global {
	interface Window {
		_oc_isadmin?: boolean
	}
}

export interface NextcloudUser {
	uid: string,
	displayName: string | null,
	isAdmin: boolean,
}

let currentUser: NextcloudUser | null | undefined

const getAttribute = (el: HTMLHeadElement | undefined, attribute: string): string | null => {
	if (el) {
		return el.getAttribute(attribute)
	}

	return null
}

/**
 * Get the currently logged in Nextcloud user or null if not logged in
 */
export function getCurrentUser(): NextcloudUser | null {
	if (currentUser !== undefined) {
		return currentUser
	}

	const head = document?.getElementsByTagName('head')[0]
	if (!head) {
		return null
	}

	// No user logged in so cache and return null
	const uid = getAttribute(head, 'data-user')
	if (uid === null) {
		currentUser = null
		return currentUser
	}

	currentUser = {
		uid,
		displayName: getAttribute(head, 'data-user-displayname'),
		isAdmin: !!window._oc_isadmin,
	} as NextcloudUser

	return currentUser
}
