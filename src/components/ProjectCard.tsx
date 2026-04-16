'use client'

import { motion } from 'framer-motion'
import { Eye, ExternalLink, Calendar, Tag, Play, FileVideo } from 'lucide-react'
import { Button } from '@/components/ui/button'
import VideoPlayer from '@/components/VideoPlayer'
import type { Database } from '@/lib/supabase'

type Project = Database['public']['Tables']['projects']['Row']

interface ProjectCardProps {
  project: Project
  onView3D: (project: Project) => void
  onProjectDetails?: (project: Project) => void
}

export default function ProjectCard({ project, onView3D, onProjectDetails }: ProjectCardProps) {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    // Fallback to placeholder if image fails to load
    e.currentTarget.src = `https://picsum.photos/400/300?random=${project.id}`
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative bg-slate-800 rounded-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105"
    >
      <div className="aspect-video relative overflow-hidden">
        <img
          src={project.thumbnail_url || `https://picsum.photos/400/300?random=${project.id}`}
          alt={project.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          onError={handleImageError}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
          <p className="text-gray-300 text-sm mb-4 line-clamp-2">{project.description}</p>
          
          <div className="flex gap-2 mb-4">
            {project.tags?.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-purple-600/30 text-purple-300 text-xs rounded-full"
              >
                {tag}
              </span>
            ))}
            
            {(project.videos?.length || 0) > 0 && (
              <span className="px-2 py-1 bg-red-600/30 text-red-300 text-xs rounded-full flex items-center gap-1">
                <FileVideo className="h-3 w-3" />
                {project.videos?.length} video{(project.videos?.length || 0) > 1 ? 's' : ''}
              </span>
            )}
          </div>
          
          <div className="flex gap-2">
            <Button 
              size="sm" 
              className="bg-purple-600 hover:bg-purple-700"
              onClick={() => onView3D(project)}
            >
              <Eye className="h-4 w-4 mr-2" />
              View 3D
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white"
              onClick={() => onProjectDetails?.(project)}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Details
            </Button>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex items-center justify-between text-sm text-gray-400">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {new Date(project.created_at).toLocaleDateString()}
          </div>
          <div className="flex items-center gap-1">
            <Tag className="h-4 w-4" />
            {project.category}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
