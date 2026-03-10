export type AnchorProps = React.ComponentProps<'a'> & {
	href: string
}

export default function Anchor(props: AnchorProps) {
	return (
		<a
			target='_blank'
			rel='noopener'
			{...props}
		/>
	)
}
