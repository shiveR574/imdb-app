import NextAuth from "next-auth";
import {Account, User as AuthUser} from "next-auth";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import User from "@/src/models/User";
import connect from "@/src/utils/db";


export const authOptions:any = {
  // Configure one or more authentication providers
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
            } catch (err: any) {
                throw new Error(err);      
            }
        }
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID ?? "",
      clientSecret: process.env.GITHUB_SECRET ?? "",
    }),
    // ...add more providers here
  ],
    callbacks: {
        async signIn({user, account}: {user: AuthUser, account: Account}) {
            if(account?.provider == "credentials") {
                return true;
            }
            if(account?.provider == "github") {
                await connect();
                try {
                    if (!user.email) {
                        console.log("GitHub user has no email");
                        return false;
                    }
                    const existingUser = await User.findOne({email: user.email});
                    if(!existingUser) {
                        const nameParts = user.name?.split(" ") || [];
                        const newUser = new User({
                            email: user.email,
                            firstName: nameParts[0] || "GitHub",
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
        },
        async jwt({ token, user, account }: { token: any, user: any, account: any }) {
        // 'user' and 'account' are ONLY available the very first time the user signs in
        if (account && user) {
            if (account.provider === "credentials") {
                // For credentials, 'user' is exactly what you returned from authorize()
                token.id = user.id; 
            } 
            
            if (account.provider === "github") {
                // To avoid a second DB query here, look up the user once or pass it.
                // If you stick to your current architecture, doing the DB lookup here is fine, 
                // but use the provider check instead of length checking:
                await connect();
                const dbUser = await User.findOne({ email: token.email });
                if (dbUser) {
                    token.id = dbUser._id.toString();
                }
            }
        }
            return token;
        },

        // 2. Pass the token id to the client-side session
        async session({ session, token }: { session: any, token: any }) {
            if (token && session.user) {
                session.user.id = token.id;
            }
            return session;
        }
    }
};