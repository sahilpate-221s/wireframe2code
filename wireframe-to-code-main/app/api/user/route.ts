import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/configs/db";
import { usersTable } from "@/configs/schema";

export async function POST(req: NextRequest) {
    try {
        const { userEmail, userName } = await req.json();
        
        if (!userEmail || !userName) {
            return NextResponse.json(
                { error: "Missing required fields: userEmail and userName" },
                { status: 400 }
            );
        }

        console.log("Checking user with email:", userEmail);
        
        // Check if user exists
        const existingUser = await db.select().from(usersTable)
            .where(eq(usersTable.email, userEmail));

        if (existingUser?.length > 0) {
            console.log("User found:", existingUser[0]);
            return NextResponse.json(existingUser[0]);
        }

        // Create new user
        console.log("Creating new user:", { name: userName, email: userEmail });
        const newUser = await db.insert(usersTable).values({
            name: userName,
            email: userEmail,
            credits: 3,
        }).returning();

        console.log("New user created:", newUser[0]);
        return NextResponse.json(newUser[0]);

    } catch (error) {
        console.error("Error in POST /api/user:", error);
        return NextResponse.json(
            { error: "Internal server error", details: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        );
    }
}

export async function GET(req: Request) {
    try {
        const reqUrl = req.url;
        const { searchParams } = new URL(reqUrl);
        const email = searchParams?.get('email');

        if (!email) {
            return NextResponse.json(
                { error: "Missing email parameter" },
                { status: 400 }
            );
        }

        const result = await db.select().from(usersTable)
            .where(eq(usersTable.email, email));

        if (result?.length === 0) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(result[0]);
    } catch (error) {
        console.error("Error in GET /api/user:", error);
        return NextResponse.json(
            { error: "Internal server error", details: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        );
    }
}
