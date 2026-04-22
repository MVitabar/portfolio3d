'use client'

import { motion } from 'framer-motion'
import { Eye, ExternalLink, Calendar, Tag, Play, FileVideo } from 'lucide-react'
import { Button } from '@/components/ui/button'
import VideoPlayer from '@/components/VideoPlayer'
import type { Project } from '@/lib/supabase'
import { useLanguage } from '@/contexts/LanguageContext'

interface ProjectCardProps {
  project: Project
  onView3D: (project: Project) => void
  onProjectDetails?: (project: Project) => void
}

export default function ProjectCard({ project, onView3D, onProjectDetails }: ProjectCardProps) {
  try {
    console.log('=== ProjectCard RENDER ===', project.id, project.title)
    const { t } = useLanguage()
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    // Fallback to consistent placeholder if image fails to load
    const fallbackImages = [
      '/Gemini_Generated_Image_swz4wiswz4wiswz4.png',
      '/Gemini_Generated_Image_ilhjusilhjusilhj.png'
    ]
    const projectId = parseInt(project.id) || 0
    const fallbackUrl = fallbackImages[projectId % fallbackImages.length]
    
    // Only update if different to prevent infinite loops
    if (e.currentTarget.src !== fallbackUrl) {
      e.currentTarget.src = fallbackUrl
    }
  }

  const handleThumbnailError = (e: React.SyntheticEvent<HTMLImageElement>, index: number) => {
    // Fallback for thumbnail images - use consistent fallback
    const fallbackImages = [
      '/Gemini_Generated_Image_swz4wiswz4wiswz4.png',
      '/Gemini_Generated_Image_ilhjusilhjusilhj.png'
    ]
    const projectId = parseInt(project.id) || 0
    const fallbackUrl = fallbackImages[(projectId + index) % fallbackImages.length]
    
    // Only update if different to prevent infinite loops
    if (e.currentTarget.src !== fallbackUrl) {
      e.currentTarget.src = fallbackUrl
    }
  }

  // Validate if image URL is valid
  const isValidImageUrl = (url: string | undefined | null) => {
    if (!url || url.trim() === '' || url === 'undefined') return false
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  // Get safe thumbnail URL
  const getSafeThumbnailUrl = () => {
    // Debug logging
    if (!project.thumbnail_url || project.thumbnail_url === 'undefined') {
      console.warn(`Project ${project.id} has invalid thumbnail_url:`, project.thumbnail_url)
    }
    
    // Check if thumbnail_url exists and is valid
    if (project.thumbnail_url && isValidImageUrl(project.thumbnail_url)) {
      return project.thumbnail_url
    }
    // Use consistent fallback images based on project ID
    const fallbackImages = [
      '/Gemini_Generated_Image_swz4wiswz4wiswz4.png',
      '/Gemini_Generated_Image_ilhjusilhjusilhj.png'
    ]
    // Ensure project.id is a valid number for modulo operation
    const projectId = parseInt(project.id) || 0
    const fallbackUrl = fallbackImages[projectId % fallbackImages.length]
    console.log(`Using fallback for project ${project.id}:`, fallbackUrl)
    return fallbackUrl
  }

  // Get safe images array
  const getSafeImages = () => {
    console.log(`=== Project ${project.id} Image Debug ===`)
    console.log('Project thumbnail_url:', project.thumbnail_url)
    console.log('Project images array:', project.images)
    
    if (!project.images || !Array.isArray(project.images)) {
      console.log('No valid images array')
      return []
    }
    
    // Images to exclude (all local site images)
    const excludePatterns = [
      '/Gemini_Generated_Image_swz4wiswz4wiswz4.png',
      '/Gemini_Generated_Image_ilhjusilhjusilhj.png',
      '/file.svg',
      '/globe.svg',
      '/grid.svg',
      '/next.svg',
      '/vercel.svg',
      '/window.svg',
      // Exclude any image that starts with / (local path)
      /^\/[^\/]/  // This regex will match any local path starting with /
    ]
    
    const filteredImages = project.images.filter(img => {
      console.log(`Checking image: ${img}`)
      
      if (!isValidImageUrl(img)) {
        console.log(`  -> Invalid URL: ${img}`)
        return false
      }
      
      // Exclude any local site images (starting with /)
      if (img.startsWith('/')) {
        console.log(`  -> Excluded (local site image): ${img}`)
        return false
      }
      
      // Only include actual image files (jpg, png, gif, webp, svg)
      const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg']
      const isImageFile = imageExtensions.some(ext => 
        img.toLowerCase().endsWith(ext)
      )
      
      if (!isImageFile) {
        console.log(`  -> Excluded (not an image file): ${img}`)
        return false
      }
      
      // Exclude fallback images specifically
      const isExcluded = excludePatterns.some(exclude => {
        if (typeof exclude === 'string') {
          return img.includes(exclude)
        }
        return exclude.test(img)
      })
      if (isExcluded) {
        console.log(`  -> Excluded (pattern match): ${img}`)
        return false
      }
      
      console.log(`  -> Valid: ${img}`)
      return true
    })
    
    console.log(`Final filtered images for project ${project.id}:`, filteredImages)
    console.log(`=== End Debug ===`)
    return filteredImages
  }

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't trigger if clicking on buttons
    if ((e.target as HTMLElement).closest('button')) {
      return
    }
    onProjectDetails?.(project)
  }

  // Check if project has 3D models
  const has3DModel = () => {
    // Check main model_url
    if (project.model_url) {
      return true
    }
    
    // Check for 3D models in images array
    if (project.images && project.images.length > 0) {
      const modelExtensions = ['.fbx', '.glb', '.gltf', '.obj', '.blend']
      return project.images.some(img => 
        modelExtensions.some(ext => img.toLowerCase().includes(ext))
      )
    }
    
    return false
  }

  const safeImages = getSafeImages()
  const hasMultipleImages = safeImages.length >= 1
  
  console.log(`Project ${project.id}: images=${project.images?.length}, safe=${safeImages.length}, multiple=${hasMultipleImages}`)
  
  // Debug the layout decision
  console.log(`Project ${project.id} layout decision:`)
  console.log(`  Original images count: ${project.images?.length || 0}`)
  console.log(`  Safe images count: ${safeImages.length}`)
  console.log(`  Has multiple images: ${hasMultipleImages}`)
  console.log(`  Layout: ${hasMultipleImages ? 'Grid (2:1)' : 'Full width'}`)
  console.log(`  Safe images list:`, safeImages)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] cursor-pointer border border-slate-700/50"
      onClick={handleCardClick}
    >
      {/* Main Content */}
      <div className={`${!hasMultipleImages ? '' : 'grid grid-cols-1 lg:grid-cols-3 gap-0 rounded-lg'}`}>
        {/* Main Image Section - Full width when single image, 2 columns when multiple */}
        <div className={`${!hasMultipleImages ? '' : 'lg:col-span-2'} relative`}>
          <div className="aspect-[16/9] overflow-hidden w-full h-full rounded-lg">
            <img
              src={getSafeThumbnailUrl()}
              alt={project.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              onError={handleImageError}
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-60" />
            
            {/* Floating Badges */}
            <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-none">
              {project.featured && (
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                  <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                  Featured
                </div>
              )}
              
              <div className="flex gap-2">
                {has3DModel() && (
                  <div className="bg-purple-600/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    3D Available
                  </div>
                )}
                
                {(project.videos?.length || 0) > 0 && (
                  <div className="bg-red-600/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    <FileVideo className="h-3 w-3" />
                    {project.videos?.length} Video{(project.videos?.length || 0) > 1 ? 's' : ''}
                  </div>
                )}
              </div>
            </div>
            
            {/* Content Overlay for Single Image */}
            {!hasMultipleImages && (
              <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/95 via-black/50 to-transparent">
                <div className="max-w-3xl">
                  <h3 className="text-2xl font-bold text-white mb-3">{project.title}</h3>
                  <p className="text-gray-300 text-lg mb-6 line-clamp-3 leading-relaxed">{project.description}</p>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.tags?.slice(0, 4).map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-gradient-to-r from-purple-600/30 to-pink-600/30 text-purple-300 text-sm rounded-full border border-purple-500/30"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    {has3DModel() && (
                      <Button 
                        size="lg" 
                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
                        onClick={(e) => { e.stopPropagation(); onView3D(project); }}
                      >
                        <Eye className="h-5 w-5 mr-2" />
                        {t('portfolio.view3d')}
                      </Button>
                    )}
                    <Button 
                      size="lg" 
                      variant="outline" 
                      className="border-purple-400/50 text-purple-400 hover:bg-purple-400/20 hover:text-white hover:border-purple-400 transition-all duration-300"
                      onClick={(e) => { e.stopPropagation(); onProjectDetails?.(project); }}
                    >
                      <ExternalLink className="h-5 w-5 mr-2" />
                      {t('portfolio.details')}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Side Content Section - Only when multiple images */}
        {hasMultipleImages && (
          <div className="p-4 flex flex-col justify-between h-full">
            {/* Title and Description */}
            <div className="space-y-2">
              <div>
                <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">{project.title}</h3>
                <p className="text-gray-400 text-xs line-clamp-3 leading-relaxed">{project.description}</p>
              </div>
              
              {/* Tags */}
              <div className="flex flex-wrap gap-1">
                {project.tags?.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-gradient-to-r from-purple-600/30 to-pink-600/30 text-purple-300 text-xs rounded-full border border-purple-500/30"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="space-y-2 mt-4">
              {has3DModel() && (
                <Button 
                  size="sm" 
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
                  onClick={(e) => { e.stopPropagation(); onView3D(project); }}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  {t('portfolio.view3d')}
                </Button>
              )}
              <Button 
                size="sm" 
                variant="outline" 
                className="w-full border-purple-400/50 text-purple-400 hover:bg-purple-400/20 hover:text-white hover:border-purple-400 transition-all duration-300"
                onClick={(e) => { e.stopPropagation(); onProjectDetails?.(project); }}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                {t('portfolio.details')}
              </Button>
            </div>
          </div>
        )}
      </div>
      
      {/* Thumbnail Gallery - Additional Images */}
      {hasMultipleImages && (
        <div className="px-6 pb-6">
          <div className="flex gap-2 overflow-x-auto">
            {safeImages.slice(0, 4).map((image, index) => (
              <div key={index} className="flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border-2 border-slate-700/50 hover:border-purple-500/50 transition-colors duration-300">
                <img
                  src={image}
                  alt={`${project.title} - Image ${index + 1}`}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                  onError={(e) => handleThumbnailError(e, index)}
                />
              </div>
            ))}
            {safeImages.length > 4 && (
              <div className="flex-shrink-0 w-24 h-24 rounded-lg bg-slate-800/50 border-2 border-slate-700/50 flex items-center justify-center">
                <span className="text-gray-400 text-xs font-bold">+{safeImages.length - 4}</span>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Footer */}
      <div className="px-6 pb-6 pt-4 border-t border-slate-700/50">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-gray-400">
            <Calendar className="h-4 w-4" />
            <span>{new Date(project.created_at).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <Tag className="h-4 w-4" />
            <span className="text-purple-400 font-medium">{project.category}</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
  } catch (error) {
    console.error('ProjectCard ERROR:', error)
    console.error('Project data:', project)
    return (
      <div className="bg-red-900 border border-red-500 rounded-lg p-4 text-white">
        <h3 className="text-lg font-bold mb-2">Error loading project</h3>
        <p className="text-sm">Project ID: {project.id}</p>
        <p className="text-xs text-red-300 mt-2">{(error as Error).message}</p>
      </div>
    )
  }
}
