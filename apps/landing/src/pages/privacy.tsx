import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';

export default function PrivacyPage() {
  return (
    <>
      <Head>
        <title>Privacy Policy | Clendr</title>
        <meta name="description" content="Clendr Privacy Policy - How we protect your data and privacy" />
      </Head>

      <Header />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-8 text-gray-900 dark:text-white">Privacy Policy</h1>
            
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p>Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              
              <h2>Introduction</h2>
              <p>
                At Clendr, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, 
                and safeguard your information when you use our calendar application and related services. 
                Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, 
                please do not access the application.
              </p>
              
              <h2>Information We Collect</h2>
              <p>We collect information that you provide directly to us when you:</p>
              <ul>
                <li>Create an account and use our services</li>
                <li>Input calendar events and related data</li>
                <li>Contact our customer support</li>
                <li>Respond to surveys or communicate with us</li>
              </ul>
              <p>This information may include:</p>
              <ul>
                <li>Name, email address, and other contact information</li>
                <li>Calendar data including events, appointments, and reminders</li>
                <li>User preferences and settings</li>
                <li>Device information and usage statistics</li>
              </ul>
              
              <h2>How We Use Your Information</h2>
              <p>We use the information we collect to:</p>
              <ul>
                <li>Provide, maintain, and improve our services</li>
                <li>Process and complete transactions</li>
                <li>Send you technical notices and support messages</li>
                <li>Respond to your comments and questions</li>
                <li>Develop new products and services</li>
                <li>Monitor and analyze usage trends</li>
              </ul>
              
              <h2>Data Security</h2>
              <p>
                We implement appropriate technical and organizational measures to protect the security 
                of your personal information. However, please be aware that no method of transmission over 
                the internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
              </p>
              
              <h2>Data Retention</h2>
              <p>
                We will retain your personal information only for as long as is necessary for the purposes 
                set out in this privacy policy. We will also retain and use your information to comply with 
                our legal obligations, resolve disputes, and enforce our agreements.
              </p>
              
              <h2>Your Rights</h2>
              <p>
                Depending on your location, you may have certain rights regarding your personal information, 
                such as the right to access, correct, delete, or restrict processing of your data. To exercise 
                these rights, please contact us using the details provided below.
              </p>
              
              <h2>Changes to this Privacy Policy</h2>
              <p>
                We may update our privacy policy from time to time. We will notify you of any changes by 
                posting the new privacy policy on this page and updating the "Last Updated" date.
              </p>
              
              <h2>Contact Us</h2>
              <p>
                If you have any questions about this privacy policy or our data practices, please contact us at:
              </p>
              <p>
                <strong>Email:</strong> privacy@clendr.com<br />
                <strong>Address:</strong> 2261 Market Street #86329, San Francisco, CA 94114
              </p>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </>
  );
} 