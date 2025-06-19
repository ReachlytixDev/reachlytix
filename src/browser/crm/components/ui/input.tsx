import * as React from "react"

import { cn } from "../../lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "crm-flex crm-h-10 crm-w-full crm-rounded-md crm-border crm-border-input crm-bg-background crm-px-3 crm-py-2 crm-text-sm crm-ring-offset-background file:crm-border-0 file:crm-bg-transparent file:crm-text-sm file:crm-font-medium placeholder:crm-text-muted-foreground focus-visible:crm-outline-none focus-visible:crm-ring-2 focus-visible:crm-ring-ring focus-visible:crm-ring-offset-2 disabled:crm-cursor-not-allowed disabled:crm-opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }