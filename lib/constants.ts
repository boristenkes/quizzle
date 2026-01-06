export const userRoles = ['user', 'admin'] as const

export type UserRole = (typeof userRoles)[number]

export const questionTypes = [
	'multi_correct',
	'single_correct',
	'text'
] as const

export type QuestionType = (typeof questionTypes)[number]

export const questionTypeLabel: Record<QuestionType, string> = {
	multi_correct: 'Multiple correct',
	single_correct: 'One correct',
	text: 'Text'
}

export const questionDifficulties = ['easy', 'medium', 'hard'] as const

export type QuestionDifficulty = (typeof questionDifficulties)[number]

export const MIN_QUIZ_QUESTIONS = 3
export const MAX_QUIZ_QUESTIONS = 50

export const MIN_QUESTION_OPTIONS = 2
export const MAX_QUESTION_OPTIONS = 4
