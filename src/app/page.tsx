import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "./api/auth/[...nextauth]/route"
import BatchTable from "@/components/BatchTable"
import BatchInput from "@/components/BatchInput"
import {addBatchData, fetchBatchData} from "./actions"

type Props = {

}

const Home = async (props: Props) => {
  const session = await getServerSession(authOptions)
  const batchList = await fetchBatchData()
  if (!session) {
    console.log("no session")
    redirect('/signIn')
  } else {
    return (
      <div className="mt-12 w-full">
        <div className="max-w-7xl mx-auto relative overflow-x-auto p-4">
          <BatchTable batchList={batchList}/>
          <BatchInput addData={addBatchData} />
        </div>
      </div>
    )
  }

}

export default Home