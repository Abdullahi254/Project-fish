'use client';
import { useState } from 'react';
import { RiArrowDropDownLine} from "react-icons/ri"
import SubTable from './SubTable';
type Props = {}

const BatchTable = (props: Props) => {
    const [more, setMore] = useState<boolean>(false)
    const handlemore = () => {
        setMore(prev => !prev)
    }
    return (
        <table className="w-full text-sm text-left text-gray-500">
            <thead className='text-xs text-gray-700 uppercase bg-gray-50'>
                <tr>
                    <th scope="col" className="px-6 py-3">Batch Date</th>
                    <th scope="col" className="px-6 py-3">Total Water Loss(KG)</th>
                    <th scope="col" className="px-6 py-3">Estimated Loss(KSH)</th>
                    <th scope="col" className="px-6 py-3"></th>
                </tr>
            </thead>
            <tbody>
                <tr className='bg-white border-b'>
                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                        14/10/2023
                    </th>
                    <td className="px-6 py-4">60.00</td>
                    <td className="px-6 py-4">60,000.00</td>
                    <td className="px-6 py-4"><RiArrowDropDownLine className={!more ? `cursor-pointer text-black text-lg` : `cursor-pointer text-black rotate-180 text-lg`} onClick={handlemore} /></td>
                </tr>
                <tr>
                    {more && <td colSpan={4}>
                        <div className='max-w-6xl mx-auto py-6 bg-gray-300 my-2'>
                            <h2 className='text-center mb-2 text-black font-semibold'>BATCH DATE: 14/10/2023</h2>
                            <SubTable />
                        </div>
                    </td>}

                </tr>
                <tr className='bg-white border-b'>
                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                        15/10/2023
                    </th>
                    <td className="px-6 py-4">60.00</td>
                    <td className="px-6 py-4">60,000.00</td>
                    <td className="px-6 py-4"><RiArrowDropDownLine className='cursor-pointer text-black' /></td>
                </tr>
                <tr className='bg-white border-b'>
                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                        16/10/2023
                    </th>
                    <td className="px-6 py-4">60.00</td>
                    <td className="px-6 py-4">60,000.00</td>
                    <td className="px-6 py-4"><RiArrowDropDownLine className='cursor-pointer text-black' /></td>
                </tr>
            </tbody>
        </table>
    )
}

export default BatchTable