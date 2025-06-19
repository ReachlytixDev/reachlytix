import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../lib/utils"

const badgeVariants = cva(
  "crm-inline-flex crm-items-center crm-rounded-full crm-border crm-px-2.5 crm-py-0.5 crm-text-xs crm-font-semibold crm-transition-colors focus:crm-outline-none focus:crm-ring-2 focus:crm-ring-ring focus:crm-ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "crm-border-transparent crm-bg-primary crm-text-primary-foreground hover:crm-bg-primary/80",
        secondary:
          "crm-border-transparent crm-bg-secondary crm-text-secondary-foreground hover:crm-bg-secondary/80",
        destructive:
          "crm-border-transparent crm-bg-destructive crm-text-destructive-foreground hover:crm-bg-destructive/80",
        outline: "crm-text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }