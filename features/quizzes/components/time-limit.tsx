import { Quiz } from '@/db/schema'

export type TimeLimitProps = React.HTMLAttributes<HTMLElement> & {
	limit: Quiz['timeLimitSeconds'] | undefined
}

export default function TimeLimit({ limit, ...props }: TimeLimitProps) {
	if (!limit) return <em {...props}>No time limit</em>

	return <span {...props}>{`${limit / 60}m limit`}</span>
}
