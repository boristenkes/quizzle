import sanitize, { type IOptions } from 'sanitize-html'

export const sanitizeConfig = {
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
		a: ['href', 'name', 'target'],
		img: ['src', 'srcset', 'alt', 'title', 'width', 'height', 'loading'],
		span: ['class', 'style']
	},
	transformTags: {
		a: sanitize.simpleTransform('a', { target: '_blank', rel: 'noopener' })
	},
	allowedSchemes: ['http', 'https', 'mailto'],
	allowedSchemesByTag: {
		img: ['http', 'https']
	}
} satisfies IOptions

export const sanitizeHTML = (html: string): string => {
	const cleanHTML = sanitize(html, sanitizeConfig)

	return cleanHTML
}
