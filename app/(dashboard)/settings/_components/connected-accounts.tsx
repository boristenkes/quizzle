import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from '@/components/ui/card'
import { db } from '@/db'
import { User } from '@/db/schema'
import '@/utils/format'
import AccountCard from './account-card'

export type ConnectedAccountsProps = {
	sessionUserId: User['id']
}

export default async function ConnectedAccounts({
	sessionUserId
}: ConnectedAccountsProps) {
	const accounts = await db.query.accountsTable.findMany({
		where: (table, { eq }) => eq(table.userId, sessionUserId),
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
