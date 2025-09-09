import { useMemo, useState } from 'react'
import { AlertTriangle, Download, PlayCircle } from 'lucide-react'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, AreaChart, Area, PieChart, Pie, Cell, Legend } from 'recharts'
import ExportModal from '../components/ExportModal'

const chartData = Array.from({ length: 24 }).map((_, i) => ({
  hour: `${i}:00`,
  incidents: Math.round(Math.random() * (i % 6 === 0 ? 12 : 6)),
  risk: Math.random() * 1,
}))

type Log = { id: number; time: string; message: string; level: 'info' | 'warning' | 'critical' }

export default function Dashboard() {
  const [logs] = useState<Log[]>(() => (
    Array.from({ length: 10 }).map((_, i) => ({
      id: i + 1,
      time: new Date(Date.now() - i * 1000 * 60 * 5).toLocaleTimeString(),
      message: i % 3 === 0 ? 'Loitering detected near entrance A' : i % 3 === 1 ? 'Unattended object detected in lobby' : 'Perimeter breach risk increased',
      level: i % 3 === 0 ? 'warning' : i % 3 === 1 ? 'info' : 'critical',
    }))
  ))

  const [isExportModalOpen, setIsExportModalOpen] = useState(false)

  const riskAvg = useMemo(() => (chartData.reduce((a, b) => a + b.risk, 0) / chartData.length), [])

  const alertsByType = [
    { name: 'Loitering', value: 12 },
    { name: 'Intrusion', value: 8 },
    { name: 'Object Left', value: 6 },
    { name: 'Violence', value: 3 },
  ]
  const pieColors = ['#60a5fa', '#22d3ee', '#f59e0b', '#ef4444']

  const handleExport = (format: "pdf" | "csv") => {
    // Simulate file download
    const data = format === "pdf" 
      ? "PDF data would be generated here" 
      : "Time,Event,Level\n" + logs.map(log => `${log.time},${log.message},${log.level}`).join('\n')
    
    const blob = new Blob([data], { type: format === "pdf" ? "application/pdf" : "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `dashboard-export.${format}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <section className="relative">
      <div className="mx-auto max-w-7xl px-4 py-16 md:py-24">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Operations Dashboard</h2>
          <button 
            onClick={() => setIsExportModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-md border border-white/10 px-4 py-2 text-sm hover:bg-white/5 hover-glow"
          >
            <Download className="h-4 w-4" /> Export
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="glass relative aspect-video overflow-hidden rounded-xl border border-white/10 lg:col-span-2">
            <video
              className="h-full w-full object-cover opacity-80"
              src="https://cdn.coverr.co/videos/coverr-night-traffic-1-6563/1080p.mp4"
              autoPlay
              loop
              muted
              playsInline
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
            <div className="absolute left-4 top-4 rounded-md bg-black/60 px-3 py-1 text-xs">Camera 12 — Main Entrance</div>
            <button className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-md bg-brand-600 px-3 py-2 text-xs hover:bg-brand-500">
              <PlayCircle className="h-4 w-4" /> Live
            </button>
          </div>

          <div className="glass rounded-xl border border-white/10 p-4">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-medium">Alerts</h3>
              <span className="rounded bg-brand-600/30 px-2 py-0.5 text-xs text-brand-200">Last 24h</span>
            </div>
            <ul className="flex max-h-64 flex-col gap-3 overflow-auto">
              {logs.map((log) => (
                <li key={log.id} className="flex items-start gap-3 rounded border border-white/5 bg-black/30 p-3">
                  <AlertTriangle className={`mt-0.5 h-4 w-4 ${log.level === 'critical' ? 'text-red-400' : log.level === 'warning' ? 'text-yellow-300' : 'text-brand-200'}`} />
                  <div>
                    <p className="text-sm">{log.message}</p>
                    <p className="text-xs text-white/50">{log.time}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="glass rounded-xl border border-white/10 p-4 lg:col-span-2 fade-in-up">
            <h3 className="mb-3 text-sm font-medium">Incident Frequency</h3>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ left: -20, right: 10, top: 10, bottom: 0 }}>
                  <XAxis dataKey="hour" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }} tickLine={false} axisLine={{ stroke: 'rgba(255,255,255,0.1)' }} />
                  <YAxis tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }} tickLine={false} axisLine={{ stroke: 'rgba(255,255,255,0.1)' }} />
                  <Tooltip contentStyle={{ background: 'rgba(0,0,0,0.7)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }} labelStyle={{ color: 'white' }} />
                  <Line type="monotone" dataKey="incidents" stroke="#1a6bff" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex gap-2">
              <button onClick={() => setIsExportModalOpen(true)} className="inline-flex items-center gap-2 rounded-md border border-white/10 px-3 py-2 text-xs hover:bg-white/5">
                <Download className="h-4 w-4" /> Export Chart
              </button>
            </div>
          </div>

          <div className="glass rounded-xl border border-white/10 p-4 fade-in-up">
            <h3 className="mb-3 text-sm font-medium">Risk Index</h3>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ left: -20, right: 10, top: 10, bottom: 0 }}>
                  <XAxis dataKey="hour" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }} tickLine={false} axisLine={{ stroke: 'rgba(255,255,255,0.1)' }} />
                  <YAxis domain={[0, 1]} tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }} tickLine={false} axisLine={{ stroke: 'rgba(255,255,255,0.1)' }} />
                  <Area type="monotone" dataKey="risk" stroke="#39ff14" fill="#39ff14" fillOpacity={0.2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-2 text-xs text-white/60">Average: {(riskAvg * 100).toFixed(1)}%</p>
            <div className="mt-4 flex gap-2">
              <button onClick={() => setIsExportModalOpen(true)} className="inline-flex items-center gap-2 rounded-md border border-white/10 px-3 py-2 text-xs hover:bg-white/5">
                <Download className="h-4 w-4" /> Export Chart
              </button>
            </div>
          </div>

          <div className="glass rounded-xl border border-white/10 p-4 fade-in-up">
            <h3 className="mb-3 text-sm font-medium">Active Cameras</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg bg-black/30 border border-white/10 p-4">
                <p className="text-sm text-white/60">Active</p>
                <p className="text-2xl font-semibold">42</p>
              </div>
              <div className="rounded-lg bg-black/30 border border-white/10 p-4">
                <p className="text-sm text-white/60">Offline</p>
                <p className="text-2xl font-semibold">3</p>
              </div>
            </div>
          </div>

          <div className="glass rounded-xl border border-white/10 p-4 fade-in-up">
            <h3 className="mb-3 text-sm font-medium">Alerts by Type</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={alertsByType} dataKey="value" nameKey="name" outerRadius={80} label>
                    {alertsByType.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip contentStyle={{ background: 'rgba(0,0,0,0.7)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }} labelStyle={{ color: 'white' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="glass rounded-xl border border-white/10 p-4 fade-in-up">
            <h3 className="mb-1 text-sm font-medium">Recent Alerts</h3>
            <p className="text-xs text-white/50 mb-2">Timestamps, camera IDs, and severity</p>
            <div className="max-h-48 overflow-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-white/60">
                  <tr>
                    <th className="py-2">Time</th>
                    <th className="py-2">Camera ID</th>
                    <th className="py-2">Event</th>
                    <th className="py-2">Level</th>
                  </tr>
                </thead>
                <tbody className="text-white/80">
                  {logs.map((l, i) => (
                    <tr key={l.id} className="border-t border-white/5">
                      <td className="py-2">{l.time}</td>
                      <td className="py-2">CAM-{(i % 12) + 1}</td>
                      <td className="py-2">{l.message}</td>
                      <td className="py-2 capitalize">{l.level}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 flex gap-2">
              <button onClick={() => setIsExportModalOpen(true)} className="inline-flex items-center gap-2 rounded-md border border-white/10 px-3 py-2 text-xs hover:bg-white/5">
                <Download className="h-4 w-4" /> Export Table
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onExport={handleExport}
      />
    </section>
  )
}


