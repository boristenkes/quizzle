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

export const difficulties = ['easy', 'medium', 'hard'] as const

export type Difficulty = (typeof difficulties)[number]

export const notificationTypes = [
	'new_follower',
	'new_attempt',
	'new_review'
] as const

export type NotificationType = (typeof notificationTypes)[number]

export const MIN_QUIZ_QUESTIONS = 3
export const MAX_QUIZ_QUESTIONS = 50

export const MIN_QUESTION_OPTIONS = 2
export const MAX_QUESTION_OPTIONS = 4

export const MAX_PLAYTIME_SECONDS = 24 * 60 * 60 // 24 hours
