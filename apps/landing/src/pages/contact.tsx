import { useState } from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ClientOnly from '../components/ClientOnly';

export default function Contact() {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    message: '',
    subject: 'General Inquiry',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  
  const subjects = [
    'General Inquiry',
    'Partnership',
    'Support',
    'Feature Request',
    'Bug Report',
    'Other',
  ];
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, we would send the form data to the server
      // const response = await fetch('/api/contact', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(formState),
      // });
      
      // const data = await response.json();
      
      // if (!response.ok) {
      //   throw new Error(data.message || 'Something went wrong');
      // }
      
      // Success
      setIsSubmitted(true);
      setFormState({
        name: '',
        email: '',
        message: '',
        subject: 'General Inquiry',
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to send message';
      setError(message);
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <>
      <Head>
        <title>Contact Us | Clendr</title>
        <meta name="description" content="Get in touch with the Clendr team. We'd love to hear from you!" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div className="min-h-screen text-zinc-100 bg-zinc-950 overflow-hidden">
        <Header />
        
        <main className="container mx-auto px-4 py-16 md:py-24 relative z-10">
          {/* Static background elements */}
          <div className="fixed inset-0 z-0 overflow-hidden">
            <div className="absolute inset-0 bg-zinc-950 bg-gradient-to-b from-zinc-900 to-zinc-950"></div>
            <div className="absolute inset-0 bg-grid opacity-20"></div>
            <div className="noise-overlay"></div>
          </div>
          
          <ClientOnly>
            <div className="max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 font-geist text-center text-zinc-100">
                Get in Touch
              </h1>
              
              <p className="text-xl text-zinc-400 text-center mb-12">
                Have questions or feedback? We'd love to hear from you.
              </p>
              
              <div className="glass-effect-card shadow-dark overflow-hidden">
                <div className="grid md:grid-cols-5">
                  {/* Contact Information */}
                  <div className="md:col-span-2 bg-zinc-800/40 backdrop-blur-md p-8 text-zinc-100 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10">
                      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                          <pattern id="contact-grid" width="30" height="30" patternUnits="userSpaceOnUse">
                            <path d="M 30 0 L 0 0 0 30" fill="none" stroke="currentColor" strokeWidth="0.5" />
                          </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#contact-grid)" />
                      </svg>
                    </div>
                    
                    <h3 className="text-2xl font-bold mb-6 relative">Contact Information</h3>
                    <p className="mb-8 opacity-90 relative">
                      Fill out the form and our team will get back to you within 24 hours.
                    </p>
                    
                    <div className="space-y-6 relative">
                      <div className="flex items-start">
                        <div className="mr-3 text-zinc-400">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm text-zinc-400">Email</p>
                          <p>support@clendr.app</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="mr-3 text-zinc-400">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm text-zinc-400">Location</p>
                          <p>San Francisco, CA</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Decorative elements */}
                    <div className="absolute -right-12 -bottom-12 w-40 h-40 border border-zinc-700/30 rounded-full"></div>
                    <div className="absolute right-12 bottom-12 w-20 h-20 bg-zinc-700/20 rounded-full"></div>
                  </div>
                  
                  {/* Contact Form */}
                  <div className="md:col-span-3 p-8">
                    {isSubmitted ? (
                      <div className="h-full flex flex-col items-center justify-center text-center py-8">
                        <div className="w-16 h-16 bg-zinc-800/80 glass-icon rounded-full flex items-center justify-center mb-6">
                          <svg className="w-8 h-8 text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        
                        <h3 className="text-2xl font-bold mb-2 text-zinc-100">
                          Message Sent!
                        </h3>
                        
                        <p className="text-zinc-400 mb-6">
                          Thank you for reaching out. We'll get back to you as soon as possible.
                        </p>
                        <button
                          type="button"
                          className="px-4 py-2 bg-zinc-800/80 rounded-lg text-sm hover:bg-zinc-700/80 transition-colors"
                          onClick={() => setIsSubmitted(false)}
                        >
                          Send Another Message
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmit}>
                        <h3 className="text-2xl font-bold mb-6 text-zinc-200">Send a Message</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div className="mb-4">
                            <label htmlFor="name" className="block text-sm font-medium text-zinc-400 mb-1">
                              Your Name
                            </label>
                            <input
                              id="name"
                              name="name"
                              type="text"
                              required
                              value={formState.name}
                              onChange={handleChange}
                              className="sophisticated-input"
                              placeholder="John Doe"
                            />
                          </div>
                          
                          <div className="mb-4">
                            <label htmlFor="email" className="block text-sm font-medium text-zinc-400 mb-1">
                              Your Email
                            </label>
                            <input
                              id="email"
                              name="email"
                              type="email"
                              required
                              value={formState.email}
                              onChange={handleChange}
                              className="sophisticated-input"
                              placeholder="john@example.com"
                            />
                          </div>
                        </div>
                        
                        <div className="mb-4">
                          <label htmlFor="subject" className="block text-sm font-medium text-zinc-400 mb-1">
                            Subject
                          </label>
                          <select
                            id="subject"
                            name="subject"
                            required
                            value={formState.subject}
                            onChange={handleChange}
                            className="sophisticated-input"
                          >
                            {subjects.map((subject) => (
                              <option key={subject} value={subject}>{subject}</option>
                            ))}
                          </select>
                        </div>
                        
                        <div className="mb-6">
                          <label htmlFor="message" className="block text-sm font-medium text-zinc-400 mb-1">
                            Message
                          </label>
                          <textarea
                            id="message"
                            name="message"
                            rows={5}
                            required
                            value={formState.message}
                            onChange={handleChange}
                            className="sophisticated-input resize-none"
                            placeholder="Your message here..."
                          ></textarea>
                        </div>
                        
                        {error && (
                          <div className="mb-4 p-3 bg-red-900/30 text-red-200 rounded-md border border-red-800/50">
                            {error}
                          </div>
                        )}
                        
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="cta-button w-full md:w-auto"
                        >
                          {isSubmitting ? (
                            <div className="flex items-center justify-center">
                              <div className="animate-spin mr-2 h-4 w-4 border-2 border-zinc-900 border-l-transparent rounded-full"></div>
                              Sending...
                            </div>
                          ) : (
                            <span className="flex items-center">
                              Send Message
                              <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                              </svg>
                            </span>
                          )}
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </ClientOnly>
        </main>
        
        <Footer />
      </div>
    </>
  );
}