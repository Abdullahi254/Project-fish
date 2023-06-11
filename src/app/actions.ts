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
        throw new Error("Error Adding Batch Data", { cause: er })
    }

}

export const fetchRecords = async (id: number) => {
    try {
        const records = await prisma.record.findMany({
            where: { batchId: id }
        })
        return records
    } catch (er) {
        throw new Error("Error Fetching Records Data", { cause: er })
    }
}
export const addRecordData = async ({
    weight,
    sold,
    batchId
}: {
    weight: number
    sold: number
    batchId: number
}) => {
    try {
        const existingRecords = await fetchRecords(batchId)
        if (existingRecords.length < 1) {
            const record = await prisma.record.create({
                data: {
                    weight,
                    weightSold: sold,
                    remaining: (weight - sold),
                    waterLoss: 0,
                    batch: {
                        connect: { id: batchId }
                    }
                }
            })
        } else {
            const previousRecord = existingRecords[existingRecords.length - 1]
            const waterLoss = previousRecord.remaining - weight
            const record = await prisma.record.create({
                data: {
                    weight,
                    weightSold: sold,
                    remaining: (weight - sold),
                    waterLoss,
                    batch: {
                        connect: { id: batchId }
                    }
                }
            })

        }
    } catch (er) {
        throw new Error("Error Adding Record Data", { cause: er })
    }
}

export const fetchBatchData = async () => {
    try {
        const batchList = await prisma.batch.findMany()
        return batchList
    } catch (er) {
        throw new Error("Error Fetching Batch Data", { cause: er })
    }
}