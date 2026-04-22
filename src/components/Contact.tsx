'use client'

import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Contact() {
  return (
    <section id="contact" className="py-20 px-4 relative overflow-hidden">
      {/* Dynamic Background with 3D Art */}
      <div className="absolute inset-0">
        {/* Main Background Image */}
        <div className="absolute inset-0">
          <img
            src="/Gemini_Generated_Image_ilhjusilhjusilhj.png"
            alt="3D Digital Art Background"
            className="w-full h-full object-cover"
            style={{
              filter: 'contrast(1.1) saturate(1.2) brightness(0.6)',
              transform: 'scale(1)',
              objectPosition: '70% center'
            }}
          />
        </div>
        
        {/* Dark Overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-purple-900/85 to-slate-900/95" />
        
        {/* Animated Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-tl from-blue-900/20 via-transparent to-purple-900/20" />
        
        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        
        {/* Contact-specific Geometric Elements */}
        <motion.div
          className="absolute top-10 right-10"
          animate={{
            rotate: [0, -360],
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <div className="w-16 h-16 border-2 border-purple-400/30 rounded-lg" />
        </motion.div>
        
        <motion.div
          className="absolute bottom-20 left-20"
          animate={{
            rotate: [0, 360],
            y: [0, -30, 0]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <div className="w-20 h-20 border border-blue-400/30 rounded-full" />
        </motion.div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Get In Touch
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Have a project in mind? Let's create something amazing together
          </p>
        </motion.div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-3xl font-bold text-white mb-8">Let's Connect</h3>
              <p className="text-gray-300 text-lg mb-12">
                I'm always interested in hearing about new projects and opportunities. 
                Whether you have a question or just want to say hi, feel free to reach out!
              </p>
            </div>
            <div className="space-y-6">
              <div className="flex items-center gap-6 text-gray-300 p-6 bg-slate-800/30 rounded-xl backdrop-blur-sm">
                <div className="w-16 h-16 bg-purple-600/20 rounded-xl flex items-center justify-center">
                  <Mail className="h-8 w-8 text-purple-400" />
                </div>
                <div>
                  <p className="font-semibold text-white text-lg">Email</p>
                  <a 
                    href="mailto:vitabarmartin@gmail.com"
                    className="text-purple-300 hover:text-purple-200 transition-colors duration-200 text-lg"
                  >
                    vitabarmartin@gmail.com
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-6 text-gray-300 p-6 bg-slate-800/30 rounded-xl backdrop-blur-sm">
                <div className="w-16 h-16 bg-purple-600/20 rounded-xl flex items-center justify-center">
                  <Phone className="h-8 w-8 text-purple-400" />
                </div>
                <div>
                  <p className="font-semibold text-white text-lg">Phone</p>
                  <a href="https://wa.me/5548996209954" target="_blank" rel="noopener noreferrer" className="text-purple-300 hover:text-purple-200 transition-colors duration-200 text-lg">
                    +55 (48) 99620-9954
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-6 text-gray-300 p-6 bg-slate-800/30 rounded-xl backdrop-blur-sm">
                <div className="w-16 h-16 bg-purple-600/20 rounded-xl flex items-center justify-center">
                  <MapPin className="h-8 w-8 text-purple-400" />
                </div>
                <div>
                  <p className="font-semibold text-white text-lg">Location</p>
                  <p className="text-lg">Brazil</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
