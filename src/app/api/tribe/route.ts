import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { tribe, tribeMembers, user, prediction } from "@/db/schema";
import { eq, desc, inArray } from "drizzle-orm";

export async function POST(request: NextRequest) {
    try {
        const { tribeId } = await request.json();

        const [tribeInfo] = await db
        .select()
        .from(tribe)
        .where(eq(tribe.id, tribeId));

        if (!tribeInfo) {
            return NextResponse.json({ error: "Invalid tribe ID" }, { status: 400 });
        }

        const members = await db
        .select({
            userId: tribeMembers.userId,
            name: user.name,
            email: user.email,
            points: user.points,
        })
        .from(tribeMembers)
        .innerJoin(user, eq(user.id, tribeMembers.userId))
        .where(eq(tribeMembers.tribeId, tribeId));

        const userIds = members.map((m) => m.userId);
        if (userIds.length === 0) {
            return NextResponse.json({ tribe: tribeInfo, members: [] });
        }

        const preds = await db
        .select()
        .from(prediction)
        .where(inArray(prediction.userId, userIds))
        .orderBy(desc(prediction.createdAt));

        const predMap = new Map();
        for (const p of preds) {
            if (!predMap.has(p.userId)) {
                predMap.set(p.userId, p);
            }
        }

        const result = members.map((m) => ({
            use3diction: predMap.get(m.userId) ?? null,
        }));

        return NextResponse.json({ tribe: tribeInfo, members: result });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}
