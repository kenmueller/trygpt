import { atom } from 'recoil'

import ImageCompletion from '@/lib/image'

const imagesState = atom<ImageCompletion[] | null>({
	key: 'images',
	default: null
})

export default imagesState
