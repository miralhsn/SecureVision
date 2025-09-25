import { motion } from 'framer-motion'
import { BellRing, Shield, Cpu, Camera, Activity, BarChart3, Users, Eye, AlertTriangle, Search, Lock, Zap, Globe, Smartphone, Database, TrendingUp } from 'lucide-react'
import { Link } from 'react-router-dom'

const solutions = [
  {
    category: 'Retail Security',
    icon: Shield,
    title: 'Loitering Detection',
    description: 'AI-powered cameras detect suspicious loitering behavior and send instant alerts to security personnel.',
    features: ['Real-time monitoring', 'Behavioral analysis', 'Automated alerts', 'Evidence collection']
  },
  {
    category: 'Retail Security',
    icon: Eye,
    title: 'Shoplifting Prevention',
    description: 'Advanced computer vision identifies shoplifting attempts and suspicious activities in real-time.',
    features: ['Object tracking', 'Theft detection', 'POS integration', 'Loss prevention']
  },
  {
    category: 'Retail Security',
    icon: Users,
    title: 'Pickpocketing Detection',
    description: 'Monitor crowded areas and detect pickpocketing attempts with crowd density analysis.',
    features: ['Crowd monitoring', 'Suspicious behavior', 'High-traffic alerts', 'Incident recording']
  },
  {
    category: 'Financial Security',
    icon: Lock,
    title: 'Cash Skimming Detection',
    description: 'Detect tampering with ATMs and payment terminals to prevent financial fraud.',
    features: ['ATM monitoring', 'Device tampering', 'Fraud prevention', 'Compliance reporting']
  },
  {
    category: 'System Security',
    icon: Camera,
    title: 'Camera Tampering Detection',
    description: 'Monitor camera health and detect when cameras are covered, moved, or tampered with.',
    features: ['Camera status monitoring', 'Tamper detection', 'Auto-recovery', 'System alerts']
  },
  {
    category: 'Crowd Management',
    icon: Activity,
    title: 'Crowd Density & Flow',
    description: 'Analyze crowd patterns and density to optimize space utilization and prevent overcrowding.',
    features: ['Density analysis', 'Flow patterns', 'Capacity management', 'Safety alerts']
  },
  {
    category: 'Access Control',
    icon: AlertTriangle,
    title: 'Restricted Area Motion',
    description: 'Monitor restricted areas and detect unauthorized access or movement after hours.',
    features: ['Perimeter monitoring', 'Access control', 'After-hours detection', 'Intrusion alerts']
  },
  {
    category: 'Analytics',
    icon: BarChart3,
    title: 'Incident Analytics',
    description: 'Comprehensive analytics and reporting for security insights and trend analysis.',
    features: ['Trend analysis', 'Performance metrics', 'Custom reports', 'Data visualization']
  }
]

const capabilities = [
  {
    icon: Zap,
    title: 'Real-time Processing',
    description: 'Process video streams in real-time with minimal latency for instant threat detection.',
    color: 'text-yellow-400'
  },
  {
    icon: Search,
    title: 'Smart Video Search',
    description: 'Search through hours of footage using natural language queries and AI-powered indexing.',
    color: 'text-blue-400'
  },
  {
    icon: Globe,
    title: 'Cloud-based Access',
    description: 'Access your surveillance system from anywhere with secure cloud-based management.',
    color: 'text-green-400'
  },
  {
    icon: Database,
    title: 'Secure Data Storage',
    description: 'Enterprise-grade encryption and secure storage for all surveillance data and analytics.',
    color: 'text-purple-400'
  }
]

export default function Features() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a1220] to-black text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="sv-hero-bg" />
        <div className="sv-grid-overlay" />
        <div className="mx-auto max-w-7xl px-4 py-20 md:py-28 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              AI-Powered Security Solutions
            </h1>
            <p className="text-xl text-white/70 mb-8 max-w-3xl mx-auto">
              Comprehensive surveillance solutions that detect suspicious activities, prevent losses, 
              and provide actionable insights for modern security operations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/workflow"
                className="inline-flex items-center gap-2 bg-brand-600 px-6 py-3 text-lg font-medium text-white shadow-glass rounded-md hover:bg-brand-500 transition hover-glow"
              >
                Request a Demo <Activity className="h-5 w-5" />
              </Link>
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 border border-white/10 px-6 py-3 text-lg text-white/80 rounded-md hover:bg-white/5 transition"
              >
                <Eye className="h-5 w-5" /> View Dashboard
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Solutions Grid */}
      <section className="py-20 bg-[#0b1324] border-t border-white/5">
        <div className="mx-auto max-w-7xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Comprehensive Security Solutions
            </h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              From retail theft prevention to crowd management, our AI-powered solutions 
              address every aspect of modern security challenges.
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {solutions.map((solution, i) => {
              const Icon = solution.icon;
              return (
                <motion.div
                  key={solution.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="glass rounded-xl border border-white/10 p-6 hover:border-brand-500/30 transition-all duration-300"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-brand-600/20 rounded-lg flex items-center justify-center">
                      <Icon className="h-6 w-6 text-brand-400" />
                    </div>
                    <div>
                      <span className="text-xs text-brand-400 font-medium">{solution.category}</span>
                      <h3 className="text-lg font-semibold">{solution.title}</h3>
                    </div>
                  </div>
                  <p className="text-white/70 mb-4 text-sm">{solution.description}</p>
                  <ul className="space-y-1">
                    {solution.features.map((feature, idx) => (
                      <li key={idx} className="text-xs text-white/60 flex items-center gap-2">
                        <div className="w-1 h-1 bg-brand-400 rounded-full" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Capabilities Section */}
      <section className="py-20 bg-black border-t border-white/5">
        <div className="mx-auto max-w-7xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose SecureVision?
            </h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              Enterprise-grade security solutions with cutting-edge AI technology 
              and unmatched reliability.
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {capabilities.map((capability, i) => {
              const Icon = capability.icon;
              return (
                <motion.div
                  key={capability.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className={`h-8 w-8 ${capability.color}`} />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{capability.title}</h3>
                  <p className="text-sm text-white/70">{capability.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#0b1324] border-t border-white/5">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass rounded-2xl border border-white/10 p-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Secure Your Business?
            </h2>
            <p className="text-xl text-white/70 mb-8">
              Join thousands of businesses already using SecureVision to prevent losses 
              and enhance security operations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/workflow"
                className="inline-flex items-center gap-2 bg-brand-600 px-8 py-4 text-lg font-medium text-white shadow-glass rounded-lg hover:bg-brand-500 transition hover-glow"
              >
                Get Started Today <TrendingUp className="h-5 w-5" />
              </Link>
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 border border-white/20 px-8 py-4 text-lg text-white/80 rounded-lg hover:bg-white/5 transition"
              >
                <Smartphone className="h-5 w-5" /> View Demo
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}


