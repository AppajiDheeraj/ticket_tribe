import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { user } from "@/db/schema";
import { desc } from "drizzle-orm";

export async function POST(request: NextRequest) {
    const { userId } = await request.json();

    const users = await db
        .select({
            id: user.id,
            name: user.name,
            points: user.points,
        })
        .from(user)
        .orderBy(desc(user.points));

    const rank = users.findIndex((u) => u.id === userId) + 1;

    return NextResponse.json({
        leaderboard: users,
        myRank: rank,
    });
}
