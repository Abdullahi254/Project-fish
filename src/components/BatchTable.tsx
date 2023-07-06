'use client';
import React, { useState, useRef, useEffect, useTransition } from 'react';
import { RiArrowDropDownLine } from "react-icons/ri"
import RecordsTable from './RecordsTable';
import { fetchBatchData } from '@/app/actions';
import { AsyncReturnType } from "../../typing"
import { useRouter } from 'next/navigation';
import { RxReset } from "react-icons/rx"
import { AiOutlineLoading3Quarters as Spinner } from 'react-icons/ai'

type Props = {
    batchList: AsyncReturnType<typeof fetchBatchData>
    startDate: string | string[] | undefined
    endDate: string | string[] | undefined
}

const BatchTable = ({
    batchList,
    startDate,
    endDate
}: Props) => {
    const [activeIds, setActiveIds] = useState<number[]>([])
    const [toogle, setToogle] = useState<boolean>()
    const firstDateRef = useRef<HTMLInputElement>(null)
    const secondDateRef = useRef<HTMLInputElement>(null)
    const [isPending, startTransition] = useTransition()
    const [date1, setDate1] = useState<Date>()
    const [date2, setDate2] = useState<Date>()
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

    const clearDateFields = () => {
        startTransition(() => {
            if (firstDateRef.current?.value && secondDateRef.current?.value) {
                firstDateRef.current.value = ''
                secondDateRef.current.value = ''
            }
            router.push("/")
        })
    }

    useEffect(() => {
        const first = firstDateRef.current?.value
        const second = secondDateRef.current?.value
        if (first && second) {
            startTransition(() => {
                router.push(`/?start=${first}&end=${second}`)
            })
        }
    }, [toogle, router])
    useEffect(() => {
        const d1 = new Date(startDate as string)
        const d2 = new Date(endDate as string)
        setDate1(d1)
        setDate2(d2)
    }, [startDate, endDate])
    return (
        <>
            <div className='w-full mb-2 space-x-4 py-2 px-2 md:px-8 flex items-center justify-start md:justify-end'>
                <span className='text-xs md:text-sm text-gray-500'>From:</span>
                <input type='date' ref={firstDateRef} className='text-xs md:text-sm text-gray-600' onChange={handleDateChange} />
                <span className='text-xs md:text-sm text-gray-500'>To:</span>
                <input type='date' ref={secondDateRef} className='text-xs md:text-sm text-gray-600' onChange={handleDateChange} />
            </div>
            {isPending &&
                <div className='w-full flex justify-center py-2'>
                    <Spinner className='animate-spin' />
                </div>
            }
            {(startDate && endDate) &&
                <div className='w-full mb-2 flex justify-start px-2 md:justify-center items-center py-2 space-x-4 '>
                    <p className='text-xs md:text-sm text-gray-600'>Date Selected:</p>
                    <p className='text-xs md:text-sm font-semibold'>{date1?.toDateString()}</p>
                    <p className='text-xs md:text-sm text-gray-600'>to</p>
                    <p className='text-xs md:text-sm font-semibold'>{date2?.toDateString()}</p>
                    <button onClick={clearDateFields}><RxReset className='text-green-500' /></button>
                </div>
            }
            <table className="w-full text-sm text-left text-gray-500">
                <thead className='text-[9px] md:text-xs text-gray-700 uppercase bg-gray-50'>
                    <tr>
                        <th scope="col" className="px-6 py-3">Batch Date</th>
                        <th scope="col" className="px-6 py-3">Fish Type</th>
                        <th scope="col" className="px-6 py-3 hidden md:block">Price/Kilo(KSH)</th>
                        <th scope="col" className="px-6 py-3">Total Water Loss(KG)</th>
                        <th scope="col" className="px-6 py-3 hidden md:block">Estimated Loss(KSH)</th>
                    </tr>
                </thead>
                <tbody className='text-xs md:text-sm'>
                    {
                        batchList.map((data) => <React.Fragment key={data.id}>
                            <tr className='bg-white hover:bg-gray-50 border-b cursor-pointer' onClick={() => handlemore(data.id)}>
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                    {data.batchDate.toDateString()}
                                </th>
                                <td className="px-6 py-4">{data.type}</td>
                                <td className="px-6 py-4 hidden md:block">{data.pricePerKilo.toFixed(2)}</td>
                                <td className="px-6 py-4 ">{data.totalWaterLoss?.toFixed(2)}</td>
                                <td className="px-6 py-4 hidden md:block">{data.estimatedLoss?.toFixed(2)}</td>
                            </tr>
                            <tr>
                                {(activeIds.includes(data.id)) && <td colSpan={6}>
                                    <div className='max-w-6xl mx-auto pt-4 pb-2 bg-gray-200 my-2'>
                                        <div className='w-full flex justify-evenly items-center text-[9px] md:text-xs mb-2'>
                                            <h2 className='text-center text-gray-700 font-semibold'>BATCH-DATE: <b className='ml-1'>{data.batchDate.toDateString()}</b></h2>
                                            <h2 className='text-center text-gray-700 font-semibold'>TYPE: {data.type}</h2>
                                            <RiArrowDropDownLine className={activeIds.includes(data.id) ? `cursor-pointer rotate-180 text-red-500 text-xl` : `cursor-pointer text-black text-xl`} onClick={() => handlemore(data.id)} />
                                        </div>
                                        <RecordsTable batchId={data.id} batchDate={data.batchDate.toLocaleDateString()} />
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