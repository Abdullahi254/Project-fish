import React from 'react'
import ProfileCard from './ProfileCard'
import { Client, Transaction } from '@prisma/client'

export type MyClient = Client & {
    transactions: Transaction[]
}

type Props = {
    clients: MyClient[]
}

const ClientList = ({ clients }: Props) => {
    return (
        <>
            <div className=' px-4 md:px-6 py-4 flex flex-col space-y-2'>
                {clients.map(data => <ProfileCard
                    id ={data.id}
                    key={data.id}
                    name={`${data.first}-${data.last}`}
                    credit={data?.totalCredit}
                    debit={data?.totalDebit}
                    date={data?.transactions[0]?.createdAt}
                />)}
            </div>
        </>

    )
}

export default ClientList