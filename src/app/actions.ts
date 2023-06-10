"use server";
import { prisma } from "../app/api/auth/[...nextauth]/route"

export type Batch = {
    date: Date
    type: string
    price: number
}
export const addBatchData = async ({ date, type, price }: Batch) => {
    try {
        const batchData = await prisma.batch.create({
            data: {
                batchDate: date,
                type: type,
                pricePerKilo: price,
            }
        })
    } catch (er) {
        throw new Error("Error Adding Batch Data", { cause: er})
    }

}

export const fetchBatchData = async () => {
    try {
        const batchList = await prisma.batch.findMany()
        return batchList
    } catch (er) {
        throw new Error("Error Fetching Batch Data", { cause: er})
    }
}