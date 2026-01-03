import 'server-only'

import { db } from '@/db'
import { users } from '@/db/schema'
import { uploadthing } from '@/lib/uploadthing'
import { and, isNotNull, like } from 'drizzle-orm'

// Remove images from Uploadthing that no longer exist in the database
// TODO: Include Quiz images
export async function GET() {
	const { files } = await uploadthing.listFiles()

	if (files.length === 0) return

	const uploadthingKeys = files.map(f => f.key)

	const userImages = (await db.query.users.findMany({
		where: and(
			isNotNull(users.image),
			like(users.image, 'https://zyuyzp7rol.ufs.sh/f/%')
		),
		columns: { image: true }
	})) as { image: string }[]

	const usedKeys = new Set(userImages.map(u => u.image.split('/f/')[1]))

	const unusedKeys = uploadthingKeys.filter(key => !usedKeys.has(key))

	const timestamp = new Date().toISOString()
	const label = `[${timestamp}::CRON/pruneUploadthingImages]:`

	if (unusedKeys.length === 0) {
		console.info(label, 'No unused images.')
		return
	}

	const response = await uploadthing.deleteFiles(unusedKeys)

	if (response.success) {
		console.info(
			label,
			`Successfully deleted ${response.deletedCount} unused images`
		)
	} else {
		console.warn(
			label,
			`Failed to delete ${unusedKeys.length} unused images:`,
			unusedKeys
		)
	}
}
