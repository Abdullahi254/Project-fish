'use client';
import React, { useEffect, useState, useRef, useTransition } from 'react'
import { MdAdd, } from 'react-icons/md'
import { usePathname, useRouter } from 'next/navigation';
import { AiOutlineLoading3Quarters as Spinner, AiFillCloseCircle as Close } from "react-icons/ai"
import { Sold } from '@prisma/client';

type Props = {
    addData: (
        recordId: number,
        quantity: number,
        batchId: number,
    ) => Promise<void>
    recordId: number
    batchId: number
    soldList: Sold[]
    remaining: number
    batchDate: string | string[] | undefined
    show: string | string[]
}

const SoldInput = ({ addData, recordId, batchId, soldList, remaining, batchDate, show }: Props) => {
    const [showForm, setShowForm] = useState<boolean>(false)

    const [weightSwitch, setWeightSwitch] = useState<boolean>(false)
    const [disableButton, setDisableButton] = useState<boolean>(true)
    const [isPending, startTransition] = useTransition()
    const [error, setError] = useState<string>('')
    const [rem, setRemaining] = useState<number>(0)


    const weigtRef = useRef<HTMLInputElement>(null)

    const router = useRouter()
    const pathName = usePathname()
    const handleCancel = () => {
        setShowForm(false)
        if (weigtRef.current?.value) {
            weigtRef.current.value = ''
        }
        setDisableButton(true)
        setWeightSwitch(false)
    }

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
        console.log("papap")
        try {
            startTransition(() => {
                const weigt = weigtRef.current?.value
                if (weigt) {
                    addData(recordId, Number(weigt), batchId)
                    router.replace(`${pathName}?batch=${batchId}&batchDate=${batchDate}&rem=${(rem-Number(weigt)).toFixed(2)}&show=${show}`)
                    setShowForm(prev => !prev)
                    weigtRef.current.value = ''
                    handleCancel()
                }
                else {
                    throw new Error("Error adding new Client")
                }
            })
        } catch (er: any) {
            setError(er.message)
            setShowForm(prev => !prev)
            handleCancel()
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
    useEffect(() => {
        setRemaining(remaining)
    }, [remaining, rem])
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
                            <input name='amount' disabled={isPending} className="text-xs md:text-sm appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none" min="1" step={'.01'} ref={weigtRef} type='number' placeholder="Weight Sold(KG)" onChange={handleWeightChange} max={rem} />
                            <button className=" uppercase border-transparent disabled:bg-gray-300  flex-shrink-0 bg-gray-900 border-gray-500 text-xs md:text-sm text-white py-1 px-2 rounded" type="submit" disabled={isPending || disableButton || (rem < 1)}>
                                Add
                            </button>
                            <button className="flex-shrink-0 border-transparent border-2 text-red-400 hover:text-red-700 text-xs md:text-sm py-1 px-2 rounded" type="button" disabled={isPending} onClick={handleCancel}>
                                Cancel
                            </button>
                        </div>
                    </form>

            }
        </>


    )
}

export default SoldInput