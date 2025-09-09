import { motion } from "framer-motion";
import { ArrowLeft, Mail, User, Building, MessageSquare, Shield, Brain, Bell, BarChart } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function Workflow() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    company: "",
    message: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted:", formData);
    alert("Thank you for your interest! We'll contact you soon.");
  };

  const workflowSteps = [
    {
      id: 1,
      title: "Threat Detection",
      description: "AI-powered cameras detect suspicious activity in real-time",
      icon: Shield,
      color: "text-red-400"
    },
    {
      id: 2,
      title: "AI Analysis",
      description: "Machine learning algorithms analyze behavior patterns",
      icon: Brain,
      color: "text-blue-400"
    },
    {
      id: 3,
      title: "Alert Generation",
      description: "Instant notifications sent to security personnel",
      icon: Bell,
      color: "text-yellow-400"
    },
    {
      id: 4,
      title: "Retail Security Dashboard",
      description: "Comprehensive analytics and reporting interface",
      icon: BarChart,
      color: "text-green-400"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a1220] to-black text-white">
      {/* Header */}
      <div className="container mx-auto px-4 py-8">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
        
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Request a Demo
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Experience SecureVision's AI-powered surveillance system. See how our technology 
            can protect your business with intelligent threat detection and real-time analytics.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Lead Capture Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="glass-card p-8 rounded-2xl"
          >
            <h2 className="text-2xl font-bold mb-6">Get Started Today</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-300 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-300 mb-2">
                  Company
                </label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                    placeholder="Enter your company name"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                  Message
                </label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 resize-none"
                    placeholder="Tell us about your security needs..."
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-brand-500 hover:bg-brand-600 text-white font-medium py-3 px-6 rounded-lg transition hover-glow"
              >
                Request Demo
              </button>
            </form>
          </motion.div>

          {/* Workflow Flowchart */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass-card p-8 rounded-2xl"
          >
            <h2 className="text-2xl font-bold mb-6">How It Works</h2>
            <div className="space-y-6">
              {workflowSteps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="flex items-start space-x-4"
                  >
                    <div className="flex-shrink-0">
                      <div className={`w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center ${step.color}`}>
                        <Icon className="h-6 w-6" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-1">
                        {step.title}
                      </h3>
                      <p className="text-gray-400 text-sm">
                        {step.description}
                      </p>
                    </div>
                    {index < workflowSteps.length - 1 && (
                      <div className="absolute left-6 mt-12 w-0.5 h-8 bg-gradient-to-b from-blue-500 to-transparent" />
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}