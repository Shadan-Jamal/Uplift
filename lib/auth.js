import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { connectToDB } from "./mongo";
import User from "../models/user";
import Counselor from "../models/counselor";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

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
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key");
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
            name: 'credentials',
            credentials: {},
            async authorize(credentials) {
                const { email, password, userType } = credentials;
                console.log(credentials)
                try {
                    await connectToDB();
                    
                    // Check if user exists in either collection
                    let user = await User.findOne({ email: email.toLowerCase() });
                    let isCounselor = false;
                    
                    if (!user) {
                        user = await Counselor.findOne({ email: email.toLowerCase() });
                        isCounselor = true;
                    }
                    
                    if (!user) {
                        throw new Error('No user found with this email');
                    }
                    
                    if(!isCounselor){
                        const pw = await bcrypt.compare(password, user.password);
                        if (!pw) {
                            throw new Error('Invalid password');
                        }
                    }
                    
                    // Add user type to the returned user object
                    return {
                        ...user.toObject(),
                        userType: isCounselor ? 'counselor' : 'student'
                    };
                } catch (err) {
                    console.log('Auth error:', err);
                    throw new Error(err.message || 'Authentication failed');
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.userType = user.userType;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.userType = token.userType;
            }
            return session;
        }
    },
    session: {
        strategy: "jwt"
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: "/login",
        error: "/login"
    }
}; 