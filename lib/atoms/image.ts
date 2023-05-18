import { atom } from 'recoil'

import ImageCompletion from '@/lib/image'

const imageState = atom<ImageCompletion | null>({
	key: 'image',
	default: null
})

export default imageState
