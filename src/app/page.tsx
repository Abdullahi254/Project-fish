import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "./api/auth/[...nextauth]/route"
import BatchTable from "@/components/BatchTable"
import BatchInput from "@/components/BatchInput"
import { addBatchData, fetchBatchData, fetchBatchesByDateRange } from "./actions"
import { Batch } from "@prisma/client"


const fetchData = async (start?: Date, end?: Date) => {
  try {
    if (start && end) {
      return await fetchBatchesByDateRange(start, end)
    }
    return await fetchBatchData()
  } catch (er) {
    console.log(er)
  }
}

const Home = async ({
  searchParams
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) => {
  const startDate = searchParams["start"]
  const endDate = searchParams["end"]
  const session = await getServerSession(authOptions)
  let batchList: Batch[] = []
  if (startDate && endDate) {
    batchList = [...await fetchData(new Date(startDate as string), new Date(endDate as string)) as Batch[]]
  } else {
    batchList = [...await fetchData() as Batch[]]
  }
  if (!session) {
    console.log("no session")
    redirect('/signIn')
  } else {
    return (
      <div className="mt-12 w-full">
        <div className="max-w-7xl mx-auto relative overflow-x-auto p-4">
          <BatchTable batchList={batchList} startDate={startDate} endDate={endDate} />
          <BatchInput addData={addBatchData} />
        </div>
      </div>
    )
  }

}

export default Home