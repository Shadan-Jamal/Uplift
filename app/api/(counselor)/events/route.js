import { NextResponse } from "next/server";
import {connectToDB} from "../../../../lib/mongo";
import Event from "../../../../models/event";

export async function POST(req){
    try{
        const {name, description, date, venue, poster} = await req.json();
        await connectToDB();
        const event = await Event.create({name, description, date, venue, poster});
        return NextResponse.json({
            success: true,
            message : "Event created successfully!"
        },{status : 201});
    }
    catch(err){
        console.log(err);
        return NextResponse.json({
            success : false,
            message : "Failed to create event",
        },{status : 500});
    }
}