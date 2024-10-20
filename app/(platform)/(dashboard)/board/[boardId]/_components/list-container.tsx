"use client"

import { ListWithCards } from "@/types"
import { useEffect, useState } from "react"
import { DragDropContext, Droppable } from "@hello-pangea/dnd"

import { ListForm } from "./list-form"
import { ListItem } from "./list-item"
import { useAction } from "@/hooks/use-action"
import { updateListOrder } from "@/actions/update-list-order"
import { toast } from "sonner"
import { updateCardOrder } from "@/actions/update-card-order"

interface ListContainerProps {
    lists: ListWithCards[],
    boardId: string
}

function reorder<T>(list: T[], startIndex: number, endIndex: number) {
    const result = Array.from(list)
    const [removed] = result.splice(startIndex, 1)
    result.splice(endIndex, 0, removed)

    return result
}

function ListContainer({ lists, boardId }: ListContainerProps) {
    const [data, setData] = useState(lists)

    useEffect(() => {
        setData(lists)
    }, [lists])

    const { execute: executeUpdateListOrder } = useAction(updateListOrder, {
        onError(error) {
            toast.error(error)
        },
    })

    const { execute: executeUpdateCardOrder } = useAction(updateCardOrder, {
        onError(error) {
            toast.error(error)
        },
    })

    return (
        <DragDropContext onDragEnd={(result) => {
            const { destination, source, type } = result

            if (!destination) return

            //Dropped in the same position
            if (
                destination.droppableId === source.droppableId &&
                destination.index === source.index
            ) return

            if (type === "list") {
                const items = reorder(
                    data,
                    source.index,
                    destination.index
                ).map((item, index) => ({ ...item, order: index + 1 }))

                setData(items)
                executeUpdateListOrder({ items, boardId })
            }

            if (type === "card") {
                const newData = [...data]

                const sourceList = newData.find(list => list.id === source.droppableId)
                const destList = newData.find(list => list.id === destination.droppableId)

                if (!sourceList || !destList) return;

                if (!sourceList.cards) sourceList.cards = []
                if (!destList.cards) destList.cards = []

                if (source.droppableId === destination.droppableId) {
                    const reorderedCards = reorder(
                        sourceList.cards,
                        source.index,
                        destination.index
                    )

                    reorderedCards.forEach((card, index) => card.order = index + 1)

                    sourceList.cards = reorderedCards
                    executeUpdateCardOrder({ items: reorderedCards, listId: source.droppableId, boardId })
                    setData(newData)
                } else {
                    const [removedCard] = sourceList.cards.splice(source.index, 1)
                    destList.cards.splice(destination.index, 0, removedCard)

                    sourceList.cards.forEach((item, index) => item.order = index + 1)
                    destList.cards.forEach((item, index) => item.order = index + 1)

                    setData(newData)
                    executeUpdateCardOrder({ items: destList.cards, listId: destination.droppableId, boardId })
                }

            }
        }}>
            <Droppable droppableId="lists" type="list" direction="horizontal">
                {(provided) => (
                    <ol
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="flex gap-x-3 h-full"
                    >
                        {data.map((list, index) => (
                            <ListItem
                                key={list.id}
                                index={index}
                                data={list}
                            />
                        ))}
                        {provided.placeholder}
                        <ListForm />
                        <div className="flex-shrink-0 w-1"></div>
                    </ol>
                )}

            </Droppable>
        </DragDropContext>
    )
}

export { ListContainer }