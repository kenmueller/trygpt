import cx from 'classnames'

import formatCents from '@/lib/cents/format'
import formatDate from '@/lib/date/format'
import allUsers from '@/lib/user/all'
import costThisPeriod from '@/lib/user/costThisPeriod'

import styles from './Info.module.scss'
import User from '@/lib/user'

const totalCost = (user: User) => user.purchasedAmount + costThisPeriod(user)

const AdminInfo = async () => {
	const users = await allUsers()

	const usersSortedByCost = [...users].sort(
		(a, b) => totalCost(b) - totalCost(a)
	)

	return (
		<div
			className={cx(
				'flex flex-col items-stretch gap-4 overflow-x-auto',
				styles.root
			)}
		>
			<h2>Users</h2>
			<table>
				<thead>
					<tr>
						<th>Name</th>
						<th>Email</th>
						<th>Cost this period</th>
						<th>Purchased amount</th>
						<th>Last charged</th>
						<th>Has payment method</th>
					</tr>
				</thead>
				<tbody>
					{usersSortedByCost.map(user => (
						<tr
							key={user.id}
							className={cx(user.paymentMethod && 'bg-white bg-opacity-10')}
						>
							<td>{user.name}</td>
							<td>{user.email}</td>
							<td>{formatCents(costThisPeriod(user))}</td>
							<td>{formatCents(user.purchasedAmount)}</td>
							<td>
								{user.lastCharged ? formatDate(user.lastCharged) : 'Never'}
							</td>
							<td>{user.paymentMethod ? 'Yes' : 'No'}</td>
						</tr>
					))}
				</tbody>
			</table>
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
