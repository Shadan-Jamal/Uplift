import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { connectToDB } from "./mongo";
import User from "../models/user";
import Counselor from "../models/counselor";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import NextAuth from "next-auth";

/**
 * Verify the JWT token from cookies
 * @returns {Object|null} The decoded token or null if invalid
 */
export function verifyToken() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('token')?.value;
    
    if (!token) {
      return null;
    }
    
    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET);
    return decoded;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

/**
 * Check if the user is authenticated
 * @returns {boolean} True if authenticated, false otherwise
 */
export function isAuthenticated() {
  const token = verifyToken();
  return !!token;
}

/**
 * Get the current user from the token
 * @returns {Object|null} The user object or null if not authenticated
 */
export function getCurrentUser() {
  const token = verifyToken();
  if (!token) {
    return null;
  }
  
  return {
    userId: token.userId,
    email: token.email,
    userType: token.userType
  };
}

/**
 * Check if the user has access to a specific route
 * @param {string} route - The route to check access for
 * @returns {boolean} True if the user has access, false otherwise
 */
export function hasRouteAccess(route) {
  const user = getCurrentUser();
  console.log("User in hasRouteAccess:", user);
  if (!user) {
    return false;
  }
  
  // Student routes
  if (route.startsWith('/') && user.userType === 'student') {
    return true;
  }
  
  // Counselor routes
  if (route.startsWith('/counselor/') && user.userType === 'counselor') {
    return true;
  }
  
  // Public routes
  if (route === '/' || route === '/login' || route === '/register' || route === '/forgot-password') {
    return true;
  }
  
  return false;
}

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        userType: { label: "User Type", type: "string" }
      },
      async authorize(credentials) {
        try {
          console.log("inside authorize")
          const { email, password, userType } = credentials;
          await connectToDB();
          let user;
          if (userType === "student") {
            user = await User.findOne({ email: email });
          } else {
            user = await Counselor.findOne({ email: email });
          }

          if (!user) {
            throw new Error("User not found");
          }

          let isValid;
          if(userType === "student") {
            isValid = await bcrypt.compare(password, user.password);
          }
          else{
            isValid = password === user.password;
          }
          
          if (!isValid) {
            return null;
          }

          console.log(user)
          return {
            id: user.userId,
            email: user.email,
            name : userType !== "student" && user.name,
            type: userType
          };
        } catch (error) {
          console.error("Error in authorize:", error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.type = user.type;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.type = token.type;
      }
      return session;
    }
  },
  pages: {
    signIn: "/login",
    error: "/login"
  },
  session: {
    strategy: "jwt"
  }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }; 