'use client';
import { usePathname, useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useState, useTransition } from 'react'
import { AiOutlineSearch as SearchIcon } from "react-icons/ai"
import { AiOutlineLoading3Quarters as Spinner } from 'react-icons/ai'
type Props = {}


const SearchForm = (props: Props) => {
    const [inputValue, setInputValue] = useState<string>('')
    const [debouncedValue, setDebouncedValue] = useState<string>('')
    const [mounted, setMounted] = useState<boolean>(false)
    const [isPending, startTransition] = useTransition()
    const router = useRouter()
    const pathname = usePathname()

    const handleSearchParams = useCallback((value: string) => {
        let params = new URLSearchParams(window.location.search)
        if (value.length > 0) {
            params.set("search", value)
        } else {
            params.delete("search")
        }
        console.log(params.toString())
        startTransition(() => {
            router.replace(`${pathname}?${params.toString()}`)
        })
    }, [pathname, router])

    useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        const searchQuery = params.get("search") ?? ''
        setInputValue(searchQuery)
    }, [])

    useEffect(() => {
        if (debouncedValue.length > 0 && !mounted) {
            setMounted(true)
        }
    }, [debouncedValue, mounted])

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedValue(inputValue)
        }, 500)
        return () => {
            clearTimeout(timer)
        }
    }, [inputValue])
    useEffect(() => {
        if (mounted) {
            handleSearchParams(debouncedValue)
        }
    }, [debouncedValue, handleSearchParams, mounted])

    return (
        <>
            <form className="flex items-center" onSubmit={(e)=>e.preventDefault()}>
                <label htmlFor="simple-search text-xs md:text-sm" className="sr-only">Search</label>
                <div className="relative w-full">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <SearchIcon className='text-lg md:text-xl text-gray-500' />
                    </div>
                    <input value={inputValue} onChange={(e) => setInputValue(e.target.value)} type="text" id="simple-search" className="bg-gray-50 border border-gray-300 text-gray-900 text-xs md:text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full pl-10 p-2.5" placeholder="Search" required />
                </div>
            </form>
            { isPending &&
                <div className='w-full flex justify-center pt-2'>
                    <Spinner className='animate-spin'/>
                </div>
            }
        </>

    )
}

export default SearchForm