"use client"

import { useFormStatus } from "react-dom"
import { Button } from "../ui/button"
import { cn } from "@/lib/utils"

interface FormSubmitProps {
    children: React.ReactNode,
    disabled?: boolean,
    className?: string,
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "primary"
}

function FormSubmit({
    children,
    disabled,
    className,
    variant = "primary"
}: FormSubmitProps) {
    const { pending } = useFormStatus()

    return (
        <Button
            disabled={pending || disabled}
            variant={variant}
            type="submit"
            size="sm"
            className={cn(className)}
        >
            {children}
        </Button>
    )
}

export { FormSubmit }