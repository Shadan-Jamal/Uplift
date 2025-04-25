import { NextResponse } from "next/server";
import { connectToDB } from "../../../../lib/mongo";
import User from "../../../../models/user";
import Counselor from "../../../../models/counselor";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "../../../../lib/email";

// Function to generate a random verification code
function generateVerificationCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req) {
    try {
        // Parse request body
        const body = await req.json();
        const { email, action, verificationCode, newPassword } = body;
        
        console.log(`Forgot password action: ${action} for email: ${email}`);

        // Validate input
        if (!email) {
            console.log("Missing email");
            return NextResponse.json(
                { message: "Email is required" },
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

        // Check if user exists in either collection
        let user = await User.findOne({ email: email.toLowerCase() });
        let userType = 'student';
        
        if (!user) {
            user = await Counselor.findOne({ email: email.toLowerCase() });
            userType = 'counselor';
        }

        if (!user) {
            console.log("User not found in either collection");
            return NextResponse.json(
                { message: "No account found with this email" },
                { status: 404 }
            );
        }

        // Handle different actions
        if (action === "request") {
            // Generate verification code
            const code = generateVerificationCode();
            
            // Store verification code in user document
            user.resetCode = code;
            user.resetCodeExpires = new Date(Date.now() + 3600000); // 1 hour from now
            await user.save();
            
            // Send verification email
            const emailSent = await sendVerificationEmail(email, code);
            
            if (!emailSent) {
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
        else if (action === "verify") {
            // Validate verification code
            if (!verificationCode) {
                return NextResponse.json(
                    { message: "Verification code is required" },
                    { status: 400 }
                );
            }
            
            // Check if code matches and is not expired
            if (user.resetCode !== verificationCode || user.resetCodeExpires < new Date()) {
                return NextResponse.json(
                    { message: "Invalid or expired verification code" },
                    { status: 400 }
                );
            }
            
            return NextResponse.json(
                { message: "Verification code is valid" },
                { status: 200 }
            );
        }
        else if (action === "reset") {
            // Validate new password
            if (!newPassword) {
                return NextResponse.json(
                    { message: "New password is required" },
                    { status: 400 }
                );
            }
            
            if (newPassword.length < 8) {
                return NextResponse.json(
                    { message: "Password must be at least 8 characters long" },
                    { status: 400 }
                );
            }
            
            // Hash new password
            const hashedPW = await bcrypt.hash(newPassword, 10);
            
            // Update user password and clear reset code
            user.password = hashedPW;
            user.resetCode = undefined;
            user.resetCodeExpires = undefined;
            await user.save();
            
            return NextResponse.json(
                { message: "Password reset successful" },
                { status: 200 }
            );
        }
        else {
            return NextResponse.json(
                { message: "Invalid action" },
                { status: 400 }
            );
        }
    } catch (error) {
        console.error("Forgot password error:", error);
        return NextResponse.json(
            { message: "An error occurred during password reset" },
            { status: 500 }
        );
    }
} 