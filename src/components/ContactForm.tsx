'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ContactFormData {
  name: string
  email: string
  message: string
}

export default function ContactForm() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      // Use Formspree GET method (more reliable)
      const formUrl = 'https://formspree.io/f/xjvqylqj/submit'
      const formDataParams = new URLSearchParams({
        name: formData.name,
        email: formData.email,
        message: formData.message,
        subject: `New message from ${formData.name} via portfolio`
      })
      
      const response = await fetch(`${formUrl}?${formDataParams.toString()}`, {
        method: 'GET',
        mode: 'no-cors',
        headers: {
          'Accept': 'application/json',
        'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        alert('Thank you for your message! I\'ll get back to you soon.')
        setFormData({ name: '', email: '', message: '' })
      } else {
        // Show more detailed error for debugging
        const errorText = await response.text()
        console.error('Formspree error:', errorText)
        alert(`Error: ${errorText || 'Failed to send message. Please try again.'}`)
      }
    } catch (error) {
      console.error('Error sending email:', error)
      alert('Sorry, there was an error sending your message. Please try again or contact me directly at vitabarmartin@gmail.com')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-8 space-y-6"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 bg-slate-700/50 border border-purple-400/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200"
          placeholder="Your Name"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 bg-slate-700/50 border border-purple-400/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200"
          placeholder="your@email.com"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          rows={5}
          className="w-full px-4 py-3 bg-slate-700/50 border border-purple-400/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200 resize-none"
          placeholder="Tell me about your project..."
        />
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <div className="flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Sending...
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2">
            <Send className="h-5 w-5" />
            Send Message
          </div>
        )}
      </Button>
    </motion.form>
  )
}
