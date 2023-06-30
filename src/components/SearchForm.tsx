import React from 'react'
import {AiOutlineSearch as SearchIcon} from "react-icons/ai"
type Props = {}

const SearchForm = (props: Props) => {
    return (
        <form className="flex items-center">
            <label htmlFor="simple-search" className="sr-only">Search</label>
            <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <SearchIcon className='text-lg md:text-xl text-gray-500'/>
                </div>
                <input type="text" id="simple-search" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full pl-10 p-2.5" placeholder="Search" required />
            </div>
            <button type="submit" className="p-2.5 ml-2 text-sm font-medium text-white bg-gray-900 rounded-lg border border-gray-700 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-gray-300">
                <SearchIcon className='text-lg md:text-xl'/>
                <span className="sr-only">Search</span>
            </button>
        </form>
    )
}

export default SearchForm