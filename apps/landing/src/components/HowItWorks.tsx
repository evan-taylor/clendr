import { motion } from 'framer-motion';

interface HowItWorksProps {
  className?: string;
}

const HowItWorks = ({ className = '' }: HowItWorksProps) => {
  const steps = [
    {
      title: 'Intelligent Scheduling',
      description: 'Our AI analyzes your habits and preferences to suggest the best times for meetings and tasks.',
      iconColor: 'from-primary-500 to-blue-500',
      iconPath: 'M9.5 12L11 13.5L14.5 10M7.364 2.5h9.272a1.5 1.5 0 0 1 1.06.44l4.208 4.208a1.5 1.5 0 0 1 .44 1.06v9.272a2.25 2.25 0 0 1-2.25 2.25H7.364a2.25 2.25 0 0 1-2.25-2.25V4.75a2.25 2.25 0 0 1 2.25-2.25Z',
    },
    {
      title: 'Seamless Integration',
      description: 'Connect with your existing tools and services for a unified scheduling experience.',
      iconColor: 'from-purple-500 to-primary-500',
      iconPath: 'M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244',
    },
    {
      title: 'Smart Reminders',
      description: 'Get personalized notifications that adapt to your context and schedule changes.',
      iconColor: 'from-blue-500 to-teal-500',
      iconPath: 'M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0',
    },
    {
      title: 'Effortless Sharing',
      description: 'Share your availability with others and schedule meetings without back-and-forth.',
      iconColor: 'from-teal-500 to-purple-500',
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
    <section id="how-it-works" className={`relative py-20 md:py-32 ${className}`}>
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 -z-10"></div>
      
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          <motion.span 
            className="inline-block px-3 py-1 text-sm font-semibold bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-full mb-4 shadow-md"
            variants={itemVariants}
          >
            How It Works
          </motion.span>
          
          <motion.h2 
            className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6"
            variants={itemVariants}
          >
            Intelligent Scheduling <span className="gradient-text">Simplified</span>
          </motion.h2>
          
          <motion.p 
            className="max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-300"
            variants={itemVariants}
          >
            Clendr transforms calendar management with these powerful features
          </motion.p>
        </motion.div>
        
        {/* Process visualization */}
        <div className="relative">
          {/* Connecting line */}
          <div className="absolute left-1/2 top-8 bottom-0 w-0.5 bg-gradient-to-b from-primary-500 to-transparent dark:from-primary-400 -translate-x-1/2 hidden md:block"></div>
          
          <motion.div 
            className="grid md:grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 relative z-10"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {steps.map((step, index) => (
              <motion.div 
                key={index} 
                className={`${index % 2 === 0 ? 'lg:translate-x-12' : 'lg:-translate-x-12 lg:mt-32'} relative`}
                variants={itemVariants}
                custom={index}
              >
                <div className="glass-card p-8 relative z-10 overflow-hidden">
                  {/* Step number */}
                  <div className="absolute -right-6 -top-6 w-24 h-24 flex items-center justify-center opacity-10 text-7xl font-bold font-geist text-primary-500">
                    {index + 1}
                  </div>
                  
                  {/* Icon */}
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${step.iconColor} mb-6 p-4 shadow-lg`}>
                    <svg 
                      className="w-full h-full text-white" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={step.iconPath} />
                    </svg>
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">{step.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{step.description}</p>
                </div>
                
                {/* 3D perspective effect for cards */}
                <div className="absolute inset-0 bg-primary-500/10 dark:bg-primary-500/5 rounded-2xl transform -rotate-2 -translate-y-2 translate-x-2 z-0"></div>
              </motion.div>
            ))}
          </motion.div>
        </div>
        
        {/* Abstract visualization - ENHANCED VERSION */}
        <div className="mt-24 relative rounded-xl overflow-hidden p-10 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900/80 dark:to-gray-800/80 backdrop-blur border border-gray-100/20 dark:border-gray-700/20 shadow-xl">
          <div className="absolute inset-0 overflow-hidden opacity-10">
            <div className="absolute inset-0 bg-gradient-radial from-primary-500/20 via-transparent to-transparent"></div>
            <svg className="absolute w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>
          
          <div className="relative z-10">
            <motion.h3
              className="text-2xl md:text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              AI-Powered Calendar Optimization
            </motion.h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {/* Before Optimization */}
              <motion.div
                className="glass-card p-6 rounded-xl relative overflow-hidden"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.1 }}
              >
                <div className="absolute -right-8 -top-8 w-24 h-24 bg-red-500/10 rounded-full"></div>
                <h4 className="text-xl font-bold mb-4 text-gray-900 dark:text-white flex items-center">
                  <svg className="w-6 h-6 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Before Clendr
                </h4>
                <div className="space-y-2">
                  <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded border-l-4 border-red-500 text-sm text-gray-700 dark:text-gray-300">
                    <div className="font-medium">Meeting Overload</div>
                    <div className="text-xs opacity-75">Back-to-back meetings with no breaks</div>
                  </div>
                  <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded border-l-4 border-red-500 text-sm text-gray-700 dark:text-gray-300">
                    <div className="font-medium">Context Switching</div>
                    <div className="text-xs opacity-75">Jumping between unrelated tasks</div>
                  </div>
                  <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded border-l-4 border-red-500 text-sm text-gray-700 dark:text-gray-300">
                    <div className="font-medium">Inefficient Time Blocks</div>
                    <div className="text-xs opacity-75">Wasted time between appointments</div>
                  </div>
                </div>
              </motion.div>
              
              {/* AI Process */}
              <motion.div
                className="glass-card p-6 rounded-xl relative overflow-hidden"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.3 }}
              >
                <div className="absolute -right-8 -top-8 w-24 h-24 bg-primary-500/10 rounded-full"></div>
                <h4 className="text-xl font-bold mb-4 text-gray-900 dark:text-white flex items-center">
                  <svg className="w-6 h-6 mr-2 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Clendr AI Process
                </h4>
                <div className="space-y-2 relative">
                  <motion.div
                    className="h-full absolute left-3 top-0 w-0.5 bg-gradient-to-b from-primary-500 to-teal-500"
                    initial={{ height: 0 }}
                    whileInView={{ height: '100%' }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.8 }}
                  ></motion.div>
                  <motion.div 
                    className="ml-5 p-2 bg-primary-100 dark:bg-primary-900/30 rounded text-sm text-gray-700 dark:text-gray-300"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.9 }}
                  >
                    <div className="font-medium">Analyzes Work Patterns</div>
                    <div className="text-xs opacity-75">Learns from your productivity cycles</div>
                  </motion.div>
                  <motion.div 
                    className="ml-5 p-2 bg-primary-100 dark:bg-primary-900/30 rounded text-sm text-gray-700 dark:text-gray-300"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 1.1 }}
                  >
                    <div className="font-medium">Prioritizes Tasks</div>
                    <div className="text-xs opacity-75">Based on deadlines and importance</div>
                  </motion.div>
                  <motion.div 
                    className="ml-5 p-2 bg-primary-100 dark:bg-primary-900/30 rounded text-sm text-gray-700 dark:text-gray-300"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 1.3 }}
                  >
                    <div className="font-medium">Optimizes Schedule</div>
                    <div className="text-xs opacity-75">Creates ideal time blocks and breaks</div>
                  </motion.div>
                </div>
              </motion.div>
              
              {/* After Optimization */}
              <motion.div
                className="glass-card p-6 rounded-xl relative overflow-hidden"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.5 }}
              >
                <div className="absolute -right-8 -top-8 w-24 h-24 bg-green-500/10 rounded-full"></div>
                <h4 className="text-xl font-bold mb-4 text-gray-900 dark:text-white flex items-center">
                  <svg className="w-6 h-6 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  After Clendr
                </h4>
                <div className="space-y-2">
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded border-l-4 border-green-500 text-sm text-gray-700 dark:text-gray-300">
                    <div className="font-medium">Focused Deep Work</div>
                    <div className="text-xs opacity-75">Dedicated time blocks for priority tasks</div>
                  </div>
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded border-l-4 border-green-500 text-sm text-gray-700 dark:text-gray-300">
                    <div className="font-medium">Smart Breaks</div>
                    <div className="text-xs opacity-75">Recovery time between intense sessions</div>
                  </div>
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded border-l-4 border-green-500 text-sm text-gray-700 dark:text-gray-300">
                    <div className="font-medium">Batched Meetings</div>
                    <div className="text-xs opacity-75">Similar meetings grouped efficiently</div>
                  </div>
                </div>
              </motion.div>
            </div>
            
            {/* Interactive Calendar Animation */}
            <motion.div
              className="relative h-64 md:h-80 max-w-4xl mx-auto rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800/50 mb-10"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {/* Day Columns */}
              <div className="absolute inset-0 grid grid-cols-5 gap-0.5 p-1">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className="bg-white/30 dark:bg-gray-900/30 rounded-lg relative overflow-hidden">
                    <div className="absolute top-1 left-0 right-0 text-center text-xs font-medium text-gray-500 dark:text-gray-400">
                      {['MON', 'TUE', 'WED', 'THU', 'FRI'][index]}
                    </div>
                    
                    {/* Time blocks comparison */}
                    <div className="absolute inset-0 flex flex-col pt-6 px-1">
                      <div className="flex-1 relative">
                        {/* "Before" blocks - scattered, inefficient and overwhelming */}
                        <motion.div
                          className="absolute inset-0 opacity-0"
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          viewport={{ once: true }}
                          animate={{ 
                            opacity: [0, 1, 1, 0, 0, 0, 0, 1, 1] 
                          }}
                          transition={{
                            duration: 7,
                            repeat: Infinity,
                            repeatDelay: 0,
                          }}
                        >
                          {index === 0 && (
                            <>
                              {/* Overwhelming, crowded calendar with too many small meetings */}
                              <div className="absolute top-[5%] left-1 right-1 h-[8%] bg-red-300/70 dark:bg-red-700/70 rounded text-[6px] text-center overflow-hidden">Meeting</div>
                              <div className="absolute top-[15%] left-1 right-1 h-[6%] bg-yellow-300/70 dark:bg-yellow-700/70 rounded text-[6px] text-center overflow-hidden">Call</div>
                              <div className="absolute top-[23%] left-1 right-1 h-[5%] bg-purple-300/70 dark:bg-purple-700/70 rounded text-[6px] text-center overflow-hidden">Task</div>
                              <div className="absolute top-[30%] left-1 right-1 h-[7%] bg-red-300/70 dark:bg-red-700/70 rounded text-[6px] text-center overflow-hidden">Meeting</div>
                              <div className="absolute top-[39%] left-1 right-1 h-[5%] bg-blue-300/70 dark:bg-blue-700/70 rounded text-[6px] text-center overflow-hidden">Review</div>
                              <div className="absolute top-[46%] left-1 right-1 h-[6%] bg-orange-300/70 dark:bg-orange-700/70 rounded text-[6px] text-center overflow-hidden">Call</div>
                              <div className="absolute top-[54%] left-1 right-1 h-[5%] bg-green-300/70 dark:bg-green-700/70 rounded text-[6px] text-center overflow-hidden">Task</div>
                              <div className="absolute top-[61%] left-1 right-1 h-[7%] bg-red-300/70 dark:bg-red-700/70 rounded text-[6px] text-center overflow-hidden">Meeting</div>
                              <div className="absolute top-[70%] left-1 right-1 h-[8%] bg-purple-300/70 dark:bg-purple-700/70 rounded text-[6px] text-center overflow-hidden">Task</div>
                              <div className="absolute top-[80%] left-1 right-1 h-[9%] bg-yellow-300/70 dark:bg-yellow-700/70 rounded text-[6px] text-center overflow-hidden">Call</div>
                            </>
                          )}
                          {index === 1 && (
                            <>
                              <div className="absolute top-[7%] left-1 right-1 h-[6%] bg-orange-300/70 dark:bg-orange-700/70 rounded text-[6px] text-center overflow-hidden">Call</div>
                              <div className="absolute top-[15%] left-1 right-1 h-[7%] bg-red-300/70 dark:bg-red-700/70 rounded text-[6px] text-center overflow-hidden">Meeting</div>
                              <div className="absolute top-[24%] left-1 right-1 h-[4%] bg-green-300/70 dark:bg-green-700/70 rounded text-[6px] text-center overflow-hidden">Task</div>
                              <div className="absolute top-[30%] left-1 right-1 h-[5%] bg-blue-300/70 dark:bg-blue-700/70 rounded text-[6px] text-center overflow-hidden">Review</div>
                              <div className="absolute top-[37%] left-1 right-1 h-[6%] bg-red-300/70 dark:bg-red-700/70 rounded text-[6px] text-center overflow-hidden">Meeting</div>
                              <div className="absolute top-[45%] left-1 right-1 h-[8%] bg-yellow-300/70 dark:bg-yellow-700/70 rounded text-[6px] text-center overflow-hidden">Call</div>
                              <div className="absolute top-[55%] left-1 right-1 h-[5%] bg-purple-300/70 dark:bg-purple-700/70 rounded text-[6px] text-center overflow-hidden">Task</div>
                              <div className="absolute top-[62%] left-1 right-1 h-[6%] bg-red-300/70 dark:bg-red-700/70 rounded text-[6px] text-center overflow-hidden">Meeting</div>
                              <div className="absolute top-[70%] left-1 right-1 h-[8%] bg-orange-300/70 dark:bg-orange-700/70 rounded text-[6px] text-center overflow-hidden">Call</div>
                              <div className="absolute top-[80%] left-1 right-1 h-[6%] bg-green-300/70 dark:bg-green-700/70 rounded text-[6px] text-center overflow-hidden">Task</div>
                            </>
                          )}
                          {index === 2 && (
                            <>
                              <div className="absolute top-[5%] left-1 right-1 h-[6%] bg-purple-300/70 dark:bg-purple-700/70 rounded text-[6px] text-center overflow-hidden">Task</div>
                              <div className="absolute top-[13%] left-1 right-1 h-[7%] bg-red-300/70 dark:bg-red-700/70 rounded text-[6px] text-center overflow-hidden">Meeting</div>
                              <div className="absolute top-[22%] left-1 right-1 h-[5%] bg-yellow-300/70 dark:bg-yellow-700/70 rounded text-[6px] text-center overflow-hidden">Call</div>
                              <div className="absolute top-[29%] left-1 right-1 h-[6%] bg-blue-300/70 dark:bg-blue-700/70 rounded text-[6px] text-center overflow-hidden">Review</div>
                              <div className="absolute top-[37%] left-1 right-1 h-[4%] bg-green-300/70 dark:bg-green-700/70 rounded text-[6px] text-center overflow-hidden">Task</div>
                              <div className="absolute top-[43%] left-1 right-1 h-[7%] bg-red-300/70 dark:bg-red-700/70 rounded text-[6px] text-center overflow-hidden">Meeting</div>
                              <div className="absolute top-[52%] left-1 right-1 h-[5%] bg-orange-300/70 dark:bg-orange-700/70 rounded text-[6px] text-center overflow-hidden">Call</div>
                              <div className="absolute top-[59%] left-1 right-1 h-[6%] bg-purple-300/70 dark:bg-purple-700/70 rounded text-[6px] text-center overflow-hidden">Task</div>
                              <div className="absolute top-[67%] left-1 right-1 h-[5%] bg-red-300/70 dark:bg-red-700/70 rounded text-[6px] text-center overflow-hidden">Meeting</div>
                              <div className="absolute top-[74%] left-1 right-1 h-[6%] bg-yellow-300/70 dark:bg-yellow-700/70 rounded text-[6px] text-center overflow-hidden">Call</div>
                              <div className="absolute top-[82%] left-1 right-1 h-[5%] bg-blue-300/70 dark:bg-blue-700/70 rounded text-[6px] text-center overflow-hidden">Review</div>
                            </>
                          )}
                          {index === 3 && (
                            <>
                              <div className="absolute top-[8%] left-1 right-1 h-[7%] bg-red-300/70 dark:bg-red-700/70 rounded text-[6px] text-center overflow-hidden">Meeting</div>
                              <div className="absolute top-[17%] left-1 right-1 h-[5%] bg-green-300/70 dark:bg-green-700/70 rounded text-[6px] text-center overflow-hidden">Task</div>
                              <div className="absolute top-[24%] left-1 right-1 h-[6%] bg-yellow-300/70 dark:bg-yellow-700/70 rounded text-[6px] text-center overflow-hidden">Call</div>
                              <div className="absolute top-[32%] left-1 right-1 h-[8%] bg-red-300/70 dark:bg-red-700/70 rounded text-[6px] text-center overflow-hidden">Meeting</div>
                              <div className="absolute top-[42%] left-1 right-1 h-[5%] bg-blue-300/70 dark:bg-blue-700/70 rounded text-[6px] text-center overflow-hidden">Review</div>
                              <div className="absolute top-[49%] left-1 right-1 h-[4%] bg-orange-300/70 dark:bg-orange-700/70 rounded text-[6px] text-center overflow-hidden">Call</div>
                              <div className="absolute top-[55%] left-1 right-1 h-[6%] bg-red-300/70 dark:bg-red-700/70 rounded text-[6px] text-center overflow-hidden">Meeting</div>
                              <div className="absolute top-[63%] left-1 right-1 h-[5%] bg-purple-300/70 dark:bg-purple-700/70 rounded text-[6px] text-center overflow-hidden">Task</div>
                              <div className="absolute top-[70%] left-1 right-1 h-[8%] bg-yellow-300/70 dark:bg-yellow-700/70 rounded text-[6px] text-center overflow-hidden">Call</div>
                              <div className="absolute top-[80%] left-1 right-1 h-[5%] bg-green-300/70 dark:bg-green-700/70 rounded text-[6px] text-center overflow-hidden">Task</div>
                            </>
                          )}
                          {index === 4 && (
                            <>
                              <div className="absolute top-[5%] left-1 right-1 h-[6%] bg-blue-300/70 dark:bg-blue-700/70 rounded text-[6px] text-center overflow-hidden">Review</div>
                              <div className="absolute top-[13%] left-1 right-1 h-[7%] bg-red-300/70 dark:bg-red-700/70 rounded text-[6px] text-center overflow-hidden">Meeting</div>
                              <div className="absolute top-[22%] left-1 right-1 h-[5%] bg-orange-300/70 dark:bg-orange-700/70 rounded text-[6px] text-center overflow-hidden">Call</div>
                              <div className="absolute top-[29%] left-1 right-1 h-[5%] bg-green-300/70 dark:bg-green-700/70 rounded text-[6px] text-center overflow-hidden">Task</div>
                              <div className="absolute top-[36%] left-1 right-1 h-[7%] bg-red-300/70 dark:bg-red-700/70 rounded text-[6px] text-center overflow-hidden">Meeting</div>
                              <div className="absolute top-[45%] left-1 right-1 h-[6%] bg-yellow-300/70 dark:bg-yellow-700/70 rounded text-[6px] text-center overflow-hidden">Call</div>
                              <div className="absolute top-[53%] left-1 right-1 h-[8%] bg-purple-300/70 dark:bg-purple-700/70 rounded text-[6px] text-center overflow-hidden">Task</div>
                              <div className="absolute top-[63%] left-1 right-1 h-[5%] bg-red-300/70 dark:bg-red-700/70 rounded text-[6px] text-center overflow-hidden">Meeting</div>
                              <div className="absolute top-[70%] left-1 right-1 h-[7%] bg-blue-300/70 dark:bg-blue-700/70 rounded text-[6px] text-center overflow-hidden">Review</div>
                              <div className="absolute top-[79%] left-1 right-1 h-[6%] bg-green-300/70 dark:bg-green-700/70 rounded text-[6px] text-center overflow-hidden">Task</div>
                            </>
                          )}
                        </motion.div>
                        
                        {/* "After" blocks - optimized and well organized */}
                        <motion.div
                          className="absolute inset-0 opacity-0"
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          viewport={{ once: true }}
                          animate={{ 
                            opacity: [0, 0, 0, 0, 0, 1, 1, 0, 0] 
                          }}
                          transition={{
                            duration: 7,
                            repeat: Infinity,
                            repeatDelay: 0,
                          }}
                        >
                          {index === 0 && (
                            <>
                              <div className="absolute top-[5%] left-1 right-1 h-[6%] bg-blue-300/70 dark:bg-blue-700/70 rounded text-xs text-center">Team Sync</div>
                              <div className="absolute top-[15%] left-1 right-1 h-[25%] bg-green-300/70 dark:bg-green-700/70 rounded-t text-xs text-center">Focus Block</div>
                              <div className="absolute top-[42%] left-1 right-1 h-[6%] bg-teal-300/70 dark:bg-teal-700/70 rounded text-xs text-center">Break</div>
                              <div className="absolute top-[50%] left-1 right-1 h-[15%] bg-purple-300/70 dark:bg-purple-700/70 rounded text-xs text-center">Meetings</div>
                              <div className="absolute top-[70%] left-1 right-1 h-[25%] bg-green-300/70 dark:bg-green-700/70 rounded-t text-xs text-center">Focus Block</div>
                            </>
                          )}
                          {index === 1 && (
                            <>
                              <div className="absolute top-[5%] left-1 right-1 h-[6%] bg-blue-300/70 dark:bg-blue-700/70 rounded text-xs text-center">Team Sync</div>
                              <div className="absolute top-[15%] left-1 right-1 h-[30%] bg-green-300/70 dark:bg-green-700/70 rounded-t text-xs text-center">Focus Block</div>
                              <div className="absolute top-[47%] left-1 right-1 h-[6%] bg-teal-300/70 dark:bg-teal-700/70 rounded text-xs text-center">Break</div>
                              <div className="absolute top-[55%] left-1 right-1 h-[40%] bg-purple-300/70 dark:bg-purple-700/70 rounded text-xs text-center">Meetings</div>
                            </>
                          )}
                          {index === 2 && (
                            <>
                              <div className="absolute top-[5%] left-1 right-1 h-[6%] bg-blue-300/70 dark:bg-blue-700/70 rounded text-xs text-center">Team Sync</div>
                              <div className="absolute top-[15%] left-1 right-1 h-[20%] bg-purple-300/70 dark:bg-purple-700/70 rounded text-xs text-center">Meetings</div>
                              <div className="absolute top-[37%] left-1 right-1 h-[6%] bg-teal-300/70 dark:bg-teal-700/70 rounded text-xs text-center">Break</div>
                              <div className="absolute top-[45%] left-1 right-1 h-[50%] bg-green-300/70 dark:bg-green-700/70 rounded-t text-xs text-center">Focus Block</div>
                            </>
                          )}
                          {index === 3 && (
                            <>
                              <div className="absolute top-[5%] left-1 right-1 h-[6%] bg-blue-300/70 dark:bg-blue-700/70 rounded text-xs text-center">Team Sync</div>
                              <div className="absolute top-[15%] left-1 right-1 h-[45%] bg-green-300/70 dark:bg-green-700/70 rounded-t text-xs text-center">Focus Block</div>
                              <div className="absolute top-[62%] left-1 right-1 h-[6%] bg-teal-300/70 dark:bg-teal-700/70 rounded text-xs text-center">Break</div>
                              <div className="absolute top-[70%] left-1 right-1 h-[25%] bg-purple-300/70 dark:bg-purple-700/70 rounded text-xs text-center">Meetings</div>
                            </>
                          )}
                          {index === 4 && (
                            <>
                              <div className="absolute top-[5%] left-1 right-1 h-[6%] bg-blue-300/70 dark:bg-blue-700/70 rounded text-xs text-center">Team Sync</div>
                              <div className="absolute top-[15%] left-1 right-1 h-[25%] bg-purple-300/70 dark:bg-purple-700/70 rounded text-xs text-center">Meetings</div>
                              <div className="absolute top-[42%] left-1 right-1 h-[6%] bg-teal-300/70 dark:bg-teal-700/70 rounded text-xs text-center">Break</div>
                              <div className="absolute top-[50%] left-1 right-1 h-[45%] bg-green-300/70 dark:bg-green-700/70 rounded-t text-xs text-center">Focus Block</div>
                            </>
                          )}
                        </motion.div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Animation overlay - Optimization Process */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-primary-500/90 to-teal-500/90 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                animate={{ 
                  opacity: [0, 0, 1, 1, 0],
                  scale: [1, 1, 1, 1.05, 1.05] 
                }}
                transition={{ 
                  duration: 4.0, 
                  times: [0, 0.2, 0.3, 0.5, 0.6],
                  repeat: Infinity,
                  repeatDelay: 3
                }}
              >
                <motion.div 
                  className="text-center text-white"
                  animate={{ 
                    opacity: [0, 0, 1, 1, 0] 
                  }}
                  transition={{ 
                    duration: 4.0, 
                    times: [0, 0.2, 0.3, 0.5, 0.6],
                    repeat: Infinity,
                    repeatDelay: 3
                  }}
                >
                  <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <p className="text-xl font-bold">Optimizing Your Calendar</p>
                  <p className="text-sm opacity-90">AI is analyzing your schedule...</p>
                </motion.div>
              </motion.div>
              
              {/* Before/After Labels */}
              <div className="absolute top-2 right-2 z-10 flex gap-1 text-xs font-medium">
                <motion.div 
                  className="px-2 py-1 rounded bg-red-500 text-white"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  animate={{ 
                    opacity: [0, 1, 1, 0, 0, 0, 0, 1, 1] 
                  }}
                  transition={{
                    duration: 7,
                    repeat: Infinity,
                    repeatDelay: 0,
                  }}
                >
                  BEFORE
                </motion.div>
                <motion.div 
                  className="px-2 py-1 rounded bg-green-500 text-white"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  animate={{ 
                    opacity: [0, 0, 0, 0, 0, 1, 1, 0, 0] 
                  }}
                  transition={{
                    duration: 7,
                    repeat: Infinity,
                    repeatDelay: 0,
                  }}
                >
                  AFTER
                </motion.div>
              </div>
            </motion.div>
            
            <motion.p 
              className="text-center text-gray-700 dark:text-gray-300 max-w-2xl mx-auto text-lg font-medium"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.7 }}
            >
              Clendr intelligently manages and optimizes your calendar events and tasks, 
              transforming chaotic schedules into focused productivity.
            </motion.p>
          </div>
        </div>
        
        {/* New Call to Action */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <a 
            href="/waitlist" 
            className="inline-block px-8 py-4 bg-gradient-to-r from-primary-600 to-teal-600 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transform transition hover:-translate-y-1"
          >
            Join the Waitlist to Try Clendr
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks; 