import { NextResponse } from "next/server";
import { connectToDB } from "../../../lib/mongo";
import User from "../../../models/user";

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const email = searchParams.get('email');

        if (!email) {
            return NextResponse.json(
                { message: "Id is required" },
                { status: 400 }
            );
        }

        await connectToDB();

        const user = await User.findOne({ email })
            .select('userId email -_id'); // Only select userId and email, exclude _id

        if (!user) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(user);
    } catch (error) {
        console.error("Error fetching user:", error);
        return NextResponse.json(
            { message: "An error occurred while fetching user data" },
            { status: 500 }
        );
    }
} 