import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Check, Copy, Eye, EyeOff, PackageCheck, PlugZap, RefreshCw } from 'lucide-react';
import { ConnectionDiagram } from '../components/ConnectionDiagram';
import { PageHeader } from '../components/PageHeader';
import { StageBadge } from '../components/StageBadge';
import { StatCard } from '../components/StatCard';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/Select';
import { Separator } from '../components/ui/Separator';
import { Switch } from '../components/ui/CSwitch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/Tabs';
import { referenceRules } from '../data/referenceData';
import { syncRuns, syncedDatasets } from '../data/syncHistory';
import { useWorkflow } from '../contexts/WorkflowContext';
import { useScreenInit } from '../useScreenInit.js';

const statusTone: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  ok: 'secondary',
  stale: 'outline',
  error: 'destructive',
  success: 'secondary',
  partial: 'outline',
  failed: 'destructive'
};

export function SmartKargo() {
  const { shipments, acceptCargo } = useWorkflow();
  const screenInit = useScreenInit();
  const [tab, setTab] = useState<string>(screenInit.tab ?? 'connection');
  const [env, setEnv] = useState('prod');
  const [interval, setIntervalValue] = useState('5');
  const [writeBack, setWriteBack] = useState(true);
  const [pullEmbargo, setPullEmbargo] = useState(true);
  const [showKey, setShowKey] = useState(false);

  const readyToAccept = shipments.filter((s) => s.stage === 'compliance_ok');

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Integration"
        title="SmartKargo"
        actions={
        <Badge variant="secondary" className="gap-1.5">
            <PlugZap className="h-3 w-3" aria-hidden="true" />
            Connected
          </Badge>
        } />
      

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="connection">Connection</TabsTrigger>
          <TabsTrigger value="data">Data sources</TabsTrigger>
          <TabsTrigger value="sync">Sync history</TabsTrigger>
          <TabsTrigger value="status">Order status</TabsTrigger>
        </TabsList>

        <TabsContent value="connection" className="mt-4 space-y-4">
          <ConnectionDiagram env={env} latencyMs={184} uptime="99.97%" lastSync="2 min ago" />

          <div className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Credentials</CardTitle>
                <CardDescription>Used by every node that reads or writes SmartKargo.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="env">Environment</Label>
                  <Select value={env} onValueChange={setEnv}>
                    <SelectTrigger id="env">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="prod">Production</SelectItem>
                      <SelectItem value="uat">UAT</SelectItem>
                      <SelectItem value="sandbox">Sandbox</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="interval">Poll interval</Label>
                  <Select value={interval} onValueChange={setIntervalValue}>
                    <SelectTrigger id="interval">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Every 1 min</SelectItem>
                      <SelectItem value="5">Every 5 min</SelectItem>
                      <SelectItem value="15">Every 15 min</SelectItem>
                      <SelectItem value="60">Hourly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="baseUrl">Base URL</Label>
                  <Input id="baseUrl" defaultValue="https://api.smartkargo.com/swift247/v2" />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="apiKey">API key</Label>
                  <div className="flex gap-2">
                    <Input
                      id="apiKey"
                      type={showKey ? 'text' : 'password'}
                      defaultValue="sk_live_9f2b41c7a8d3"
                      className="font-mono" />
                    
                    <Button
                      variant="outline"
                      size="icon"
                      aria-label={showKey ? 'Hide API key' : 'Reveal API key'}
                      onClick={() => setShowKey((v) => !v)}>
                      
                      {showKey ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      aria-label="Copy API key"
                      onClick={() => toast.success('API key copied')}>
                      
                      <Copy className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="webhook">Webhook</Label>
                  <div className="flex gap-2">
                    <Input id="webhook" readOnly value="https://ops.swift247.vn/hooks/smartkargo/orders" />
                    <Button
                      variant="outline"
                      size="icon"
                      aria-label="Copy webhook URL"
                      onClick={() => toast.success('Copied')}>
                      
                      <Copy className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
                <Separator className="sm:col-span-2" />
                <label className="flex items-center justify-between gap-3 sm:col-span-2">
                  <span>
                    <span className="block text-sm font-medium">Write status back</span>
                    <span className="block text-xs text-muted-foreground">PATCH /orders/{'{id}'}/status</span>
                  </span>
                  <Switch checked={writeBack} onCheckedChange={setWriteBack} aria-label="Write status back" />
                </label>
                <label className="flex items-center justify-between gap-3 sm:col-span-2">
                  <span>
                    <span className="block text-sm font-medium">Auto-pull restricted list</span>
                    <span className="block text-xs text-muted-foreground">Hourly</span>
                  </span>
                  <Switch checked={pullEmbargo} onCheckedChange={setPullEmbargo} aria-label="Auto-pull embargoes" />
                </label>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Scopes</CardTitle>
                  <CardDescription>Granted to this extension</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground/70">
                      Read
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {['orders', 'rules', 'restricted', 'routes'].map((scope) =>
                      <span
                        key={scope}
                        className="flex items-center gap-1 rounded-md border border-border bg-card px-1.5 py-0.5 font-mono text-[10px] text-foreground">
                        
                          <Check className="h-2.5 w-2.5 text-chart-2" aria-hidden="true" />
                          {scope}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground/70">
                      Write
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {['orders.status', 'orders.fees'].map((scope) =>
                      <span
                        key={scope}
                        className="flex items-center gap-1 rounded-md border border-border bg-card px-1.5 py-0.5 font-mono text-[10px] text-foreground">
                        
                          <Check className="h-2.5 w-2.5 text-chart-2" aria-hidden="true" />
                          {scope}
                        </span>
                      )}
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs text-muted-foreground">API version</span>
                    <span className="font-mono text-xs text-foreground">v2.7</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => toast.success('Connection OK', { description: 'All scopes granted' })}>
                    
                    <Check className="h-3.5 w-3.5" aria-hidden="true" />
                    Test connection
                  </Button>
                </CardContent>
              </Card>

              <Button className="w-full" onClick={() => toast.success('Settings saved')}>
                Save settings
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="data" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Synced datasets</CardTitle>
              <CardDescription>Data the rule checks run against</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Dataset</TableHead>
                    <TableHead>Endpoint</TableHead>
                    <TableHead>Records</TableHead>
                    <TableHead>Frequency</TableHead>
                    <TableHead>Last sync</TableHead>
                    <TableHead className="w-24" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {syncedDatasets.map((dataset) =>
                  <TableRow key={dataset.id}>
                      <TableCell className="text-sm font-medium">{dataset.name}</TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">{dataset.endpoint}</TableCell>
                      <TableCell className="font-mono text-xs">{dataset.records}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{dataset.frequency}</TableCell>
                      <TableCell>
                        <Badge variant={statusTone[dataset.status]} className="text-[10px]">
                          {dataset.lastSync}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toast.success(`${dataset.name} synced`)}>
                        
                          <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
                          Sync
                        </Button>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Active rules</CardTitle>
              <CardDescription>{referenceRules.length} rules evaluated per run</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Rule</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Updated</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {referenceRules.map((rule) =>
                  <TableRow key={rule.id}>
                      <TableCell className="font-mono text-xs">{rule.code}</TableCell>
                      <TableCell className="max-w-[320px] text-sm">{rule.title}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-[10px]">
                          {rule.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-xs">{rule.value}</TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">{rule.updatedAt}</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sync" className="mt-4 space-y-4">
          <div className="grid gap-4 sm:grid-cols-4">
            {[
            { label: 'Runs today', value: '214' },
            { label: 'Success rate', value: '98.1%' },
            { label: 'Records synced', value: '4,318' },
            { label: 'Last failure', value: '07:15' }].
            map((stat) =>
            <StatCard key={stat.label} label={stat.label} value={stat.value} />
            )}
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">History</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Time</TableHead>
                    <TableHead>Dataset</TableHead>
                    <TableHead>Direction</TableHead>
                    <TableHead className="text-right">Records</TableHead>
                    <TableHead className="text-right">Duration</TableHead>
                    <TableHead>Result</TableHead>
                    <TableHead>Detail</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {syncRuns.map((run) =>
                  <TableRow key={run.id}>
                      <TableCell className="whitespace-nowrap font-mono text-xs text-muted-foreground">
                        {run.at}
                      </TableCell>
                      <TableCell className="text-sm">{run.dataset}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-mono text-[10px] uppercase">
                          {run.direction}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-mono text-xs tabular-nums">{run.records}</TableCell>
                      <TableCell className="text-right font-mono text-xs tabular-nums">{run.duration}</TableCell>
                      <TableCell>
                        <Badge variant={statusTone[run.status]} className="text-[10px]">
                          {run.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-[260px] truncate text-xs text-muted-foreground">
                        {run.detail}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="status" className="mt-4 space-y-4">
          {readyToAccept.length ?
          <Card>
              <CardHeader>
                <CardTitle className="text-base">Cleared for pickup</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {readyToAccept.map((order) =>
              <div
                key={order.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border p-4">
                
                    <div>
                      <p className="font-mono text-sm font-medium">{order.trackingNo}</p>
                      <p className="text-xs text-muted-foreground">
                        {order.sender}, {order.origin} → {order.destination}
                      </p>
                    </div>
                    <Button
                  size="sm"
                  onClick={() => {
                    acceptCargo(order.id);
                    toast.success('Picked up', { description: order.trackingNo });
                  }}>
                  
                      <PackageCheck className="h-3.5 w-3.5" aria-hidden="true" />
                      Confirm pickup
                    </Button>
                  </div>
              )}
              </CardContent>
            </Card> :
          null}

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Order records</CardTitle>
              <CardDescription>Status written back to SmartKargo</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tracking</TableHead>
                    <TableHead>Order ref</TableHead>
                    <TableHead>Sender</TableHead>
                    <TableHead className="text-right">Risk</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-24" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {shipments.map((order) =>
                  <TableRow key={order.id}>
                      <TableCell className="font-mono text-xs">{order.trackingNo}</TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">{order.orderRef}</TableCell>
                      <TableCell className="text-sm">{order.sender}</TableCell>
                      <TableCell className="text-right font-mono text-xs tabular-nums">{order.riskScore}</TableCell>
                      <TableCell>
                        <StageBadge stage={order.stage} />
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" asChild>
                          <Link to={`/agent/${order.id}`}>Run log</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>);

}