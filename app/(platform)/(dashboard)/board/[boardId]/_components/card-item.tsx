import { useCardModal } from "@/hooks/use-card-modal"
import { Draggable } from "@hello-pangea/dnd"
import { Card } from "@prisma/client"

interface CardItemProps {
    data: Card
    index: number
}
function CardItem({ data, index }: CardItemProps) {
    const { setOpen } = useCardModal()

    return (
        <Draggable draggableId={data.id} index={index}>
            {(provided) => (
                <li
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                >
                    <div
                        role="button"
                        onClick={() => setOpen(true, data.id)}
                        className="border-2 border-transparent overflow-ellipsis overflow-hidden hover:border-black py-2 px-3 text-sm bg-white rounded-md shadow-sm cursor-pointer"
                    >
                        {data.title}
                    </div>
                </li>
            )
            }
        </Draggable>
    )
}

export { CardItem }