import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { ListContainer } from "./_components/list-container"

interface BoardIdPageProps {
    params: {
        boardId: string
    }
}

async function BoardIdPage({ params: { boardId } }: BoardIdPageProps) {
    const { orgId } = auth()

    if (!orgId) redirect("/select-org")

    const lists = await db.list.findMany({
        where: {
            boardId: boardId,
            board: { orgId }
        },
        include: { cards: { orderBy: { order: "asc" } } },
        orderBy: { order: "asc" }
    })
    return (
        <div className="p-4 h-full overflow-x-auto">
            <ListContainer
                boardId={boardId}
                lists={lists}
            />
        </div>
    )
}

export default BoardIdPage