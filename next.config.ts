import type { NextConfig } from 'next'
import './lib/env'

const nextConfig: NextConfig = {
	/* config options here */
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'zyuyzp7rol.ufs.sh',
				pathname: '/f/*'
			}
		]
	}
}

export default nextConfig
