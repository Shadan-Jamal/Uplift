import { NextResponse } from "next/server";
import { connectToDB } from "../../../lib/mongo";
import User from "../../../models/user";
import bcrypt from "bcryptjs";

export async function POST(req) {
    try {
        const { email, password } = await req.json();
        const hashedPW = await bcrypt.hash(password, 10);
        await connectToDB();
        const existingUser = await User.findOne({ email });
        
        if (existingUser) {
            return NextResponse.json(
                { message: "User already exists" },
                { status: 400 }
            );
        }
        await User.create({ email, password: hashedPW });

        return NextResponse.json(
            { message: "User registered successfully" },
            { status: 201 }
        );
    } catch (error) {
        console.error("Registration error:", error);
        return NextResponse.json(
            { message: "User registration failed" },
            { status: 500 }
        );
    }
}
