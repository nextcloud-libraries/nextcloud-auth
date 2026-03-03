/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

declare global {
	// eslint-disable-next-line camelcase
	var _nc_auth_requesttoken: string | undefined

	interface Window {
		_oc_isadmin?: boolean
	}
}

export {}
