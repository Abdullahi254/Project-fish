'use client';
import React, { useRef, useState, useEffect, useTransition, useCallback } from 'react'
import { RxReset } from "react-icons/rx"
import { useRouter } from 'next/navigation';
import { Transaction } from '@prisma/client';
import { AiOutlineLoading3Quarters as Spinner } from 'react-icons/ai'
type Props = {
    startDate: string | string[] | undefined
    endDate: string | string[] | undefined
    transactions: Transaction[]
    slug: string
    customerName: string | string[] | undefined
}

const TransactionTable = ({ startDate, endDate, transactions, slug, customerName }: Props) => {
    const [toogle, setToogle] = useState<boolean>()
    const [totalCredit, setTotalCredit] = useState<number>(0)
    const [totalDebit, setTotalDebit] = useState<number>(0)
    const [isFull, setTable] = useState<boolean>(false)
    const [date1, setDate1] = useState<Date>()
    const [date2, setDate2] = useState<Date>()
    const firstDateRef = useRef<HTMLInputElement>(null)
    const secondDateRef = useRef<HTMLInputElement>(null)

    const [isPending, startTransition] = useTransition()
    const [isPending2, startTransition2] = useTransition()

    const router = useRouter()

    const handleDateChange = () => {
        setToogle(prev => !prev)
    }

    const handleFullTable = () => {
        startTransition(() => {
            if (firstDateRef.current?.value && secondDateRef.current?.value) {
                firstDateRef.current.value = ''
                secondDateRef.current.value = ''
            }
            router.push(`/ledger/${slug}?name=${customerName}&table=full`)
            setTable(true)
        })
    }

    const handlelessTable = useCallback(() => {
        startTransition(() => {
            if (firstDateRef.current?.value && secondDateRef.current?.value) {
                firstDateRef.current.value = ''
                secondDateRef.current.value = ''
            }
            router.push(`/ledger/${slug}?name=${customerName}`)
            setTable(false)
        })
    }, [router, slug, customerName])

    const clearDateFields = () => {
        if (firstDateRef.current?.value && secondDateRef.current?.value) {
            firstDateRef.current.value = ''
            secondDateRef.current.value = ''
        }
        startTransition2(() => {
            router.push(`/ledger/${slug}?name=${customerName}`)
        })
    }

    useEffect(() => {
        const debits = transactions.map(data => data.debit)
        const credits = transactions.map(data => data.credit)
        const creditSum: number = credits.reduce((accumulator: number, currentValue) => {
            if (currentValue === null) {
                return accumulator;
            } else {
                return accumulator + currentValue;
            }
        }, 0)
        const debitSum: number = debits.reduce((accumulator: number, currentValue) => {
            if (currentValue === null) {
                return accumulator;
            } else {
                return accumulator + currentValue;
            }
        }, 0)
        setTotalCredit(creditSum)
        setTotalDebit(debitSum)
    }, [totalCredit, totalDebit, transactions])

    useEffect(() => {
        const first = firstDateRef.current?.value
        const second = secondDateRef.current?.value
        if (first && second) {
            startTransition2(() => {
                router.push(`/ledger/${slug}?name=${customerName}`)
                setTable(false)
                router.push(`/ledger/${slug}?name=${customerName}&start=${first}&end=${second}`)
            })
        }
    }, [toogle, router, slug, handlelessTable, customerName])
    useEffect(() => {
        const d1 = new Date(startDate as string)
        const d2 = new Date(endDate as string)
        setDate1(d1)
        setDate2(d2)
    }, [startDate, endDate])
    return (
        <>
            <div className='w-full mb-2 space-x-4 py-2 px-6 md:px-8 flex items-center justify-start md:justify-end'>
                <span className='text-xs md:text-sm text-gray-500'>From:</span>
                <input type='date' ref={firstDateRef} className='text-xs md:text-sm text-gray-600' onChange={handleDateChange} />
                <span className='text-xs md:text-sm text-gray-500'>To:</span>
                <input type='date' ref={secondDateRef} className='text-xs md:text-sm text-gray-600' onChange={handleDateChange} />
            </div>
            <div className='w-full mb-2 space-x-4 py-2 px-6 md:px-8 flex items-center justify-start md:justify-end'>
                <h3 className='text-xs md:text-sm font-bold uppercase'>{customerName}</h3>
            </div>
            {isPending2 &&
                <div className='w-full flex justify-center py-2'>
                    <Spinner className='animate-spin' />
                </div>
            }

            {
                (!startDate && !endDate) &&
                <div className='w-full flex justify-center py-2'>
                    {!isFull ? <h3 className='text-xs md:text-sm font-bold underline uppercase'>Latest Transactions</h3> :
                        <h3 className='text-xs md:text-sm font-bold underline uppercase'>Full Table</h3>}
                </div>
            }

            {(startDate && endDate) &&
                <div className='w-full mb-2 flex justify-start px-2 md:justify-center items-center py-2 space-x-4 '>
                    <p className='text-xs md:text-sm text-gray-600'>Date Selected:</p>
                    <p className='text-xs md:text-sm font-semibold'>{date1?.toDateString()}</p>
                    <p className='text-xs md:text-sm text-gray-600'>to</p>
                    <p className='text-xs md:text-sm font-semibold'>{date2?.toDateString()}</p>
                    <button onClick={clearDateFields}><RxReset className='text-green-500' /></button>
                </div>
            }
            <table className="w-full text-sm text-left text-gray-500">
                <thead className='text-[9px] md:text-xs text-gray-700 uppercase bg-gray-50'>
                    <tr>
                        <th scope="col" className="px-6 py-3">Date</th>
                        <th scope="col" className="px-6 py-3">Weight(KG)</th>
                        <th scope="col" className="px-6 py-3">Price/KG(KSH)</th>
                        <th scope="col" className="px-6 py-3">Debit(KSH)</th>
                        <th scope="col" className="px-6 py-3">Credit(KSH)</th>
                        <th scope="col" className="px-6 py-3">Balance(KSH)</th>
                    </tr>
                </thead>
                <tbody className='text-xs md:text-sm'>
                    {
                        transactions.map((data) => <React.Fragment key={data.id}>
                            <tr className='bg-white border-b' >
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                    {data.createdAt.toDateString()}
                                </th>
                                <td className="px-6 py-4">{data?.quantity?.toFixed(2)}</td>
                                <td className="px-6 py-4">{data?.pricePerKG?.toFixed(2)}</td>
                                <td className="px-6 py-4">{data?.debit?.toFixed(2)}</td>
                                <td className="px-6 py-4">{data?.credit?.toFixed(2)}</td>
                                <td className="px-6 py-4">{data.debtBalance.toFixed(2)}</td>
                            </tr>
                        </React.Fragment>)
                    }
                    <tr className='bg-white' >
                        <td className="px-6 py-4 font-bold text-black"></td>
                        <td className="px-6 py-4 font-bold text-black"></td>
                        <td className="px-6 py-4 font-bold text-black">TOTAL:</td>
                        <td className="px-6 py-4">{totalDebit.toFixed(2)}</td>
                        <td className="px-6 py-4">{totalCredit.toFixed(2)}</td>
                        <td className="px-6 py-4 font-bold text-black">{(totalDebit - totalCredit).toFixed(2)}</td>
                    </tr>
                    <tr className='bg-white'>
                        <td className="px-6 py-4"></td>
                        <td className="px-6 py-4"></td>
                        <td className="px-6 py-4"></td>
                        <td className="px-6 py-4"></td>
                        <td className="px-6 py-4"></td>
                        {
                            isFull ?
                                <td className="px-6 py-4"><button className='text-blue-600 hover:text-indigo-900 text-xs md:text-sm' onClick={handlelessTable}>Show less</button></td> :
                                <td className="px-6 py-4"><button className='text-blue-600 hover:text-indigo-900 text-xs md:text-sm' onClick={handleFullTable}>Full table</button></td>
                        }
                    </tr>
                </tbody>
            </table>
            {isPending &&
                <div className='w-full flex justify-center py-2'>
                    <Spinner className='animate-spin' />
                </div>
            }
        </>
    )
}

export default TransactionTable