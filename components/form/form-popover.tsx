"use client"

import {
    Popover,
    PopoverClose,
    PopoverContent,
    PopoverTrigger
} from "@/components/ui/popover"
import { Button } from "../ui/button"
import { X } from "lucide-react"
import { FormInput } from "./form-input"
import { FormSubmit } from "./form-submit"
import { createBoard } from "@/actions/create-board"
import { useAction } from "@/hooks/use-action"
import { toast } from "sonner"
import { FormPicker } from "./form-picker"
import { ElementRef, useRef } from "react"
import { useRouter } from "next/navigation"
import { useProModal } from "@/hooks/use-pro-modal"


interface FormPopoverProps {
    children: React.ReactNode,
    side?: "left" | "right" | "top" | "bottom",
    align?: "start" | "center" | "end"
    sideOffset?: number
}

function FormPopover({
    children,
    align,
    side = "bottom",
    sideOffset = 0
}: FormPopoverProps) {
    const proModal = useProModal()
    const router = useRouter()
    const closeRef = useRef<ElementRef<"button">>(null)

    const { execute, fieldErrors } = useAction(createBoard, {
        onSuccess({ id }) {
            toast.success("Board created!")
            closeRef.current?.click()
            router.push(`/board/${id}`)
        },

        onError(error) {
            toast.error(error)
            proModal.setOpen(true)
        }
    })

    function onSubmit(formData: FormData) {
        const title = formData.get("title") as string
        const image = formData.get("image") as string

        execute({
            title,
            image
        })
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                {children}
            </PopoverTrigger>
            <PopoverContent
                align={align}
                className="w-80 pt-3"
                side={side}
                sideOffset={sideOffset}
            >
                <div className="text-sm font-medium text-center text-neutral-600 pb-4">
                    Create board
                </div>

                <PopoverClose ref={closeRef} asChild>
                    <Button className="h-auto w-auto p-2 absolute top-2 right-2 text-neutral-600" variant="ghost">
                        <X className="h-4 w-4" />
                    </Button>
                </PopoverClose>

                <form action={onSubmit} className="space-y-4">
                    <div className="space-y-4">
                        <FormPicker
                            id="image"
                            errors={fieldErrors}
                        />
                        <FormInput
                            id="title"
                            label="Board Title"
                            type="text"
                            errors={fieldErrors}
                        />
                    </div>
                    <FormSubmit
                        className="w-full"
                        variant="primary"
                    >
                        Create
                    </FormSubmit>
                </form>
            </PopoverContent>
        </Popover>
    )
}

export { FormPopover }