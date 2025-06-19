import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../lib/utils"

const buttonVariants = cva(
  "crm-inline-flex crm-items-center crm-justify-center crm-whitespace-nowrap crm-rounded-md crm-text-sm crm-font-medium crm-ring-offset-background crm-transition-colors focus-visible:crm-outline-none focus-visible:crm-ring-2 focus-visible:crm-ring-ring focus-visible:crm-ring-offset-2 disabled:crm-pointer-events-none disabled:crm-opacity-50",
  {
    variants: {
      variant: {
        default: "crm-bg-primary crm-text-primary-foreground hover:crm-bg-primary/90",
        destructive:
          "crm-bg-destructive crm-text-destructive-foreground hover:crm-bg-destructive/90",
        outline:
          "crm-border crm-border-input crm-bg-background hover:crm-bg-accent hover:crm-text-accent-foreground",
        secondary:
          "crm-bg-secondary crm-text-secondary-foreground hover:crm-bg-secondary/80",
        ghost: "hover:crm-bg-accent hover:crm-text-accent-foreground",
        link: "crm-text-primary crm-underline-offset-4 hover:crm-underline",
      },
      size: {
        default: "crm-h-10 crm-px-4 crm-py-2",
        sm: "crm-h-9 crm-rounded-md crm-px-3",
        lg: "crm-h-11 crm-rounded-md crm-px-8",
        icon: "crm-h-10 crm-w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }