import { connectToDB } from "../../../../lib/mongo";
import User from "../../../../models/user";
import NextAuth from "next-auth/next"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs" 

const authOptions = {
    providers : [
        CredentialsProvider({
            name : 'credentials',
            credentials : {},
            async authorize(credentials) {
                const {email, password} = credentials;
                try{
                    await connectToDB();
                    const user = await User.findOne({email});
                    if(!user){
                        return null
                    }
                    const pw = await bcrypt.compare(password,user.password)
                    if(!pw){
                        return null
                    }

                    return user;
                }
                catch(err){
                    console.log(err)
                }
            }
        })
    ],
    session : {
        strategy : "jwt"
    },
    secret : process.env.NEXTAUTH_SECRET,
    pages : {
        signIn : "/"
    }
};

const handler = NextAuth(authOptions)

export {handler as GET, handler as POST};