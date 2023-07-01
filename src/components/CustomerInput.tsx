'use client';
import React, { useEffect, useState, useRef } from 'react'
import { MdAdd, } from 'react-icons/md'
import { useRouter } from 'next/navigation';
import { AiOutlineLoading3Quarters as Spinner, AiFillCloseCircle as Close } from "react-icons/ai"

type Props = {
    addData: ({ first, last, phoneNumber }: {
        first: string
        last: string
        phoneNumber: string
    }) => Promise<void>
}

const CustomerInput = ({ addData }: Props) => {
    const [showForm, setShowForm] = useState<boolean>(false)

    const [nameSwitch, setNameSwitch] = useState<boolean>(false)
    const [name2Switch, setName2Switch] = useState<boolean>(false)
    const [phoneSwitch, setPhoneSwitch] = useState<boolean>(false)
    const [disableButton, setDisableButton] = useState<boolean>(true)
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string>('')

    const nameRef = useRef<HTMLInputElement>(null)
    const name2Ref = useRef<HTMLInputElement>(null)
    const phoneRef = useRef<HTMLInputElement>(null)

    const router = useRouter()

    const handleAddButton = () => {
        setShowForm(prev => !prev)
    }

    const handleNameChange = () => {
        if (nameRef.current?.value && nameRef.current?.value.length > 1) {
            setNameSwitch(true)
        } else {
            setNameSwitch(false)
        }
    }
    const handleName2Change = () => {
        if (name2Ref.current?.value && name2Ref.current?.value.length > 1) {
            setName2Switch(true)
        } else {
            setName2Switch(false)
        }
    }
    const handlePhoneChange = () => {
        if (phoneRef.current?.value && phoneRef.current?.value.length > 9) {
            setPhoneSwitch(true)
        } else {
            setPhoneSwitch(false)
        }
    }
    async function createClient(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        try {
            setLoading(true)
            const first = nameRef.current?.value
            const last = name2Ref.current?.value
            const phone = phoneRef.current?.value
            if (first && last && phone) {
                await addData({
                    first: first,
                    last: last,
                    phoneNumber: phone
                })
                router.refresh()
                setLoading(false)
                setShowForm(prev => !prev)
                nameRef.current.value = ''
                name2Ref.current.value = ''
                phoneRef.current.value = ''
            }
            else {
                throw new Error("Error adding new Client")
            }
        } catch (er: any) {
            setError(er.message)
            setLoading(false)
            setShowForm(prev => !prev)
            if (nameRef.current?.value && name2Ref.current?.value && phoneRef.current?.value) {
                nameRef.current.value = ''
                name2Ref.current.value = ''
                phoneRef.current.value = ''
            }
        }
    }
    useEffect(() => {
        if (nameSwitch && name2Switch && phoneSwitch) {
            setDisableButton(false)
        }
        else {
            setDisableButton(true)
        }
    }, [nameSwitch, name2Switch, phoneSwitch])
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
                    <form className="w-full max-w-[600px] mx-auto  py-2 flex-wrap" onSubmit={(e) => createClient(e)}>
                        <div className="flex items-center  border-b border-gray-500 py-2">
                            <input name='name' disabled={loading} className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none" ref={nameRef} placeholder="First" onChange={handleNameChange} />
                            <input name='name2' disabled={loading} className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none" ref={name2Ref} placeholder="Last" onChange={handleName2Change} />
                            <input name='phone' disabled={loading} className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none" min="1" ref={phoneRef} type='number' placeholder="Phone" onChange={handlePhoneChange} />
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

export default CustomerInput