export const userRoles = ['user', 'admin'] as const

export type UserRole = (typeof userRoles)[number]

export const questionTypes = ['multi_choice', 'single_choice', 'text'] as const

export type QuestionType = (typeof questionTypes)[number]

export const questionTypeLabel: Record<QuestionType, string> = {
	multi_choice: 'Multiple choices',
	single_choice: 'Single choice',
	text: 'Text'
}

export const quizDifficulties = ['easy', 'medium', 'hard'] as const

export type QuizDifficulty = (typeof quizDifficulties)[number]
