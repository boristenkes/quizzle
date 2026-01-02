import { QuestionType } from '@/db/schema/questions'

export const questionTypeLabel: Record<QuestionType, string> = {
	multi_choice: 'Multiple choices',
	single_choice: 'Single choice',
	text: 'Text'
}
