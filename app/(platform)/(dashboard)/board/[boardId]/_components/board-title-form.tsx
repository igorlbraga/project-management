"use client"

import { ElementRef, useRef, useState } from "react"

import { Button } from "@/components/ui/button"
import { Board } from "@prisma/client"
import { FormInput } from "@/components/form/form-input"
import { toast } from "sonner"
import { useAction } from "@/hooks/use-action"
import { updateBoard } from "@/actions/update-board"

interface BoardTitleFormProps {
    data: Board
}

function BoardTitleForm({
    data
}: BoardTitleFormProps) {
    const { execute } = useAction(updateBoard, {
        onSuccess(data) {
            toast.success(`Board ${data.title} updated!`)
            setTitle(data.title)
            disableEditing()
        },
        onError(error) {
            toast.error(error)
        },
    })

    const formRef = useRef<ElementRef<"form">>(null)
    const inputRef = useRef<ElementRef<"input">>(null)

    const [title, setTitle] = useState(data.title)
    const [isEditing, setIsEditing] = useState(false)

    function enableEditing() {
        // TODO: Focus editing
        setIsEditing(true)
        setTimeout(() => {
            inputRef.current?.focus()
            inputRef.current?.select()
        })
    }

    function disableEditing() {
        setIsEditing(false)
    }

    function onSubmit(formData: FormData) {
        const title = formData.get("title") as string

        execute({ title, id: data.id })
    }

    function onBlur() {
        if (inputRef.current?.value != title)
            formRef.current?.requestSubmit()
        else disableEditing()
    }

    if (isEditing) {
        return (
            <form ref={formRef} className="flex w-full items-center gap-x-2" action={onSubmit}>
                <FormInput
                    ref={inputRef}
                    id="title"
                    onBlur={onBlur}
                    defaultValue={title}
                    className="text-lg w-full font-bold px-2 py-1 h-7 bg-transparent focus-visible:outline-none focus-visible:ring-transparent border-none"
                />
            </form>
        )
    }

    return (
        <Button
            onClick={enableEditing}
            className="inline-block font-bold text-lg h-auto w-auto max-w-full truncate p-1 px-2"
            variant="transparent"
        >
            {title}
        </Button>
    )
}

export { BoardTitleForm }