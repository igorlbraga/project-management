"use client"

import { createCard } from "@/actions/create-card"
import { FormSubmit } from "@/components/form/form-submit"
import { FormTextarea } from "@/components/form/form-textarea"
import { Button } from "@/components/ui/button"
import { useAction } from "@/hooks/use-action"
import { Plus, X } from "lucide-react"
import { ElementRef, forwardRef, KeyboardEventHandler, useRef } from "react"
import { useParams } from "next/navigation"
import { useEventListener, useOnClickOutside } from "usehooks-ts"
import { toast } from "sonner"

interface CardFormProps {
    listId: string
    enableEditing: () => void
    disableEditing: () => void
    isEditing: boolean
}



export const CardForm = forwardRef<HTMLTextAreaElement, CardFormProps>(({
    listId,
    enableEditing,
    disableEditing,
    isEditing
}, ref) => {
    const params = useParams()
    const formRef = useRef<ElementRef<"form">>(null)

    const { execute, fieldErrors } = useAction(createCard, {
        onSuccess(data) {
            toast.success(`Card "${data.title}" created`)
            formRef.current?.reset()
        },
        onError(error) { toast.error(error) }
    })

    useOnClickOutside(formRef, disableEditing)
    useEventListener("keydown", (e) => e.key === "Escape" ? disableEditing() : null)

    const onTextareaKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            formRef.current?.requestSubmit()
        }
    }

    function onSubmit(formData: FormData) {
        const title = formData.get("title") as string
        const boardId = formData.get("boardId") as string
        const listId = formData.get("listId") as string

        execute({ title, boardId, listId })
    }

    if (isEditing) return (
        <form
            ref={formRef}
            action={onSubmit}
            className="m-1 py-0.5 px-1 space-y-4"
        >
            <FormTextarea
                id="title"
                onKeyDown={onTextareaKeyDown}
                ref={ref}
                errors={fieldErrors}
                placeholder="Enter a title for this card..."
            />
            <input
                hidden
                readOnly
                name="boardId"
                id="boardId"
                value={params.boardId}
            />
            <input
                hidden
                readOnly
                name="listId"
                id="listId"
                value={listId}
            />

            <div className="flex items-center gap-x-1">
                <FormSubmit>
                    Add card
                </FormSubmit>
                <Button onClick={disableEditing} size="sm" variant="ghost">
                    <X className="h-5 w-5" />
                </Button>
            </div>
        </form>
    )

    return (
        <div className="pt-2 px-2">
            <Button
                onClick={enableEditing}
                className="h-auto px-2 py-1.5 w-full justify-start text-muted-foreground text-sm"
                size="sm"
                variant="ghost"
            >
                <Plus className="h-4 w-4 mr-2" />
                Add a card
            </Button>
        </div>
    )
}
)

CardForm.displayName = "CardForm"