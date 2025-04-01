import { NextResponse } from "next/server";
import { connectToDB } from "../../../../lib/mongo";
import Affirmation from "../../../../models/affirmation";

export async function POST(req){
    try{
        const {text} = await req.json();
        await connectToDB();
        const affirmation = await Affirmation.create({text});

        return NextResponse.json({
            success: true,
            affirmation
        }, {status: 201});
        
    }
    catch(err){
        console.log(err);
        return NextResponse.json({
            success : false,
            message : "Failed to add affirmation",
        },{status : 500});
    }
}