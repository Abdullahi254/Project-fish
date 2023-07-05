'use client';
import React, { useEffect, useState, useRef, useTransition } from 'react'
import { MdAdd, } from 'react-icons/md'
import { useRouter } from 'next/navigation';
import { AiOutlineLoading3Quarters as Spinner, AiFillCloseCircle as Close } from "react-icons/ai"

type Props = {
    id: number
    addDebit: (debit: number, id: number) => Promise<void>
    addCredit: (price: number, quantity: number, id: number) => Promise<void>
}

const TransactionInput = ({ addCredit, addDebit, id }: Props) => {
    const [showForm, setShowForm] = useState<boolean>(false)
    const [amountSwitch, setAmountSwitch] = useState<boolean>(false)
    const [priceSwitch, setPriceSwitch] = useState<boolean>(false)
    const [weightSwitch, setWeightSwitch] = useState<boolean>(false)
    const [isDebit, setIsDebit] = useState<boolean>(false)
    const [disableButton, setDisableButton] = useState<boolean>(true)
    const [isPending, startTransition] = useTransition()
    const [error, setError] = useState<string>('')

    const typeRef = useRef<HTMLSelectElement>(null)
    const amountRef = useRef<HTMLInputElement>(null)
    const quantityRef = useRef<HTMLInputElement>(null)
    const priceRef = useRef<HTMLInputElement>(null)

    const router = useRouter()

    const handleAddButton = () => {
        setShowForm(prev => !prev)
    }
    const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setDisableButton(true)
        if (amountRef.current?.value) {
            amountRef.current.value = ''
        }
        if (priceRef.current?.value) {
            priceRef.current.value = ''
        }
        if (quantityRef.current?.value) {
            quantityRef.current.value = ''
        }
        if (e.target.value === 'debit') {
            setIsDebit(true)
        } else {
            setIsDebit(false)
        }
    }
    const handleAmountChange = () => {
        if (amountRef.current?.value) {
            setAmountSwitch(true)
        } else {
            setAmountSwitch(false)
        }
    }
    const handlePriceChange = () => {
        if (priceRef.current?.value) {
            setPriceSwitch(true)
        } else {
            setPriceSwitch(false)
        }
    }
    const handleWeightChange = () => {
        if (quantityRef.current?.value) {
            setWeightSwitch(true)
        } else {
            setWeightSwitch(false)
        }
    }

    const createCredit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        try {
            startTransition(async () => {
                const type = typeRef.current?.value
                const price = priceRef.current?.value
                const quantity = quantityRef.current?.value
                if (type && price && quantity) {
                    await addCredit(Number(price), Number(quantity), id)
                    setShowForm(prev => !prev)
                    router.refresh()
                    priceRef.current.value = ''
                    quantityRef.current.value = ''
                    setDisableButton(true)
                }
                else {
                    throw new Error("Error creating Transaction data")
                }
            })
        } catch (er: any) {
            setError(er.message)
            setShowForm(prev => !prev)
            if (typeRef.current?.value && priceRef.current?.value && quantityRef.current?.value) {
                typeRef.current.value = ''
                priceRef.current.value = ''
                quantityRef.current.value = ''
            }
            setDisableButton(true)
        }
    }
    const createDebit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        try {
            startTransition(async () => {
                const type = typeRef.current?.value
                const amount = amountRef.current?.value
                if (type && amount) {
                    await addDebit(Number(amount), id)
                    setShowForm(prev => !prev)
                    router.refresh()
                    typeRef.current.value = ''
                    amountRef.current.value = ''
                }
                else {
                    throw new Error("Error creating Transaction data")
                }
            })
        } catch (er: any) {
            setError(er.message)
            setShowForm(prev => !prev)
            if (typeRef.current?.value && amountRef.current?.value) {
                typeRef.current.value = ''
                amountRef.current.value = ''
            }
        }
    }
    useEffect(() => {
        if (typeRef.current?.value === 'debit' && amountSwitch) {
            setDisableButton(false)
        }
        else {
            setDisableButton(true)
        }
    }, [amountSwitch])
    useEffect(() => {
        if (typeRef.current?.value === 'credit' && priceSwitch && weightSwitch) {
            setDisableButton(false)
        }
        else {
            setDisableButton(true)
        }
    }, [priceSwitch, weightSwitch,])
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
            {isPending && <div className='w-full py-2 flex justify-center'>
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
                    isDebit ?
                        <form className="w-full max-w-[600px] mx-auto  py-2 flex-wrap" onSubmit={(e) => createDebit(e)}>
                            <div className="flex items-center  border-b border-gray-500 py-2">
                                <select name='type' disabled={isPending} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full py-2 px-1 cursor-pointer" ref={typeRef} onChange={(e) => handleTypeChange(e)}>
                                    <option >Choose</option>
                                    <option value="debit">Debit</option>
                                    <option value="credit">Credit</option>
                                </select>
                                <input name='amount' disabled={isPending} className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none" min={1} ref={amountRef} type='number' placeholder="Amount(KSH)" onChange={handleAmountChange} step={0.01} />
                                <button className=" uppercase border-transparent disabled:bg-gray-300  flex-shrink-0 bg-gray-900 border-gray-500  text-sm  text-white py-1 px-2 rounded" type="submit" disabled={isPending || disableButton}>
                                    Add
                                </button>
                                <button className="flex-shrink-0 border-transparent border-2 text-red-400 hover:text-red-700 text-sm py-1 px-2 rounded" type="button" onClick={handleAddButton}>
                                    Cancel
                                </button>
                            </div>
                        </form> :
                        <form className="w-full max-w-[600px] mx-auto  py-2 flex-wrap" onSubmit={(e) => createCredit(e)}>
                            <div className="flex items-center  border-b border-gray-500 py-2">
                                <select name='type' disabled={isPending} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full py-2 px-1 cursor-pointer" ref={typeRef} onChange={handleTypeChange}>
                                    <option >Choose</option>
                                    <option value="debit">Debit</option>
                                    <option value="credit">Credit</option>
                                </select>
                                <input name='price' disabled={isPending} className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none" min="1" ref={priceRef} type='number' placeholder="price/kg(KSH)" onChange={handlePriceChange} step={0.01} />
                                <input name='quantity' disabled={isPending} className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none" min="1" ref={quantityRef} type='number' placeholder="Weight(KG)" onChange={handleWeightChange} step={0.01} />
                                <button className=" uppercase border-transparent disabled:bg-gray-300  flex-shrink-0 bg-gray-900 border-gray-500  text-sm  text-white py-1 px-2 rounded" type="submit" disabled={isPending || disableButton}>
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