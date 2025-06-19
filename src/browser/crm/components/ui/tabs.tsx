import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "../../lib/utils"

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "crm-inline-flex crm-h-10 crm-items-center crm-justify-center crm-rounded-md crm-bg-muted crm-p-1 crm-text-muted-foreground",
      className
    )}
    {...props}
  />
))
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "crm-inline-flex crm-items-center crm-justify-center crm-whitespace-nowrap crm-rounded-sm crm-px-3 crm-py-1.5 crm-text-sm crm-font-medium crm-ring-offset-background crm-transition-all focus-visible:crm-outline-none focus-visible:crm-ring-2 focus-visible:crm-ring-ring focus-visible:crm-ring-offset-2 disabled:crm-pointer-events-none disabled:crm-opacity-50 data-[state=active]:crm-bg-background data-[state=active]:crm-text-foreground data-[state=active]:crm-shadow-sm",
      className
    )}
    {...props}
  />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "crm-mt-2 crm-ring-offset-background focus-visible:crm-outline-none focus-visible:crm-ring-2 focus-visible:crm-ring-ring focus-visible:crm-ring-offset-2",
      className
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }