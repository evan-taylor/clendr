import { motion } from 'framer-motion';

interface HowItWorksProps {
  className?: string;
}

const HowItWorks = ({ className = '' }: HowItWorksProps) => {
  const steps = [
    {
      title: 'Intelligent Scheduling',
      description: 'Our AI analyzes your habits and preferences to suggest the best times for meetings and tasks.',
      iconColor: 'from-zinc-400 to-zinc-600',
      iconPath: 'M9.5 12L11 13.5L14.5 10M7.364 2.5h9.272a1.5 1.5 0 0 1 1.06.44l4.208 4.208a1.5 1.5 0 0 1 .44 1.06v9.272a2.25 2.25 0 0 1-2.25 2.25H7.364a2.25 2.25 0 0 1-2.25-2.25V4.75a2.25 2.25 0 0 1 2.25-2.25Z',
    },
    {
      title: 'Seamless Integration',
      description: 'Connect with your existing tools and services for a unified scheduling experience.',
      iconColor: 'from-zinc-500 to-zinc-700',
      iconPath: 'M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244',
    },
    {
      title: 'Smart Reminders',
      description: 'Get personalized notifications that adapt to your context and schedule changes.',
      iconColor: 'from-zinc-400 to-zinc-600',
      iconPath: 'M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0',
    },
    {
      title: 'Effortless Sharing',
      description: 'Share your availability with others and schedule meetings without back-and-forth.',
      iconColor: 'from-zinc-500 to-zinc-700',
      iconPath: 'M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z',
    },
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.7,
        ease: [0.215, 0.61, 0.355, 1.0]
      }
    }
  };

  return (
    <section id="how-it-works" className={`relative py-24 md:py-40 ${className}`}>
      {/* Simple dark background with grid pattern */}
      <div className="absolute inset-0 bg-zinc-950 bg-gradient-to-b from-zinc-950 to-zinc-900 -z-10">
        <div className="absolute inset-0 bg-grid opacity-20"></div>
        <div className="noise-overlay"></div>
      </div>
      
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          <motion.h2 
            className="text-4xl md:text-5xl font-bold text-zinc-100 mb-6"
            variants={itemVariants}
          >
            <span>Intelligent Scheduling</span> <span className="text-gradient">Simplified</span>
          </motion.h2>
          
          <motion.p 
            className="max-w-2xl mx-auto text-xl text-zinc-400"
            variants={itemVariants}
          >
            Clendr transforms calendar management with these powerful features
          </motion.p>
        </motion.div>
        
        {/* Features in grid */}
        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-24"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {steps.map((step, index) => (
            <motion.div 
              key={index} 
              className="relative"
              variants={itemVariants}
              custom={index}
            >
              <div className="glass-effect-card p-8 relative z-10 h-full">
                {/* Step number */}
                <div className="absolute -right-4 -top-4 w-12 h-12 flex items-center justify-center bg-zinc-800/60 rounded-full text-2xl font-bold text-zinc-200 shadow-dark z-20">
                  {index + 1}
                </div>
                
                {/* Icon */}
                <div className="glass-icon mb-6">
                  <svg 
                    className="w-6 h-6 text-zinc-200" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={step.iconPath} />
                  </svg>
                </div>
                
                <h3 className="text-2xl font-bold mb-3 text-zinc-100">{step.title}</h3>
                <p className="text-zinc-400">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        {/* AI-Powered Calendar Optimization Section */}
        <div className="mb-24">
          <motion.h3
            className="text-3xl font-bold text-center mb-16 text-zinc-100"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            AI-Powered Calendar Optimization
          </motion.h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {/* Before Clendr */}
            <motion.div
              className="glass-effect-card p-6 relative"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              <h4 className="text-xl font-bold mb-6 text-zinc-100 flex items-center">
                <svg className="w-5 h-5 mr-2 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Before Clendr
              </h4>
              <div className="space-y-3">
                <div className="p-3 bg-zinc-800/40 rounded border-l-2 border-zinc-700 text-sm">
                  <div className="font-medium text-zinc-300">Meeting Overload</div>
                  <div className="text-zinc-500">Back-to-back meetings with no breaks</div>
                </div>
                <div className="p-3 bg-zinc-800/40 rounded border-l-2 border-zinc-700 text-sm">
                  <div className="font-medium text-zinc-300">Context Switching</div>
                  <div className="text-zinc-500">Jumping between unrelated tasks</div>
                </div>
                <div className="p-3 bg-zinc-800/40 rounded border-l-2 border-zinc-700 text-sm">
                  <div className="font-medium text-zinc-300">Inefficient Time Blocks</div>
                  <div className="text-zinc-500">Wasted time between appointments</div>
                </div>
              </div>
            </motion.div>
            
            {/* Clendr AI Process */}
            <motion.div
              className="glass-effect-card p-6 relative"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <h4 className="text-xl font-bold mb-6 text-zinc-100 flex items-center">
                <svg className="w-5 h-5 mr-2 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Clendr AI Process
              </h4>
              <div className="space-y-3">
                <div className="p-3 bg-zinc-800/40 rounded border-l-2 border-zinc-600 text-sm">
                  <div className="font-medium text-zinc-300">Analyzes Work Patterns</div>
                  <div className="text-zinc-500">Learns from your productivity cycles</div>
                </div>
                <div className="p-3 bg-zinc-800/40 rounded border-l-2 border-zinc-600 text-sm">
                  <div className="font-medium text-zinc-300">Prioritizes Tasks</div>
                  <div className="text-zinc-500">Based on deadlines and importance</div>
                </div>
                <div className="p-3 bg-zinc-800/40 rounded border-l-2 border-zinc-600 text-sm">
                  <div className="font-medium text-zinc-300">Optimizes Schedule</div>
                  <div className="text-zinc-500">Creates ideal time blocks and breaks</div>
                </div>
              </div>
            </motion.div>
            
            {/* After Clendr */}
            <motion.div
              className="glass-effect-card p-6 relative"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              <h4 className="text-xl font-bold mb-6 text-zinc-100 flex items-center">
                <svg className="w-5 h-5 mr-2 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                After Clendr
              </h4>
              <div className="space-y-3">
                <div className="p-3 bg-zinc-800/40 rounded border-l-2 border-zinc-500 text-sm">
                  <div className="font-medium text-zinc-300">Focused Deep Work</div>
                  <div className="text-zinc-500">Dedicated time blocks for priority tasks</div>
                </div>
                <div className="p-3 bg-zinc-800/40 rounded border-l-2 border-zinc-500 text-sm">
                  <div className="font-medium text-zinc-300">Smart Breaks</div>
                  <div className="text-zinc-500">Recovery time between intense sessions</div>
                </div>
                <div className="p-3 bg-zinc-800/40 rounded border-l-2 border-zinc-500 text-sm">
                  <div className="font-medium text-zinc-300">Batched Meetings</div>
                  <div className="text-zinc-500">Similar meetings grouped efficiently</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Final CTA for this section */}
        <div className="text-center">
          <motion.p 
            className="text-lg text-zinc-400 mb-8 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Experience how Clendr's intelligent algorithms transform your chaotic schedule 
            into a balanced workflow designed for optimal productivity.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <a href="#waitlist" className="btn-primary px-8 py-3 text-lg interactive" data-cursor-text="Join Now">
              Try Clendr Today
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;