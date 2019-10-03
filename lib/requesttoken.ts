const tokenElement = document.getElementsByTagName('head')[0]
let token = tokenElement ? tokenElement.getAttribute('data-requesttoken') : null

interface CsrfTokenObserver {
	(token: string): void;
}

const observers: Array<CsrfTokenObserver> = []

export function getRequestToken(): string | null {
	return token
}

export function onRequestTokenUpdate(observer: CsrfTokenObserver): void {
	observers.push(observer)
}

export function setRequestToken(newToken: string) {
	token = newToken

	observers.forEach(observer => {
		try {
			observer(newToken)
		} catch (e) {
			console.error('error updating CSRF token observer', e)
		}
	})
}
