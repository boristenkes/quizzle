import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from '@/components/ui/card'
import { db } from '@/db'
import '@/utils/format'
import AccountCard from './account-card'

export default async function ConnectedAccounts() {
	const accounts = await db.query.accounts.findMany({
		columns: {
			id: true,
			providerId: true
		},
		with: {
			user: {
				columns: {
					email: true,
					emailVerified: true
				}
			}
		}
	})

	return (
		<Card>
			<CardHeader>
				<CardTitle>Connected Accounts</CardTitle>
				<CardDescription>Manage your connected social accounts</CardDescription>
			</CardHeader>
			<CardContent>
				<ul className='space-y-4'>
					{accounts.map(account => (
						<li key={account.id}>
							<AccountCard
								account={account}
								numberOfAccounts={accounts.length}
							/>
						</li>
					))}
				</ul>
			</CardContent>
		</Card>
	)
}
