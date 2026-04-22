'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/contexts/LanguageContext'

export default function Hero() {
  const [mounted, setMounted] = useState(false)
  const { t } = useLanguage()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Dynamic Background with 3D Art */}
      <div className="absolute inset-0">
        {/* Main Background Image */}
        <div className="absolute inset-0">
          <img
            src="/Gemini_Generated_Image_swz4wiswz4wiswz4.png"
            alt="3D Digital Art Background"
            className="w-full h-full object-cover"
            style={{
              filter: 'contrast(1.2) saturate(1.3) brightness(0.8)',
              transform: 'scale(1.1)'
            }}
          />
        </div>
        
        {/* Dark Overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-slate-900/90" />
        
        {/* Animated Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-transparent to-blue-900/30" />
        
        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
        
        {/* Animated Geometric Elements */}
        <motion.div
          className="absolute top-20 left-20"
          animate={{
            rotate: [0, 360],
            y: [0, -20, 0]
          }}
          transition={{
            rotate: { duration: 20, repeat: Infinity, ease: "linear" },
            y: { duration: 4, repeat: Infinity, ease: "easeInOut" }
          }}
        >
          <div className="w-16 h-16 border-l-2 border-t-2 border-purple-400/40" />
        </motion.div>

        <motion.div
          className="absolute top-40 right-32"
          animate={{
            rotate: [360, 0],
            x: [0, 30, 0]
          }}
          transition={{
            rotate: { duration: 15, repeat: Infinity, ease: "linear" },
            x: { duration: 3, repeat: Infinity, ease: "easeInOut" }
          }}
        >
          <div className="w-12 h-12 border-r-2 border-b-2 border-blue-400/40" />
        </motion.div>

        
        
        <motion.div
          className="absolute bottom-60 right-40"
          animate={{
            rotate: [0, -360],
            x: [0, -20, 0]
          }}
          transition={{
            rotate: { duration: 12, repeat: Infinity, ease: "linear" },
            x: { duration: 2.5, repeat: Infinity, ease: "easeInOut" }
          }}
        >
          <div className="w-10 h-10 border-l-2 border-b-2 border-cyan-400/40" />
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 px-4 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/30 rounded-full mb-6"
            >
              <span className="text-purple-300 text-sm font-medium font-sans">{t('hero.badge')}</span>
            </motion.div>

            {/* Main Title */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-5xl md:text-7xl font-bold text-white mb-6 font-heading tracking-tight"
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400">
                {t('hero.title')[0]}
              </span>
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400">
                {t('hero.title')[1]}
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-xl text-gray-300 mb-8 leading-relaxed font-sans"
            >
              {t('hero.subtitle')}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="flex flex-col sm:flex-row gap-4 mb-12"
            >
              <Button 
                size="lg" 
                onClick={() => {
                  const portfolioSection = document.getElementById('portfolio')
                  if (portfolioSection) {
                    portfolioSection.scrollIntoView({ behavior: 'smooth' })
                  }
                }}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-8 py-4 rounded-lg shadow-lg hover:shadow-purple-500/25 transition-all duration-300 font-sans"
              >
                {t('hero.viewWork')}
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                onClick={() => {
                  const contactSection = document.getElementById('contact')
                  if (contactSection) {
                    contactSection.scrollIntoView({ behavior: 'smooth' })
                  }
                }}
                className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white px-8 py-4 rounded-lg transition-all duration-300 font-sans"
              >
                {t('hero.contactMe')}
              </Button>
            </motion.div>

            {/* Availability Status */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="flex items-center gap-2 text-green-400 text-sm font-medium font-sans"
            >
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              {t('hero.available')}
            </motion.div>

                      </motion.div>

          {/* Right Side - Stats & Visual Elements */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            {/* Elegant Visual Elements */}
            <div className="relative">
              {/* Central Hexagon */}
              <motion.div
                className="relative w-48 h-48 mx-auto"
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.1, 1]
                }}
                transition={{
                  rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                  scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-32 h-32 border-2 border-purple-400/50 transform rotate-45" />
                  <div className="absolute w-24 h-24 border border-blue-400/40" />
                  <div className="absolute w-16 h-16 bg-gradient-to-br from-purple-500/20 to-blue-500/20" />
                </div>
              </motion.div>

              {/* Floating Triangles */}
              <motion.div
                className="absolute top-0 left-0"
                animate={{
                  y: [0, -10, 0],
                  rotate: [0, 15, -15, 0]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-b-[20px] border-b-purple-400/40" />
              </motion.div>

              <motion.div
                className="absolute top-0 right-0"
                animate={{
                  y: [0, 10, 0],
                  rotate: [0, -15, 15, 0]
                }}
                transition={{
                  duration: 3.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[16px] border-b-blue-400/40" />
              </motion.div>

              <motion.div
                className="absolute bottom-0 left-1/2 transform -translate-x-1/2"
                animate={{
                  x: [-20, 20, -20],
                  opacity: [0.4, 0.8, 0.4]
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <div className="w-12 h-12 border-2 border-pink-400/40 rounded-full" />
              </motion.div>
            </div>

            {/* Expertise Cards */}
            <div className="grid grid-cols-2 gap-4 mt-12">
              {[
                { label: 'Lighting', value: 'Studio', color: 'purple' },
                { label: 'Materials', value: 'PBR', color: 'blue' },
                { label: 'Rendering', value: 'Photoreal', color: 'pink' },
                { label: 'Composition', value: 'Clean', color: 'cyan' }
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1 + index * 0.1 }}
                  className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-4 text-center"
                >
                  <div className={`w-8 h-1 bg-${stat.color}-400 mx-auto mb-3 rounded-full`}></div>
                  <div className="text-2xl font-bold text-white font-heading">{stat.value}</div>
                  <div className="text-sm text-gray-400 font-sans">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.2 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-gray-400 text-sm font-sans">Scroll to explore</span>
          <ArrowDown className="h-5 w-5 text-purple-400" />
        </motion.div>
      </motion.div>
    </section>
  )
}
