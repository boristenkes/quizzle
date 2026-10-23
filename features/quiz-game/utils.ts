import { AttemptQuestion, TextQuestionSettings } from '@/db/schema'

export function gradeAnswer(
	submittedAnswer: AttemptQuestion['submittedAnswer'],
	questionPrivate: AttemptQuestion['questionPrivate']
): boolean {
	if (!submittedAnswer || !questionPrivate) return false

	if (submittedAnswer.type !== questionPrivate.type) return false

	switch (questionPrivate.type) {
		case 'text': {
			if (submittedAnswer.type !== questionPrivate.type) break

			const submitted = normalizeText(submittedAnswer.answer, {
				ignoreCase: questionPrivate.ignoreCase,
				trimWhitespace: questionPrivate.trimWhitespace
			})

			return questionPrivate.acceptableAnswers.some(
				answer =>
					submitted ===
					normalizeText(answer, {
						ignoreCase: questionPrivate.ignoreCase,
						trimWhitespace: questionPrivate.trimWhitespace
					})
			)
		}

		case 'single_correct': {
			if (submittedAnswer.type !== 'single_correct') return false

			return questionPrivate.options.some(
				option => option.id === submittedAnswer.answerId && option.isCorrect
			)
		}

		case 'multi_correct': {
			if (submittedAnswer.type !== 'multi_correct') return false

			const correctIds = new Set(
				questionPrivate.options
					.filter(option => option.isCorrect)
					.map(option => option.id)
			)

			const submittedIds = new Set(submittedAnswer.answerIds)

			// Reject duplicate IDs instead of silently accepting them.
			if (submittedIds.size !== submittedAnswer.answerIds.length) {
				return false
			}

			if (submittedIds.size !== correctIds.size) {
				return false
			}

			return [...correctIds].every(id => submittedIds.has(id))
		}
	}

	return false
}

export function normalizeText(
	value: string,
	options: Pick<TextQuestionSettings, 'ignoreCase' | 'trimWhitespace'>
): string {
	if (!value) return value

	let normalized = value

	if (options.trimWhitespace) normalized = normalized.trim()
	if (options.ignoreCase) normalized = normalized.toLowerCase()

	return normalized
}
