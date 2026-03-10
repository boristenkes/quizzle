import sanitize, { type IOptions } from 'sanitize-html'
import { env } from './env'

function isExternal(href: string): boolean {
	try {
		if (href.startsWith('mailto:')) return false

		const url = new URL(href, env.NEXT_PUBLIC_BASE_URL)
		const base = new URL(env.NEXT_PUBLIC_BASE_URL)

		return url.origin !== base.origin
	} catch {
		return false
	}
}

export const sanitizeConfig: IOptions = {
	allowedTags: [
		'b',
		'i',
		'em',
		'strong',
		'a',
		'p',
		'br',
		'ul',
		'ol',
		'li',
		'code',
		'pre',
		'blockquote',
		'img',
		'span'
	],
	allowedAttributes: {
		a: ['href', 'name', 'target', 'rel'],
		img: ['src', 'srcset', 'alt', 'title', 'width', 'height', 'loading'],
		span: ['class', 'style']
	},
	transformTags: {
		a: (tagName, attribs) => {
			const href = attribs.href

			if (!href) return { tagName, attribs }

			if (href.startsWith('mailto:')) {
				return {
					tagName,
					attribs: {
						...attribs,
						target: '_blank',
						rel: 'noopener'
					}
				}
			}

			if (isExternal(href)) {
				return {
					tagName,
					attribs: {
						...attribs,
						href: `/external?href=${encodeURIComponent(href)}`,
						target: '_blank',
						rel: 'noopener'
					}
				}
			}

			return {
				tagName,
				attribs
			}
		}
	},
	allowedSchemes: ['http', 'https', 'mailto'],
	allowedSchemesByTag: {
		img: ['http', 'https']
	}
}

export const sanitizeHTML = (html: string): string => {
	return sanitize(html, sanitizeConfig)
}
