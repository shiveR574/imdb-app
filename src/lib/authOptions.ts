import NextAuth, { AuthOptions, Session } from "next-auth";
import { Account, User as AuthUser } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import User from "@/src/models/User";
import connect from "@/src/utils/db";
import { JWT } from "next-auth/jwt";

// 1. Switched from :any to :AuthOptions for full type protection
export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
        id: "credentials",
        name: "Credentials",
        credentials: {
            firstName: { label: "First Name", type: "text"},
            lastName: { label: "Last Name", type: "text"},
            email: { label: "Email", type: "text"},
            password: { label: "Password", type: "password"},
        },
        async authorize(credentials: any) {
            await connect();
            try {
                const user = await User.findOne({email: credentials.email});
                if (user) {
                    const isPasswordCorrect = await bcrypt.compare(
                        credentials.password, 
                        user.password
                    )
                    if (isPasswordCorrect) {
                        return user;
                    } else {
                        throw new Error("Wrong Credentials!");
                    }
                }
                return null; // Return null if user isn't found
            } catch (err: any) {
                throw new Error(err);      
            }
        }
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID ?? "",
      clientSecret: process.env.GITHUB_SECRET ?? "",
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID ?? "",
      clientSecret: process.env.GOOGLE_SECRET ?? "",
    }),
  ],
  callbacks: {
        async signIn({user, account}: {user: AuthUser, account: Account | null}) {
            if(account?.provider == "credentials") {
                return true;
            }
            if(account?.provider == "github" || account?.provider == "google") {
                await connect();
                try {
                    if (!user.email) {
                        console.log(`${account.provider} user has no email`);
                        return false;
                    }
                    const existingUser = await User.findOne({email: user.email});
                    if(!existingUser) {
                        const nameParts = user.name?.split(" ") || [];
                        const newUser = new User({
                            email: user.email,
                            firstName: nameParts[0] || account.provider,
                            lastName: nameParts[1] || "User",
                        });

                        await newUser.save();
                        return true;
                    }
                    return true;
                } catch(err) {
                    console.log("Error saving user", err);
                    return false;
                }
            }
            return false;
        },
        
        async jwt({ token, user, account }: { token: JWT; user?: any; account?: Account | null }) {
          if (user) {
              if (account?.provider === "credentials") {
                  token.id = user._id || user.id; 
              } else if (account?.provider === "github" || account?.provider === "google") {
                  await connect();
                  const dbUser = await User.findOne({ email: user.email });
                  if (dbUser) {
                      token.id = dbUser._id.toString();
                  }
              }
          }
          return token;
        },

        // 2. Fixed: Changed session: any to session: Session
        async session({ session, token }: { session: Session; token: JWT }) {
          if (session.user && token.id) {
              session.user.id = token.id; // TypeScript now knows exactly what token.id and session.user.id are!
          }
          return session;
        }
    }
};