/**
 * SPDX-FileCopyrightText: 2024 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */
import { getBuilder } from '@nextcloud/browser-storage'

const browserStorage = getBuilder('public').persist().build()

/**
 * Get the guest nickname for public pages
 */
export function getGuestNickname(): string | null {
	return browserStorage.getItem('guestNickname')
}

/**
 * Set the guest nickname for public pages
 * @param nickname The nickname to set
 */
export function setGuestNickname(nickname: string): void {
	browserStorage.setItem('guestNickname', nickname)
}
