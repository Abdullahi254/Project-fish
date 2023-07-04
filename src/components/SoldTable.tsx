'use client';
import { Sold } from '@prisma/client';
import React from 'react';

type Props = {
    soldList: Sold[]
    show: string | string[] | undefined
}

const SoldTable = ({
    soldList,
    show
}: Props) => {
    return (
        <>

            <table className="w-full text-sm text-left text-gray-500">
                <thead className='text-xs text-gray-700 uppercase bg-gray-50'>
                    <tr>
                        <th scope="col" className="px-6 py-3">Date</th>
                        <th scope="col" className="px-6 py-3">Time</th>
                        <th scope="col" className="px-6 py-3">Sold(KG)</th>

                    </tr>
                </thead>
                <tbody>
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
                </tbody>
            </table>
        </>

    )
}

export default SoldTable