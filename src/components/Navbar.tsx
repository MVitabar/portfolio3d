'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Menu, X, Home, FolderOpen, Mail, User, LogOut, Settings, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/components/AuthProvider'
import { useLanguage } from '@/contexts/LanguageContext'
import LoginForm from '@/components/LoginForm'
import LanguageSelector from '@/components/LanguageSelector'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const { user, isAdmin, signOut } = useAuth()
  const { t, language, setLanguage } = useLanguage()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { icon: Home, label: t('nav.home'), href: '#home' },
    { icon: FolderOpen, label: t('nav.portfolio'), href: '#portfolio' },
    { icon: User, label: t('nav.about'), href: '#about' },
    { icon: Mail, label: t('nav.contact'), href: '#contact' }
  ]

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-slate-900/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
        }`}
      >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-shrink-0"
          >
            <h1 className="text-2xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
              3D Artist
            </h1>
          </motion.div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              {navItems.map((item, index) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-gray-300 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 hover:text-white hover:bg-purple-600/20 md:hover:text-white md:hover:bg-purple-600/20"
                >
                  {item.label}
                </motion.a>
              ))}
              {/* Language Selector */}
              <div className="flex items-center gap-2 pl-4 border-l border-gray-600">
                <LanguageSelector />
              </div>
              
              {/* Auth Section */}
              <div className="flex items-center gap-2 pl-4 border-l border-gray-600">
                {user ? (
                  <>
                    <span className="text-gray-300 text-sm">
                      {user.email}
                    </span>
                    {isAdmin && (
                      <Button variant="ghost" size="sm" className="text-purple-400 hover:text-purple-300 md:hover:text-purple-300">
                        <Settings className="h-4 w-4" />
                      </Button>
                    )}
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={signOut}
                      className="text-red-400 hover:text-red-300 md:hover:text-red-300"
                    >
                      <LogOut className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setShowLogin(true)}
                    className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white md:hover:bg-purple-400 md:hover:text-white"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Sign In
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:bg-purple-600/20 md:hover:bg-purple-600/20"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      <motion.div
        className={`md:hidden ${scrolled ? 'bg-slate-900/95 backdrop-blur-md' : 'bg-slate-900'} ${
          isOpen ? '' : 'pointer-events-none'
        }`}
        initial={{ opacity: 0, height: 0 }}
        animate={{ 
          opacity: isOpen ? 1 : 0, 
          height: isOpen ? 'auto' : 0 
        }}
        transition={{ duration: 0.3 }}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-gray-300 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 hover:text-white hover:bg-purple-600/20 md:hover:text-white md:hover:bg-purple-600/20"
              onClick={() => setIsOpen(false)}
            >
              <div className="flex items-center gap-2">
                <item.icon className="h-5 w-5" />
                {item.label}
              </div>
            </a>
          ))}
          
          {/* Mobile Language Selector */}
          <div className="border-t border-gray-700 pt-2 mt-2">
            <div className="px-3 py-2">
              <div className="flex items-center gap-2 text-gray-300 text-sm mb-2">
                <Globe className="h-4 w-4" />
                Language
              </div>
              <div className="space-y-1">
                {[
                  { code: 'en' as const, name: 'English', flag: 'EN' },
                  { code: 'es' as const, name: 'Español', flag: 'ES' },
                  { code: 'pt' as const, name: 'Português', flag: 'PT' }
                ].map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => { setLanguage(lang.code); setIsOpen(false); }}
                    className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors duration-200 ${
                      language === lang.code 
                        ? 'bg-purple-600/20 text-purple-300' 
                        : 'text-gray-300 hover:bg-slate-700/50 hover:text-white'
                    }`}
                  >
                    <span className="text-sm font-bold">{lang.flag}</span>
                    <span className="text-sm">{lang.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Mobile Auth Section */}
          <div className="border-t border-gray-700 pt-2 mt-2">
            {user ? (
              <>
                <div className="px-3 py-2 text-gray-300 text-sm">
                  {user.email}
                </div>
                {isAdmin && (
                  <button className="text-purple-400 block px-3 py-2 text-sm hover:text-purple-300 md:hover:text-purple-300">
                    <Settings className="h-4 w-4 inline mr-2" />
                    Admin Settings
                  </button>
                )}
                <button 
                  onClick={() => { signOut(); setIsOpen(false); }}
                  className="text-red-400 block px-3 py-2 text-sm hover:text-red-300 md:hover:text-red-300"
                >
                  <LogOut className="h-4 w-4 inline mr-2" />
                  Sign Out
                </button>
              </>
            ) : (
              <button 
                onClick={() => { setShowLogin(true); setIsOpen(false); }}
                className="text-purple-400 block px-3 py-2 text-sm hover:text-purple-300 md:hover:text-purple-300"
              >
                <User className="h-4 w-4 inline mr-2" />
                Sign In
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </motion.nav>

      {/* Login Modal */}
      {showLogin && (
        <LoginForm onClose={() => setShowLogin(false)} />
      )}
    </>
  )
}
