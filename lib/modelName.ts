const modelName = (model: string) => {
	switch (model) {
		case 'gpt-3.5-turbo':
			return 'GPT 3.5'
		case 'gpt-4':
			return 'GPT 4'
		default:
			return model
	}
}

export default modelName
