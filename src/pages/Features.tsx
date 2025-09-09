import { motion } from 'framer-motion'
import { BellRing, Shield, Cpu, Camera, Activity, BarChart3 } from 'lucide-react'

const features = [
  { icon: Shield, title: 'Threat Detection', desc: 'Multi-model fusion for robust anomaly detection.' },
  { icon: BellRing, title: 'Smart Alerts', desc: 'Context-aware, noise-reduced, escalations built-in.' },
  { icon: Camera, title: 'Playback & Review', desc: 'Timeline browsing with highlights and filters.' },
  { icon: Cpu, title: 'Agentic AI', desc: 'Autonomous data triage and reporting summaries.' },
  { icon: Activity, title: 'Scalability', desc: 'From a single site to global multi-tenant fleets.' },
  { icon: BarChart3, title: 'Dashboards', desc: 'KPIs, trends, and ROI visuals for executives.' },
]

export default function Features() {
  return (
    <section className="relative">
      <div className="mx-auto max-w-7xl px-4 py-16 md:py-24">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center text-3xl font-semibold md:text-4xl"
        >
          Capabilities that matter
        </motion.h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-white/70">
          Designed for real-world security operations with elegance and clarity.
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="glass rounded-xl border border-white/10 p-6"
            >
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-md bg-brand-600/30 text-brand-200">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-medium">{f.title}</h3>
              <p className="mt-2 text-sm text-white/70">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}


