/// <reference types="@nextcloud/typings" />

declare var OC: Nextcloud.v23.OC
	| Nextcloud.v24.OC
	| Nextcloud.v25.OC;

const getAttribute = (el: HTMLHeadElement | undefined, attribute: string): string | null => {
	if (el) {
		return el.getAttribute(attribute)
	}

	return null
}

let currentUser: NextcloudUser | null | undefined = undefined

export interface NextcloudUser {
	uid: string,
	displayName: string | null,
	isAdmin: boolean,
}

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
		isAdmin: (typeof OC === 'undefined') ? false : OC.isUserAdmin(),
	} as NextcloudUser

	return currentUser
}
