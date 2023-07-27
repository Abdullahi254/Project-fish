import React from 'react'

type Props = {}

function Loading({ }: Props) {
  return (
    <div className="mt-14 w-full">
      <div className="max-w-7xl mx-auto overflow-x-auto">

        <div className='w-full px-4 bg-white flex justify-evenly items-center animate-pulse border-b py-4'>
          <div className="h-[20px] bg-gray-200 rounded-full w-32 md:w-48 mb-4"></div>
          <div className="h-[20px] bg-gray-200 rounded-full w-32 md:w-48 mb-4"></div>
          <div className="h-[20px] bg-gray-200 rounded-full w-32 md:w-48 mb-4"></div>
          <div className="h-[20px] bg-gray-200 rounded-full w-32 md:w-48 mb-4 hidden md:block"></div>
          <div className="h-[20px] bg-gray-200 rounded-full w-32 md:w-48 mb-4 hidden md:block"></div>
        </div>

        {
          [1, 2, 3, 4, 5].map(index =>
            <div className='w-full px-4 bg-white flex justify-evenly items-center animate-pulse border-b py-4' key={index}>
              <div className="h-[20px] bg-gray-200 rounded-full w-32 md:w-48 mb-4"></div>
              <div className="h-[20px] bg-gray-200 rounded-full w-32 md:w-48 mb-4"></div>
              <div className="h-[20px] bg-gray-200 rounded-full w-32 md:w-48 mb-4"></div>
              <div className="h-[20px] bg-gray-200 rounded-full w-32 md:w-48 mb-4 hidden md:block"></div>
              <div className="h-[20px] bg-gray-200 rounded-full w-32 md:w-48 mb-4 hidden md:block"></div>
            </div>)
        }


      </div>
    </div>
  )
}

export default Loading