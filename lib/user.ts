/// <reference types="@nextcloud/typings" />

declare var OC: Nextcloud.v16.OC
	| Nextcloud.v17.OC
	| Nextcloud.v18.OC
	| Nextcloud.v19.OC
	| Nextcloud.v20.OC
	| Nextcloud.v21.OC
	| Nextcloud.v22.OC
	| Nextcloud.v20.OC
	| Nextcloud.v24.OC;

const getAttribute = (el: HTMLHeadElement | undefined, attribute: string): string | null => {
	if (el) {
		return el.getAttribute(attribute)
	}

	return null
}

const head = document.getElementsByTagName('head')[0]
const uid = getAttribute(head, 'data-user')
const displayName = getAttribute(head, 'data-user-displayname')

const isAdmin = (typeof OC === 'undefined')
	? false
	: OC.isUserAdmin()

export interface NextcloudUser {
	uid: string,
	displayName: string | null,
	isAdmin: boolean,
}

export function getCurrentUser(): NextcloudUser | null {
	if (uid === null) {
		return null
	}

	return {
		uid,
		displayName,
		isAdmin,
	} as NextcloudUser
}
