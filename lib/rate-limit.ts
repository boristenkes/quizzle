const requests = new Map<string, number[]>()

const WINDOW_MS = 60_000
const MAX_REQUESTS = 10

// Remove expired records and inactive keys every 5 minutes.
const CLEANUP_INTERVAL_MS = 5 * 60_000

let lastCleanup = Date.now()

export function rateLimit(
	key: string,
	{ windowMs = WINDOW_MS, maxRequests = MAX_REQUESTS } = {}
): boolean {
	const now = Date.now()

	// Clean up inactive keys periodically.
	if (now - lastCleanup >= CLEANUP_INTERVAL_MS) {
		for (const [storedKey, timestamps] of requests) {
			const active = timestamps.filter(timestamp => now - timestamp < WINDOW_MS)

			if (active.length === 0) {
				requests.delete(storedKey)
			} else {
				requests.set(storedKey, active)
			}
		}

		lastCleanup = now
	}

	const timestamps = (requests.get(key) ?? []).filter(
		timestamp => now - timestamp < WINDOW_MS
	)

	if (timestamps.length >= MAX_REQUESTS) {
		requests.set(key, timestamps)
		return false
	}

	timestamps.push(now)
	requests.set(key, timestamps)

	return true
}
