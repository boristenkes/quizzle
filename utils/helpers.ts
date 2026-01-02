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
	const words = name.split(' ')

	if (words.length === 1) return name[0].toUpperCase()

	return words
		.slice(0, 2)
		.map(word => word[0].toUpperCase())
		.join('')
}
