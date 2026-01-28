import { sanitizeConfig } from '@/lib/sanitize-html'
import { GenerateQuestionsConfigSchema } from './zod'

export function getGenerateQuestionsPrompt(
	pdfText: string,
	config: GenerateQuestionsConfigSchema
) {
	const { easy, medium, hard } = config.difficultyDistribution
	const { text, single_correct, multi_correct } = config.typeDistribution

	return `
Generate quiz questions based ONLY on the PDF text below.

QUESTION REQUIREMENTS
- Generate exactly ${config.questionCount} questions (min 3, max 50).
- Question type distribution:
  - text: ${text}
  - single_correct: ${single_correct}
  - multi_correct: ${multi_correct}

DIFFICULTY DISTRIBUTION
- easy: ${easy}
- medium: ${medium}
- hard: ${hard}

Difficulty definitions:
- Easy: direct facts or definitions
- Medium: relationships or explanations
- Hard: deeper understanding or multi-step reasoning

CHOICE QUESTION RULES
- 2-4 options per question
- single_correct: exactly 1 correct option
- multi_correct: at least 1 correct option
- Incorrect options must be plausible but clearly wrong per the PDF

TEXT QUESTION RULES
- acceptableAnswers must:
  - not be empty
  - be lowercase
  - include all valid answers found in the PDF
  - include synonyms ONLY if present in the PDF

EXPLANATION RULES
- explanationHTML must:
  - explain why the answer is correct
  - be concise (2–4 sentences)
  - use ONLY allowed HTML tags (${sanitizeConfig.ALLOWED_TAGS.join(', ')}) 
    and attributes (${sanitizeConfig.ALLOWED_ATTR.join(', ')})

QUESTION SCHEMA
- Each question must match the following schema:
{
	type: "object",
	properties: {
		prompt: { type: "string" },
		explanationHTML: { type: "string" },
		difficulty: {
			type: "string",
			enum: ["easy", "medium", "hard"]
		},
		type: {
			type: "string",
			enum: ["multi_correct", "single_correct", "text"]
		},
		acceptableAnswers: {
			type: "array",
			items: { type: "string" }
		},
		options: {
			type: "array",
			items: {
				type: "object",
				properties: {
					value: { type: "string" },
					isCorrect: { type: "boolean" }
				},
				required: ["value", "isCorrect"]
			}
		},
		ignoreCase: { type: "boolean" },
		trimWhitespace: { type: "boolean" }
	},
	required: ["prompt", "explanationHTML", "difficulty", "type"]
}

SOURCE DOCUMENT (ONLY SOURCE OF TRUTH)
<<<BEGIN PDF TEXT>>>
${pdfText}
<<<END PDF TEXT>>>
`
}
