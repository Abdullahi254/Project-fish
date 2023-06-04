'use client';

import { useState } from 'react';
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai"
import { GiBoatFishing } from "react-icons/gi"
import FishIcon from "../asset/fish.png"
import { signOut } from "next-auth/react"

type Props = {}

const Navbar = (props: Props) => {
  const [sideNav, setsideNav] = useState<boolean>(false)

  const handleNav = () => {
    setsideNav(prev => !prev)
  }
  return (
    <nav className=" fixed top-0 w-full h-12 border-b-[1px] border-gray-500 px-8 z-[100]">
      <div className='hidden lg:flex items-center h-full justify-between mx-auto max-w-7xl'>

        <div className='flex space-x-10 h-full items-center'>
          <div className='cursor-pointer'>
            <Image src={FishIcon} width={40} height={40} alt='fish icon' priority />
          </div>
          <div className='space-x-8'>
            <Link href="/">
              <span className='text-gray-500 text-sm hover:text-gray-900 hover:underline'>Batch Record</span>
            </Link>
            <Link href="/ledger">
              <span className='text-gray-500 text-sm hover:text-gray-900 hover:underline'>Customer Ledger</span>
            </Link>
            <Link href="/analytics">
              <span className='text-gray-500 text-sm hover:text-gray-900 hover:underline'>Analytics</span>
            </Link>
          </div>
        </div>

        <div>
          <Link href="/">
            <span className='bg-gray-900 text-white rounded-md px-3 py-2 text-sm font-medium' onClick={() => signOut()}>Logout</span>
          </Link>
        </div>

      </div>

      <div className='flex lg:hidden h-full items-center justify-between mx-auto max-w-7xl'>
        <div className=' cursor-pointer' onClick={handleNav}>
          <AiOutlineMenu className='text-lg' />
        </div>
        <div className='cursor-pointer'>
          <Image src={FishIcon} width={40} height={40} alt='fish icon' />
        </div>
        <div>
          <Link href="/">
            <span className='bg-gray-900 text-white rounded-md px-3 py-2 text-sm font-medium' onClick={() => signOut()}>Logout</span>
          </Link>
        </div>
      </div>

      {/* side nav */}
      <div className={sideNav ? 'fixed left-0 top-0 w-full h-screen bg-black/70 lg:hidden ' : ''}>
        <div
          className={sideNav ? 'fixed left-0 top-0 w-[75%] sm:w-[60%] lg:w-[45%] h-screen bg-[#ecf0f3] p-10 px-4  ease-in duration-500 flex flex-col justify-between z-[150]' :
            'fixed left-[-150%] top-0 ease-in duration-500'}
        >
          <div className='relative'>
            <span className='absolute top-0 right-0 cursor-pointer rounded-full shadow-lg shadow-gray-400 p-3' onClick={handleNav}>
              <AiOutlineClose size={20} />
            </span>
            <div className='flex justify-center w-full items-center'>
              <GiBoatFishing className='text-[50px] text-gray-700' />
            </div>
            <div className='border-b-2  border-gray-400 my-4 text-center' />
            <div className='py-4 flex flex-col'>
              <ul>
                <Link href="/">
                  <li className='py-6 text-gray-500 text-sm hover:font-semibold hover:border-b-2 border-gray-400' onClick={handleNav}>Batch Record</li>
                </Link>
                <Link href="/ledger">
                  <li className='py-6 text-gray-500 text-sm hover:font-semibold hover:border-b-2 border-gray-400' onClick={handleNav}>Customer Ledger</li>
                </Link>
                <Link href="/analytics">
                  <li className='py-6 text-gray-500 text-sm hover:font-semibold hover:border-b-2 border-gray-400' onClick={handleNav}>Analytics</li>
                </Link>
              </ul>
            </div>
          </div>
        </div>
      </div>

    </nav>
  )
}

export default Navbar