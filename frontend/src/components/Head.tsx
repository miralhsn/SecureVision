import { Helmet } from 'react-helmet-async';

interface HeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
}

export default function Head({ 
  title = "SecureVision - AI-Powered CCTV Surveillance & Analytics",
  description = "Real-time detection of suspicious activity, intelligent alerts, and actionable insights. Built for enterprises that demand security with elegance.",
  keywords = "AI surveillance, CCTV analytics, security monitoring, threat detection, retail security, enterprise security",
  ogImage = "/og-image.jpg"
}: HeadProps) {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="SecureVision" />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://securevision.com/" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content="https://securevision.com/" />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={ogImage} />
      
      {/* Additional SEO */}
      <meta name="robots" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="canonical" href="https://securevision.com/" />
    </Helmet>
  );
}
