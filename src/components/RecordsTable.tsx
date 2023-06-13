'use client'

import RecordInput from './RecordInput'
import { addRecordData, fetchRecords } from '@/app/actions'
import { AsyncReturnType } from "../../typing"
import React, { useEffect, useState } from 'react'
import { AiOutlineEdit } from "react-icons/ai"
import { FcCancel } from "react-icons/fc"
import { TiTickOutline as TiTick } from "react-icons/ti"


type Props = {
    batchId: number
}

const RecordsTable = ({ batchId }: Props) => {
    const [records, setRecords] = useState<AsyncReturnType<typeof fetchRecords>>([])
    const [activateInput, setActivateInput] = useState<boolean>(false)

    const fetchData = React.useCallback(async () => {
        try {
            const records = await fetchRecords(batchId)
            setRecords(records)
        } catch (er: any) {
            console.log(er.message)
        }
    }, [batchId])
    useEffect(() => {

        fetchData()
        return setRecords([])
    }, [fetchData])

    const handleSoldInput = () => {
        setActivateInput(true)
    }
    const updateRecord = (id: number) => {
        setActivateInput(false)
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
                                <input type="number" autoFocus min={0} max={record.weight} placeholder="Sold(kg)" size={5}
                                    className={`border-b-2 outline-none border-black text-gray-900 text-sm  block p-4`}
                                /> :
                                <td className="px-4 py-4">{record.weightSold}</td>
                            }
                            <td className="px-4 py-4">{record.remaining}</td>

                            <td className="px-4 py-4">{record.waterLoss}</td>
                            <td className="px-4 py-4">
                                {records.length === record.id ? <>
                                    {
                                        !activateInput ?
                                            <AiOutlineEdit className='cursor-pointer text-green-600' onClick={handleSoldInput} /> :
                                            <TiTick className='cursor-pointer text-green-600' onClick={() => updateRecord(record.id)} />
                                    }
                                </> :
                                    <FcCancel />}
                            </td>
                        </tr>)
                    }
                </tbody>
            </table>
            <RecordInput addData={addRecordData} batchId={batchId} fetchData={fetchData} />
        </>
    )
}

export default RecordsTable