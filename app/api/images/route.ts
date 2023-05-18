if (!process.env.NEXT_PUBLIC_PREVIEW_IMAGE_LIMIT)
	throw new Error('Missing NEXT_PUBLIC_PREVIEW_IMAGE_LIMIT')

import { NextRequest, NextResponse } from 'next/server'
import { nanoid } from 'nanoid'
import { getStorage } from 'firebase-admin/storage'

import errorFromUnknown from '@/lib/error/fromUnknown'
import userFromRequest from '@/lib/user/fromRequest'
import HttpError from '@/lib/error/http'
import ErrorCode from '@/lib/error/code'
import updateUser from '@/lib/user/update'
import formatCents from '@/lib/cents/format'
import createImageCompletion from '@/lib/completion/image'
import addImageCompletion from '@/lib/image/create'
import admin from '@/lib/firebase/admin'

const CACHE_CONTROL = 'public, max-age=31536000, immutable'

const storage = getStorage(admin).bucket()

export const dynamic = 'force-dynamic'

export const POST = async (request: NextRequest) => {
	try {
		const user = await userFromRequest()
		if (!user) throw new HttpError(ErrorCode.Unauthorized, 'Unauthorized')

		const preview = !user.paymentMethod

		const hasPreviewImagesRemaining =
			user.previewImages <
			Number.parseInt(process.env.NEXT_PUBLIC_PREVIEW_IMAGE_LIMIT!)

		if (preview && !hasPreviewImagesRemaining)
			throw new HttpError(
				ErrorCode.Forbidden,
				`You have no free images remaining. Purchase GPT 4 for ${formatCents(
					100
				)} to continue.`
			)

		const prompt = (await request.text()).trim()
		if (!prompt) throw new HttpError(ErrorCode.BadRequest, 'Invalid prompt')

		if (preview)
			// Increment preview images before creating the image completion so a user can't get tons of free images by spamming the endpoint
			await updateUser(user.id, {
				incrementPreviewImages: 1
			})

		const imageUrl = await createImageCompletion(prompt)

		const id = nanoid()

		const imageResponse = await fetch(imageUrl)

		const contentType = imageResponse.headers.get('content-type')

		if (!contentType)
			throw new HttpError(ErrorCode.Internal, 'Missing image content type')

		const file = storage.file(`image-completions/${encodeURIComponent(id)}`)

		await file.save(Buffer.from(await imageResponse.arrayBuffer()), {
			gzip: true,
			contentType,
			metadata: {
				contentType,
				cacheControl: CACHE_CONTROL
			}
		})

		const promises = [
			addImageCompletion(user, {
				id,
				prompt
			})
		]

		if (!preview)
			promises.push(
				updateUser(user.id, {
					incrementImages: 1
				})
			)

		await Promise.all(promises)

		return new NextResponse(id)
	} catch (unknownError) {
		const { code, message } = errorFromUnknown(unknownError)
		return new NextResponse(message, { status: code })
	}
}
