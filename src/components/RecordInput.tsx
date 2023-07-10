'use client';
import React, { useEffect, useState, useRef, useTransition } from 'react'
import { MdAdd, } from 'react-icons/md'
import { useRouter } from 'next/navigation';
import { Record } from '@prisma/client';

type Props = {
    addData: (
        { weight,
            batchId
        }:
            {
                weight: number
                batchId: number
            }) => Promise<void>
    updateLastRecordWeight: (weight: number, batchId: number) => Promise<void>
    batchId: number,
    fetchData: () => Promise<void>,
    setLoading: (state: boolean) => void,
    getError: (error: string) => void
    max: number | undefined
    records: Record[]
}

const RecordInput = ({ addData, batchId, fetchData, setLoading, getError, max, records, updateLastRecordWeight }: Props) => {
    const [showForm, setShowForm] = useState<boolean>(false)
    const [weightSwitch, setWeightSwitch] = useState<boolean>(false)
    const [disableButton, setDisableButton] = useState<boolean>(true)
    const [isWaterLoss, setIsWaterLoss] = useState<string>('')
    const [options, set2Options] = useState<boolean>(false)

    const [isPending, startTransition] = useTransition()

    const router = useRouter()

    const weightRef = useRef<HTMLInputElement>(null)
    const typeRef = useRef<HTMLSelectElement>(null)

    const handleAddButton = () => {
        setShowForm(prev => !prev)
    }

    const handleCancel = () => {
        setShowForm(false)
        if (weightRef.current?.value) {
            weightRef.current.value = ''
        }
        setDisableButton(true)
        setWeightSwitch(false)
        setIsWaterLoss('')
    }
    const handleWeightChange = () => {
        if (weightRef.current?.value) {
            setWeightSwitch(true)
        } else {
            setWeightSwitch(false)
        }
    }
    const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        if (weightRef.current?.value) {
            weightRef.current.value = ''
        }
        setWeightSwitch(false)
        setDisableButton(true)
        if (e.target.value === 'loss') {
            setIsWaterLoss('loss')
        } else if (e.target.value === 'new') {
            setIsWaterLoss('new')
        } else {
            setIsWaterLoss('')
        }
    }
    async function createRecord(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        startTransition(async () => {
            try {
                setWeightSwitch(false)
                if (isWaterLoss === 'loss' && weightRef.current?.value) {
                    await addData({
                        weight: Number(weightRef.current.value),
                        batchId
                    })
                    handleCancel()
                    fetchData()
                    router.refresh()
                } else if (isWaterLoss === 'new' && weightRef.current?.value) {
                    await updateLastRecordWeight(Number(weightRef.current.value), batchId)
                    handleCancel()
                    fetchData()
                    router.refresh()
                } else {
                    handleCancel()
                    getError('Error creating new Record')
                }
            } catch (er: any) {
                handleCancel()
                getError(er.message)
            }
        })
    }
    useEffect(() => {
        if (weightSwitch && (isWaterLoss === 'loss' || isWaterLoss === 'new')) {
            setDisableButton(false)
        }
        else {
            setDisableButton(true)
        }
    }, [weightSwitch, isWaterLoss])
    useEffect(() => {
        if (records.length < 1) {
            set2Options(false)
        } else {
            set2Options(true)
        }
    }, [records])
    useEffect(() => {
        setLoading(isPending)
    }, [isPending, setLoading])
    return (
        <>
            {
                !showForm ? <div className='w-full py-2 flex justify-around'>
                    <MdAdd className='text-2xl cursor-pointer text-gray-600' onClick={(e) => {
                        e.preventDefault()
                        handleAddButton()
                    }} />
                </div> :
                    <form className="w-full max-w-[600px] mx-auto px-6  py-2 flex-wrap" onSubmit={(e) => createRecord(e)}>
                        <div className="flex items-center  border-b border-gray-500 py-2">
                            <select name='type' disabled={isPending} className="bg-gray-200 border border-gray-300 text-gray-900 text-xs md:text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full py-2 px-1 cursor-pointer" ref={typeRef} onChange={(e) => handleTypeChange(e)}>
                                <option >Choose</option>
                                <option value="new">Add Weight</option>
                                {options && <option value="loss">Water-loss Measurement</option>}
                            </select>
                            <input name='weight' className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none" ref={weightRef} type='number' min="1" max={isWaterLoss === 'loss' ? max : undefined} disabled={isPending} step={0.01} placeholder="Weight(Kg)" onChange={handleWeightChange} />
                            <button className=" uppercase border-transparent disabled:bg-gray-300  flex-shrink-0 bg-gray-900 border-gray-500 text-xs md:text-sm  text-white py-1 px-2 rounded" type="submit" disabled={disableButton || (isWaterLoss === 'loss' && max as number < 1 ? true : false || isPending)}>
                                Add
                            </button>
                            <button className="flex-shrink-0 border-transparent border-2 text-red-400 hover:text-red-700 text-xs md:text-sm py-1 px-2 rounded" type="button" onClick={handleCancel} disabled={isPending}>
                                Cancel
                            </button>
                        </div>
                    </form>

            }
        </>


    )
}

export default RecordInput