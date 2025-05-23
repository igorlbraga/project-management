"use client"

import { updateList } from "@/actions/update-list"
import { FormInput } from "@/components/form/form-input"
import { useAction } from "@/hooks/use-action"
import { List } from "@prisma/client"
import { ElementRef, useRef, useState } from "react"
import { toast } from "sonner"
import { useEventListener } from "usehooks-ts"
import { ListOptions } from "./list-options"

function ListHeader({ data, onAddCard }: { data: List, onAddCard: () => void }) {
    const [title, setTitle] = useState(data.title)
    const [isEditing, setIsEditing] = useState(false)

    const formRef = useRef<ElementRef<"form">>(null)
    const inputRef = useRef<ElementRef<"input">>(null)

    function enableEditing() {
        setIsEditing(true)
        setTimeout(() => {
            inputRef.current?.focus()
            inputRef.current?.select()
        })
    }

    function disableEditing() {
        setIsEditing(false)
    }

    const { execute, fieldErrors } = useAction(updateList, {
        onSuccess(data) {
            toast.success(`Rename to: ${data.title}`)
            setTitle(data.title)
            disableEditing()
        },
        onError(error) {
            toast.error(error)
        },
    })

    function onSubmit(formData: FormData) {
        const title = formData.get("title") as string
        const id = formData.get("id") as string
        const boardId = formData.get("boardId") as string

        if (title === data.title) return disableEditing()

        execute({
            title,
            id,
            boardId
        })
    }

    useEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            formRef.current?.requestSubmit()
        }
    })

    function onBlur() {
        formRef.current?.requestSubmit()
    }

    return (
        <div className="pt-2 px-2 text-sm font-semibold flex justify-between items-start gap-x-2">
            {isEditing ? (
                <form ref={formRef} action={onSubmit} className="flex-1 px-[2px] ">
                    <input hidden id="id" name="id" value={data.id} readOnly />
                    <input hidden id="boardId" name="boardId" value={data.boardId} readOnly />
                    <FormInput
                        ref={inputRef}
                        onBlur={onBlur}
                        id="title"
                        placeholder="Enter a list title..."
                        defaultValue={title}
                        errors={fieldErrors}
                        className="text-sm px-2 py-1 h-7 font-medium border-transparent hover:border-input focus:border-input transition truncate bg-transparent"
                    />
                </form>
            ) : (
                <div
                    onClick={enableEditing}
                    className="w-full cursor-text text-sm px-2.5 py-1 h-7 font-medium border-transparent truncate"
                >
                    {title}
                </div>
            )}
            <ListOptions
                onAddCard={onAddCard}
                data={data}
            />
        </div>
    )
}

export { ListHeader }