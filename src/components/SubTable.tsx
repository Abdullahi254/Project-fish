import React from 'react'

type Props = {}

const SubTable = (props: Props) => {
    return (
        <table className="w-full text-sm text-left text-gray-500">
            <thead className='text-xs text-gray-700 uppercase bg-gray-50'>
                <tr>
                    <th scope="col" className="px-6 py-3">Id</th>
                    <th scope="col" className="px-6 py-3">Weight(kg)</th>
                    <th scope="col" className="px-6 py-3">Sold(kg)</th>
                    <th scope="col" className="px-6 py-3">Remaining(kg)</th>
                    <th scope="col" className="px-6 py-3">Water Loss(kg)</th>
                </tr>
            </thead>
            <tbody>
                <tr className='bg-white border-b'>
                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                        1
                    </th>
                    <td className="px-6 py-4">300.00</td>
                    <td className="px-6 py-4">200.00</td>
                    <td className="px-6 py-4">100.00</td>
                    <td className="px-6 py-4">0.00</td>
                </tr>
                <tr className='bg-white border-b'>
                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                        2
                    </th>
                    <td className="px-6 py-4">50.00</td>
                    <td className="px-6 py-4">10.00</td>
                    <td className="px-6 py-4">40.00</td>
                    <td className="px-6 py-4">50.00</td>
                </tr>
                <tr className='bg-white border-b'>
                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                        3
                    </th>
                    <td className="px-6 py-4">40.00</td>
                    <td className="px-6 py-4">40.00</td>
                    <td className="px-6 py-4">0.00</td>
                    <td className="px-6 py-4">10.00</td>
                </tr>
            </tbody>
        </table>
    )
}

export default SubTable