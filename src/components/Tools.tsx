'use client'

import { motion } from 'framer-motion'
import { useLanguage } from '@/contexts/LanguageContext'

interface Tool {
  name: string
  category: string
  icon: string
  description?: string
}

export default function Tools() {
  const { t } = useLanguage()

  // Tool icons (using simple SVG paths or emoji for now)
  const toolIcons: { [key: string]: string } = {
    blender: ' Blender',
    cinema4d: ' C4D',
    substance: ' Substance',
    aftereffects: ' AE',
    photoshop: ' PS',
    octane: ' Octane',
    redshift: ' Redshift',
    zbrush: ' ZBrush',
    mari: ' Mari',
    nuke: ' Nuke'
  }

  // Enhanced tools data with descriptions
  const toolsData: Tool[] = [
    { name: 'Blender', category: 'modeling', icon: toolIcons.blender, description: 'Open-source 3D creation suite' },
    { name: 'Cinema 4D', category: 'modeling', icon: toolIcons.cinema4d, description: 'Professional 3D modeling software' },
    { name: 'ZBrush', category: 'modeling', icon: toolIcons.zbrush, description: 'Digital sculpting and painting' },
    { name: 'Substance Painter', category: 'texturing', icon: toolIcons.substance, description: '3D texturing software' },
    { name: 'Substance Designer', category: 'texturing', icon: toolIcons.substance, description: 'Material authoring tool' },
    { name: 'Mari', category: 'texturing', icon: toolIcons.mari, description: '3D painting and texturing' },
    { name: 'Octane Render', category: 'rendering', icon: toolIcons.octane, description: 'GPU-accelerated rendering' },
    { name: 'Redshift', category: 'rendering', icon: toolIcons.redshift, description: 'GPU rendering engine' },
    { name: 'After Effects', category: 'post', icon: toolIcons.aftereffects, description: 'Motion graphics and compositing' },
    { name: 'Photoshop', category: 'post', icon: toolIcons.photoshop, description: 'Image editing and post-production' },
    { name: 'Nuke', category: 'post', icon: toolIcons.nuke, description: 'Node-based compositing' }
  ]

  // Get tools from translations and merge with enhanced data
  const translationTools = (t('tools.items') as any) || []
  const enhancedTools = translationTools.map((tool: any) => ({
    ...tool,
    ...toolsData.find(t => t.name === tool.name)
  }))

  // Group tools by category
  const toolsByCategory = enhancedTools.reduce((acc: { [key: string]: Tool[] }, tool: Tool) => {
    if (!acc[tool.category]) {
      acc[tool.category] = []
    }
    acc[tool.category].push(tool)
    return acc
  }, {} as { [key: string]: Tool[] })

  const categoryColors: { [key: string]: string } = {
    modeling: 'from-blue-500 to-cyan-500',
    rendering: 'from-purple-500 to-pink-500',
    texturing: 'from-orange-500 to-red-500',
    post: 'from-green-500 to-emerald-500'
  }

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
            {t('tools.title')}
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            {t('tools.subtitle')}
          </p>
        </motion.div>

        {/* Tools Grid by Category */}
        <div className="space-y-12">
          {Object.entries(toolsByCategory).map(([category, categoryTools], categoryIndex) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: categoryIndex * 0.1 }}
            >
              {/* Category Header */}
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">
                  {t(`tools.categories.${category}`)}
                </h3>
                <div className={`h-1 w-20 bg-gradient-to-r ${categoryColors[category]} rounded-full`}></div>
              </div>

              {/* Tools Grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {(categoryTools as Tool[]).map((tool: Tool, toolIndex: number) => (
                  <motion.div
                    key={tool.name}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: (categoryIndex * 0.1) + (toolIndex * 0.05) }}
                    className="group relative"
                  >
                    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700/50 hover:border-purple-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10 cursor-pointer">
                      {/* Tool Icon */}
                      <div className={`w-16 h-16 bg-gradient-to-r ${categoryColors[category]} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                        <span className="text-white font-bold text-lg">
                          {tool.icon}
                        </span>
                      </div>

                      {/* Tool Name */}
                      <h4 className="text-lg font-semibold text-white mb-2">
                        {tool.name}
                      </h4>

                      {/* Tool Description */}
                      {tool.description && (
                        <p className="text-sm text-gray-400 leading-relaxed">
                          {tool.description}
                        </p>
                      )}

                      {/* Hover Effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Expertise Highlight */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-2xl p-8 border border-purple-500/30">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  Technical Excellence Meets Artistic Vision
                </h3>
                <p className="text-gray-300 mb-6">
                  I combine deep knowledge of industry-standard tools with artistic expertise to deliver exceptional results. Each tool is mastered to its fullest potential, ensuring your projects receive the highest quality treatment.
                </p>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    <span className="text-sm text-gray-300">10+ Years Experience</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                    <span className="text-sm text-gray-300">Industry Certified</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                    <span className="text-sm text-gray-300">Cutting-Edge Workflow</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-800/50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-purple-400 mb-1">11+</div>
                  <div className="text-sm text-gray-400">Mastered Tools</div>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-pink-400 mb-1">24/7</div>
                  <div className="text-sm text-gray-400">Learning & Updates</div>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-blue-400 mb-1">100%</div>
                  <div className="text-sm text-gray-400">Professional Workflow</div>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-400 mb-1">5+</div>
                  <div className="text-sm text-gray-400">Years Commercial</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
