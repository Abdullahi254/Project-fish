'use client';
import { Sold } from '@prisma/client';
import React, { useEffect, useState } from 'react';

type Props = {
    soldList: Sold[]
    show: string | string[] | undefined
    batchDate: string | string[] | undefined
}

const SoldTable = ({
    soldList,
    show,
    batchDate
}: Props) => {
    const [total, setTotal] = useState<number>(0)

    useEffect(()=>{
        const quantityList = soldList.map(data=>data.quantity)
        const sum = quantityList.reduce((acc,curr)=>acc+curr)
        setTotal(sum) 
    },[soldList])
    return (
        <>
            <div className='w-full flex justify-center items-center'>
                <h3 className='text-xs md:text-sm font-semibold'>Batch Date: {batchDate}</h3>
            </div>
            <table className="w-full text-sm text-left text-gray-500">
                <thead className='text-[9px] md:text-xs text-gray-700 uppercase bg-gray-50'>
                    <tr>
                        <th scope="col" className="px-6 py-3">Date</th>
                        <th scope="col" className="px-6 py-3">Time</th>
                        <th scope="col" className="px-6 py-3">Sold(KG)</th>

                    </tr>
                </thead>
                <tbody className='text-xs md:text-sm'>
                    {
                        (soldList.length < 1 && show) ? <tr>
                            <th scope="col" colSpan={3} className="px-6 py-3 text-gray-500 font-semibold text-center">Add new Sold Entry</th>
                        </tr> :
                            soldList.map((data) => <React.Fragment key={data.id}>
                                <tr className='bg-white border-b' >
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                        {data.date.toDateString()}
                                    </th>
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                        {data.date.toLocaleTimeString()}
                                    </th>
                                    <td className="px-6 py-4">{data.quantity.toFixed(2)}</td>
                                </tr>
                            </React.Fragment>)
                    }
                    <tr className='bg-white'>
                        <th className='px-6 py-4'></th>
                        <th scope="row" className="px-6 py-4 font-semibold text-gray-900 whitespace-nowrap">
                            TOTAL:
                        </th>
                        <th scope="row" className="px-6 py-4 font-semibold text-gray-900 whitespace-nowrap">
                            {total.toFixed(2)}
                        </th>
                    </tr>
                </tbody>
            </table>
        </>

    )
}

export default SoldTable