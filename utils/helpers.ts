import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export const delay = (ms: number) =>
	new Promise(resolve => setTimeout(resolve, ms))

export const { isArray } = Array

export function isEmpty(value: unknown): value is [] | Record<string, never> {
	if (!value || typeof value !== 'object') return true

	const { length } = isArray(value) ? value : Object.keys(value)

	return length === 0
}

export const getInitials = (name: string) => {
	if (!name.length) return ''

	const words = name.split(' ')

	if (words.length === 1) return name[0].toUpperCase()

	return words
		.slice(0, 2)
		.map(word => word[0].toUpperCase())
		.join('')
}

export function getDirtyValues<T>(
	data: T,
	dirtyFields: Partial<Record<keyof T, boolean | undefined>>
): Partial<T> {
	return Object.keys(dirtyFields).reduce(
		(acc, key) => ({
			...acc,
			[key]: data[key as keyof T]
		}),
		{}
	)
}

export function getUploadthingKey(url: string | undefined | null) {
	// Uploadthing image example:
	// https://zyuyzp7rol.ufs.sh/f/aYByzrDTozqSNzce1pk0ZiK6xbCIa3UpuHyF5eTrf2ghEOlAhttps

	if (!url?.startsWith('https://zyuyzp7rol.ufs.sh')) return null

	const key = url.split('/f/').at(1) as string

	return key
}

declare global {
	interface Array<T> {
		count(callback: (value: T, index: number, array: T[]) => boolean): number
	}
}

if (!Array.prototype.count) {
	Array.prototype.count = function (callback) {
		const count = this.filter(callback).length

		return count
	}
}
