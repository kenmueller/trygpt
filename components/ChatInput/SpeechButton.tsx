'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMicrophone } from '@fortawesome/free-solid-svg-icons'
import { toast } from 'react-toastify'
import cx from 'classnames'

import Artyom, { startArtyom, stopArtyom } from '@/lib/artyom'
import alertError from '@/lib/error/alert'
import errorFromUnknown from '@/lib/error/fromUnknown'

const ChatInputShareButton = ({
	isTyping,
	disabled,
	submit
}: {
	isTyping: boolean
	disabled: boolean
	submit: (prompt: string) => void
}) => {
	const isTypingRef = useRef(isTyping)
	const submitRef = useRef(submit)

	const [isLoading, setIsLoading] = useState(false)
	const [isStarted, setIsStarted] = useState(false)

	const artyom = useMemo(() => {
		if (typeof window === 'undefined') return null

		const artyom = new Artyom()

		artyom.addCommands([
			{
				smart: true,
				indexes: ['tell chat *', 'tell chad *'],
				action: (_index: number, message: string) => {
					if (isTypingRef.current) {
						alertError(new Error('Wait for ChatGPT to stop typing'))
						return
					}

					submitRef.current(message.trim())
				}
			}
		])

		return artyom
	}, [isTypingRef, submitRef])

	const toggle = useCallback(async () => {
		try {
			setIsLoading(true)

			if (!artyom) throw new Error('Artyom is not initialized')

			if (!artyom.recognizingSupported)
				throw new Error('Speech recognition is not supported')

			if (!isStarted) {
				await toast.promise(startArtyom(artyom), {
					pending: 'Starting speech...',
					success: 'Speech started. Start your prompt with "Tell chat..."',
					error: 'Failed to start speech'
				})
			} else {
				stopArtyom(artyom)
				toast.success('Speech stopped')
			}

			setIsStarted(isStarted => !isStarted)
		} catch (unknownError) {
			alertError(errorFromUnknown(unknownError))
		} finally {
			setIsLoading(false)
		}
	}, [setIsLoading, isStarted, setIsStarted, artyom])

	useEffect(() => {
		try {
			if (!disabled) return
			if (!artyom) throw new Error('Artyom is not initialized')

			stopArtyom(artyom)
			setIsStarted(false)
		} catch (unknownError) {
			alertError(errorFromUnknown(unknownError))
		}
	}, [disabled, artyom, setIsStarted])

	useEffect(() => {
		// On unload stop speech

		return () => {
			try {
				if (!artyom) throw new Error('Artyom is not initialized')

				stopArtyom(artyom)
				setIsStarted(false)
			} catch (unknownError) {
				alertError(errorFromUnknown(unknownError))
			}
		}
	}, [artyom])

	useEffect(() => {
		isTypingRef.current = isTyping
	}, [isTypingRef, isTyping])

	useEffect(() => {
		submitRef.current = submit
	}, [submitRef, submit])

	return (
		<button
			className={cx(
				'text-xl w-450:text-2xl transition-colors ease-linear hover:text-opacity-70 disabled:text-opacity-50',
				!isStarted ? 'text-sky-500' : 'text-red-500'
			)}
			aria-label={!isStarted ? 'Start speaking your messages' : 'Stop speech'}
			data-balloon-pos="up-left"
			disabled={disabled || isLoading}
			onClick={toggle}
		>
			<FontAwesomeIcon icon={faMicrophone} />
		</button>
	)
}

export default ChatInputShareButton
