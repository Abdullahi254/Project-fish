import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "../../api/auth/[...nextauth]/route"
import TransactionTable from "@/components/TransactionTable"
import TransactionInput from "@/components/TransactionInput"
import { addTransaction, fetchLatestFiveTransactions, fetchTransactions, fetchTransactionsByDateRange } from "@/app/actions"
import { Transaction } from "@prisma/client"


const fetchData = async (clientId: number, start?: Date, end?: Date, full?: boolean) => {
    try {
        if (start && end) {
            return await fetchTransactionsByDateRange(start, end, clientId)
        }
        else if (full) {
            return await fetchTransactions(clientId)
        }
        return await fetchLatestFiveTransactions(clientId)
    } catch (er) {
        console.log(er)
    }
}

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
    const name = searchParams["name"]
    const fullTable: boolean = searchParams["table"] ? true : false
    const cleintId: number = Number(params.slug)

    let transactions: Transaction[] = []
    if (startDate && endDate) {
        transactions = [...await fetchData(cleintId, new Date(startDate as string), new Date(endDate as string)) as Transaction[]]
    } else if (fullTable) {
        transactions = [...await fetchData(cleintId, undefined, undefined, fullTable) as Transaction[]]
    } else {
        transactions = [...await fetchData(cleintId) as Transaction[]]
    }

    if (!session) {
        console.log("no session")
        redirect('/signIn')
    } else {
        return (
            <div className="mt-12 w-full">
                <div className="max-w-7xl mx-auto relative overflow-x-auto p-4">
                    <TransactionTable startDate={startDate} endDate={endDate} transactions={transactions} slug={params.slug} customerName={name} />
                    <TransactionInput addData={addTransaction} id={Number(params.slug)} />
                </div>
            </div>
        )
    }

}

export default Home