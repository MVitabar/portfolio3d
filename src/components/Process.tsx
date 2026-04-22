'use client'

import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle, Clock, Users, Target, Zap } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

interface ProcessStep {
  title: string
  description: string
  icon: React.ReactNode
  color: string
}

export default function Process() {
  const { t } = useLanguage()

  const processSteps: ProcessStep[] = [
    {
      title: t('process.steps.0.title'),
      description: t('process.steps.0.description'),
      icon: <Target className="h-6 w-6" />,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: t('process.steps.1.title'),
      description: t('process.steps.1.description'),
      icon: <Zap className="h-6 w-6" />,
      color: 'from-purple-500 to-pink-500'
    },
    {
      title: t('process.steps.2.title'),
      description: t('process.steps.2.description'),
      icon: <Users className="h-6 w-6" />,
      color: 'from-orange-500 to-red-500'
    },
    {
      title: t('process.steps.3.title'),
      description: t('process.steps.3.description'),
      icon: <CheckCircle className="h-6 w-6" />,
      color: 'from-green-500 to-emerald-500'
    }
  ]

  return (
    <section className="py-20 bg-gradient-to-b from-slate-800 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {t('process.title')}
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            {t('process.subtitle')}
          </p>
        </motion.div>

        {/* Process Timeline */}
        <div className="relative">
          {/* Desktop Timeline */}
          <div className="hidden lg:block">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-purple-500 to-pink-500"></div>
            
            <div className="space-y-12">
              {processSteps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className={`flex items-center ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}
                >
                  <div className={`w-5/12 ${index % 2 === 0 ? 'text-right pr-8' : 'text-left pl-8 order-1'}`}>
                    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700/50 hover:border-purple-500/50 transition-all duration-300">
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`p-2 bg-gradient-to-r ${step.color} rounded-lg`}>
                          <div className="text-white">{step.icon}</div>
                        </div>
                        <h3 className="text-xl font-bold text-white">{step.title}</h3>
                      </div>
                      <p className="text-gray-300 leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                  
                  {/* Timeline Dot */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full border-4 border-slate-900"></div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Mobile Timeline */}
          <div className="lg:hidden space-y-8">
            {processSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex gap-4"
              >
                <div className={`p-3 bg-gradient-to-r ${step.color} rounded-lg flex-shrink-0`}>
                  <div className="text-white">{step.icon}</div>
                </div>
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-4 border border-slate-700/50 flex-1">
                  <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Process Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-4 gap-6 mt-16"
        >
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700/50 text-center">
            <Clock className="h-8 w-8 text-purple-400 mx-auto mb-3" />
            <div className="text-2xl font-bold text-white mb-1">2-3 Days</div>
            <div className="text-sm text-gray-400">Average turnaround</div>
          </div>
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700/50 text-center">
            <CheckCircle className="h-8 w-8 text-green-400 mx-auto mb-3" />
            <div className="text-2xl font-bold text-white mb-1">98%</div>
            <div className="text-sm text-gray-400">Client satisfaction</div>
          </div>
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700/50 text-center">
            <Users className="h-8 w-8 text-blue-400 mx-auto mb-3" />
            <div className="text-2xl font-bold text-white mb-1">50+</div>
            <div className="text-sm text-gray-400">Happy clients</div>
          </div>
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700/50 text-center">
            <ArrowRight className="h-8 w-8 text-orange-400 mx-auto mb-3" />
            <div className="text-2xl font-bold text-white mb-1">4 Steps</div>
            <div className="text-sm text-gray-400">Streamlined process</div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
