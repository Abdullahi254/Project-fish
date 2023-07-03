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

export const fetchClientsByName = async (name: string) => {
    try {
        const clients = await prisma.client.findMany({
            where: {
                OR: [
                    {
                        first: name
                    },
                    {
                        last: name
                    }
                ]
            },
            include: {
                transactions: {
                    orderBy: {
                        createdAt: 'desc'
                    },
                    take: 1
                },
            },
            orderBy: {
                transactions: {
                    _count: 'desc'
                }
            },
        })
        return clients
    } catch (er: any) {
        throw new Error(er.message, { cause: er })
    }
}

export const fetchClientsWithLatestTransactions = async () => {
    try {
        const clients = await prisma.client.findMany({
            include: {
                transactions: {
                    orderBy: {
                        createdAt: 'desc'
                    },
                    take: 1
                },
            },
            orderBy: {
                transactions: {
                    _count: 'desc'
                }
            },
            take: 6
        })
        return clients
    } catch (er: any) {
        throw new Error(er.message, { cause: er })
    }
}

export const addCLient = async ({
    first,
    last,
    phoneNumber,
}: {
    first: string
    last: string
    phoneNumber: string
}) => {
    try {
        const client = await prisma.client.create({
            data: {
                first,
                last,
                phoneNumber,
                totalCredit: 0,
                totalDebit: 0
            }
        })
    } catch (er: any) {
        throw new Error(er.message, { cause: er })
    }
}

export const fetchTransactions = async (id: number) => {
    try {
        const transactions = await prisma.transaction.findMany({
            where: {
                clientId: id
            }
        })
        return transactions
    } catch (er: any) {
        throw new Error(er.message, { cause: er })
    }
}
export const fetchLatestFiveTransactions = async (clientID:number) => {
    try {
        const transactions = await prisma.transaction.findMany({
            where:{
                clientId: clientID
            },
            take: 5,
            orderBy: {
                id: 'desc',
            }
        })
        return transactions
    } catch (er: any) {
        throw new Error(er.message, { cause: er })
    }
}

export const fetchLatestTransaction = async (id: number) => {
    try {
        const transactions = await fetchTransactions(id)
        if (transactions.length > 0) {
            const lastTransaction = transactions[transactions.length - 1]
            return lastTransaction
        }
        return 0
    } catch (er: any) {
        throw new Error(er.message, { cause: er })
    }
}

export const updateClientTransactionValues = async (id: number, credit?: number, debit?: number) => {
    try {
        const client = await prisma.client.update({
            where: { id: id },
            data: {
                totalCredit: {
                    increment: credit ? credit : 0
                },
                totalDebit: {
                    increment: debit ? debit : 0
                }
            }
        })
    } catch (er: any) {
        throw new Error(er.message, { cause: er })
    }
}

export const addTransaction = async (
    { debit, credit, id }: {
        debit?: number
        credit?: number
        id: number
    }
) => {
    try {
        const latestTransaction = await fetchLatestTransaction(id)
        if (latestTransaction !== 0) {
            const balance = latestTransaction.debtBalance
            const transaction = await prisma.transaction.create({
                data: {
                    debit,
                    credit,
                    debtBalance: debit ? (balance + debit) : (credit ? (balance - credit) : balance),
                    client: {
                        connect: {
                            id
                        }
                    }
                }
            })
            await updateClientTransactionValues(transaction.clientId, credit, debit)
        }else{
            const transaction = await prisma.transaction.create({
                data: {
                    debit,
                    credit,
                    debtBalance: debit ? debit : (credit ? (-1 * credit) : 0),
                    client: {
                        connect: {
                            id
                        }
                    }
                }
            })
            await updateClientTransactionValues(transaction.clientId, credit, debit)
        }

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
export const updateRecord = async (recordId: number, sold: number, batchId: number) => {
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
export const updateWaterLoss = async (batchId: number, waterLoss: number) => {
    try {
        const batch = await prisma.batch.findUnique({
            where: {
                id: batchId
            },
            select: {
                pricePerKilo: true,
                totalWaterLoss: true,
                estimatedLoss: true
            }
        });

        if (!batch) {
            throw new Error("Batch Fetching Error")
        }

        const pricePerKilo = batch.pricePerKilo;
        const updatedTotalWaterLoss = (batch.totalWaterLoss || 0) + waterLoss;
        const updatedEstimatedLoss = (batch.estimatedLoss || 0) + (pricePerKilo * waterLoss);

        const updateBatch = await prisma.batch.update({
            where: {
                id: batchId
            },
            data: {
                totalWaterLoss: updatedTotalWaterLoss,
                estimatedLoss: updatedEstimatedLoss
            }
        });
    } catch (er: any) {
        throw new Error(er.message, { cause: er })
    }
};

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
            await updateWaterLoss(batchId, waterLoss)
        }
    } catch (er: any) {
        throw new Error(er.message, { cause: er })
    }
}

export const fetchBatchData = async () => {
    try {
        const batchList = await prisma.batch.findMany({
            take: 5,
            orderBy: {
                id: 'desc',
            }
        })
        return batchList
    } catch (er: any) {
        throw new Error(er.message, { cause: er })
    }
}

export const fetchBatchesByDateRange = async (startDate: Date, endDate: Date) => {
    try {
        const batches = await prisma.batch.findMany({
            where: {
                batchDate: {
                    gte: startDate, // Greater than or equal to the start date
                    lte: endDate,   // Less than or equal to the end date
                },
            },
        });

        return batches
    } catch (er: any) {
        throw new Error(er.message, { cause: er })
    }
};