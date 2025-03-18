import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';
import AnimatedBackground from '../components/AnimatedBackground';

export default function PrivacyPage() {
  return (
    <>
      <Head>
        <title>Privacy Policy | Clendr</title>
        <meta name="description" content="Clendr Privacy Policy - How we protect your data and privacy" />
      </Head>

      <div className="min-h-screen bg-zinc-950 text-zinc-100 relative overflow-hidden">
        <AnimatedBackground />
        <Header />

        <main className="pt-32 pb-16 relative z-10">
          <div className="container mx-auto px-4">
            <motion.div 
              className="max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="glass-effect-card p-8 rounded-xl">
                <h1 className="text-4xl md:text-5xl font-bold mb-8 text-zinc-100">Privacy Policy</h1>
                
                <div className="prose prose-zinc prose-invert max-w-none">
                  <p className="text-zinc-400">Last Updated: March 18, 2025</p>
                  
                  <h2 className="text-zinc-100">Introduction</h2>
                  <p className="text-zinc-300">
                    At Clendr, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, 
                    and safeguard your information when you use our calendar application and related services. 
                    Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, 
                    please do not access the application.
                  </p>
                  
                  <h2 className="text-zinc-100">Information We Collect</h2>
                  <p className="text-zinc-300">We collect information that you provide directly to us when you:</p>
                  <ul className="text-zinc-300">
                    <li>Create an account and use our services</li>
                    <li>Input calendar events and related data</li>
                    <li>Contact our customer support</li>
                    <li>Respond to surveys or communicate with us</li>
                  </ul>
                  <p className="text-zinc-300">This information may include:</p>
                  <ul className="text-zinc-300">
                    <li>Name, email address, and other contact information</li>
                    <li>Calendar data including events, appointments, and reminders</li>
                    <li>User preferences and settings</li>
                    <li>Device information and usage statistics</li>
                  </ul>
                  
                  <h2 className="text-zinc-100">How We Use Your Information</h2>
                  <p className="text-zinc-300">We use the information we collect to:</p>
                  <ul className="text-zinc-300">
                    <li>Provide, maintain, and improve our services</li>
                    <li>Process and complete transactions</li>
                    <li>Send you technical notices and support messages</li>
                    <li>Respond to your comments and questions</li>
                    <li>Develop new products and services</li>
                    <li>Monitor and analyze usage trends</li>
                  </ul>
                  
                  <h2 className="text-zinc-100">Data Security</h2>
                  <p className="text-zinc-300">
                    We implement appropriate technical and organizational measures to protect the security 
                    of your personal information. However, please be aware that no method of transmission over 
                    the internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
                  </p>
                  
                  <h2 className="text-zinc-100">Data Retention</h2>
                  <p className="text-zinc-300">
                    We will retain your personal information only for as long as is necessary for the purposes 
                    set out in this privacy policy. We will also retain and use your information to comply with 
                    our legal obligations, resolve disputes, and enforce our agreements.
                  </p>
                  
                  <h2 className="text-zinc-100">Your Rights</h2>
                  <p className="text-zinc-300">
                    Depending on your location, you may have certain rights regarding your personal information, 
                    such as the right to access, correct, delete, or restrict processing of your data. To exercise 
                    these rights, please contact us using the details provided below.
                  </p>
                  
                  <h2 className="text-zinc-100">Changes to this Privacy Policy</h2>
                  <p className="text-zinc-300">
                    We may update our privacy policy from time to time. We will notify you of any changes by 
                    posting the new privacy policy on this page and updating the "Last Updated" date.
                  </p>
                  
                  <h2 className="text-zinc-100">Contact Us</h2>
                  <p className="text-zinc-300">
                    If you have any questions about this privacy policy or our data practices, please contact us at:
                  </p>
                  <p className="text-zinc-300">
                    <strong>Email:</strong> support@clendr.com<br />
                    <strong>Address:</strong> 2261 Market Street #86329, San Francisco, CA 94114
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}