import { NextResponse } from "next/server";
import { db } from "@/db";
import { prediction, user } from "@/db/schema";
import { eq, and, sql } from "drizzle-orm";
import { fetchStockResults } from "@/lib/stocks";

export async function POST(request: Request) {
    if (request.headers.get("x-cron-secret") !== process.env.CRON_SECRET) {
        return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const today = new Date().toISOString().slice(0, 10);
    const todayDate = new Date(today);

    const results = await fetchStockResults();

    const preds = await db
        .select()
        .from(prediction)
        .where(
        and(eq(prediction.date, todayDate), eq(prediction.locked, true))
        );

    for (const p of preds) {
        let score = 0;
        if (p.AAPL === results.AAPL) score++;
        if (p.MSFT === results.MSFT) score++;
        if (p.GOOGL === results.GOOGL) score++;

        if (score == 3) {
        await db
            .update(user)
            .set({ points: sql`${user.points} + ${1}` })
            .where(eq(user.id, p.userId));
        }
    }

    return NextResponse.json({
        success: true,
        processed: preds.length,
        message: "Scores calculated & leaderboard updated",
    });
}
