import ImageCompletion from '@/lib/image'
import ShareButton from '@/components/Image/ShareButton'
import DownloadButton from '@/components/Image/DownloadButton'
import ImageMessage from '@/components/Image/Message'

const ImagePageImageMessage = ({ image }: { image: ImageCompletion }) => (
	<ImageMessage
		image={image}
		options={
			<>
				<ShareButton image={image} />
				<DownloadButton image={image} />
			</>
		}
	/>
)

export default ImagePageImageMessage
