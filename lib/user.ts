const uidElement = document
	.getElementsByTagName('head')[0]
const uid = uidElement ? uidElement.getAttribute('data-user') : null

const displayNameElement = document
	.getElementsByTagName('head')[0]
const displayName = displayNameElement ? displayNameElement.getAttribute('data-user-displayname') : null

export interface NextcloudUser {
	uid: String,
	displayName: String | null
}

export function getCurrentUser(): NextcloudUser | null {
	if (uid === null) {
		return null
	}

	return {
		uid,
		displayName,
	} as NextcloudUser
}
