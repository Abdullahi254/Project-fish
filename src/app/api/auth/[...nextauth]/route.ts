import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { Account, PrismaClient, User } from "@prisma/client";



const globalForPrisma = global as unknown as {
    prisma: PrismaClient | undefined
}

export const prisma =
    globalForPrisma.prisma ??
    new PrismaClient({
        log: ['query'],
    })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export const authOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }),
    ],
    callbacks: {
        async redirect({ url, baseUrl }:{
            url:string
            baseUrl:string
        }) {
            // Allows relative callback URLs
            if (url.startsWith("/")) return `${baseUrl}${url}`
            // Allows callback URLs on the same origin
            else if (new URL(url).origin === baseUrl) return url
            return baseUrl
        },
        async signIn({ account, profile }:{
            account:Account
            profile?: User
        }) {
            if (account.provider === "google") {
              return profile?.email == "abdush504@gmail.com"
            }
            return true // Do different verification for other providers that don't have `email_verified`
          },
    }
}
// @ts-ignore: Unreachable code error
const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }