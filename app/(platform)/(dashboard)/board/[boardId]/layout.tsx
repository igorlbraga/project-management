import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs/server"
import { notFound, redirect } from "next/navigation"
import { BoardNavbar } from "./_components/board-navbar"

export async function generateMetadata({
    params
}: {
    params: { boardId: string }
}) {
    const { orgId } = auth()

    if (!orgId) {
        return {
            title: "Board"
        }
    }

    const board = await db.board.findUnique({
        where: {
            id: params.boardId,
            orgId
        }
    })

    return {
        title: board?.title || "Board"
    }
}

async function BoardIdLayout({
    children,
    params
}: {
    children: React.ReactNode,
    params: { boardId: string }
}) {
    const { orgId } = auth()

    if (!orgId) redirect("/select-org")

    const board = await db.board.findUnique({
        where: {
            id: params.boardId,
            orgId
        },
        include: { image: true }
    })

    if (!board) notFound()



    return (
        <div
            style={{ backgroundImage: `url(${board.image?.fullUrl})` }}
            className="relative h-full bg-no-repeat bg-cover bg-center"
        >
            <BoardNavbar board={board} />
            <div className="absolute inset-0 bg-black/10" />
            <main className="relative pt-28 h-full">
                {children}
            </main>
        </div>
    )
}

export default BoardIdLayout