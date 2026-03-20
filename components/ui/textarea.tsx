import * as React from "react"

import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, value, defaultValue, onChange, readOnly, ...props }, ref) => {
    const isControlled = value !== undefined
    const hasOnChange = onChange !== undefined
    
    // If it's controlled but has no onChange, make it read-only
    const isReadOnly = readOnly || (isControlled && !hasOnChange)
    
    return (
      <textarea
        className={cn(
          "flex min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        value={isControlled ? value : undefined}
        defaultValue={!isControlled ? defaultValue : undefined}
        onChange={onChange}
        readOnly={isReadOnly}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
