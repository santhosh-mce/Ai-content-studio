import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import Google from "next-auth/providers/google"
import { prisma } from "@/lib/prisma"

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id
        // Add custom fields
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { role: true, plan: true, credits: true }
        })
        if (dbUser) {
          // @ts-ignore
          session.user.role = dbUser.role
          // @ts-ignore
          session.user.plan = dbUser.plan
          // @ts-ignore
          session.user.credits = dbUser.credits
        }
      }
      return session
    }
  }
})
