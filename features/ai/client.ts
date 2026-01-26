import 'server-only'

import { GoogleGenAI } from '@google/genai'
import parsePDF from 'pdf-parse'

export const gemini = new GoogleGenAI({})

export const GEMINI_MODEL_NAME = 'gemini-3-flash-preview'

export async function extractTextFromPDF(pdf: File) {
	const buffer = Buffer.from(await pdf.arrayBuffer())
	const data = await parsePDF(buffer)

	return data.text
}

export function chunkText(text: string, size = 1500) {
	const chunks: string[] = []

	for (let i = 0; i < text.length; i += size) {
		chunks.push(text.slice(i, i + size))
	}

	return chunks
}
