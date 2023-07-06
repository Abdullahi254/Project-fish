import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "../api/auth/[...nextauth]/route"




const Home = async ({
    searchParams
}: {
    searchParams: { [key: string]: string | string[] | undefined }
}) => {
    const session = await getServerSession(authOptions)

    if (!session) {
        console.log("no session")
        redirect('/signIn')
    } else {
        return (
            <div className="mt-12 w-full">
                <div className="max-w-7xl mx-auto flex flex-col justify-center items-center px-4 py-6 h-[50vh]">
                    <h3 className="text-gray-600 uppercase text-xs md:text-sm font-semibold font-serif tracking-wide">Coming Soon!</h3>
                </div>
            </div>
        )
    }
}

export default Home