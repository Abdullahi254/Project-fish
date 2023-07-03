'use client';
import React, { useEffect, useState, useRef, useTransition } from 'react'
import { MdAdd, } from 'react-icons/md'
import { useRouter } from 'next/navigation';
import { AiOutlineLoading3Quarters as Spinner, AiFillCloseCircle as Close } from "react-icons/ai"
import { Sold } from '@prisma/client';

type Props = {
    addData: (
        recordId: number,
        quantity: number,
        batchId: number
    ) => Promise<void>
    recordId: number
    batchId: number
    soldList: Sold[]
    accSold: number
}

const SoldInput = ({ addData, recordId, batchId, soldList, accSold }: Props) => {
    const [showForm, setShowForm] = useState<boolean>(false)

    const [weightSwitch, setWeightSwitch] = useState<boolean>(false)
    const [disableButton, setDisableButton] = useState<boolean>(true)
    const [isPending, startTransition] = useTransition()
    const [error, setError] = useState<string>('')
    const [maxSold, setMaxSold] = useState<number>(0)


    const weigtRef = useRef<HTMLInputElement>(null)

    const router = useRouter()

    const handleAddButton = () => {
        setShowForm(prev => !prev)
    }

    const handleWeightChange = () => {
        if (weigtRef.current?.value && weigtRef.current?.value.length > 0) {
            setWeightSwitch(true)
        } else {
            setWeightSwitch(false)
        }
    }
    async function createSold(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        try {
            startTransition(() => {
                const weigt = weigtRef.current?.value
                if (weigt) {
                    addData(recordId, Number(weigt), batchId)
                    router.refresh()
                    setShowForm(prev => !prev)

                    weigtRef.current.value = ''
                }
                else {
                    throw new Error("Error adding new Client")
                }
            })
        } catch (er: any) {
            setError(er.message)
            setShowForm(prev => !prev)
            if (weigtRef.current?.value) {
                weigtRef.current.value = ''
            }
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
    useEffect(()=>{
        const filtedSoldList = soldList.map(data=>data.quantity)
        const total = filtedSoldList.reduce((acc, curr)=> acc + curr)
        setMaxSold(accSold - total)
    },[soldList, accSold])
    return (
        <>
            {error &&
                <div className='bg-white w-full py-2'>
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative flex justify-center items-center" role="alert">
                        <strong className="font-bold mr-1 text-sm">Error! </strong>
                        <span className="block sm:inline text-sm">{error}</span>
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
                    <form className="w-full max-w-[600px] mx-auto  py-2 flex-wrap px-2" onSubmit={(e) => createSold(e)}>
                        <div className="flex items-center  border-b border-gray-500 py-2">
                            <input name='amount' disabled={isPending} className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none" min="1" step={'.01'} ref={weigtRef} type='number' placeholder="Weight Sold(KG)" onChange={handleWeightChange} max={maxSold}/>
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

export default SoldInput