import { createLibConfig } from '@nextcloud/vite-config'

export default createLibConfig(
	{
		index: `${__dirname}/lib/index.ts`,
	},
	{
		libraryFormats: ['cjs', 'es'],
	},
)
