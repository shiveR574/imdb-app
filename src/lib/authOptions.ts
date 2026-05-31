import NextAuth from "next-auth";
import {Account, User as AuthUser} from "next-auth";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import User from "@/src/models/User";
import connect from "@/src/utils/db";


export const authOptions: any = {
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

      // this puts the user id into the token when they log in
      async jwt({ token, user }: { token: any, user: any }) {
          if (user) {
              await connect();
              // find the MongoDB user to get their _id
              const dbUser = await User.findOne({ email: user.email });
              if (dbUser) {
                  token.id = dbUser._id.toString();
              }
          }
          return token;
      },

      // this makes the id available on session.user
      async session({ session, token }: { session: any, token: any }) {
          if (session.user) {
              session.user.id = token.id;
          }
          return session;
      },
  }
};