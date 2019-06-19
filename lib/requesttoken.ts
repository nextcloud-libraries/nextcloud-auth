/// <reference types="nextcloud-typings" />

type OC16to17 = Nextcloud.v16.OC | Nextcloud.v17.OC
declare var OC: OC16to17;

/**
 * @returns {Promise<String>} Promise that resolves to the request token
 */
export function getRequestToken(): Promise<string> {
	return Promise.resolve(OC.requestToken)
}
