import * as React from "react"
import { 
  Database, 
  FileSpreadsheet, 
  Upload, 
  Download, 
  RefreshCw, 
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Plus,
  Import,
  Export
} from "lucide-react"
import { Button } from "../ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { Input } from "../ui/input"
import { cn } from "../../lib/utils"
import { ExtensionManager } from "../../integrations/extensions"

interface DataIntegrationProps {
  className?: string
}

interface DataSource {
  id: string
  name: string
  type: 'database' | 'csv' | 'excel' | 'api'
  status: 'connected' | 'disconnected' | 'error'
  lastSync: Date
  recordCount: number
  description: string
}

interface DataTable {
  name: string
  type: string
  records: number
  lastModified: Date
  columns: string[]
}

const mockDataSources: DataSource[] = [
  {
    id: 'crm-db',
    name: 'CRM Database',
    type: 'database',
    status: 'connected',
    lastSync: new Date(),
    recordCount: 15420,
    description: 'Main CRM SQLite database'
  },
  {
    id: 'leads-csv',
    name: 'Lead Import CSV',
    type: 'csv',
    status: 'connected',
    lastSync: new Date(Date.now() - 3600000),
    recordCount: 2500,
    description: 'Monthly lead import file'
  },
  {
    id: 'contacts-excel',
    name: 'Contact Database',
    type: 'excel',
    status: 'disconnected',
    lastSync: new Date(Date.now() - 86400000),
    recordCount: 8900,
    description: 'Excel contact database'
  }
]

const mockTables: DataTable[] = [
  {
    name: 'leads',
    type: 'table',
    records: 5420,
    lastModified: new Date(),
    columns: ['id', 'first_name', 'last_name', 'email', 'phone', 'company', 'status']
  },
  {
    name: 'contacts',
    type: 'table',
    records: 8900,
    lastModified: new Date(Date.now() - 1800000),
    columns: ['id', 'name', 'email', 'phone', 'address', 'created_at']
  },
  {
    name: 'campaigns',
    type: 'table',
    records: 156,
    lastModified: new Date(Date.now() - 3600000),
    columns: ['id', 'name', 'type', 'status', 'start_date', 'end_date']
  },
  {
    name: 'call_logs',
    type: 'table',
    records: 12340,
    lastModified: new Date(Date.now() - 7200000),
    columns: ['id', 'lead_id', 'agent_id', 'duration', 'status', 'notes', 'created_at']
  }
]

export function DataIntegration({ className }: DataIntegrationProps) {
  const [activeTab, setActiveTab] = React.useState("sources")
  const [selectedSource, setSelectedSource] = React.useState<DataSource | null>(null)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)

  const extensionManager = ExtensionManager.getInstance()

  const handleConnectDatabase = async () => {
    setIsLoading(true)
    try {
      await extensionManager.executeExtensionCommand(
        'cweijan.vscode-database-client2',
        'database.connect'
      )
    } catch (error) {
      console.error('Failed to connect to database:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenCSV = async (fileName: string) => {
    try {
      await extensionManager.executeExtensionCommand(
        'mechatroner.rainbow-csv',
        'rainbow-csv.query',
        [fileName]
      )
    } catch (error) {
      console.error('Failed to open CSV:', error)
    }
  }

  const handleOpenExcel = async (fileName: string) => {
    try {
      await extensionManager.executeExtensionCommand(
        'GrapeCity.gc-excelviewer',
        'excel.openFile',
        [fileName]
      )
    } catch (error) {
      console.error('Failed to open Excel file:', error)
    }
  }

  const handleQueryData = async (tableName: string) => {
    try {
      await extensionManager.executeExtensionCommand(
        'cweijan.vscode-database-client2',
        'database.query',
        [`SELECT * FROM ${tableName} LIMIT 100`]
      )
    } catch (error) {
      console.error('Failed to query data:', error)
    }
  }

  const getStatusColor = (status: DataSource['status']) => {
    switch (status) {
      case 'connected':
        return 'crm-bg-green-100 crm-text-green-800'
      case 'disconnected':
        return 'crm-bg-gray-100 crm-text-gray-800'
      case 'error':
        return 'crm-bg-red-100 crm-text-red-800'
      default:
        return 'crm-bg-gray-100 crm-text-gray-800'
    }
  }

  const getTypeIcon = (type: DataSource['type']) => {
    switch (type) {
      case 'database':
        return Database
      case 'csv':
        return FileSpreadsheet
      case 'excel':
        return FileSpreadsheet
      case 'api':
        return RefreshCw
      default:
        return Database
    }
  }

  const renderDataSourceCard = (source: DataSource) => {
    const IconComponent = getTypeIcon(source.type)
    const statusColor = getStatusColor(source.status)

    return (
      <Card 
        key={source.id}
        className={cn(
          "crm-cursor-pointer crm-transition-all hover:crm-shadow-md",
          selectedSource?.id === source.id && "crm-ring-2 crm-ring-primary"
        )}
        onClick={() => setSelectedSource(source)}
      >
        <CardHeader>
          <div className="crm-flex crm-items-start crm-justify-between">
            <div className="crm-flex crm-items-center crm-gap-3">
              <div className="crm-p-2 crm-bg-muted crm-rounded-lg">
                <IconComponent className="crm-h-5 crm-w-5" />
              </div>
              <div>
                <CardTitle className="crm-text-lg">{source.name}</CardTitle>
                <CardDescription>{source.description}</CardDescription>
              </div>
            </div>
            <Badge className={statusColor}>
              {source.status}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="crm-space-y-2">
            <div className="crm-flex crm-justify-between crm-text-sm">
              <span className="crm-text-muted-foreground">Records:</span>
              <span className="crm-font-medium">{source.recordCount.toLocaleString()}</span>
            </div>
            <div className="crm-flex crm-justify-between crm-text-sm">
              <span className="crm-text-muted-foreground">Last Sync:</span>
              <span className="crm-font-medium">{source.lastSync.toLocaleTimeString()}</span>
            </div>
            <div className="crm-flex crm-gap-2 crm-mt-4">
              {source.type === 'database' && (
                <Button size="sm" variant="outline" onClick={(e) => {
                  e.stopPropagation()
                  handleConnectDatabase()
                }}>
                  <Database className="crm-h-3 crm-w-3 crm-mr-1" />
                  Connect
                </Button>
              )}
              {source.type === 'csv' && (
                <Button size="sm" variant="outline" onClick={(e) => {
                  e.stopPropagation()
                  handleOpenCSV(source.name)
                }}>
                  <Eye className="crm-h-3 crm-w-3 crm-mr-1" />
                  View
                </Button>
              )}
              {source.type === 'excel' && (
                <Button size="sm" variant="outline" onClick={(e) => {
                  e.stopPropagation()
                  handleOpenExcel(source.name)
                }}>
                  <Eye className="crm-h-3 crm-w-3 crm-mr-1" />
                  Open
                </Button>
              )}
              <Button size="sm" variant="ghost">
                <RefreshCw className="crm-h-3 crm-w-3" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const renderTableRow = (table: DataTable) => (
    <div key={table.name} className="crm-flex crm-items-center crm-justify-between crm-p-4 crm-border crm-rounded-lg">
      <div className="crm-flex crm-items-center crm-gap-3">
        <Database className="crm-h-5 crm-w-5 crm-text-muted-foreground" />
        <div>
          <p className="crm-font-medium">{table.name}</p>
          <p className="crm-text-sm crm-text-muted-foreground">
            {table.records.toLocaleString()} records • {table.columns.length} columns
          </p>
        </div>
      </div>
      <div className="crm-flex crm-items-center crm-gap-2">
        <Badge variant="outline">{table.type}</Badge>
        <Button size="sm" variant="outline" onClick={() => handleQueryData(table.name)}>
          <Search className="crm-h-3 crm-w-3 crm-mr-1" />
          Query
        </Button>
        <Button size="sm" variant="ghost">
          <Edit className="crm-h-3 crm-w-3" />
        </Button>
      </div>
    </div>
  )

  return (
    <div className={cn("crm-space-y-6", className)}>
      {/* Header */}
      <div className="crm-flex crm-items-center crm-justify-between">
        <div>
          <h1 className="crm-text-3xl crm-font-bold crm-tracking-tight">Data Integration</h1>
          <p className="crm-text-muted-foreground">
            Manage data sources and leverage VS Code extensions for data operations
          </p>
        </div>
        <div className="crm-flex crm-gap-2">
          <Button variant="outline">
            <Import className="crm-h-4 crm-w-4 crm-mr-2" />
            Import Data
          </Button>
          <Button>
            <Plus className="crm-h-4 crm-w-4 crm-mr-2" />
            Add Source
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="sources" className="crm-flex crm-items-center crm-gap-2">
            <Database className="crm-h-4 crm-w-4" />
            Data Sources
          </TabsTrigger>
          <TabsTrigger value="tables" className="crm-flex crm-items-center crm-gap-2">
            <FileSpreadsheet className="crm-h-4 crm-w-4" />
            Tables & Views
          </TabsTrigger>
          <TabsTrigger value="import" className="crm-flex crm-items-center crm-gap-2">
            <Upload className="crm-h-4 crm-w-4" />
            Import/Export
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sources" className="crm-space-y-4">
          <div className="crm-flex crm-items-center crm-gap-4 crm-mb-6">
            <div className="crm-flex-1">
              <Input
                placeholder="Search data sources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="crm-max-w-sm"
              />
            </div>
            <Button variant="outline">
              <Filter className="crm-h-4 crm-w-4 crm-mr-2" />
              Filter
            </Button>
          </div>

          <div className="crm-grid crm-gap-4 md:crm-grid-cols-2 lg:crm-grid-cols-3">
            {mockDataSources
              .filter(source => 
                source.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                source.description.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map(renderDataSourceCard)}
          </div>
        </TabsContent>

        <TabsContent value="tables" className="crm-space-y-4">
          <div className="crm-flex crm-items-center crm-justify-between crm-mb-6">
            <div className="crm-flex crm-items-center crm-gap-4">
              <Input
                placeholder="Search tables..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="crm-max-w-sm"
              />
              <Button variant="outline">
                <Filter className="crm-h-4 crm-w-4 crm-mr-2" />
                Filter
              </Button>
            </div>
            <Button variant="outline" onClick={handleConnectDatabase} disabled={isLoading}>
              <RefreshCw className={cn("crm-h-4 crm-w-4 crm-mr-2", isLoading && "crm-animate-spin")} />
              Refresh
            </Button>
          </div>

          <div className="crm-space-y-3">
            {mockTables
              .filter(table => 
                table.name.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map(renderTableRow)}
          </div>
        </TabsContent>

        <TabsContent value="import" className="crm-space-y-4">
          <div className="crm-grid crm-gap-6 md:crm-grid-cols-2">
            {/* Import Section */}
            <Card>
              <CardHeader>
                <CardTitle className="crm-flex crm-items-center crm-gap-2">
                  <Upload className="crm-h-5 crm-w-5" />
                  Import Data
                </CardTitle>
                <CardDescription>
                  Import data from various file formats using VS Code extensions
                </CardDescription>
              </CardHeader>
              <CardContent className="crm-space-y-4">
                <Button className="crm-w-full" onClick={() => handleOpenCSV('import')}>
                  <FileSpreadsheet className="crm-h-4 crm-w-4 crm-mr-2" />
                  Import CSV File
                </Button>
                <Button variant="outline" className="crm-w-full" onClick={() => handleOpenExcel('import')}>
                  <FileSpreadsheet className="crm-h-4 crm-w-4 crm-mr-2" />
                  Import Excel File
                </Button>
                <Button variant="outline" className="crm-w-full">
                  <Database className="crm-h-4 crm-w-4 crm-mr-2" />
                  Connect External DB
                </Button>
              </CardContent>
            </Card>

            {/* Export Section */}
            <Card>
              <CardHeader>
                <CardTitle className="crm-flex crm-items-center crm-gap-2">
                  <Download className="crm-h-5 crm-w-5" />
                  Export Data
                </CardTitle>
                <CardDescription>
                  Export CRM data to various formats for analysis and backup
                </CardDescription>
              </CardHeader>
              <CardContent className="crm-space-y-4">
                <Button variant="outline" className="crm-w-full">
                  <FileSpreadsheet className="crm-h-4 crm-w-4 crm-mr-2" />
                  Export to CSV
                </Button>
                <Button variant="outline" className="crm-w-full">
                  <FileSpreadsheet className="crm-h-4 crm-w-4 crm-mr-2" />
                  Export to Excel
                </Button>
                <Button variant="outline" className="crm-w-full">
                  <Database className="crm-h-4 crm-w-4 crm-mr-2" />
                  Database Backup
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}