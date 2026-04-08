"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { format } from "date-fns"
import { Download, FileText, CheckCircle, Clock, AlertTriangle, Receipt } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import api from "@/lib/api-client"

const STATUS_CONFIG: Record<string, { label: string; icon: any; className: string }> = {
  draft:   { label: "Draft",    icon: FileText,      className: "bg-muted text-muted-foreground" },
  sent:    { label: "Pending",  icon: Clock,         className: "bg-yellow-500/10 text-yellow-500" },
  paid:    { label: "Paid",     icon: CheckCircle,   className: "bg-green-500/10 text-green-500" },
  overdue: { label: "Overdue",  icon: AlertTriangle, className: "bg-destructive/10 text-destructive" },
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<any[]>([])
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    api.get("/invoices")
      .then((r) => setInvoices(r.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const totalPaid    = invoices.filter((i) => i.status === "paid").reduce((s, i) => s + i.amount, 0)
  const totalPending = invoices.filter((i) => i.status === "sent" || i.status === "overdue").reduce((s, i) => s + i.amount, 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Invoices</h1>
        <p className="mt-1 text-muted-foreground">View and manage your project invoices.</p>
      </div>

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Total Paid",       value: `$${totalPaid.toLocaleString()}`,    color: "text-green-500" },
          { label: "Pending Payment",  value: `$${totalPending.toLocaleString()}`, color: "text-yellow-500" },
          { label: "Total Invoices",   value: invoices.length,                     color: "" },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <Card className="border-border/50 bg-card/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{s.label}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Table */}
      <Card className="border-border/50 bg-card/50">
        <CardHeader><CardTitle>All Invoices</CardTitle></CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-12 rounded-lg bg-muted/50 animate-pulse" />
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice #</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead className="w-12" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((inv) => {
                  const cfg = STATUS_CONFIG[inv.status] || STATUS_CONFIG.draft
                  const Icon = cfg.icon
                  return (
                    <TableRow key={inv.id}>
                      <TableCell className="font-mono font-medium">{inv.invoiceNumber}</TableCell>
                      <TableCell className="text-muted-foreground">{inv.project?.title ?? "—"}</TableCell>
                      <TableCell className="font-semibold">${Number(inv.amount).toLocaleString()}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${cfg.className}`}>
                          <Icon className="h-3 w-3" />
                          {cfg.label}
                        </span>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {inv.dueDate ? format(new Date(inv.dueDate), "MMM d, yyyy") : "—"}
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" title="Download">
                          <Download className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
                {!loading && invoices.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                      <Receipt className="mx-auto mb-2 h-8 w-8 opacity-30" />
                      No invoices yet
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
