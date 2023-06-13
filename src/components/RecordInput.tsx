'use client';
import React, { useEffect, useState, useRef } from 'react'
import { MdAdd, } from 'react-icons/md'

type Props = {
    addData: (
        { weight,
            batchId
        }:
            {
                weight: number
                batchId: number
            }) => Promise<void>
    batchId: number,
    fetchData: () => Promise<void>
}

const RecordInput = ({ addData, batchId, fetchData }: Props) => {
    const [showForm, setShowForm] = useState<boolean>(false)
    const [weightSwitch, setWeightSwitch] = useState<boolean>(false)
    const [disableButton, setDisableButton] = useState<boolean>(true)


    const weightRef = useRef<HTMLInputElement>(null)

    const handleAddButton = () => {
        setShowForm(prev => !prev)
    }
    const handleWeightChange = () => {
        if (weightRef.current?.value && weightRef.current?.value.length >= 0) {
            setWeightSwitch(true)
        } else {
            setWeightSwitch(false)
        }
    }
    async function createRecord(data: FormData) {
        console.log("adding...")
        const weight = data.get("weight")?.valueOf()
        if (typeof (weight) !== undefined) {
            addData({
                weight: Number(data.get("weight")?.valueOf()) as number,
                batchId: batchId
            }).then(() => {
                console.log("added data successfully")
                fetchData()
                setWeightSwitch(false)
                setShowForm(prev => !prev)
            }).catch(er => {
                console.log("error adding data", er.message)
                setWeightSwitch(false)
            })
        }

    }
    useEffect(() => {
        if (weightSwitch) {
            setDisableButton(false)
        }
        else {
            setDisableButton(true)
        }
    }, [weightSwitch])
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
                            <input name='weight' autoFocus className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none" ref={weightRef} type='number' min="1" placeholder="New Weight(Kg)" onChange={handleWeightChange} />
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