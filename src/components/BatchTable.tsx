'use client';
import React, { useState, useRef, useEffect } from 'react';
import { RiArrowDropDownLine } from "react-icons/ri"
import RecordsTable from './RecordsTable';
import { fetchBatchData } from '@/app/actions';
import { AsyncReturnType } from "../../typing"
import { useRouter } from 'next/navigation';

type Props = {
    batchList: AsyncReturnType<typeof fetchBatchData>
}

const BatchTable = ({
    batchList
}: Props) => {
    const [activeIds, setActiveIds] = useState<number[]>([])
    const [toogle, setToogle] = useState<boolean>()
    const firstDateRef = useRef<HTMLInputElement>(null)
    const secondDateRef = useRef<HTMLInputElement>(null)
    const router = useRouter()

    const handlemore = (id: number) => {
        if (activeIds.includes(id)) {
            setActiveIds(
                activeIds.filter(i => i !== id)
            )
        } else {
            setActiveIds([
                id,
                ...activeIds
            ])
        }
    }

    const handleDateChange = () => {
        setToogle(prev => !prev)
    }

    useEffect(() => {
        if (firstDateRef.current?.value && secondDateRef.current?.value) {
            router.push(`/?start=${firstDateRef.current.value}&end=${secondDateRef.current.value}`)
        }
    }, [toogle, router])
    return (
        <>
            <div className='w-full mb-2 space-x-4 py-2 pr-8 flex items-center justify-center md:justify-end'>
                <span className='text-sm text-gray-500'>From:</span>
                <input type='date' ref={firstDateRef} className='text-sm text-gray-600' onChange={handleDateChange} />
                <span className='text-sm text-gray-500'>To:</span>
                <input type='date' ref={secondDateRef} className='text-sm text-gray-600' onChange={handleDateChange} />
            </div>
            <table className="w-full text-sm text-left text-gray-500">
                <thead className='text-xs text-gray-700 uppercase bg-gray-50'>
                    <tr>
                        <th scope="col" className="px-6 py-3">Batch Date</th>
                        <th scope="col" className="px-6 py-3">Fish Type</th>
                        <th scope="col" className="px-6 py-3">Total Water Loss(KG)</th>
                        <th scope="col" className="px-6 py-3">Price/Kilo(KSH)</th>
                        <th scope="col" className="px-6 py-3">Estimated Loss(KSH)</th>
                        <th scope="col" className="px-6 py-3"></th>
                    </tr>
                </thead>
                <tbody>
                    {
                        batchList.map((data) => <React.Fragment key={data.id}>
                            <tr className='bg-white border-b' >
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                    {data.batchDate.toDateString()}
                                </th>
                                <td className="px-6 py-4">{data.type}</td>
                                <td className="px-6 py-4">{data.totalWaterLoss?.toFixed(2)}</td>
                                <td className="px-6 py-4">{data.pricePerKilo.toFixed(2)}</td>
                                <td className="px-6 py-4">{data.estimatedLoss?.toFixed(2)}</td>
                                <td className="py-4"><RiArrowDropDownLine className={activeIds.includes(data.id) ? `cursor-pointer text-black text-lg` : `cursor-pointer text-black rotate-180 text-lg`} onClick={() => handlemore(data.id)} /></td>
                            </tr>
                            <tr>
                                {(activeIds.includes(data.id)) && <td colSpan={6}>
                                    <div className='max-w-6xl mx-auto pt-4 pb-2 bg-gray-200 my-2'>
                                        <div className='w-full flex justify-evenly'>
                                            <h2 className='text-center text-black font-semibold'>ID: {data.id}</h2>
                                            <h2 className='text-center text-black font-semibold'>TYPE: {data.type}</h2>
                                            <h2 className='text-center text-black font-semibold mb-2'>DATE: {data.batchDate.toDateString()}</h2>
                                        </div>
                                        <RecordsTable batchId={data.id} />
                                    </div>
                                </td>}

                            </tr>
                        </React.Fragment>)
                    }
                </tbody>
            </table>
        </>

    )
}

export default BatchTable