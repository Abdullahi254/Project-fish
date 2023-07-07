'use client'

import RecordInput from './RecordInput'
import { addRecordData, fetchRecords } from '@/app/actions'
import { AsyncReturnType } from "../../typing"
import React, { useEffect, useState, useTransition } from 'react'
import { AiOutlineEdit } from "react-icons/ai"
import { AiOutlineLoading3Quarters as Spinner, AiFillCloseCircle as Close } from "react-icons/ai"
import { useRouter } from 'next/navigation'
import { FcCancel } from "react-icons/fc"


type Props = {
    batchId: number
    batchDate: string
}

const RecordsTable = ({ batchId, batchDate }: Props) => {
    const [records, setRecords] = useState<AsyncReturnType<typeof fetchRecords>>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [remaining, setRemaining] = useState<number>(0)
    const [isPending, startTransition] = useTransition()
    const [error, setError] = useState<string>('')

    const router = useRouter()

    const fetchData = React.useCallback(async () => {
        try {
            setLoading(true)
            const records = await fetchRecords(batchId)
            setRecords(records)
            setLoading(false)
        } catch (er: any) {
            console.log(er.message)
            setLoading(false)
            setError(er.message)
        }
    }, [batchId])
    useEffect(() => {
        fetchData()
        return () => {
            setRecords([])
        }
    }, [fetchData])
    useEffect(() => {
        const latestRecord = records[records.length - 1]
        const rem = latestRecord?.remaining
        setRemaining(rem)
    }, [records])
    return (
        <>
            <table className="w-full text-sm text-left text-gray-500 mb-2 border-x-2">
                <thead className='text-[9px] md:text-xs text-gray-700 uppercase bg-gray-50'>
                    <tr>
                        <th scope="col" className="px-4 py-3">NO</th>
                        <th scope="col" className="px-4 py-3">Weight(kg)</th>
                        <th scope="col" className="px-4 py-3 ">Sold(kg)</th>
                        <th scope="col" className="px-4 py-3 hidden md:block">Remaining(kg)</th>
                        <th scope="col" className="px-4 py-3">Water Loss(kg)</th>
                        <th scope="col" className="px-4 py-3">Action</th>
                    </tr>
                </thead>
                <tbody className='text-xs md:text-sm'>
                    {
                        records.map((record, index) => <tr className='bg-white border-b' key={record.id}>
                            <th scope="row" className="px-4 py-4 font-medium text-gray-900 whitespace-nowrap">
                                {index + 1}
                            </th>
                            <td className="px-4 py-4">{record.weight.toFixed(2)}</td>
                            <td className="px-4 py-4">{record.weightSold.toFixed(2)}</td>
                            <td className="px-4 py-4 hidden md:block">{record.remaining.toFixed(2)}</td>
                            <td className="px-4 py-4">{record.waterLoss.toFixed(2)}</td>
                            <td className="px-4 py-4">
                                {(records.length - 1) === index ?

                                    <AiOutlineEdit className='cursor-pointer text-green-600' onClick={() => {
                                        startTransition(() => {
                                            router.push(`/records/${record.id}?batch=${batchId}&batchDate=${batchDate}&rem=${record.remaining}&show=true`)
                                        })
                                    }} /> :
                                    <AiOutlineEdit className='cursor-pointer text-gray-400' onClick={() => {
                                        startTransition(() => {
                                            router.push(`/records/${record.id}?batch=${batchId}&batchDate=${batchDate}&rem=${record.remaining}`)
                                        })
                                    }} />
                                }

                            </td>
                        </tr>)
                    }
                </tbody>
            </table>
            <div className='bg-white w-full flex justify-center py-1'>
                {loading && <Spinner className=' text-lg animate-spin' />}
            </div>
            <div className='bg-white w-full flex justify-center py-1'>
                {isPending && <Spinner className=' text-lg animate-spin' />}
            </div>
            {error &&
                <div className='bg-white w-full py-2'>
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative flex justify-center" role="alert">
                        <strong className="font-bold mr-1">Error! </strong>
                        <span className="block sm:inline">{error}</span>
                        <span className="absolute top-0 bottom-0 right-0 px-4 py-3 cursor-pointer text-lg font-bold" onClick={() => setError('')}>
                            <Close />
                        </span>
                    </div>
                </div>
            }
            <RecordInput
                max={remaining}
                addData={addRecordData}
                batchId={batchId}
                fetchData={fetchData}
                setLoading={(state) => setLoading(state)}
                getError={(error) => setError(error)}
            />
        </>
    )
}

export default RecordsTable