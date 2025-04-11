import { NextResponse } from "next/server";
import { connectToDB } from "../../../../lib/mongo";
import Counselor from "../../../../models/counselor";

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