import { getServerSession } from "next-auth/next"
import { authOptions } from "../api/auth/[...nextauth]/route"
import SignIn from "@/components/SignIn"
type Props = {}

const page = async (props: Props) => {
    const session = await getServerSession(authOptions)
    return (
        <SignIn session={session} />
    )

}

export default page