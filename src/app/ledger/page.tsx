import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "../api/auth/[...nextauth]/route"
import ClientList from "@/components/ClientList"
import SearchForm from "@/components/SearchForm"
import CustomerInput from "@/components/CustomerInput"
import { addCLient, fetchClientsWithLatestTransactions ,fetchClientsByName } from "../actions"
import { MyClient } from "@/components/ClientList"


const fetchData = async (name?: string) => {
    try {
        if (name) {
            return await fetchClientsByName(name)
        }
        return await fetchClientsWithLatestTransactions()
    } catch (er) {
        console.log(er)
    }
}

const Home = async ({
    searchParams
}: {
    searchParams: { [key: string]: string | string[] | undefined }
}) => {
    const session = await getServerSession(authOptions)
    const name = searchParams["search"]
    let clients: MyClient[] = []
    if (name) {
        clients = [...await fetchData(name as string) as MyClient[]]
    } else {
        clients = [...await fetchData() as MyClient[]]
    }
    if (!session) {
        console.log("no session")
        redirect('/signIn')
    } else {
        return (
            <div className="mt-12 w-full">
                <div className="max-w-7xl mx-auto relative overflow-x-auto p-4">
                    <div className="px-6">
                        <SearchForm />
                    </div>
                    <ClientList clients={clients} />
                    <CustomerInput addData={addCLient} />
                </div>
            </div>
        )
    }

}

export default Home