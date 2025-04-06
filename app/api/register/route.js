import { NextResponse } from "next/server";
import { connectToDB } from "../../../lib/mongo";
import User from "../../../models/user";
import bcrypt from "bcryptjs";

// Function to generate random ID
function generateUserId() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = 'SCC';
    for (let i = 0; i < 5; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

export async function POST(req) {
    try {
        // Parse request body
        const body = await req.json();
        const { email, password } = body;
        
        console.log("Registration attempt for email:", email);

        // Validate input
        if (!email || !password) {
            console.log("Missing required fields");
            return NextResponse.json(
                { message: "Email and password are required" },
                { status: 400 }
            );
        }

        // Validate email format
        if (!email.includes('@') || !email.includes('.')) {
            console.log("Invalid email format");
            return NextResponse.json(
                { message: "Invalid email format" },
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

        // Check for existing user
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            console.log("User already exists");
            return NextResponse.json(
                { message: "A user with this email already exists" },
                { status: 400 }
            );
        }

        // Generate unique userId
        let userId;
        let isUnique = false;
        let attempts = 0;
        const maxAttempts = 5;

        while (!isUnique && attempts < maxAttempts) {
            userId = generateUserId();
            const existingUserId = await User.findOne({ userId });
            if (!existingUserId) {
                isUnique = true;
            }
            attempts++;
        }

        if (!isUnique) {
            console.error("Failed to generate unique userId after", maxAttempts, "attempts");
            return NextResponse.json(
                { message: "Failed to generate unique user ID" },
                { status: 500 }
            );
        }

        // Hash password
        const hashedPW = await bcrypt.hash(password, 10);

        // Create new user
        const user = await User.create({
            userId,
            email: email.toLowerCase(),
            password: hashedPW
        });

        console.log("User created successfully with ID:", userId);

        return NextResponse.json(
            { 
                message: "User registered successfully",
                userId: user.userId
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Registration error:", error);
        
        // Handle specific mongoose errors
        if (error.name === 'ValidationError') {
            return NextResponse.json(
                { message: "Validation error", details: error.message },
                { status: 400 }
            );
        }

        if (error.code === 11000) {
            return NextResponse.json(
                { message: "A user with this email or ID already exists" },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { message: "An error occurred during registration" },
            { status: 500 }
        );
    }
}
