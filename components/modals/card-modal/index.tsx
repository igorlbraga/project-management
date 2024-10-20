"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { useCardModal } from "@/hooks/use-card-modal"
import { CardWithList } from "@/types"
import { useQuery } from "@tanstack/react-query"
import { Header } from "./header"
import { Description } from "./description"
import { Actions } from "./actions"
import { AuditLog } from "@prisma/client"
import { Activity } from "./activity"


function CardModal() {
    const { id, isOpen, setOpen } = useCardModal()

    const { data: cardData } = useQuery<CardWithList>({
        queryKey: ["card", id],
        queryFn: async () => {
            const res = await fetch(`/api/cards/${id}`)
            return res.json()
        }
    })

    const { data: auditLogsData } = useQuery<AuditLog[]>({
        queryKey: ["card-logs", id],
        queryFn: async () => {
            const res = await fetch(`/api/cards/${id}/logs`)
            return res.json()
        }
    })

    console.log(cardData?.id)

    return (
        <Dialog
            open={isOpen}
            onOpenChange={() => setOpen(false)}
        >
            <DialogContent>
                {cardData ?
                    <Header data={cardData} /> :
                    <Header.Skeleton />
                }
                <div className="grid grid-cols-1 md:grid-cols-4 md:gap-4">
                    <div className="col-span-3">
                        <div className="w-full space-y-6">
                            {cardData ?
                                <Description data={cardData} /> :
                                <Description.Skeleton />
                            }
                            {auditLogsData ?
                                <Activity items={auditLogsData} /> :
                                <Activity.Skeleton />
                            }
                        </div>
                    </div>
                    {cardData ?
                        <Actions data={cardData} /> :
                        <Actions.Skeleton />
                    }
                </div>
            </DialogContent>
        </Dialog>
    )
}

export { CardModal }