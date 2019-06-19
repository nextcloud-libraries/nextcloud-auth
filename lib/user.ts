/// <reference types="nextcloud-typings" />

type OC16to17 = Nextcloud.v16.OC | Nextcloud.v17.OC
declare var OC: OC16to17;

export interface NextcloudUser {
	uid: String,
	displayName: String | null
}

/**
 * @todo inline https://github.com/nextcloud/server/blob/master/core/src/OC/currentuser.js
 */
export function getCurrentUser(): NextcloudUser | null {
	const user = OC.getCurrentUser()

	if (user.uid === false) {
		return null
	}

	return {
		uid: user.uid,
		displayName: user.displayName,
	} as NextcloudUser
}
