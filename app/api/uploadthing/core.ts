import { getSession } from '@/lib/auth'
import { createUploadthing, type FileRouter } from 'uploadthing/next'
import { UploadThingError } from 'uploadthing/server'

const f = createUploadthing()

export const ourFileRouter = {
	avatarUploader: f({
		image: {
			maxFileSize: '2MB',
			maxFileCount: 1
		}
	})
		.middleware(async ({ req }) => {
			const session = await getSession()

			if (!session) throw new UploadThingError('Unauthorized')

			return { userId: session.user.id }
		})
		.onUploadComplete(async ({ metadata, file }) => {
			// This code RUNS ON YOUR SERVER after upload
			console.log('Upload complete for userId:', metadata.userId)

			console.log('file url', file.ufsUrl)

			// !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
			return { uploadedBy: metadata.userId }
		})
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
