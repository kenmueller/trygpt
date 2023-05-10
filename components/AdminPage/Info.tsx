import cx from 'classnames'

import formatCents from '@/lib/cents/format'
import formatDate from '@/lib/date/format'
import allUsers from '@/lib/user/all'
import costThisPeriod from '@/lib/user/costThisPeriod'
import User from '@/lib/user'
import amountReceived from '@/lib/user/amountReceived'

import styles from './Info.module.scss'

const totalCost = (user: User) =>
	user.purchasedAmount + amountReceived(costThisPeriod(user))

const AdminInfo = async () => {
	const users = await allUsers()

	const usersSortedByCost = [...users].sort(
		(a, b) => totalCost(b) - totalCost(a)
	)

	const mostRecentUser = users.reduce(
		(max, user) => (user.created >= (max?.created ?? 0) ? user : max),
		(users[0] as User | undefined) ?? null
	)

	return (
		<div className={cx('flex flex-col items-stretch gap-4', styles.root)}>
			<h2>Users</h2>
			<div className="overflow-x-auto">
				<table>
					<thead>
						<tr>
							<th>ID</th>
							<th>Name</th>
							<th>Email</th>
							<th>Cost this period</th>
							<th>Purchased amount</th>
							<th>Total cost</th>
							<th>Last charged</th>
							<th>Has payment method</th>
							<th>Joined</th>
						</tr>
					</thead>
					<tbody>
						{usersSortedByCost.map(user => (
							<tr
								key={user.id}
								className={cx(user.paymentMethod && 'bg-white bg-opacity-10')}
							>
								<td>{user.id}</td>
								<td>
									{user.name} ({user.points})
								</td>
								<td>{user.email}</td>
								<td>{formatCents(amountReceived(costThisPeriod(user)))}</td>
								<td>{formatCents(user.purchasedAmount)}</td>
								<td>{formatCents(totalCost(user))}</td>
								<td>
									{user.lastCharged ? formatDate(user.lastCharged) : 'Never'}
								</td>
								<td>{user.paymentMethod ? 'Yes' : 'No'}</td>
								<td>{formatDate(user.created)}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
			{mostRecentUser && (
				<p>
					Most recent user:{' '}
					<strong>
						{mostRecentUser.name} ({mostRecentUser.points}) (Joined{' '}
						{formatDate(mostRecentUser.created)})
					</strong>
				</p>
			)}
			<p>
				Total users: <strong>{users.length}</strong>
			</p>
			<p>
				Users charged before:{' '}
				<strong>{users.filter(user => user.purchasedAmount > 0).length}</strong>
			</p>
			<p>
				Total money made now:{' '}
				<strong>
					{formatCents(
						users.reduce((total, user) => total + user.purchasedAmount, 0)
					)}
				</strong>
			</p>
			<p>
				Total money made by the end of the period:{' '}
				<strong>
					{formatCents(
						users.reduce((total, user) => total + totalCost(user), 0)
					)}
				</strong>
			</p>
		</div>
	)
}

export default AdminInfo
