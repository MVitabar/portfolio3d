'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Eye, ExternalLink, Calendar, Tag, Trash2, Edit, FileVideo } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Database } from '@/lib/supabase'
import { supabase } from '@/lib/supabase'

type Project = Database['public']['Tables']['projects']['Row']

interface AdminProjectCardProps {
  project: Project
  onView3D: (project: Project) => void
  onProjectDetails: (project: Project) => void
  onProjectEdit: (project: Project) => void
  onProjectDelete: (projectId: string) => void
}

export default function AdminProjectCard({ 
  project, 
  onView3D, 
  onProjectDetails, 
  onProjectEdit,
  onProjectDelete 
}: AdminProjectCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      return
    }

    setIsDeleting(true)
    try {
      // Delete from database
      const { error: dbError } = await supabase
        .from('projects')
        .delete()
        .eq('id', project.id)

      if (dbError) {
        console.error('Error deleting project from database:', dbError)
        alert('Error deleting project from database')
        return
      }

      // Delete associated files from storage
      const filesToDelete = []
      
      // Add thumbnail
      if (project.thumbnail_url) {
        const thumbnailPath = project.thumbnail_url.split('/').pop()?.split('?')[0]
        if (thumbnailPath) {
          filesToDelete.push(`images/thumbnails/${thumbnailPath}`)
        }
      }

      // Add model file
      if (project.model_url) {
        const modelPath = project.model_url.split('/').pop()?.split('?')[0]
        if (modelPath) {
          filesToDelete.push(`models/${project.id}/${modelPath}`)
        }
      }

      // Add images
      project.images?.forEach(imageUrl => {
        const imagePath = imageUrl.split('/').pop()?.split('?')[0]
        if (imagePath) {
          filesToDelete.push(`images/renders/${imagePath}`)
        }
      })

      // Add videos
      project.videos?.forEach(videoUrl => {
        const videoPath = videoUrl.split('/').pop()?.split('?')[0]
        if (videoPath) {
          filesToDelete.push(`videos/${videoPath}`)
        }
      })

      // Delete files from storage (only if there are files to delete)
      if (filesToDelete.length > 0) {
        const { error: storageError } = await supabase.storage
          .from('portfolio-files')
          .remove(filesToDelete)

        if (storageError) {
          console.error('Error deleting files from storage:', storageError)
          // Don't show error to user as project is already deleted from DB
        }
      }

      onProjectDelete(project.id)
    } catch (error) {
      console.error('Error deleting project:', error)
      alert('Error deleting project')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
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
      
        
        {/* Admin Controls Overlay */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex gap-1">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onProjectEdit(project)}
              className="bg-blue-600/80 border-blue-500 text-white hover:bg-blue-600"
            >
              <Edit className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600/80 border-red-500 text-white hover:bg-red-600"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
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
          </div>
          {(project.videos?.length || 0) > 0 && (
            <span className="px-2 py-1 bg-red-600/30 text-red-300 text-xs rounded-full flex items-center gap-1">
              <FileVideo className="h-3 w-3" />
              {project.videos?.length} video{(project.videos?.length || 0) > 1 ? 's' : ''}
            </span>
          )}
          
          <div className="flex gap-2">
            {(project.model_url || (project.images?.some(img => 
              ['.fbx', '.glb', '.gltf', '.obj', '.blend'].some(ext => img.toLowerCase().includes(ext))
            )) && (
              <Button 
                size="sm" 
                className="bg-purple-600 hover:bg-purple-700"
                onClick={() => onView3D(project)}
              >
                <Eye className="h-4 w-4 mr-2" />
                View 3D
              </Button>
            ))}
            
          <div>
            <Button 
              size="sm" 
              variant="outline" 
              className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white"
              onClick={() => onProjectDetails(project)}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Details
            </Button>
          </div>
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
