import { NextResponse } from "next/server";
import { connectToDB } from "../../../../lib/mongo";
import Counselor from "../../../../models/counselor";
import bcrypt from "bcryptjs";

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const email = searchParams.get('email');

        if (!email) {
            return NextResponse.json(
                { message: "Email is required" },
                { status: 400 }
            );
        }

        await connectToDB();

        const counselor = await Counselor.findOne(
            { email: email.toLowerCase() },
            { password: 0, resetCode: 0, resetCodeExpires: 0 } // Exclude sensitive fields
        );

        if (!counselor) {
            return NextResponse.json(
                { message: "Counselor not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(counselor);
    } catch (error) {
        console.error("Error fetching counselor:", error);
        return NextResponse.json(
            { message: "An error occurred while fetching counselor details" },
            { status: 500 }
        );
    }
}

export async function POST(req) {
    try {
        const { email, password } = await req.json();
        
        if (!email || !password) {
            return NextResponse.json(
                { message: "Email and password are required" },
                { status: 400 }
            );
        }

        await connectToDB();

        // Here we need to include the password field in the query
        const counselor = await Counselor.findOne({ email: email.toLowerCase() });
        console.log(password, email)
        if (!counselor) {
            return NextResponse.json(
                { message: "Invalid credentials" },
                { status: 401 }
            );
        }

        // Compare the provided password with the stored hash
        const isPasswordValid = await bcrypt.compare(password, counselor.password);

        if (!isPasswordValid) {
            return NextResponse.json(
                { message: "Invalid credentials" },
                { status: 401 }
            );
        }

        // If authentication is successful, return counselor data without sensitive fields
        const { password: _, resetCode, resetCodeExpires, ...counselorData } = counselor.toObject();
        
        return NextResponse.json({
            message: "Authentication successful",
            counselor: counselorData
        });
    } catch (error) {
        console.error("Error authenticating counselor:", error);
        return NextResponse.json(
            { message: "An error occurred during authentication" },
            { status: 500 }
        );
    }
} 