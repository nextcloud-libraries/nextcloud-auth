/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import type { NextcloudUser } from './user.ts'

declare module '@nextcloud/event-bus' {
	export interface NextcloudEvents {
		'csrf-token-update': { token: string, _internal?: true }
		// mapping of 'event name' => 'event type'
		'user:info:changed': NextcloudUser
	}
}
