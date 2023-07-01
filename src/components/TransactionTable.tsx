'use client';
import React, { useRef, useState } from 'react'
import { RxReset } from "react-icons/rx"
import { useRouter } from 'next/navigation';
type Props = {
    startDate: string | string[] | undefined
    endDate: string | string[] | undefined
}

const TransactionTable = ({ startDate, endDate }: Props) => {
    const [toogle, setToogle] = useState<boolean>()
    const firstDateRef = useRef<HTMLInputElement>(null)
    const secondDateRef = useRef<HTMLInputElement>(null)



    const router = useRouter()

    const handleDateChange = () => {
        setToogle(prev => !prev)
    }

    const clearDateFields = () => {
        if (firstDateRef.current?.value && secondDateRef.current?.value) {
            firstDateRef.current.value = ''
            secondDateRef.current.value = ''
        }
        router.push("/")
    }

    return (
        <>
            <div className='w-full mb-2 space-x-4 py-2 px-2 md:px-8 flex items-center justify-start md:justify-end'>
                <span className='text-sm text-gray-500'>From:</span>
                <input type='date' ref={firstDateRef} className='text-sm text-gray-600' onChange={handleDateChange} />
                <span className='text-sm text-gray-500'>To:</span>
                <input type='date' ref={secondDateRef} className='text-sm text-gray-600' onChange={handleDateChange} />
            </div>
            {(startDate && endDate) &&
                <div className='w-full mb-2 flex justify-start px-2 md:justify-center items-center py-2 space-x-4 '>
                    <p className='text-sm text-gray-600'>Date Selected:</p>
                    <p className='text-sm font-semibold'>{startDate}</p>
                    <p className='text-sm text-gray-600'>to</p>
                    <p className='text-sm font-semibold'>{endDate}</p>
                    <button onClick={clearDateFields}><RxReset className='text-green-500' /></button>
                </div>
            }
            <table className="w-full text-sm text-left text-gray-500">
                <thead className='text-xs text-gray-700 uppercase bg-gray-50'>
                    <tr>
                        <th scope="col" className="px-6 py-3">NO</th>
                        <th scope="col" className="px-6 py-3">Date</th>
                        <th scope="col" className="px-6 py-3">Debit(KSH)</th>
                        <th scope="col" className="px-6 py-3">Credit(KSH)</th>
                        <th scope="col" className="px-6 py-3">Debt Balance(KSH)</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        [1, 2, 3, 4, 5, 6].map((data) => <React.Fragment key={data}>
                            <tr className='bg-white border-b' >
                                <td className="px-6 py-4">{data}</td>
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                    12/13/2020
                                </th>
                                <td className="px-6 py-4"></td>
                                <td className="px-6 py-4">1200.00</td>
                                <td className="px-6 py-4">1200.00</td>
                            </tr>
                        </React.Fragment>)
                    }
                    <tr className='bg-white' >
                        <td className="px-6 py-4"></td>
                        <td className="px-6 py-4 font-bold text-black">TOTAL:</td>
                        <td className="px-6 py-4">0.00</td>
                        <td className="px-6 py-4">7200.00</td>
                        <td className="px-6 py-4 font-bold text-black">7200.00</td>
                    </tr>
                    <tr className='bg-white' >
                        <td className="px-6 py-4"></td>
                        <td className="px-6 py-4"></td>
                        <td className="px-6 py-4"></td>
                        <td className="px-6 py-4"></td>
                        <td className="px-6 py-4"><button className='text-blue-600 hover:text-indigo-900 text-sm'>Full table</button></td>
                    </tr>
                </tbody>
            </table>
        </>
    )
}

export default TransactionTable