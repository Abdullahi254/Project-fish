import React from 'react'
import { RxAvatar } from "react-icons/rx"
type Props = {}

const ProfileCard = (props: Props) => {
    return (
        <div className='w-full border border-gray-200 rounded-lg shadow bg-white flex p-2 justify-between flex-wrap space-y-2 items-center cursor-pointer'>
            <div className='flex space-x-2'>
                <div className='relative w-10 h-10 overflow-hidden bg-gray-100 rounded-full'>
                    <RxAvatar className='absolute w-12 h-10 text-gray-400 -left-1' />
                </div>
                <div className='space-y-1'>
                    <h3 className='text-xs text-gray-500 font-semibold'>Abdullahi Mohamud</h3>
                    <div className='flex space-x-2 flex-wrap'>
                        <p className='text-xs'><span className='text-red-500 mr-1'>Credit:</span>KSH10,000</p>
                        <p className='text-xs'><span className='text-green-500 mr-1'>Debit:</span>KSH10,000</p>
                    </div>
                </div>
            </div>

            <div className='text-xs text-gray-500'>
                12/11/2022
            </div>
        </div>
    )
}

export default ProfileCard