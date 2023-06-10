'use client';
import { useState } from 'react';
import { RiArrowDropDownLine } from "react-icons/ri"
import SubTable from './SubTable';
import { fetchBatchData } from '@/app/actions';

type AsyncReturnType<T extends (...args: any) => Promise<any>> =
    T extends (...args: any) => Promise<infer R> ? R : any

type Props = {
    batchList: AsyncReturnType<typeof fetchBatchData>
}

const BatchTable = ({
    batchList
}: Props) => {
    const [more, setMore] = useState<boolean>(false)

    const handlemore = () => {
        setMore(prev => !prev)
    }
    return (
        <table className="w-full text-sm text-left text-gray-500">
            <thead className='text-xs text-gray-700 uppercase bg-gray-50'>
                <tr>
                    <th scope="col" className="px-6 py-3">Batch Date</th>
                    <th scope="col" className="px-6 py-3">Fish Type</th>
                    <th scope="col" className="px-6 py-3">Total Water Loss(KG)</th>
                    <th scope="col" className="px-6 py-3">Price/Kilo(KSH)</th>
                    <th scope="col" className="px-6 py-3">Estimated Loss(KSH)</th>
                    <th scope="col" className="px-6 py-3"></th>
                </tr>
            </thead>
            <tbody>
                {
                    batchList.map((data) => <div key={data.id}>
                        <tr className='bg-white border-b' >
                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                {data.batchDate.toDateString()}
                            </th>
                            <td className="px-6 py-4">{data.type}</td>
                            <td className="px-6 py-4">{data.totalWaterLoss?.toFixed(2)}</td>
                            <td className="px-6 py-4">{data.pricePerKilo.toFixed(2)}</td>
                            <td className="px-6 py-4">{data.estimatedLoss?.toFixed(2)}</td>
                            <td className="py-4"><RiArrowDropDownLine className={!more ? `cursor-pointer text-black text-lg` : `cursor-pointer text-black rotate-180 text-lg`} onClick={handlemore} /></td>
                        </tr>
                        <tr>
                            {more && <td colSpan={6}>
                                <div className='max-w-6xl mx-auto py-6 bg-gray-300 my-2'>
                                    <h2 className='text-center mb-2 text-black font-semibold'>BATCH DATE: {data.batchDate.toDateString()}</h2>
                                    <SubTable />
                                </div>
                            </td>}

                        </tr>
                    </div>)
                }
            </tbody>
        </table>
    )
}

export default BatchTable