import { updateCard } from "@/actions/update-card"
import { FormSubmit } from "@/components/form/form-submit"
import { FormTextarea } from "@/components/form/form-textarea"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useAction } from "@/hooks/use-action"
import { CardWithList } from "@/types"
import { useQueryClient } from "@tanstack/react-query"
import { AlignLeft } from "lucide-react"
import { useParams } from "next/navigation"
import { ElementRef, useRef, useState } from "react"
import { toast } from "sonner"
import { useOnClickOutside } from "usehooks-ts"

interface DescriptionProps {
    data: CardWithList
}
function Description({ data }: DescriptionProps) {
    const params = useParams()
    const queryClient = useQueryClient()

    const [isEditing, setIsEditing] = useState(false)

    const formRef = useRef<ElementRef<"form">>(null)
    const textareaRef = useRef<ElementRef<"textarea">>(null)

    function setEditingMode(value: boolean) {
        if (value) {
            setIsEditing(true)
            setTimeout(() => textareaRef.current?.focus())
        } else setIsEditing(false)
    }

    const { execute, fieldErrors } = useAction(updateCard, {
        onSuccess(data) {
            queryClient.invalidateQueries({
                queryKey: ["card", data.id]
            })
            setEditingMode(false)
            toast.success(`Card "${data.title}" updated`)
        },
        onError(error) {
            toast.error(error)
        },
    })

    useOnClickOutside(formRef, () => setEditingMode(false))

    function onSubmit(formData: FormData) {
        const description = formData.get("description") as string
        const boardId = params.boardId as string

        execute({
            description,
            boardId,
            id: data.id
        })
    }

    return (
        <div className="flex items-start gap-x-3 w-full">
            <AlignLeft className="h-5 w-5 mt-0.5 text-neutral-700" />
            <div className="w-full ">
                <p className="font-semibold text-neutral-700 mb-2">
                    Description
                </p>
                {isEditing ?
                    <form
                        className="space-y-2"
                        action={onSubmit}>
                        <FormTextarea
                            id="description"
                            className="w-full mt-2"
                            placeholder="Add a more detailed description"
                            defaultValue={data.description || undefined}
                            ref={textareaRef}
                            errors={fieldErrors}
                        />
                        <div className="flex items-center gap-x-2">
                            <FormSubmit>
                                Save
                            </FormSubmit>
                            <Button
                                type="button"
                                onClick={() => setEditingMode(false)}
                                size="sm"
                                variant="ghost"
                            >
                                Cancel
                            </Button>
                        </div>
                    </form> :

                    <div
                        role="button"
                        onClick={() => setEditingMode(true)}
                        className="min-h-[78px] bg-neutral-200 text-sm font-medium py-3 px-3.5 rounded-md"
                    >
                        {data.description || "Add more detailed description..."}
                    </div>
                }
            </div>
        </div>
    )
}

export { Description }

Description.Skeleton = function DescriptionSkeleton() {
    return (
        <div className="flex items-start gap-x-3 w-full">
            <Skeleton className="h-6 w-6 bg-neutral-200" />
            <div className="w-full ">
                <Skeleton className="h-6 w-24 mb-2 bg-neutral-200" />
                <Skeleton className="w-full h-[78px] bg-neutral-200" />
            </div>
        </div>
    )
}