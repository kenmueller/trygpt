const QUOTES_MATCH = /^['"](.*)['"]$/

const trimQuotes = (text: string) => text.match(QUOTES_MATCH)?.[1] ?? text

export default trimQuotes
