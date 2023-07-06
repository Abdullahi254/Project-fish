'use client';
import React, { useEffect, useState, useRef } from 'react'
import { MdAdd, } from 'react-icons/md'
import { Batch } from '../app/actions';
import { useRouter } from 'next/navigation';
import { AiOutlineLoading3Quarters as Spinner, AiFillCloseCircle as Close } from "react-icons/ai"

type Props = {
    addData: ({ date, type, price }: Batch) => Promise<void>
}

const BatchInput = ({ addData }: Props) => {
    const [showForm, setShowForm] = useState<boolean>(false)
    const [dateSwitch, setDateSwitch] = useState<boolean>(false)
    const [typeSwitch, setTypeSwitch] = useState<boolean>(false)
    const [priceSwitch, setPriceSwitch] = useState<boolean>(false)
    const [disableButton, setDisableButton] = useState<boolean>(true)
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string>('')

    const dateRef = useRef<HTMLInputElement>(null)
    const fishTypetRef = useRef<HTMLInputElement>(null)
    const priceRef = useRef<HTMLInputElement>(null)

    const router = useRouter()

    const handleCancel = () => {
        setShowForm(false)
        if (dateRef.current?.value) {
            dateRef.current.value = ''
        }
        if (fishTypetRef.current?.value) {
            fishTypetRef.current.value = ''
        }
        if (priceRef.current?.value) {
            priceRef.current.value = ''
        }
        setDisableButton(true)
        setDateSwitch(false)
        setTypeSwitch(false)
        setPriceSwitch(false)
    }
    const handleAddButton = () => {
        setShowForm(prev => !prev)
    }
    const handleDateChange = () => {
        if (dateRef.current?.value) {
            console.log(dateRef.current.value)
            setDateSwitch(true)
        } else {
            setDateSwitch(false)
        }
    }
    const handleTypeChange = () => {
        if (fishTypetRef.current?.value && fishTypetRef.current?.value.length > 1) {
            console.log(fishTypetRef.current.value)
            setTypeSwitch(true)
        } else {
            setTypeSwitch(false)
        }
    }
    const handlePriceChange = () => {
        if (priceRef.current?.value) {
            console.log(priceRef.current.value)
            setPriceSwitch(true)
        } else {
            setPriceSwitch(false)
        }
    }
    async function createBatch(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        try {
            setLoading(true)
            const date = dateRef.current?.value
            const type = fishTypetRef.current?.value
            const price = priceRef.current?.value
            if (typeof (date) !== undefined && typeof (type) !== undefined && typeof (price) !== undefined) {
                await addData({
                    date: new Date(date as string),
                    type: type as string,
                    price: Number(price as string)
                })
                setLoading(false)
                setShowForm(prev => !prev)
                handleCancel()
                router.refresh()
            }
            else {
                throw new Error("Error creating batch data")
            }
        } catch (er: any) {
            setError(er.message)
            setLoading(false)
            setShowForm(prev => !prev)
            handleCancel()
            router.refresh()
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
            {loading && <div className='w-full py-2 flex justify-center'>
                <Spinner className='animate-spin text-lg' />
            </div>
            }
            {
                !showForm ? <div className='w-full py-2 flex justify-around'>
                    <MdAdd className='text-3xl cursor-pointer text-gray-600' onClick={(e) => {
                        e.preventDefault()
                        handleAddButton()
                    }} />
                </div> :
                    <form className="w-full max-w-[600px] mx-auto  py-4 flex-wrap mt-2" onSubmit={(e) => createBatch(e)}>
                        <div className="flex flex-col space-y-2 px-2 md:px-0 md:flex-row md:items-center  border-b border-gray-500 py-2">
                            <div className='flex items-center border-b-2 md:border-none'>
                                <label className='text-xs md:hidden px-2 text-gray-400'>Date:</label>
                                <input name='date' disabled={loading} className="text-xs md:text-sm appearance-none bg-transparent w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none" ref={dateRef} type="date" onChange={handleDateChange} />
                            </div>
                            <input name='type' disabled={loading} className=" text-xs md:text-sm appearance-none bg-transparent border-b-2 md:border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none" ref={fishTypetRef} placeholder="Fish Type" onChange={handleTypeChange} />
                            <input name='price' disabled={loading} className=" text-xs md:text-sm appearance-none bg-transparent border-b-2 md:border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none" min="1" ref={priceRef} type='number' placeholder="Price/Kilo(KSH)" onChange={handlePriceChange} step={0.01} />
                            <button className="uppercase border-transparent disabled:bg-gray-300  flex-shrink-0 bg-gray-900 border-gray-500  text-xs md:text-sm  text-white py-1 px-2 rounded" type="submit" disabled={loading || disableButton}>
                                Add
                            </button>
                            <button className="flex-shrink-0 border-transparent border-2 text-red-400 hover:text-red-700 text-xs md:text-sm py-1 px-2 rounded" type="button" onClick={handleCancel}>
                                Cancel
                            </button>
                        </div>
                    </form>

            }
        </>


    )
}

export default BatchInput