'use client';

import { signIn } from "next-auth/react"
import { GiSpearfishing } from "react-icons/gi"
import { FcGoogle } from "react-icons/fc"
import { signOut } from "next-auth/react"

type Props = {
    session: any
}

const SignIn = ({ session }: Props) => {
    return (
        <div className={session ? `w-full bg-gradient-to-r bg-white h-screen p-12 mt-12` :
            "w-full bg-gradient-to-r bg-white h-screen p-12"}>
            <div className="max-w-7xl h-[70%] mx-auto grid grid-cols-1 md:grid-cols-2 shadow-lg shadow-gray-900">
                <div className="bg-white h-full hidden md:flex justify-center items-center border-r-2 border-gray-500">
                    <GiSpearfishing className="md:text-[220px] lg:text-[400px] text-gray-800" />
                </div>
                <div className="bg-white h-full flex flex-col items-center justify-evenly">
                    <GiSpearfishing className="text-[70px] sm:text-[100px] md:hidden text-cyan-800" />
                    <h1 className="tracking-wider text-2xl font-semibold text-gray-800">MAMA DAUGHTER</h1>
                    <h2 className="tracking-wider text-lg text-gray-800 ">{session? "Already Signed In" : "Welcome aboard"}</h2>
                    {
                        !session ?
                            <button className="inline-flex items-center p-2 rounded-lg border-gray-300 border-x-2 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 hover:bg-gray-50 duration-300 text-sm text-gray-700" onClick={()=>signIn("google",{ callbackUrl: '/' })}>
                                <span><FcGoogle className="text-lg mr-2" /></span>
                                Sign in with Google
                            </button> :
                            <button className="inline-flex items-center p-2 rounded-lg border-gray-300 border-x-2 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 hover:bg-gray-50 duration-300 text-sm text-gray-700" onClick={() => signOut()}>
                                Sign out
                            </button>
                    }

                </div>
            </div>
        </div>
    )
}

export default SignIn
