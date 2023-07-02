import React from 'react'

type Props = {}

function Loading({ }: Props) {
    return (
        <div className="mt-14 w-full">
            <div className="max-w-7xl mx-auto overflow-x-auto">
                <div className='w-full px-4 bg-white flex flex-col items-center justify-center animate-pulse py-4'>
                    {
                        [1, 2, 3, 4, 5, 6].map(data => <div key={data} className="h-[40px] bg-gray-200 rounded-lg w-full mb-4"></div>)
                    }
                </div>
            </div>
        </div>
    )
}

export default Loading