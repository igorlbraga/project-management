import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(
    request: Request,
    { params }: { params: { cardId: string } }) {
    try {
        const { userId, orgId } = auth()

        if (!userId || !orgId) return new NextResponse("Unauthorized", { status: 401 })

        const card = await db.card.findUnique({
            where: {
                id: params.cardId,
                list: { board: { orgId } }
            },
            include: { list: { select: { title: true } } }
        })

        return NextResponse.json(card)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
        return new NextResponse("Internal Error", { status: 500 })
    }
}