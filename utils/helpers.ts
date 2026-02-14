import { env } from '@/lib/env'
import { clsx, type ClassValue } from 'clsx'
import slugifyOriginal from 'slugify'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export const delay = (ms: number) =>
	new Promise(resolve => setTimeout(resolve, ms))

export const { isArray } = Array

export const slugify = (str: string) => {
	return slugifyOriginal(str, {
		lower: true,
		strict: true
	})
}

export const absoluteUrl = (path: string) =>
	new URL(path, env.NEXT_PUBLIC_BASE_URL).href

export function isEmpty(value: unknown): value is [] | Record<string, never> {
	if (!value || typeof value !== 'object') return true

	const { length } = isArray(value) ? value : Object.keys(value)

	return length === 0
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

export function pickColumns<T>(...columns: (keyof T)[]): Record<keyof T, true> {
	const result = columns.reduce((prev, curr) => {
		return { ...prev, [curr]: true }
	}, {})

	return result as Record<keyof T, true>
}

export function omitColumns<T>(
	...columns: (keyof T)[]
): Record<keyof T, false> {
	const result = columns.reduce((prev, curr) => {
		return { ...prev, [curr]: false }
	}, {})

	return result as Record<keyof T, false>
}

export function scrollToElement(elementId: string) {
	if (typeof window === 'undefined' || !elementId) return

	const a = document.createElement('a')
	a.href = '#' + elementId
	a.click()
	a.remove()
}

declare global {
	interface Array<T> {
		count(callback: (value: T, index: number, array: T[]) => boolean): number
	}
}

if (!Array.prototype.count) {
	Array.prototype.count = function (callback) {
		let count = 0

		for (let i = 0; i < this.length; i++) {
			if (callback(this[i], i, this)) {
				count++
			}
		}

		return count
	}
}
