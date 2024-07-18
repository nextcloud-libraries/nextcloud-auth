/**
 * SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */
export type { CsrfTokenObserver } from './requesttoken'
export type { NextcloudUser } from './user'

export { getRequestToken, onRequestTokenUpdate } from './requesttoken'
export { getCurrentUser } from './user'
export { getGuestNickname, setGuestNickname } from './guest'
