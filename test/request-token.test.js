/**
 * @jest-environment jsdom
 */
const { getRequestToken, onRequestTokenUpdate } = require('../dist')
const { emit } = require('@nextcloud/event-bus')

describe('request token', () => {
    beforeEach(() => {
        emit('csrf-token-update', {
            token: undefined,
        })
    })

    test('updates token via event', () => {
        expect(getRequestToken()).toBe(null)
    })

    test('find correct value', () => {
        emit('csrf-token-update', {
            token: 'token123',
        })

        expect(getRequestToken()).toBe('token123')
    })

    test('request token observer is called', () => {
        const observer = jest.fn(() => { })

        onRequestTokenUpdate(observer)
        emit('csrf-token-update', {
            token: 'token123',
        })

        expect(observer.mock.calls.length).toBe(1)
    })
})
