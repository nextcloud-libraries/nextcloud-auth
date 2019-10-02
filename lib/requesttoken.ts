/// <reference types="@nextcloud/typings" />

type OC16to17 = Nextcloud.v16.OC | Nextcloud.v17.OC
declare var OC: OC16to17;

export function getRequestToken(): string {
	return OC.requestToken
}
