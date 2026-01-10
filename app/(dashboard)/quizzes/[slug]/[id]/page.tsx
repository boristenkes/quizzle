export type QuizDetailsPageProps = {
	params: Promise<{ slug: string; id: string }>
}

export default async function QuizDetailsPage({
	params
}: QuizDetailsPageProps) {
	const { slug, id } = await params

	return (
		<h1>
			QuizDetailsPage
			<p>slug = {slug}</p>
			<p>id = {id}</p>
		</h1>
	)
}
