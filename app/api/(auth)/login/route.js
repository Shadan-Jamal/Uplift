import { NextResponse } from "next/server";
import { connectToDB } from "../../../../lib/mongo";
import User from "../../../../models/user";
import Counselor from "../../../../models/counselor";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req) {
    try {
        // Parse request body
        const body = await req.json();
        const { email, password, userType } = body;
        console.log(body)
        
        console.log(`Login attempt for ${userType} with email: ${email}`);

        // Validate input
        if (!email || !password) {
            console.log("Missing required fields");
            return NextResponse.json(
                { message: "Email and password are required" },
                { status: 400 }
            );
        }

        // Connect to database
        try {
            await connectToDB();
            console.log("Database connected successfully");
        } catch (dbError) {
            console.error("Database connection error:", dbError);
            return NextResponse.json(
                { message: "Database connection failed" },
                { status: 500 }
            );
        }

        // Find user by email
        let user;
        if (userType === "student") {
            user = await User.findOne({ email: email.toLowerCase() });
        } else {
            user = await Counselor.findOne({ email: email.toLowerCase() });
        }

        if (!user) {
            console.log("User not found");
            return NextResponse.json(
                { message: "Invalid email or password" },
                { status: 401 }
            );
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        console.log("Password validation result:", isPasswordValid);
        
        if (!isPasswordValid) {
            console.log("Invalid password");
            return NextResponse.json(
                { message: "Invalid email or password" },
                { status: 401 }
            );
        }
        console.log(user)
        // Generate JWT token
        const token = jwt.sign(
            { 
                userId: user.userId,
                email: user.email,
                userType: userType
            },
            process.env.JWT_SECRET || "your-secret-key",
            { expiresIn: "1d" }
        );

        // Create response with user data
        const response = NextResponse.json(
            { 
                message: "Login successful",
                user: {
                    userId: user.userId,
                    email: user.email,
                    userType: userType
                }
            },
            { status: 200 }
        );

        // Set token as HTTP-only cookie
        response.cookies.set({
            name: "token",
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60 * 24 // 1 day
        });

        return response;
    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json(
            { message: "An error occurred during login" },
            { status: 500 }
        );
    }
} 