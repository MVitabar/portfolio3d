'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Language, translations } from '@/lib/i18n'

type LanguageContextType = {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en')

  useEffect(() => {
    // Load saved language from localStorage
    const savedLanguage = localStorage.getItem('language') as Language
    if (savedLanguage && ['en', 'es', 'pt'].includes(savedLanguage)) {
      setLanguage(savedLanguage)
    } else {
      // Detect browser language
      const browserLang = navigator.language.split('-')[0]
      if (['en', 'es', 'pt'].includes(browserLang)) {
        setLanguage(browserLang as Language)
      }
    }
  }, [])

  useEffect(() => {
    // Save language to localStorage
    localStorage.setItem('language', language)
  }, [language])

  const t = (key: string): string => {
    const keys = key.split('.')
    let value: any = translations[language]
    
    for (const k of keys) {
      value = value?.[k]
    }
    
    return value || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
