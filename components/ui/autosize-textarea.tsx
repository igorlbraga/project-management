"use client"

import type { ElementRef, FocusEventHandler, TextareaHTMLAttributes } from 'react';
import { forwardRef, useCallback, useEffect, useRef, useState } from 'react';

function setHeight(textarea: HTMLTextAreaElement, value: number) {
    textarea.style.height = `${value}px`
}

export type AutosizeTextareaProps =
    TextareaHTMLAttributes<HTMLTextAreaElement> & {
        shouldFocus?: boolean;
        bufferHeight?: number;
        minHeight?: number;
    };

export const AutosizeTextarea = forwardRef<
    HTMLTextAreaElement,
    AutosizeTextareaProps
>(
    (
        {
            onChange,
            onFocus: _onFocus,
            shouldFocus,
            bufferHeight = 0,
            minHeight = 0,
            ...props
        },
        ref,
    ) => {
        const [value] = useState("")
        const forwardedRef = useRef<ElementRef<"textarea">>(null);
        console.log(ref)

        useEffect(() => {
            if (shouldFocus && forwardedRef.current) {
                const textarea = forwardedRef.current;
                setTimeout(() => textarea.focus({ preventScroll: true }), 0);
            }
        }, [shouldFocus, forwardedRef]);

        const resize = useCallback(() => {
            const textarea = forwardedRef.current;
            if (!textarea) return;

            // We need to reset the height briefly so that we can correctly
            // recalculate the element's scrollHeight.
            setHeight(textarea, 0);

            // We then set the height directly, outside of the render loop.
            if (minHeight && minHeight >= textarea.scrollHeight) {
                setHeight(textarea, minHeight + bufferHeight);
            } else {
                setHeight(textarea, textarea.scrollHeight + bufferHeight);
            }
        }, [forwardedRef, bufferHeight, minHeight]);

        // Automatically resize the textarea as the value is updated.
        useEffect(() => {
            resize();
        }, [resize, value]);

        const onFocus = useCallback<FocusEventHandler<HTMLTextAreaElement>>(
            (e) => {
                resize();
                _onFocus?.(e);
            },
            [_onFocus, resize],
        );

        return (
            <textarea
                ref={forwardedRef}
                className="mt-32"
                value={value}
                onChange={onChange}
                onFocus={onFocus}
                {...props}
            />
        );
    },
);

AutosizeTextarea.displayName = "AutosizeTextarea"