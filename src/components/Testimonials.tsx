'use client'

import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

interface Testimonial {
  name: string
  company: string
  text: string
  rating: number
}

export default function Testimonials() {
  const { t } = useLanguage()

  // TODO: Replace with actual testimonials from clients
  const testimonials: Testimonial[] = [
    {
      name: 'Sarah Johnson',
      company: 'TechCorp Industries',
      text: 'Working with Martín transformed our product visualization. The attention to detail and photorealistic quality exceeded our expectations. Our conversion rates increased by 40% after implementing the new renders.',
      rating: 5
    },
    {
      name: 'Michael Chen',
      company: 'E-commerce Solutions Ltd',
      text: 'Martín delivered exceptional 3D visuals that perfectly captured our brand essence. The communication was smooth, and the final results were exactly what we needed for our product launch.',
      rating: 5
    },
    {
      name: 'Emma Rodriguez',
      company: 'Creative Agency Brazil',
      text: 'As an agency, we need reliable partners. Martín consistently delivers high-quality work on time. His technical expertise and artistic vision make him our go-to 3D artist for complex projects.',
      rating: 5
    }
  ]

  return (
    <section className="py-20 bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {t('testimonials.title')}
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            {t('testimonials.subtitle')}
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border border-slate-700/50 hover:border-purple-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/10"
            >
              {/* Quote Icon */}
              <div className="mb-4">
                <Quote className="h-8 w-8 text-purple-400" />
              </div>

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>

              {/* Testimonial Text */}
              <blockquote className="text-gray-300 mb-6 leading-relaxed">
                "{testimonial.text}"
              </blockquote>

              {/* Author Info */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <div className="font-semibold text-white">{testimonial.name}</div>
                  <div className="text-sm text-gray-400">{testimonial.company}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        {/* <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-2xl p-8 border border-purple-500/30">
            <h3 className="text-2xl font-bold text-white mb-4">
              Ready to join these satisfied clients?
            </h3>
            <p className="text-gray-300 mb-6">
              Let's discuss how we can create exceptional 3D visuals for your brand.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300">
                {t('contact.startProject')}
              </button>
              <button className="px-8 py-3 border border-purple-400/50 text-purple-400 font-semibold rounded-lg hover:bg-purple-400/20 hover:text-white transition-all duration-300">
                {t('contact.bookConsultation')}
              </button>
            </div>
          </div>
        </motion.div> */}
      </div>
    </section>
  )
}
