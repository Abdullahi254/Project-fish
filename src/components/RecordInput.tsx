'use client';
import React, { useEffect, useState, useRef } from 'react'
import { MdAdd, } from 'react-icons/md'

type Props = {
    addData: (
        { weight,
            sold,
            batchId
        }:
            {
                weight: number
                sold: number
                batchId: number
            }) => Promise<void>
    batchId: number
}

const RecordInput = ({ addData, batchId }: Props) => {
    const [showForm, setShowForm] = useState<boolean>(false)
    const [soldSwitch, setSoldSwitch] = useState<boolean>(false)
    const [weightSwitch, setWeightSwitch] = useState<boolean>(false)
    const [disableButton, setDisableButton] = useState<boolean>(true)

    const soldRef = useRef<HTMLInputElement>(null)
    const weightRef = useRef<HTMLInputElement>(null)

    const handleAddButton = () => {
        setShowForm(prev => !prev)
    }
    const handleSoldChange = () => {
        if (soldRef.current?.value && soldRef.current?.value.length > 1) {
            setSoldSwitch(true)
        } else {
            setSoldSwitch(false)
        }
    }
    const handleWeightChange = () => {
        if (weightRef.current?.value && weightRef.current?.value.length > 1) {
            setWeightSwitch(true)
        } else {
            setWeightSwitch(false)
        }
    }
    async function createRecord(data: FormData) {
        console.log("adding...")
        const weight = data.get("weight")?.valueOf()
        const sold = data.get("sold")?.valueOf()
        if (typeof (weight) !== undefined && typeof (sold) !== undefined) {
            addData({
                weight: Number(data.get("weight")?.valueOf()) as number,
                sold: Number(data.get("sold")?.valueOf()) as number,
                batchId: batchId
            }).then(() => {
                console.log("added data successfully")
                setShowForm(prev => !prev)
            }).catch(er => {
                console.log("error adding data")
                setShowForm(prev => !prev)
            })
        }

    }
    useEffect(() => {
        if (soldSwitch && weightSwitch) {
            setDisableButton(false)
        }
        else {
            setDisableButton(true)
        }
    }, [soldSwitch, weightSwitch])
    return (
        <>
            {
                !showForm ? <div className='w-full py-2 flex justify-around'>
                    <MdAdd className='text-2xl cursor-pointer text-gray-600' onClick={(e) => {
                        e.preventDefault()
                        handleAddButton()
                    }} />
                </div> :
                    <form className="w-full max-w-[600px] mx-auto  py-2 flex-wrap" action={createRecord}>
                        <div className="flex items-center  border-b border-gray-500 py-2">
                            <input name='weight' className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none" ref={weightRef} type='number' min="1" placeholder="New Weight" onChange={handleWeightChange} />
                            <input name='sold' className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none" ref={soldRef} type='number' min="1" max={weightRef.current?.value} placeholder='Sold Weight' onChange={handleSoldChange} />
                            <button className=" uppercase border-transparent disabled:bg-gray-300  flex-shrink-0 bg-gray-900 border-gray-500  text-sm  text-white py-1 px-2 rounded" type="submit" disabled={disableButton}>
                                Add
                            </button>
                            <button className="flex-shrink-0 border-transparent border-2 text-red-400 hover:text-red-700 text-sm py-1 px-2 rounded" type="button" onClick={handleAddButton}>
                                Cancel
                            </button>
                        </div>
                    </form>

            }
        </>


    )
}

export default RecordInput