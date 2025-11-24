import { NextResponse } from "next/server";
import { db } from "@/db";
import { prediction } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(_request: Request) {
    // if (request.headers.get("x-cron-secret") !== process.env.CRON_SECRET) {
    //     return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    // }

    await db
    .update(prediction)
    .set({ locked: true })
    .where(
        eq(prediction.locked, false)
    );

    return NextResponse.json({
        success: true,
        message: "Predictions locked for today",
    });
}
