"use client"

import { updateCard } from "@/actions/update-card"
import { FormTextarea } from "@/components/form/form-textarea"
import { Skeleton } from "@/components/ui/skeleton"
import { useAction } from "@/hooks/use-action"
import { CardWithList } from "@/types"
import { useQueryClient } from "@tanstack/react-query"
import { Layout } from "lucide-react"
import { useParams } from "next/navigation"
import { ElementRef, useEffect, useRef, useState } from "react"
import { toast } from "sonner"

function Header({ data }: { data: CardWithList }) {
    const queryCLient = useQueryClient()
    const params = useParams()

    const { execute } = useAction(updateCard, {
        onSuccess(data) {
            queryCLient.invalidateQueries({
                queryKey: ["card", data.id]
            })

            queryCLient.invalidateQueries({
                queryKey: ["card-logs", data.id]
            })

            toast.success("Card renamed")
            setTitle(title)
        },
    })

    const textareaRef = useRef<ElementRef<"textarea">>(null)

    const [title, setTitle] = useState(data.title)


    function onSubmit(formData: FormData) {
        const title = formData.get("title") as string
        const boardId = params.boardId as string

        if (title === data.title) return

        execute({
            id: data.id,
            title,
            boardId
        })
    }

    function resize() {
        const element = textareaRef.current
        if (element) {
            if (element) {
                element.style.height = `0px`
                element.style.height = `${element.scrollHeight + 1}px`
            }
        }
    }

    useEffect(() => {
        resize()
    }, [])

    return (
        <div className="flex items-start gap-x-3 mb-6 w-full">
            <Layout className="h-5 w-5 mt-1 text-neutral-700" />
            <div className="w-full">
                <form action={onSubmit}>
                    <FormTextarea
                        id="title"
                        ref={textareaRef}
                        defaultValue={title}
                        onChange={resize}
                        className="font-semibold text-xl px-2 min-h-0 text-neutral-700 bg-transparent relative -left-1.5 w-[95%] focus-visible:bg-white py-1 focus-visible:border-input mb-0.5"
                        onBlur={() => textareaRef.current?.form?.requestSubmit()}
                    />
                </form>
                <p className="text-sm text-muted-foreground">
                    In list <span className="underline">{data.list.title}</span>
                </p>
            </div>
        </div>
    )
}

Header.Skeleton = function HeaderSkeleton() {
    return (
        <div className="flex items-start gap-x-3 mb-6">
            <Skeleton className="h-6 w-6 mt-1 bg-neutral-200" />
            <div>
                <Skeleton className=" w-24 h-6 mb-1 bg-neutral-200" />
                <Skeleton className=" w-12 h-4 bg-neutral-200" />
            </div>

        </div>
    )
}

export { Header }