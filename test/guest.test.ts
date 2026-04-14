/*!
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { emit } from '@nextcloud/event-bus'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { getGuestUser, resetGuestUser } from '../lib/guest.ts'

// Mock browser storage
let tmpBrowserStorage: Record<string, string> = {}
const mockBrowserStorage = vi.hoisted(() => ({
	getItem: vi.fn((key) => tmpBrowserStorage[key]),
	setItem: vi.fn((key, value) => { tmpBrowserStorage[key] = value }),
	removeItem: vi.fn((key) => { delete tmpBrowserStorage[key] }),
}))

// Mock dependencies
vi.mock('@nextcloud/event-bus', { spy: true })
vi.mock('@nextcloud/browser-storage', () => ({
	getBuilder: vi.fn(() => ({
		persist: () => ({ build: () => mockBrowserStorage }),
	})),
}))

describe('Guest User Module', () => {
	beforeEach(() => {
		// Setup mocks
		vi.clearAllMocks()
		resetGuestUser()

		// Clear temporary browser storage
		tmpBrowserStorage = {}
	})

	describe('getGuestUser', () => {
		it('should create a new guest user with default values when no storage exists', async () => {
			const guestUser = getGuestUser()

			expect(guestUser.uid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
			expect(guestUser.displayName).toBe('')
			expect(guestUser.isAdmin).toBe(false)
			expect(mockBrowserStorage.getItem).toHaveBeenNthCalledWith(1, 'guestUid')
			expect(mockBrowserStorage.getItem).toHaveBeenNthCalledWith(2, 'guestNickname')
			expect(mockBrowserStorage.getItem).toHaveBeenNthCalledWith(3, 'guestUid')
			expect(mockBrowserStorage.setItem).toHaveBeenCalledWith('guestUid', guestUser.uid)
		})

		it('should return the existing guest user if already created', async () => {
			tmpBrowserStorage.guestNickname = 'Test User'
			tmpBrowserStorage.guestUid = 'existing-uid'

			const { getGuestUser } = await import('../lib/index.ts')

			const guestUser = getGuestUser()
			expect(mockBrowserStorage.getItem).toHaveBeenNthCalledWith(1, 'guestUid')
			expect(mockBrowserStorage.getItem).toHaveBeenNthCalledWith(2, 'guestNickname')
			expect(mockBrowserStorage.setItem).not.toHaveBeenCalled()
			expect(mockBrowserStorage.getItem).toHaveBeenNthCalledWith(3, 'guestUid')

			expect(guestUser.uid).toBe('existing-uid')
			expect(guestUser.displayName).toBe('Test User')
			expect(guestUser.isAdmin).toBe(false)

			const newGuestUser = getGuestUser()
			expect(newGuestUser).toBe(guestUser)
		})
	})

	describe('getGuestNickname', () => {
		it('should return null if no nickname is set', async () => {
			const { getGuestNickname } = await import('../lib/index.ts')
			const nickname = getGuestNickname()

			expect(nickname).toBeNull()
		})

		it('should return the nickname if set', async () => {
			tmpBrowserStorage.guestNickname = 'Test User'

			const { getGuestNickname } = await import('../lib/index.ts')
			const nickname = getGuestNickname()

			expect(nickname).toBe('Test User')
		})
	})

	describe('setGuestNickname', () => {
		it('should throw an error if nickname is empty', async () => {
			const { setGuestNickname } = await import('../lib/index.ts')
			expect(() => setGuestNickname('')).toThrow('Nickname cannot be empty')
			expect(() => setGuestNickname('   ')).toThrow('Nickname cannot be empty')
		})

		it('should set the nickname and store it in browser storage', async () => {
			const nickname = 'New Test User'

			const { getGuestUser, setGuestNickname } = await import('../lib/index.ts')
			setGuestNickname(nickname)
			const guestUser = getGuestUser()

			expect(guestUser.uid).toBeTruthy()
			expect(guestUser.displayName).toBe(nickname)
			expect(mockBrowserStorage.setItem).toHaveBeenCalledWith(
				'guestNickname',
				nickname,
			)

			expect(tmpBrowserStorage.guestNickname).toBe(nickname)
		})

		it('should emit a user info changed event when nickname is set', async () => {
			const nickname = 'Event Test User'

			const { setGuestNickname } = await import('../lib/index.ts')
			setGuestNickname(nickname)

			expect(emit).toHaveBeenCalledWith(
				'user:info:changed',
				expect.anything(),
			)
		})
	})

	describe('GuestUser class', () => {
		it('should update displayName when set through property', async () => {
			const { getGuestUser } = await import('../lib/index.ts')
			const guestUser = getGuestUser()
			const newName = 'Property Test User'

			guestUser.displayName = newName

			expect(guestUser.displayName).toBe(newName)
			expect(mockBrowserStorage.setItem).toHaveBeenCalledWith(
				'guestNickname',
				newName,
			)
			expect(emit).toHaveBeenCalledWith('user:info:changed', guestUser)
		})
	})
})
