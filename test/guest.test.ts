/**
 * SPDX-FileCopyrightText: 2025 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { getBuilder } from '@nextcloud/browser-storage'
import { emit } from '@nextcloud/event-bus'

// Mock dependencies
vi.mock('@nextcloud/browser-storage')
vi.mock('@nextcloud/event-bus')

let tmpBrowserStorage = {}

// Mock browser storage
const mockBrowserStorage = {
	getItem: vi.fn((key) => tmpBrowserStorage[key]),
	setItem: vi.fn((key, value) => { tmpBrowserStorage[key] = value }),
	removeItem: vi.fn((key) => { delete tmpBrowserStorage[key] }),
}

// Mock crypto for UUID generation
const originalCrypto = global.crypto
const mockCrypto = {
	randomUUID: vi.fn(() => 'mock-uuid-' + Math.random().toString(36).slice(2, 10)),
}

describe('Guest User Module', () => {
	beforeEach(() => {
		// Setup mocks
		vi.clearAllMocks()
		vi.resetModules()

		// Clear temporary browser storage
		tmpBrowserStorage = {}

		// Mock getBuilder to return our mockBrowserStorage
		vi.mocked(getBuilder).mockReturnValue({
			persist: () => ({
				// @ts-expect-error Mocking builder
				build: () => mockBrowserStorage,
			}),
		})

		// Replace global crypto with mock
		Object.defineProperty(global, 'crypto', {
			value: mockCrypto,
			writable: true,
		})
	})

	afterEach(() => {
		// Restore original crypto
		Object.defineProperty(global, 'crypto', {
			value: originalCrypto,
			writable: true,
		})
	})

	describe('getGuestUser', () => {
		it('should create a new guest user with default values when no storage exists', async () => {
			const { getGuestUser } = await import('../lib')
			const guestUser = getGuestUser()

			const uid = guestUser.uid

			expect(guestUser.uid).toBeTruthy()
			expect(guestUser.displayName).toBe('')
			expect(guestUser.isAdmin).toBe(false)
			expect(mockBrowserStorage.getItem).toHaveBeenNthCalledWith(1, 'guestUid')
			expect(mockBrowserStorage.getItem).toHaveBeenNthCalledWith(2, 'guestNickname')
			expect(mockBrowserStorage.setItem).toHaveBeenCalledWith('guestUid', uid)

			expect(mockBrowserStorage.getItem).toHaveBeenNthCalledWith(3, 'guestUid')

			expect(guestUser.uid).toBe(uid)
			expect(guestUser.displayName).toBe('')
			expect(guestUser.isAdmin).toBe(false)

			expect(mockCrypto.randomUUID).toHaveBeenCalledOnce()
		})

		it('should return the existing guest user if already created', async () => {
			tmpBrowserStorage.guestNickname = 'Test User'
			tmpBrowserStorage.guestUid = 'existing-uid'

			const { getGuestUser } = await import('../lib')

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
			const { getGuestNickname } = await import('../lib')
			const nickname = getGuestNickname()

			expect(nickname).toBeNull()
		})

		it('should return the nickname if set', async () => {
			tmpBrowserStorage.guestNickname = 'Test User'

			const { getGuestNickname } = await import('../lib')
			const nickname = getGuestNickname()

			expect(nickname).toBe('Test User')
		})
	})

	describe('setGuestNickname', () => {
		it('should throw an error if nickname is empty', async () => {
			const { setGuestNickname } = await import('../lib')
			expect(() => setGuestNickname('')).toThrow(
				'Nickname cannot be empty',
			)
			expect(() => setGuestNickname('   ')).toThrow(
				'Nickname cannot be empty',
			)
		})

		it('should set the nickname and store it in browser storage', async () => {
			const nickname = 'New Test User'

			const { getGuestUser, setGuestNickname } = await import('../lib')
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

			const { setGuestNickname } = await import('../lib')
			setGuestNickname(nickname)

			expect(emit).toHaveBeenCalledWith(
				'user:info:changed',
				expect.anything(),
			)
		})
	})

	describe('GuestUser class', () => {
		it('should update displayName when set through property', async () => {

			const { getGuestUser } = await import('../lib')
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
