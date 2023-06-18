'use client'

import RecordInput from './RecordInput'
import { addRecordData, fetchRecords, updateRecord } from '@/app/actions'
import { AsyncReturnType } from "../../typing"
import React, { useEffect, useState, useRef } from 'react'
import { AiOutlineEdit } from "react-icons/ai"
import { FcCancel } from "react-icons/fc"
import { TiTickOutline as TiTick } from "react-icons/ti"
import { AiOutlineLoading3Quarters as Spinner } from "react-icons/ai"


type Props = {
    batchId: number
}

const RecordsTable = ({ batchId }: Props) => {
    const [records, setRecords] = useState<AsyncReturnType<typeof fetchRecords>>([])
    const [activateInput, setActivateInput] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)
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
        }
    }, [batchId])
    useEffect(() => {

        fetchData()
        return setRecords([])
    }, [fetchData])

    const editButtonHandler = () => {
        setActivateInput(true)
    }
    const updateRecordHandler = async (id: number, data: FormData, batchId: number) => {
        try {
            const sold = data.get("sold")?.valueOf()
            if (typeof (sold) !== undefined) {
                console.log("loading", loading)
                await updateRecord(id, Number(sold,), batchId)
                setActivateInput(false)
                await fetchData()
                setLoading(false)
            }
        } catch (er: any) {
            console.log("error updating record", er.message)
            setLoading(false)
        }
    }
    return (
        <>
            <table className="w-full text-sm text-left text-gray-500 mb-2 border-x-2">
                <thead className='text-xs text-gray-700 uppercase bg-gray-50'>
                    <tr>
                        <th scope="col" className="px-4 py-3">Id</th>
                        <th scope="col" className="px-4 py-3">Weight(kg)</th>
                        <th scope="col" className="px-4 py-3">Sold(kg)</th>
                        <th scope="col" className="px-4 py-3">Remaining(kg)</th>
                        <th scope="col" className="px-4 py-3">Water Loss(kg)</th>
                        <th scope="col" className="px-4 py-3">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        records.map(record => <tr className='bg-white border-b' key={record.id}>
                            <th scope="row" className="px-4 py-4 font-medium text-gray-900 whitespace-nowrap">
                                {record.id}
                            </th>
                            <td className="px-4 py-4">{record.weight}</td>
                            {(activateInput && records.length === record.id) ?
                                <td>
                                    <form id='my-form' action={(data: FormData) => updateRecordHandler(record.id, data, batchId)}>
                                        <input type="number" name='sold' autoFocus min={0} max={record.weight}
                                            placeholder={`${record.weightSold}(kg)`} size={5} ref={soldRef} onBlur={() => {
                                                setTimeout(() => {
                                                    setActivateInput(false)
                                                }, 100)
                                            }}
                                            className={`border-b-2 outline-none border-black text-gray-900 text-sm  block p-4`}
                                        />
                                    </form>

                                </td> :
                                <td className="px-4 py-4">{record.weightSold}</td>
                            }
                            <td className="px-4 py-4">{record.remaining}</td>

                            <td className="px-4 py-4">{record.waterLoss}</td>
                            <td className="px-4 py-4">
                                {records.length === record.id ? <>
                                    {
                                        !activateInput ?
                                            <AiOutlineEdit className='cursor-pointer text-green-600' onClick={editButtonHandler} /> :
                                            <button form='my-form' onClick={() => setLoading(true)}><TiTick className='cursor-pointer text-green-600' /></button>
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
            <RecordInput addData={addRecordData} batchId={batchId} fetchData={fetchData} />
        </>
    )
}

export default RecordsTable