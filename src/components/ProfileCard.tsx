import Link from 'next/link'
import React from 'react'
import { RxAvatar } from "react-icons/rx"
type Props = {
    name: string
    credit: number | null
    debit: number | null
    date: Date | undefined | null
    id: number
}

const ProfileCard = (props: Props) => {
    return (
        <>
            <Link href={`ledger/${props.id}?name=${props.name}`}>
                <div className='w-full border border-gray-200 rounded-lg shadow bg-white flex p-2 justify-between flex-wrap space-y-2 items-center cursor-pointer hover:shadow-lg'>
                    <div className='flex space-x-2'>
                        <div className='relative w-10 h-10 overflow-hidden bg-gray-100 rounded-full'>
                            <RxAvatar className='absolute w-12 h-10 text-gray-400 -left-1' />
                        </div>
                        <div className='space-y-1'>
                            <h3 className='text-xs text-gray-500 font-semibold'>{props.name}</h3>
                            <div className='flex space-x-2 flex-wrap'>
                                <p className='text-xs'><span className='text-red-500 mr-1'>Credit:</span>KSH{props.credit?.toFixed(2)}</p>
                                <p className='text-xs'><span className='text-green-500 mr-1'>Debit:</span>KSH{props.debit?.toFixed(2)}</p>
                            </div>
                        </div>
                    </div>

                    <div className='text-xs text-gray-500'>
                        {props?.date?.toDateString()}
                    </div>
                </div>
            </Link>
        </>

    )
}

export default ProfileCard