import React from 'react'
import ProfileCard from './ProfileCard'

type Props = {}

const ClientList = (props: Props) => {
    return (
        <>
            <div className=' px-4 md:px-6 py-4 flex flex-col space-y-2'>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(index => <ProfileCard key={index} />)}
            </div>
        </>

    )
}

export default ClientList