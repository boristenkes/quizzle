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

declare global {
	interface String {
		capitalize(): string
	}
}

String.prototype.capitalize = function () {
	const words = this.split(' ')
	const capitalizedWords = words.map(
		word => word[0].toUpperCase() + word.slice(1).toLowerCase()
	)

	return capitalizedWords.join(' ')
}
