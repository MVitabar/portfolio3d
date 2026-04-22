'use client'

import { motion } from 'framer-motion'
import { Globe } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { Language } from '@/lib/i18n'

const languages = [
  { code: 'en' as Language, name: 'English', flag: 'EN' },
  { code: 'es' as Language, name: 'Español', flag: 'ES' },
  { code: 'pt' as Language, name: 'Português', flag: 'PT' }
]

export default function LanguageSelector() {
  const { language, setLanguage } = useLanguage()

  return (
    <div className="relative group">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center gap-2 px-3 py-2 bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-lg text-white hover:bg-slate-700/80 transition-colors duration-200"
      >
        <Globe className="h-4 w-4" />
        <span className="text-sm font-medium">
          {languages.find(lang => lang.code === language)?.flag}
        </span>
      </motion.button>

      <div className="absolute top-full right-0 mt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        <div className="bg-slate-800/95 backdrop-blur-sm border border-slate-700/50 rounded-lg shadow-xl overflow-hidden">
          {languages.map((lang) => (
            <motion.button
              key={lang.code}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setLanguage(lang.code)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors duration-200 ${
                language === lang.code 
                  ? 'bg-purple-600/20 text-purple-300 border-l-2 border-purple-400' 
                  : 'text-gray-300 hover:bg-slate-700/50 hover:text-white'
              }`}
            >
              <span className="text-sm font-bold">{lang.flag}</span>
              <span className="text-sm">{lang.name}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  )
}
