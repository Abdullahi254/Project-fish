'use client';
import React, { useEffect, useState, useRef } from 'react'
import { MdAdd, } from 'react-icons/md'
import { useRouter } from 'next/navigation';
import { AiOutlineLoading3Quarters as Spinner, AiFillCloseCircle as Close } from "react-icons/ai"

type Props = {
    addData: ({ debit, credit }: {
        id: number
        debit?: number
        credit?: number
    }) => Promise<void>
    id: number
}

const TransactionInput = ({ addData, id }: Props) => {
    const [showForm, setShowForm] = useState<boolean>(false)
    const [typeSwitch, setTypeSwitch] = useState<boolean>(false)
    const [priceSwitch, setPriceSwitch] = useState<boolean>(false)
    const [disableButton, setDisableButton] = useState<boolean>(true)
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string>('')

    const typeRef = useRef<HTMLSelectElement>(null)
    const priceRef = useRef<HTMLInputElement>(null)

    const router = useRouter()

    const handleAddButton = () => {
        setShowForm(prev => !prev)
    }
    const handleTypeChange = () => {
        if (typeRef.current?.value) {
            if (typeRef.current.value === 'debit' || typeRef.current.value === 'credit') {
                setTypeSwitch(true)
            }
            else{
                setTypeSwitch(false)
            }
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
    async function createBatch(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        try {
            setLoading(true)
            const type = typeRef.current?.value
            const price = priceRef.current?.value
            if (type && price) {
                await addData({
                    id: id,
                    debit: type === 'debit' ? Number(price) : undefined,
                    credit: type === 'credit' ? Number(price) : undefined
                })
                setLoading(false)
                setShowForm(prev => !prev)
                router.refresh()
                typeRef.current.value = ''
                priceRef.current.value = ''
            }
            else {
                throw new Error("Error creating batch data")
            }
        } catch (er: any) {
            setError(er.message)
            setLoading(false)
            setShowForm(prev => !prev)
            if (typeRef.current?.value && priceRef.current?.value) {
                typeRef.current.value = ''
                priceRef.current.value = ''
            }
        }
    }
    useEffect(() => {
        if (typeSwitch && priceSwitch) {
            setDisableButton(false)
        }
        else {
            setDisableButton(true)
        }
    }, [typeSwitch, priceSwitch])
    return (
        <>
            {error &&
                <div className='bg-white w-full py-2'>
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative flex justify-center text-sm" role="alert">
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
                    <form className="w-full max-w-[600px] mx-auto  py-2 flex-wrap" onSubmit={(e) => createBatch(e)}>
                        <div className="flex items-center  border-b border-gray-500 py-2">
                            <select name='type' disabled={loading} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full py-2 px-1 cursor-pointer" ref={typeRef} onChange={handleTypeChange}>
                                <option >Choose Transaction</option>
                                <option value="debit">Debit</option>
                                <option value="credit">Credit</option>
                            </select>
                            <input name='price' disabled={loading} className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none" min="1" ref={priceRef} type='number' placeholder="Amount(KSH)" onChange={handlePriceChange} step={0.01} />
                            <button className=" uppercase border-transparent disabled:bg-gray-300  flex-shrink-0 bg-gray-900 border-gray-500  text-sm  text-white py-1 px-2 rounded" type="submit" disabled={loading || disableButton}>
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

export default TransactionInput