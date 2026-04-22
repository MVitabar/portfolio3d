'use client'

import { motion } from "framer-motion";
import { useLanguage } from '@/contexts/LanguageContext';

export default function About() {
  const { t } = useLanguage()

  return (
    <section id="about" className="py-20 px-4 relative overflow-hidden">
      {/* Background to match other sections */}
      <div className="absolute inset-0">
        {/* Dark gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-purple-900/85 to-slate-900/95" />
        
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-tl from-blue-900/20 via-transparent to-purple-900/20" />
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {t('about.title')}
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-center space-y-8"
        >
          <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 md:p-12">
            <p className="text-xl text-gray-300 leading-relaxed mb-8">
              {t('about.text1')}
              {' '}
              {t('about.text2')}
            </p>
            
            <p className="text-xl text-gray-300 leading-relaxed">
              {t('about.text3')}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
