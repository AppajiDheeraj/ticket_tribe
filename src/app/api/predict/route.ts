import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { prediction } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function POST(request: NextRequest) {
    try {
        const { userId, AAPL, MSFT, GOOGL } = await request.json();

        const [latest] = await db
        .select()
        .from(prediction)
        .where(eq(prediction.userId, userId))
        .orderBy(desc(prediction.createdAt))
        .limit(1);

        if (!latest || latest.locked) {
            await db.insert(prediction).values({
                userId,
                AAPL,
                MSFT,
                GOOGL,
                date: new Date(),
                locked: false,
            });
            return NextResponse.json({ message: "created" },{status:201});
        }

        await db
        .update(prediction)
        .set({
            AAPL,
            MSFT,
            GOOGL,
            date: new Date(),
            locked: false,
        })
        .where(eq(prediction.id, latest.id));

        return NextResponse.json({ message: "updated" },{status:200});
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}
