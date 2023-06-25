import React from 'react'

type Props = {}

function loading({}: Props) {
  return (
    <div className='h-screen w-full bg-red-500 flex flex-col justify-center items-center'>
      <div>Loading...</div>
    </div>
  )
}

export default loading