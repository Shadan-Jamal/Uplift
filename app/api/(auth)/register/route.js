import { NextResponse } from "next/server";
import { connectToDB } from "../../../../lib/mongo";
import User from "../../../../models/user";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "../../../../lib/email";

// Function to generate random ID
function generateUserId() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = 'SCC';
    for (let i = 0; i < 5; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

// Function to generate a random verification code
function generateVerificationCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req) {
    try {
        // Parse request body
        const body = await req.json();
        const { email, password, action, otp } = body;
        
        console.log(`Registration action: ${action || 'register'} for email: ${email}`);

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

        // Handle OTP request
        if (action === "request-otp") {
            // Validate input
            if (!email) {
                console.log("Missing email");
                return NextResponse.json(
                    { message: "Email is required" },
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

            // Check if email is from claretcollege.edu.in
            if (!email.includes("claretcollege.edu.in")) {
                console.log("Invalid email domain");
                return NextResponse.json(
                    { message: "Please use your college email (@claretcollege.edu.in)" },
                    { status: 400 }
                );
            }

            // Check for existing user
            const existingUser = await User.findOne({ email: email.toLowerCase() });
            console.log(existingUser)
            if (existingUser) {
                console.log("User already exists");
                return NextResponse.json(
                    { message: "A user with this email already exists" },
                    { status: 400 }
                );
            }

            // Generate verification code
            const verificationCode = generateVerificationCode();
            
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
            
            // Store verification code in user document
            const user = await User.create({
                userId,
                email: email.toLowerCase(),
                verificationCode,
                verificationCodeExpires: new Date(Date.now() + 60000), // 60 seconds from now
                password: password ? await bcrypt.hash(password, 10) : null
            });
            
            // Send verification email
            const emailSent = await sendVerificationEmail(email, verificationCode);
            
            if (!emailSent) {
                // If email sending fails, delete the user document
                await User.deleteOne({ _id: user._id });
                return NextResponse.json(
                    { message: "Failed to send verification email" },
                    { status: 500 }
                );
            }
            
            return NextResponse.json(
                { message: "Verification code sent to your email" },
                { status: 200 }
            );
        } 
        // Handle OTP verification and registration
        else if (action === "verify-otp") {
            // Validate input
            if (!email || !password || !otp) {
                console.log("Missing required fields");
                return NextResponse.json(
                    { message: "Email, password, and verification code are required" },
                    { status: 400 }
                );
            }

            // Find user with the email and verification code
            const user = await User.findOne({ 
                email: email.toLowerCase(),
                verificationCode: otp,
                verificationCodeExpires: { $gt: new Date() }
            });

            if (!user) {
                console.log("Invalid or expired verification code");
                return NextResponse.json(
                    { message: "Invalid or expired verification code" },
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

            // Update user with userId and clear verification code
            user.userId = userId;
            user.verificationCode = undefined;
            user.verificationCodeExpires = undefined;
            await user.save();

            console.log("User created successfully with ID:", userId);

            return NextResponse.json(
                { 
                    message: "User registered successfully",
                    userId: user.userId
                },
                { status: 201 }
            );
        }
        // Handle direct registration (legacy support)
        else {
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
        }
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
