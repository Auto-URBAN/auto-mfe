import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
	rules: {
		'no-inline-comments': 'error',
		'spaced-comment': ['error', 'never'],
		'no-warning-comments': 'off'
	}
})
