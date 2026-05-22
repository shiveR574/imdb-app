import User from "@/src/models/User";
import db from "@/src/utils/db";
import connect from "@/src/utils/db";
import bcrypt from "bcryptjs";
import {NextResponse} from "next/server";

export const POST = async (request: any) =>{
    const {email, password, firstName, lastName} = await request.json();
    
    await connect();
        
    const existingUser = await User.findOne({email});


    if (existingUser) {
        return new NextResponse("Email is already in use", {
            status: 400,
        })
    }

    if (!password || password.length < 8) {
        return new NextResponse("Password must be at least 8 characters", { status: 400 });
    }    

    const hashedPassword = await bcrypt.hash(password, 5);
    const newUser = new User({
        firstName,
        lastName,
        email,
        password: hashedPassword,
    })

    try {
        await newUser.save();
        return new NextResponse("User has been registered", {
            status: 200,
        });
    } catch (err: any){
        console.log("Register error: ", err);
        return new NextResponse(err.message ?? "Internal Server Error", {
            status: 500,
        });
    }
}


