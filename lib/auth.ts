import NextAuth, { getServerSession } from "next-auth"
import Google from "next-auth/providers/google"
import GitHub from "next-auth/providers/github"
import { sql } from "./db"

export const authOptions = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }: { user: any }) {
      if (!user.email) return false

      // Check if user exists in database
      const existingUsers = await sql`
        SELECT id, role FROM users WHERE email = ${user.email}
      `

      if (existingUsers.length === 0) {
        await sql`
          INSERT INTO users (email, name, image, role)
          VALUES (${user.email}, ${user.name}, ${user.image}, 'client')
          ON CONFLICT (email) DO UPDATE SET
            name = EXCLUDED.name,
            image = EXCLUDED.image
        `
      }

      return true
    },
    async jwt({ token, user }: { token: any, user: any }) {
      if (user?.email) {
        const dbUsers = await sql`
          SELECT id, role FROM users WHERE email = ${user.email}
        `
        if (dbUsers.length > 0) {
          token.userId = dbUsers[0].id
          token.role = dbUsers[0].role
        }
      }
      return token
    },
    async session({ session, token }: { session: any, token: any }) {
      if (session.user) {
        session.user.id = token.userId as string
        session.user.role = token.role as "admin" | "client"
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)
export const handlers = { GET: handler, POST: handler }

export const auth = () => getServerSession(authOptions)



// Type augmentation
declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name?: string | null
      image?: string | null
      role: "admin" | "client"
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId?: string
    role?: "admin" | "client"
  }
}
