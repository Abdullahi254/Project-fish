import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "../../api/auth/[...nextauth]/route"
import TransactionTable from "@/components/TransactionTable"
import TransactionInput from "@/components/TransactionInput"
import { addTransaction, fetchLatestFiveTransactions } from "@/app/actions"

const Home = async ({
    searchParams,
    params
}: {
    params: { slug: string }
    searchParams: { [key: string]: string | string[] | undefined }
}) => {
    const session = await getServerSession(authOptions)
    const startDate = searchParams["start"]
    const endDate = searchParams["end"]
    const transactions = await fetchLatestFiveTransactions(Number(params.slug))
    if (!session) {
        console.log("no session")
        redirect('/signIn')
    } else {
        return (
            <div className="mt-12 w-full">
                <div className="max-w-7xl mx-auto relative overflow-x-auto p-4">
                    <TransactionTable startDate={startDate} endDate={endDate} transactions={transactions} slug={params.slug}/>
                    <TransactionInput addData={addTransaction} id={Number(params.slug)} />
                </div>
            </div>
        )
    }

}

export default Home