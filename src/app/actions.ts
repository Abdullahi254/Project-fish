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
    } catch (er: any) {
        throw new Error(er.message, { cause: er })
    }

}

export const fetchRecords = async (id: number) => {
    try {
        const records = await prisma.record.findMany({
            where: { batchId: id }
        })
        return records
    } catch (er: any) {
        throw new Error(er.message, { cause: er })
    }
}
export const updateRecord = async (recordId: number, sold: number, batchId:number) => {
    try {
        const existingRecords = await fetchRecords(batchId)
        const lastRecord = existingRecords[existingRecords.length - 1]
        const weight = lastRecord.weight
        if (lastRecord.id !== recordId) {
            throw new Error("Can't Update this Record Data")
        }
        const updateRecord = await prisma.record.update({
            where: {
                id: recordId
            },
            data: {
                weightSold: sold,
                remaining: (weight - sold)
            }
        })
    } catch (er: any) {
        throw new Error(er.message, { cause: er })
    }
}
export const addRecordData = async ({
    weight,
    batchId
}: {
    weight: number
    batchId: number
}) => {
    try {
        const existingRecords = await fetchRecords(batchId)
        if (existingRecords.length < 1) {
            const record = await prisma.record.create({
                data: {
                    weight,
                    weightSold: 0,
                    remaining: (weight - 0),
                    waterLoss: 0,
                    batch: {
                        connect: { id: batchId }
                    }
                }
            })
        } else {
            const previousRecord = existingRecords[existingRecords.length - 1]
            const waterLoss = previousRecord.remaining - weight
            if (weight > previousRecord.remaining) {
                throw new Error("New Weight can not be More than Previous Recording")
            }
            const record = await prisma.record.create({
                data: {
                    weight,
                    weightSold: 0,
                    remaining: (weight - 0),
                    waterLoss,
                    batch: {
                        connect: { id: batchId }
                    }
                }
            })

        }
    } catch (er: any) {
        throw new Error(er.message, { cause: er })
    }
}

export const fetchBatchData = async () => {
    try {
        const batchList = await prisma.batch.findMany()
        return batchList
    } catch (er: any) {
        throw new Error(er.message, { cause: er })
    }
}