import { ChatCompletionMessage } from './completion/chat'

export const namePromptMessages = (prompt: string): ChatCompletionMessage[] => [
	{
		role: 'system',
		text: 'Do not surround your response in quotes. Write a maximum of 15 words.'
	},
	{
		role: 'user',
		text: `Generate a short title for a conversation starting with this prompt: \`\`\`${prompt}\`\`\``
	}
]

export const messagePromptMessages = (
	messages: ChatCompletionMessage[]
): ChatCompletionMessage[] => [
	{
		role: 'system',
		text: '\
Surround code in backticks and provide a language. \
Surround display mode math in \\[ and \\] and inline math in \\( and \\) and format as LaTeX. \
Format everything else as markdown. \
If asked to generate an image, output a markdown image with the URL "https://source.unsplash.com/1600x900/?{query}" with a detailed query and do not surround it in a code block.\
'
	},
	...messages
]
