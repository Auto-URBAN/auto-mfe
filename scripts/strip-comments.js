import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs'
import { join, extname } from 'path'

const targetDirs = [
	'components',
	'pages',
	'layouts',
	'composables',
	'utils',
	'schemas',
	'server',
	'plugins',
	'middleware'
]

const targetExtensions = ['.vue', '.ts', '.js', '.mjs']

function getAllFiles(dirPath, arrayOfFiles = []) {
	try {
		const files = readdirSync(dirPath)

		files.forEach(file => {
			const filePath = join(dirPath, file)
			if (statSync(filePath).isDirectory()) {
				arrayOfFiles = getAllFiles(filePath, arrayOfFiles)
			} else if (targetExtensions.includes(extname(file))) {
				arrayOfFiles.push(filePath)
			}
		})
	} catch {
		return arrayOfFiles
	}

	return arrayOfFiles
}

function removeComments(text) {
	let result = text

	result = result.replace(/\/\*[\s\S]*?\*\//g, '')

	const lines = result.split('\n')
	const processedLines = lines.map(line => {
		if (line.includes('http://') || line.includes('https://')) {
			return line
		}

		const commentIndex = line.indexOf('//')
		if (commentIndex !== -1) {
			const beforeComment = line.substring(0, commentIndex)
			const singleQuotes = (beforeComment.match(/'/g) || []).length
			const doubleQuotes = (beforeComment.match(/"/g) || []).length
			const backticks = (beforeComment.match(/`/g) || []).length

			if (singleQuotes % 2 === 0 && doubleQuotes % 2 === 0 && backticks % 2 === 0) {
				return beforeComment.trimEnd()
			}
		}
		return line
	})
	result = processedLines.join('\n')

	result = result.replace(/<!--[\s\S]*?-->/g, '')

	result = result.replace(/\n\s*\n\s*\n/g, '\n\n')

	return result
}

function stripVueComments(content) {
	let result = content

	result = result.replace(/<!--[\s\S]*?-->/g, '')

	const scriptRegex = /<script([^>]*)>([\s\S]*?)<\/script>/gi
	result = result.replace(scriptRegex, (match, attrs, scriptContent) => {
		const strippedScript = removeComments(scriptContent)
		return `<script${attrs}>${strippedScript}</script>`
	})

	const styleRegex = /<style([^>]*)>([\s\S]*?)<\/style>/gi
	result = result.replace(styleRegex, (match, attrs, styleContent) => {
		const strippedStyle = removeComments(styleContent)
		return `<style${attrs}>${strippedStyle}</style>`
	})

	result = result.replace(/\n{3,}/g, '\n\n')

	return result
}

function processFile(filePath) {
	try {
		const content = readFileSync(filePath, 'utf8')
		let processed

		if (filePath.endsWith('.vue')) {
			processed = stripVueComments(content)
		} else {
			processed = removeComments(content)
		}

		if (processed !== content) {
			writeFileSync(filePath, processed, 'utf8')
			console.log(`✓ ${filePath}`)
			return true
		}
		return false
	} catch (error) {
		console.error(`✗ ${filePath}: ${error.message}`)
		return false
	}
}

function main() {
	console.log('🧹 Removing all comments from source files...\n')

	let allFiles = []
	targetDirs.forEach(dir => {
		const files = getAllFiles(dir)
		allFiles = allFiles.concat(files)
	})

	console.log(`📁 Found ${allFiles.length} files\n`)

	let processed = 0
	allFiles.forEach(file => {
		if (processFile(file)) {
			processed++
		}
	})

	console.log(`\n✨ Done! Stripped comments from ${processed} files`)
}

main()
