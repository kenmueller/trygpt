import { NextRequest, NextResponse } from 'next/server'

import userFromRequest from '@/lib/user/fromRequest'
import HttpError from '@/lib/error/http'
import ErrorCode from '@/lib/error/code'
import errorFromUnknown from '@/lib/error/fromUnknown'
import imageCompletionFromId from '@/lib/image/fromId'
import updateImageCompletion from '@/lib/image/update'

export const dynamic = 'force-dynamic'

export const DELETE = async (
	_request: NextRequest,
	{
		params: { imageId: encodedImageId }
	}: {
		params: { imageId: string }
	}
) => {
	try {
		const imageId = decodeURIComponent(encodedImageId)

		const user = await userFromRequest()
		if (!user) throw new HttpError(ErrorCode.Unauthorized, 'Unauthorized')

		const image = await imageCompletionFromId(imageId)

		if (!image) throw new HttpError(ErrorCode.NotFound, 'Image not found')

		if (image.userId !== user.id)
			throw new HttpError(ErrorCode.Forbidden, 'You do not own this image')

		await updateImageCompletion(image.id, {
			visible: false,
			updated: 'now'
		})

		return new NextResponse('')
	} catch (unknownError) {
		const { code, message } = errorFromUnknown(unknownError)
		return new NextResponse(message, { status: code })
	}
}
