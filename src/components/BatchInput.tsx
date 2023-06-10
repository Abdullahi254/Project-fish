'use client';
import React, { useEffect, useState, useRef } from 'react'
import { MdAdd, } from 'react-icons/md'
import { Batch } from '../app/actions';

type Props = {
    addData: ({ date, type, price }: Batch) => Promise<void>
}

const BatchInput = ({ addData }: Props) => {
    const [showForm, setShowForm] = useState<boolean>(false)
    const [dateSwitch, setDateSwitch] = useState<boolean>(false)
    const [typeSwitch, setTypeSwitch] = useState<boolean>(false)
    const [priceSwitch, setPriceSwitch] = useState<boolean>(false)
    const [disableButton, setDisableButton] = useState<boolean>(true)

    const dateRef = useRef<HTMLInputElement>(null)
    const fishTypetRef = useRef<HTMLInputElement>(null)
    const priceRef = useRef<HTMLInputElement>(null)

    const handleAddButton = () => {
        setShowForm(prev => !prev)
    }
    const handleDateChange = () => {
        if (dateRef.current?.value && dateRef.current?.value.length > 1) {
            setDateSwitch(true)
        } else {
            setDateSwitch(false)
        }
    }
    const handleTypeChange = () => {
        if (fishTypetRef.current?.value && fishTypetRef.current?.value.length > 1) {
            setTypeSwitch(true)
        } else {
            setTypeSwitch(false)
        }
    }
    const handlePriceChange = () => {
        if (priceRef.current?.value && priceRef.current?.value.length > 1) {
            setPriceSwitch(true)
        } else {
            setPriceSwitch(false)
        }
    }
    async function createBatch(data: FormData) {
        console.log("adding...")
        const date = data.get("date")?.valueOf()
        const type = data.get("type")?.valueOf()
        const price = data.get("price")?.valueOf()
        if (typeof (date) !== undefined && typeof (type) !== undefined && typeof (price) !== undefined) {
            addData({
                date: new Date(data.get("date")?.valueOf() as string),
                type: data.get("type")?.valueOf() as string,
                price: Number(data.get("price")?.valueOf()) as number
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
        if (dateSwitch && typeSwitch && priceSwitch) {
            setDisableButton(false)
        }
        else {
            setDisableButton(true)
        }
    }, [dateSwitch, typeSwitch, priceSwitch])
    return (
        <>
            {
                !showForm ? <div className='w-full py-2 flex justify-around'>
                    <MdAdd className='text-3xl cursor-pointer text-gray-600' onClick={(e) => {
                        e.preventDefault()
                        handleAddButton()
                    }} />
                </div> :
                    <form className="w-full max-w-[600px] mx-auto  py-2 flex-wrap" action={createBatch}>
                        <div className="flex items-center  border-b border-gray-500 py-2">
                            <input name='date' className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1  leading-tight focus:outline-none" ref={dateRef} type="date" onChange={handleDateChange} />
                            <input name='type' className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none" ref={fishTypetRef} placeholder="Fish Type" onChange={handleTypeChange} />
                            <input name='price' className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none" min="1" ref={priceRef} type='number' placeholder="Price/Kilo(KSH)" onChange={handlePriceChange} />
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

export default BatchInput