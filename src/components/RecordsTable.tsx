'use client'

import RecordInput from './RecordInput'
import { addRecordData, fetchRecords, updateRecord } from '@/app/actions'
import { AsyncReturnType } from "../../typing"
import React, { useEffect, useState, useRef } from 'react'
import { AiOutlineEdit } from "react-icons/ai"
import { FcCancel } from "react-icons/fc"
import { TiTickOutline as TiTick } from "react-icons/ti"
import { AiOutlineLoading3Quarters as Spinner, AiFillCloseCircle as Close  } from "react-icons/ai"
import {IoIosClose as Exit} from "react-icons/io"


type Props = {
    batchId: number
}

const RecordsTable = ({ batchId }: Props) => {
    const [records, setRecords] = useState<AsyncReturnType<typeof fetchRecords>>([])
    const [activateInput, setActivateInput] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string>('')
    const soldRef = useRef<HTMLInputElement>(null)

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
            setActivateInput(false)
            setRecords([])
        }
    }, [fetchData])

    const editButtonHandler = () => {
        setActivateInput(true)
    }
    const updateRecordHandler = async (id: number, e: React.FormEvent<HTMLFormElement>, batchId: number) => {
        try {
            e.preventDefault()
            setLoading(true)
            const sold = soldRef.current?.value
            if (typeof (sold) !== undefined) {
                await updateRecord(id, Number(sold,), batchId)
                await fetchData()
                setActivateInput(false)
                setLoading(false)
            }
        } catch (er: any) {
            console.log("error updating record", er.message)
            setLoading(false)
            setError(er.message)
        }
    }
    return (
        <>
            <table className="w-full text-sm text-left text-gray-500 mb-2 border-x-2">
                <thead className='text-xs text-gray-700 uppercase bg-gray-50'>
                    <tr>
                        <th scope="col" className="px-4 py-3">NO</th>
                        <th scope="col" className="px-4 py-3">Weight(kg)</th>
                        <th scope="col" className="px-4 py-3">Sold(kg)</th>
                        <th scope="col" className="px-4 py-3">Remaining(kg)</th>
                        <th scope="col" className="px-4 py-3">Water Loss(kg)</th>
                        <th scope="col" className="px-4 py-3">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        records.map((record, index) => <tr className='bg-white border-b' key={record.id}>
                            <th scope="row" className="px-4 py-4 font-medium text-gray-900 whitespace-nowrap">
                                {index+1}
                            </th>
                            <td className="px-4 py-4">{record.weight.toFixed(2)}</td>
                            {(activateInput && (records.length-1) === index) ?
                                <td>
                                    <form id='my-form' onSubmit={(e) => updateRecordHandler(record.id, e, batchId)}>
                                        <input type="number" name='sold' autoFocus min={1} max={record.weight}
                                            placeholder={`${record.weightSold}(kg)`} size={5} ref={soldRef} step={0.01}
                                            className={`border-b-2 outline-none border-black text-gray-900 text-sm  block p-4`}
                                        />
                                    </form>

                                </td> :
                                <td className="px-4 py-4">{record.weightSold.toFixed(2)}</td>
                            }
                            <td className="px-4 py-4">{record.remaining.toFixed(2)}</td>

                            <td className="px-4 py-4">{record.waterLoss.toFixed(2)}</td>
                            <td className="px-4 py-4">
                                {(records.length - 1) === index ? <>
                                    {
                                        !activateInput ?
                                            <AiOutlineEdit className='cursor-pointer text-green-600' onClick={editButtonHandler} /> :
                                            <div className='flex items-center w-full justify-evenly'>
                                                <button form='my-form'><TiTick className='cursor-pointer text-green-600 text-lg' /></button>
                                                <button onClick={()=>setActivateInput(false)}><Exit className='cursor-pointer text-red-600 text-[24px]' /></button>
                                            </div>    
                                    }
                                </> :
                                    <FcCancel />}
                            </td>
                        </tr>)
                    }
                </tbody>
            </table>
            <div className='bg-white w-full flex justify-center py-1'>
                {loading && <Spinner className=' text-lg animate-spin' />}
            </div>
            {error &&
                <div className='bg-white w-full py-2'>
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative flex justify-center" role="alert">
                        <strong className="font-bold mr-1">Error! </strong>
                        <span className="block sm:inline">{error}</span>
                        <span className="absolute top-0 bottom-0 right-0 px-4 py-3 cursor-pointer text-lg font-bold" onClick={() => setError('')}>
                            <Close/>
                        </span>
                    </div>
                </div>
            }
            <RecordInput
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