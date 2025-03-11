import Head from 'next/head';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Terms() {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.215, 0.61, 0.355, 1.0]
      }
    }
  };
  
  return (
    <>
      <Head>
        <title>Terms & Conditions | Clendr</title>
        <meta name="description" content="Terms and conditions for using the Clendr calendar application." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
        <Header />
        
        <main className="container mx-auto px-4 py-16 md:py-24">
          <motion.div 
            className="max-w-3xl mx-auto"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
          >
            <motion.h1 
              className="text-4xl md:text-5xl font-bold mb-8 font-geist"
              variants={fadeIn}
            >
              Terms & Conditions
            </motion.h1>
            
            <motion.div 
              className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-geist prose-a:text-primary-600 dark:prose-a:text-primary-400 prose-a:no-underline hover:prose-a:underline"
              variants={fadeIn}
            >
              <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl mb-8 border border-gray-100 dark:border-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
              
              <h2>1. Introduction</h2>
              <p>
                Welcome to Clendr ("Company," "we," "our," "us")! As you have just clicked our Terms of Service, please pause, grab a cup of coffee and carefully read the following pages. It will take you approximately 20 minutes.
              </p>
              <p>
                These Terms of Service ("Terms," "Terms of Service") govern your use of our web pages located at clendr.app and our mobile application Clendr (together or individually "Service") operated by Clendr Inc.
              </p>
              <p>
                Our Privacy Policy also governs your use of our Service and explains how we collect, safeguard and disclose information that results from your use of our web pages. Please read it here: <a href="/privacy">Privacy Policy</a>.
              </p>
              <p>
                Your agreement with us includes these Terms and our Privacy Policy ("Agreements"). You acknowledge that you have read and understood Agreements, and agree to be bound by them.
              </p>
              <p>
                If you do not agree with (or cannot comply with) Agreements, then you may not use the Service, but please let us know by emailing at support@clendr.app so we can try to find a solution. These Terms apply to all visitors, users and others who wish to access or use Service.
              </p>
              
              <h2>2. Communications</h2>
              <p>
                By using our Service, you agree to subscribe to newsletters, marketing or promotional materials and other information we may send. However, you may opt out of receiving any, or all, of these communications from us by following the unsubscribe link or by emailing at support@clendr.app.
              </p>
              
              <h2>3. Purchases</h2>
              <p>
                If you wish to purchase any product or service made available through Service ("Purchase"), you may be asked to supply certain information relevant to your Purchase including, without limitation, your credit card number, the expiration date of your credit card, your billing address, and your shipping information.
              </p>
              <p>
                You represent and warrant that: (i) you have the legal right to use any credit card(s) or other payment method(s) in connection with any Purchase; and that (ii) the information you supply to us is true, correct and complete.
              </p>
              <p>
                We may employ the use of third-party services for the purpose of facilitating payment and the completion of Purchases. By submitting your information, you grant us the right to provide the information to these third parties subject to our Privacy Policy.
              </p>
              <p>
                We reserve the right to refuse or cancel your order at any time for reasons including but not limited to: product or service availability, errors in the description or price of the product or service, error in your order or other reasons.
              </p>
              <p>
                We reserve the right to refuse or cancel your order if fraud or an unauthorized or illegal transaction is suspected.
              </p>
              
              <h2>4. Subscriptions</h2>
              <p>
                Some parts of Service are billed on a subscription basis ("Subscription(s)"). You will be billed in advance on a recurring and periodic basis ("Billing Cycle"). Billing cycles are set either on a monthly or annual basis, depending on the type of subscription plan you select when purchasing a Subscription.
              </p>
              <p>
                At the end of each Billing Cycle, your Subscription will automatically renew under the exact same conditions unless you cancel it or Clendr Inc. cancels it. You may cancel your Subscription renewal either through your online account management page or by contacting Clendr Inc. customer support team.
              </p>
              
              <h2>5. Free Trial</h2>
              <p>
                Clendr Inc. may, at its sole discretion, offer a Subscription with a free trial for a limited period of time ("Free Trial").
              </p>
              <p>
                You may be required to enter your billing information in order to sign up for Free Trial.
              </p>
              <p>
                If you do enter your billing information when signing up for Free Trial, you will not be charged by Clendr Inc. until Free Trial has expired. On the last day of Free Trial period, unless you cancelled your Subscription, you will be automatically charged the applicable subscription fee for the type of Subscription you have selected.
              </p>
              <p>
                At any time and without notice, Clendr Inc. reserves the right to (i) modify Terms of Service of Free Trial offer, or (ii) cancel such Free Trial offer.
              </p>
              
              <h2>6. Intellectual Property</h2>
              <p>
                Service and its original content (excluding Content provided by users), features and functionality are and will remain the exclusive property of Clendr Inc. and its licensors. Service is protected by copyright, trademark, and other laws of both the United States and foreign countries. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of Clendr Inc.
              </p>
              
              <h2>7. Contact Us</h2>
              <p>
                If you have any questions about these Terms, please <a href="/contact">contact us</a>.
              </p>
            </motion.div>
          </motion.div>
        </main>
        
        <Footer />
      </div>
    </>
  );
} 