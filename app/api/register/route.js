import { NextResponse } from "next/server";
import { connectToDB } from "../../../lib/mongo";
import User from "../../../models/user";
import bcrypt from "bcryptjs";

export async function POST(req) {
    try {
        const { email, password } = await req.json();
        
        // Validate input
        if (!email || !password) {
            return NextResponse.json(
                { message: "Email and password are required" },
                { status: 400 }
            );
        }

        // Validate email format
        if (!email.includes('@') || !email.includes('.')) {
            return NextResponse.json(
                { message: "Invalid email format" },
                { status: 400 }
            );
        }

        // Hash password
        const hashedPW = await bcrypt.hash(password, 10);
        
        // Connect to database
        await connectToDB();
        
        // Check for existing user
        const existingUser = await User.findOne({email});
        console.log(existingUser)
        if (existingUser) {
            return NextResponse.json(
                { message: "A user with this email already exists" },
                { status: 400 }
            );
        }

        // Create new user
        const user = await User.create({
            email: email.toLowerCase(),
            password: hashedPW
        });

        return NextResponse.json(
            { message: "User registered successfully" },
            { status: 201 }
        );
    } catch (error) {
        console.error("Registration error:", error);

        // Handle other errors
        return NextResponse.json(
            { message: "An error occurred during registration" },
            { status: 500 }
        );
    }
}
