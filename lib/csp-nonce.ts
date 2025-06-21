/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { getRequestToken } from './requesttoken.ts'

/**
 * Get the CSP nonce for script loading
 *
 * @return Current nonce if set
 * @example When using webpack this can be used to allow webpack to dynamically load additional modules:
 * ```js
 * import { getCSPNonce } from '@nextcloud/auth'
 *
 * __webpack_nonce__ = getCSPNonce()
 * ```
 */
export function getCSPNonce(): string | undefined {
	const meta = document?.querySelector<HTMLMetaElement>('meta[name="csp-nonce"]')
	// backwards compatibility with older Nextcloud versions
	if (!meta) {
		const token = getRequestToken()
		return token ? btoa(token) : undefined
	}
	return meta.nonce
}
