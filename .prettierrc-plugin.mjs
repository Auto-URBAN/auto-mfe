import { readFileSync } from 'fs'
import { resolve } from 'path'

const stripCommentsPlugin = {
	parsers: {
		vue: {
			...require('prettier/parser-html').parsers.vue,
			preprocess(text, options) {
				text = text.replace(/<!--[\s\S]*?-->/g, '')

				text = text.replace(/\/\/.*$/gm, '')

				text = text.replace(/\/\*[\s\S]*?\*\//g, '')

				text = text.replace(/\n{3,}/g, '\n\n')

				return text
			}
		},
		typescript: {
			...require('prettier/parser-typescript').parsers.typescript,
			preprocess(text, options) {
				text = text.replace(/\/\/.*$/gm, '')
				text = text.replace(/\/\*[\s\S]*?\*\//g, '')
				text = text.replace(/\n{3,}/g, '\n\n')
				return text
			}
		},
		babel: {
			...require('prettier/parser-babel').parsers.babel,
			preprocess(text, options) {
				text = text.replace(/\/\/.*$/gm, '')
				text = text.replace(/\/\*[\s\S]*?\*\//g, '')
				text = text.replace(/\n{3,}/g, '\n\n')
				return text
			}
		}
	}
}

export default stripCommentsPlugin
