import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "../../api/auth/[...nextauth]/route"
import TransactionTable from "@/components/TransactionTable"

const Home = async ({
    searchParams
}: {
    searchParams: { [key: string]: string | string[] | undefined }
}) => {
    const session = await getServerSession(authOptions)
    const startDate = searchParams["start"]
    const endDate = searchParams["end"]
    if (!session) {
        console.log("no session")
        redirect('/signIn')
    } else {
        return (
            <div className="mt-12 w-full">
                <div className="max-w-7xl mx-auto relative overflow-x-auto p-4">
                    <TransactionTable startDate={ startDate} endDate={endDate}/>
                </div>
            </div>
        )
    }

}

export default Home