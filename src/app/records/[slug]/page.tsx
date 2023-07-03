import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "../../api/auth/[...nextauth]/route"
import { addSold, fetchSold } from "../../actions"
import SoldTable from "@/components/SoldTable"
import SoldInput from "@/components/SoldInput"



const Home = async ({
    searchParams,
    params
}: {
    searchParams: { [key: string]: string | string[] | undefined }
    params: { slug: string }
}) => {
    const batchId = searchParams["batch"]
    const max = searchParams["max"]
    const session = await getServerSession(authOptions)
    const soldList = await fetchSold(Number(params.slug))
    if (!session) {
        console.log("no session")
        redirect('/signIn')
    } else {
        return (
            <div className="mt-12 w-full">
                <div className="max-w-7xl mx-auto relative overflow-x-auto p-4">
                    <SoldTable soldList={soldList}/>
                    <SoldInput batchId={Number(batchId)} recordId={Number(params.slug)} addData={addSold} soldList={soldList} accSold={Number(max)}/>
                </div>
            </div>
        )
    }

}

export default Home