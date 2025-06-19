import * as React from "react"
import { TrendingUp, Users, Phone, DollarSign, Target, Calendar } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { cn } from "../../lib/utils"
import { DashboardMetric } from "../../types"

interface DashboardProps {
  className?: string
}

const metrics: DashboardMetric[] = [
  {
    id: "total-leads",
    label: "Total Leads",
    value: "1,234",
    change: 12,
    changeType: "increase",
    icon: "Users",
    color: "blue",
  },
  {
    id: "calls-today",
    label: "Calls Today",
    value: "89",
    change: 5,
    changeType: "increase",
    icon: "Phone",
    color: "green",
  },
  {
    id: "revenue",
    label: "Revenue",
    value: "$45,231",
    change: 8,
    changeType: "increase",
    icon: "DollarSign",
    color: "yellow",
  },
  {
    id: "conversion-rate",
    label: "Conversion Rate",
    value: "23.5%",
    change: 2,
    changeType: "decrease",
    icon: "Target",
    color: "red",
  },
]

const iconMap = {
  Users,
  Phone,
  DollarSign,
  Target,
  TrendingUp,
  Calendar,
}

export function Dashboard({ className }: DashboardProps) {
  return (
    <div className={cn("crm-space-y-6", className)}>
      {/* Header */}
      <div>
        <h1 className="crm-text-3xl crm-font-bold crm-tracking-tight">Dashboard</h1>
        <p className="crm-text-muted-foreground">
          Welcome back! Here's what's happening with your CRM today.
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="crm-grid crm-gap-4 md:crm-grid-cols-2 lg:crm-grid-cols-4">
        {metrics.map((metric) => {
          const IconComponent = iconMap[metric.icon as keyof typeof iconMap]
          return (
            <Card key={metric.id}>
              <CardHeader className="crm-flex crm-flex-row crm-items-center crm-justify-between crm-space-y-0 crm-pb-2">
                <CardTitle className="crm-text-sm crm-font-medium">
                  {metric.label}
                </CardTitle>
                <IconComponent className="crm-h-4 crm-w-4 crm-text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="crm-text-2xl crm-font-bold">{metric.value}</div>
                {metric.change && (
                  <p className="crm-text-xs crm-text-muted-foreground">
                    <span
                      className={cn(
                        "crm-inline-flex crm-items-center",
                        metric.changeType === "increase"
                          ? "crm-text-green-600"
                          : "crm-text-red-600"
                      )}
                    >
                      <TrendingUp className="crm-mr-1 crm-h-3 crm-w-3" />
                      {metric.change}%
                    </span>{" "}
                    from last month
                  </p>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Recent Activity */}
      <div className="crm-grid crm-gap-4 md:crm-grid-cols-2 lg:crm-grid-cols-7">
        <Card className="lg:crm-col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="crm-space-y-4">
              <div className="crm-flex crm-items-center crm-space-x-4">
                <div className="crm-w-2 crm-h-2 crm-bg-blue-500 crm-rounded-full"></div>
                <div className="crm-flex-1">
                  <p className="crm-text-sm crm-font-medium">New lead: John Doe from Acme Corp</p>
                  <p className="crm-text-xs crm-text-muted-foreground">2 minutes ago</p>
                </div>
              </div>
              <div className="crm-flex crm-items-center crm-space-x-4">
                <div className="crm-w-2 crm-h-2 crm-bg-green-500 crm-rounded-full"></div>
                <div className="crm-flex-1">
                  <p className="crm-text-sm crm-font-medium">Call completed with Jane Smith</p>
                  <p className="crm-text-xs crm-text-muted-foreground">15 minutes ago</p>
                </div>
              </div>
              <div className="crm-flex crm-items-center crm-space-x-4">
                <div className="crm-w-2 crm-h-2 crm-bg-yellow-500 crm-rounded-full"></div>
                <div className="crm-flex-1">
                  <p className="crm-text-sm crm-font-medium">Email campaign sent to 500 contacts</p>
                  <p className="crm-text-xs crm-text-muted-foreground">1 hour ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:crm-col-span-3">
          <CardHeader>
            <CardTitle>Upcoming Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="crm-space-y-4">
              <div className="crm-flex crm-items-center crm-space-x-4">
                <Calendar className="crm-h-4 crm-w-4 crm-text-muted-foreground" />
                <div className="crm-flex-1">
                  <p className="crm-text-sm crm-font-medium">Follow up with ABC Company</p>
                  <p className="crm-text-xs crm-text-muted-foreground">Today, 2:00 PM</p>
                </div>
              </div>
              <div className="crm-flex crm-items-center crm-space-x-4">
                <Calendar className="crm-h-4 crm-w-4 crm-text-muted-foreground" />
                <div className="crm-flex-1">
                  <p className="crm-text-sm crm-font-medium">Demo call with XYZ Corp</p>
                  <p className="crm-text-xs crm-text-muted-foreground">Tomorrow, 10:00 AM</p>
                </div>
              </div>
              <div className="crm-flex crm-items-center crm-space-x-4">
                <Calendar className="crm-h-4 crm-w-4 crm-text-muted-foreground" />
                <div className="crm-flex-1">
                  <p className="crm-text-sm crm-font-medium">Review quarterly reports</p>
                  <p className="crm-text-xs crm-text-muted-foreground">Friday, 3:00 PM</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}