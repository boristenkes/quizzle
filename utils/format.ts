import { Difficulty } from '@/lib/constants'

export const intFormatter = new Intl.NumberFormat('en-US', {
	style: 'decimal'
})

export const timeFormatter = new Intl.DateTimeFormat('en-US', {
	month: 'long',
	day: 'numeric',
	year: 'numeric',
	hour: '2-digit',
	minute: '2-digit'
})

export const dateFormatter = new Intl.DateTimeFormat('en-US', {
	month: 'long',
	day: '2-digit',
	year: 'numeric'
})

export function millisToMMSS(millis: number): string {
	const totalSeconds = Math.floor(millis / 1000)
	const minutes = Math.floor(totalSeconds / 60)
	const seconds = totalSeconds % 60

	const formattedMin = minutes.toString().padStart(2, '0')
	const formattedSec = seconds.toString().padStart(2, '0')

	return `${formattedMin}:${formattedSec}`
}

export const getDifficultyColor = (difficulty: Difficulty) => {
	switch (difficulty.toLowerCase()) {
		case 'easy':
			return 'bg-green-100 text-green-800 border-green-200'
		case 'medium':
			return 'bg-yellow-100 text-yellow-800 border-yellow-200'
		case 'hard':
			return 'bg-red-100 text-red-800 border-red-200'
		default:
			return 'bg-gray-100 text-gray-800 border-gray-200'
	}
}

export function formatFileSize(sizeBytes: number) {
	if (sizeBytes === 0) return '0 Bytes'

	const units = ['Bytes', 'KB', 'MB', 'GB', 'TB']
	const i = Math.floor(Math.log(sizeBytes) / Math.log(1024))
	const formattedSize = parseFloat((sizeBytes / Math.pow(1024, i)).toFixed(2))

	return `${formattedSize} ${units[i]}`
}
