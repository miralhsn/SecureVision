import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  ShieldAlert,
  Play,
  ArrowRight,
  Shield,
  Camera,
  BarChart,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";
import Head from "../components/Head";
import apiService from "../services/api";

const geoUrl = "https://unpkg.com/world-atlas@2/countries-110m.json";
const fallbackGeoUrl = "/data/world-110m.json";

type ShrinkageData = {
  name: string;
  coordinates: [number, number];
  shrinkage: string;
};

const defaultShrinkageData: ShrinkageData[] = [
  { name: "United States", coordinates: [-100, 40], shrinkage: "2.0%" },
  { name: "Brazil", coordinates: [-51, -10], shrinkage: "1.7%" },
  { name: "South Africa", coordinates: [24, -29], shrinkage: "2.3%" },
  { name: "India", coordinates: [78, 21], shrinkage: "1.9%" },
  { name: "China", coordinates: [104, 35], shrinkage: "2.4%" },
  { name: "UK", coordinates: [-2, 55], shrinkage: "1.6%" },
  { name: "Australia", coordinates: [133, -25], shrinkage: "1.8%" },
];

export default function Home() {
  const [mapError, setMapError] = useState(false);
  const [shrinkageData, setShrinkageData] = useState<ShrinkageData[]>(defaultShrinkageData);
  const [isLoadingShrinkage, setIsLoadingShrinkage] = useState(false);

  useEffect(() => {
    fetchShrinkageData();
  }, []);

  const fetchShrinkageData = async () => {
    try {
      setIsLoadingShrinkage(true);
      const response = await apiService.getShrinkageAnalytics();
      setShrinkageData(response.data.countryData);
    } catch (error) {
      console.error('Failed to fetch shrinkage data:', error);
      // Keep default data if API fails
    } finally {
      setIsLoadingShrinkage(false);
    }
  };

  return (
    <>
      <Head 
        title="SecureVision - AI-Powered CCTV Surveillance & Analytics"
        description="Real-time detection of suspicious activity, intelligent alerts, and actionable insights. Built for enterprises that demand security with elegance."
        keywords="AI surveillance, CCTV analytics, security monitoring, threat detection, retail security, enterprise security"
      />
      <section className="relative overflow-hidden">
        {/* Background Layers */}
        <div className="sv-hero-bg" />
        <div className="sv-grid-overlay" />
        <div className="sv-wave-overlay" />

      {/* Hero */}
      <div className="mx-auto max-w-7xl px-4 py-20 md:py-28 relative z-10">
        <div className="grid items-center gap-12 md:grid-cols-2">
          {/* Left */}
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="font-display text-4xl md:text-5xl leading-tight"
            >
              SecureVision: AI-Powered CCTV Surveillance & Analytics
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="mt-6 max-w-xl text-white/70"
            >
              Real-time detection of suspicious activity, intelligent alerts,
              and actionable insights. Built for enterprises that demand
              security with elegance.
            </motion.p>
            <div className="mt-8 flex gap-4">
              <Link
                to="/workflow"
                className="inline-flex items-center gap-2 bg-brand-600 px-5 py-3 text-sm font-medium text-white shadow-glass rounded-md hover:bg-brand-500 transition hover-glow"
              >
                Request a Demo <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#preview"
                className="inline-flex items-center gap-2 border border-white/10 px-5 py-3 text-sm text-white/80 rounded-md hover:bg-white/5 transition"
              >
                <Play className="h-4 w-4" /> Preview
              </a>
            </div>
            <div className="mt-10 flex items-center gap-3 text-xs text-white/50">
              <ShieldAlert className="h-4 w-4 text-neon" />
              <span>
                Enterprise-grade encryption. Edge inference. Audit-ready logs.
              </span>
            </div>
          </div>

          {/* Right: Video */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15, duration: 0.6 }}
            className="glass relative aspect-video w-full rounded-xl overflow-hidden border border-white/10"
            id="preview"
          >
            <video
              className="w-full h-full object-cover opacity-80"
              src="/media/video2.mp4"
              autoPlay
              loop
              muted
              playsInline
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
          </motion.div>
        </div>
      </div>

      {/* Why Choose SecureVision */}
      <section className="py-20 section-ink text-white relative overflow-hidden">
        <div className="max-w-6xl mx-auto text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Why Choose SecureVision?</h2>
          <p className="text-gray-400">
            Intelligent surveillance that prevents incidents before they happen.
          </p>
        </div>
        
        {/* Device Frames */}
        <div className="relative flex justify-center items-center max-w-6xl mx-auto">
          {/* Laptop */}
          <div className="device-frame device-laptop w-[600px] h-[380px] relative z-10">
            <div className="w-full h-full bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl overflow-hidden">
              <div className="w-full h-full bg-gradient-to-br from-blue-900/20 to-blue-800/10 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                    <Camera className="h-8 w-8 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Web Dashboard</h3>
                  <p className="text-sm text-gray-400">Real-time monitoring</p>
                </div>
              </div>
              {/* Route tracking overlay */}
              <svg
                className="absolute inset-0 w-full h-full"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M50 300 Q200 100 400 280 T600 200"
                  className="route-path"
                />
                <circle className="route-dot">
                  <animateMotion
                    dur="6s"
                    repeatCount="indefinite"
                    path="M50 300 Q200 100 400 280 T600 200"
                  />
                </circle>
              </svg>
            </div>
          </div>
          
          {/* Mobile */}
          <div className="device-frame device-mobile absolute right-20 -bottom-12 w-[200px] h-[380px] z-20">
            <div className="w-full h-full bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl overflow-hidden">
              <div className="w-full h-full bg-gradient-to-br from-blue-900/20 to-blue-800/10 flex items-center justify-center">
                <div className="text-center px-4">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center mb-3 mx-auto">
                    <Shield className="h-5 w-5 text-blue-400" />
                  </div>
                  <h3 className="text-sm font-semibold text-white mb-1">Mobile App</h3>
                  <p className="text-xs text-gray-400">On-the-go alerts</p>
                </div>
              </div>
              {/* Route tracking overlay */}
              <svg
                className="absolute inset-0 w-full h-full"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M20 300 Q100 150 180 250"
                  className="route-path"
                  strokeWidth="2"
                />
                <circle className="route-dot" r="4">
                  <animateMotion
                    dur="4s"
                    repeatCount="indefinite"
                    path="M20 300 Q100 150 180 250"
                  />
                </circle>
              </svg>
            </div>
          </div>
          
          {/* PC */}
          <div className="device-frame absolute -left-20 top-8 w-[300px] h-[200px] z-5 bg-gray-900 rounded-lg border border-white/10 shadow-2xl">
            <div className="w-full h-full bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg overflow-hidden">
              <div className="w-full h-full bg-gradient-to-br from-blue-900/20 to-blue-800/10 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-3 mx-auto">
                    <BarChart className="h-6 w-6 text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-1">Desktop App</h3>
                  <p className="text-xs text-gray-400">Advanced analytics</p>
                </div>
              </div>
              {/* Route tracking overlay */}
              <svg
                className="absolute inset-0 w-full h-full"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M30 150 Q150 50 270 120"
                  className="route-path"
                  strokeWidth="2"
                />
                <circle className="route-dot" r="4">
                  <animateMotion
                    dur="5s"
                    repeatCount="indefinite"
                    path="M30 150 Q150 50 270 120"
                  />
                </circle>
              </svg>
            </div>
          </div>
        </div>
        
        {/* Request Demo Button */}
        <div className="text-center mt-16">
          <Link
            to="/workflow"
            className="inline-flex items-center gap-2 bg-brand-500 text-white px-6 py-3 rounded-xl hover:bg-brand-600 transition hover-glow text-lg font-medium"
          >
            Request a Demo <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Global Retail Shrinkage */}
      <section className="py-20 section-black text-white relative">
        <div className="max-w-6xl mx-auto text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Global Retail Shrinkage</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Estimated losses of <strong>$132 billion</strong> (2024) or{" "}
            <strong>1.82% of annual retail sales</strong>.
          </p>
        </div>

        {/* Map */}
        <div className="map-frame max-w-5xl mx-auto mb-16 h-[450px]">
          {mapError ? (
            <div className="flex items-center justify-center h-full text-gray-400">
              <div className="text-center">
                <p className="text-lg mb-2">Map Loading Error</p>
                <p className="text-sm">Unable to load world map data</p>
              </div>
            </div>
          ) : (
            <ComposableMap
              projection="geoMercator"
              projectionConfig={{ scale: 140, center: [0, 10] }}
              style={{ width: "100%", height: "100%" }}
              width={800}
              height={450}
            >
              <Geographies geography={geoUrl}>
                {({ geographies }) => {
                  console.log("geographies count", geographies.length);
                  if (geographies.length === 0) {
                    console.log("No geographies loaded");
                    return null;
                  }
                  return geographies.map((geo) => (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      style={{
                        default: {
                          fill: "#1e293b",
                          stroke: "#ffffff",
                          strokeWidth: 0.5,
                        },
                        hover: {
                          fill: "#2563eb",
                          stroke: "#60a5fa",
                          strokeWidth: 1.0,
                        },
                      }}
                    />
                  ));
                }}
              </Geographies>
              {shrinkageData.map((loc, idx) => (
                <Marker key={idx} coordinates={loc.coordinates}>
                  <circle
                    r={6}
                    fill="rgba(239,68,68,0.9)"
                    stroke="#ffffff"
                    strokeWidth={2}
                    className="animate-pulse"
                  />
                  <text
                    textAnchor="middle"
                    y={-12}
                    style={{ 
                      fontSize: "11px", 
                      fill: "#ffffff",
                      fontWeight: "bold",
                      textShadow: "0 0 6px rgba(0,0,0,0.9)"
                    }}
                  >
                    {loc.shrinkage}
                  </text>
                  <text
                    textAnchor="middle"
                    y={2}
                    style={{ 
                      fontSize: "9px", 
                      fill: "#60a5fa",
                      textShadow: "0 0 4px rgba(0,0,0,0.9)"
                    }}
                  >
                    {loc.name}
                  </text>
                  <title>{`${loc.name}: ${loc.shrinkage}`}</title>
                </Marker>
              ))}
            </ComposableMap>
          )}
        </div>

      </section>

      {/* Use Cases */}
      <section className="py-20 section-night text-white relative overflow-hidden">
        <div className="max-w-6xl mx-auto text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Use Cases</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            From retail to law enforcement, SecureVision adapts to your
            environment.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="glass-card p-6 rounded-xl fade-in-up hover-glow">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-brand-400" />
            </div>
            <h3 className="font-semibold mb-2 text-lg">Retail Security</h3>
            <p className="text-sm text-gray-400">
              Detect theft and shrinkage with AI-powered surveillance.
            </p>
          </div>
          <div className="glass-card p-6 rounded-xl fade-in-up hover-glow">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
              <Camera className="h-6 w-6 text-brand-400" />
            </div>
            <h3 className="font-semibold mb-2 text-lg">Public Safety</h3>
            <p className="text-sm text-gray-400">
              Identify suspicious activity in real-time in urban spaces.
            </p>
          </div>
          <div className="glass-card p-6 rounded-xl fade-in-up hover-glow">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
              <BarChart className="h-6 w-6 text-brand-400" />
            </div>
            <h3 className="font-semibold mb-2 text-lg">Enterprise Analytics</h3>
            <p className="text-sm text-gray-400">
              Actionable insights and reports for better security decisions.
            </p>
          </div>
        </div>
      </section>
      </section>
    </>
  );
}
