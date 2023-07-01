import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "../api/auth/[...nextauth]/route"
import ClientList from "@/components/ClientList"
import SearchForm from "@/components/SearchForm"
import CustomerInput from "@/components/CustomerInput"
import { addCLient, fetchClientsWithLatestTransactions } from "../actions"

const Home = async ({
}: {

    }) => {
    const session = await getServerSession(authOptions)
    const clients = await fetchClientsWithLatestTransactions()
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
                    <ClientList clients={clients}/>
                    <CustomerInput addData={addCLient}/>
                </div>
            </div>
        )
    }

}

export default Home