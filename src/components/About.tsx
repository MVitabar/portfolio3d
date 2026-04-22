'use client'

import { motion } from "framer-motion";

export default function About() {
  return (
    <section id="about" className="py-20 px-4 bg-slate-900/50">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            About
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-center"
        >
          <p className="text-xl text-gray-300 leading-relaxed mb-8">
            I'm a 3D artist focused on creating clean, realistic and visually strong images.
            My work centers around product visualization, lighting and composition, helping ideas 
            translate into clear and engaging visuals.
          </p>
          
          <p className="text-xl text-gray-300 leading-relaxed">
            I'm currently available for freelance projects and collaborations.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
