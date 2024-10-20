"use client"

import { Copy, Trash } from "lucide-react"
import { useParams } from "next/navigation"

import { CardWithList } from "@/types"
import { useAction } from "@/hooks/use-action"
import { deleteCard } from "@/actions/delete-card"
import { copyCard } from "@/actions/copy-card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useCardModal } from "@/hooks/use-card-modal"
import { toast } from "sonner"


function Actions({ data }: { data: CardWithList }) {
    const params = useParams()
    const cardModal = useCardModal()

    const {
        execute: executeCopyCard,
        isLoading: isLoadingCopy
    } = useAction(copyCard, {
        onSuccess() { cardModal.setOpen(false) },
        onError(error) { toast.error(error) },
    })
    const {
        execute: executeDeleteCard,
        isLoading: isLoadingDelete
    } = useAction(deleteCard, {
        onSuccess() { cardModal.setOpen(false) },
        onError(error) { toast.error(error) },
    })

    const items = [
        {
            title: "Copy",
            icon: <Copy className="h-4 w-4 mr-2" />,
            onClick: () => {
                const boardId = params.boardId as string

                executeCopyCard({
                    id: data.id,
                    boardId
                })
            },
            disabled: isLoadingCopy
        },
        {
            title: "Delete",
            icon: <Trash className="h-4 w-4 mr-2" />,
            onClick: () => {
                const boardId = params.boardId as string

                executeDeleteCard({
                    id: data.id,
                    boardId
                })
            },
            disabled: isLoadingDelete
        }
    ]

    return (
        <div className="space-y-2 mt-2">
            <p className="text-xs font-semibold">
                Actions
            </p>
            {items.map((item) => (
                <Button
                    key={item.title}
                    variant="gray"
                    className="w-full justify-start"
                    size="inline"
                    onClick={item.onClick}
                    disabled={item.disabled}
                >
                    {item.icon}
                    {item.title}
                </Button>
            ))}

        </div>
    )
}

Actions.Skeleton = function ActionSkeleton() {
    return (
        <div className="space-y-2 mt-2">
            <Skeleton className="w-20 h-4 bg-neutral-200" />
            <Skeleton className="w-full h-8 bg-neutral-200" />
            <Skeleton className="w-full h-8 bg-neutral-200" />
        </div>
    )
}

export { Actions }