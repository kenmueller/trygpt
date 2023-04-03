import { Dispatch, SetStateAction, createContext } from 'react'

const InitialPromptContext = createContext<
	[string | null, Dispatch<SetStateAction<string | null>>]
>(undefined as never)

export default InitialPromptContext
