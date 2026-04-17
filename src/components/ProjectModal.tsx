'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, Play, Edit, Trash2, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import VideoPlayer from '@/components/VideoPlayer'
import ModelModal from '@/components/ModelModal'
import type { Database } from '@/lib/supabase'
import { supabase } from '@/lib/supabase'
import { storageService } from '@/lib/storage'
import { useAuth } from '@/components/AuthProvider'
import MediaEditorFixed from '@/components/MediaEditorFixed'

type Project = Database['public']['Tables']['projects']['Row']

interface ProjectModalProps {
  project: Project | null
  isOpen: boolean
  onClose: () => void
}

export default function ProjectModal({ project, isOpen, onClose }: ProjectModalProps) {
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0)
  const [showModelViewer, setShowModelViewer] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    category: '',
    featured: false,
    tags: [] as string[]
  })
  const [isSaving, setIsSaving] = useState(false)
  const [newMediaFiles, setNewMediaFiles] = useState<File[]>([])
  const [editedImages, setEditedImages] = useState<string[]>([])
  const [editedVideos, setEditedVideos] = useState<string[]>([])
  const { isAdmin } = useAuth()

  // Populate edit form when project changes
  useEffect(() => {
    if (project) {
      setEditForm({
        title: project.title,
        description: project.description,
        category: project.category,
        featured: project.featured,
        tags: project.tags || []
      })
      setEditedImages(project.images || [])
      setEditedVideos(project.videos || [])
      setNewMediaFiles([])
      setIsEditing(false)
    }
  }, [project])

  if (!isOpen || !project) return null

  // Combine images and videos for gallery
  const allMedia = [
    ...(project.images || []).map((url, index) => ({ 
      url, 
      type: 'image' as const, 
      index 
    })),
    ...(project.videos || []).map((url, index) => ({ 
      url, 
      type: 'video' as const, 
      index 
    }))
  ]

  const currentMedia = allMedia[currentMediaIndex] || null

  const goToPrevious = () => {
    if (allMedia.length === 0) return
    setCurrentMediaIndex((prev) => prev === 0 ? allMedia.length - 1 : prev - 1)
  }

  const goToNext = () => {
    if (allMedia.length === 0) return
    setCurrentMediaIndex((prev) => prev === allMedia.length - 1 ? 0 : prev + 1)
  }

  const openModelViewer = () => {
    setShowModelViewer(true)
  }

  const handleSave = async () => {
    console.log('=== PROJECT MODAL SAVE TRIGGERED ===')
    console.log('Project:', project)
    console.log('isEditing:', isEditing)
    console.log('editForm:', editForm)
    console.log('editedImages:', editedImages)
    console.log('editedVideos:', editedVideos)
    console.log('newMediaFiles:', newMediaFiles)
    console.log('===================================')
    
    if (!project) return
    
    setIsSaving(true)
    try {
      // Upload new media files
      let newImageUrls: string[] = []
      let newVideoUrls: string[] = []
      
      if (newMediaFiles.length > 0) {
        const result = await storageService.uploadProjectFiles(
          project.id,
          undefined,
          undefined,
          newMediaFiles
        )
        
        if (result.errors.length > 0) {
          console.error('Upload errors:', result.errors)
          alert('Some files failed to upload: ' + result.errors.join(', '))
        }
        
        newImageUrls = result.imageUrls
        newVideoUrls = result.videoUrls
      }

      // Combine edited files with new ones
      const updatedImages = [...editedImages, ...newImageUrls]
      const updatedVideos = [...editedVideos, ...newVideoUrls]

      // Update project in database
      const { error } = await supabase
        .from('projects')
        .update({
          ...editForm,
          images: updatedImages,
          videos: updatedVideos,
          updated_at: new Date().toISOString()
        })
        .eq('id', project.id)

      if (error) {
        console.error('Error updating project:', error)
        alert('Error updating project')
        return
      }

      setIsEditing(false)
      setNewMediaFiles([])
      window.location.reload()
    } catch (error) {
      console.error('Error saving project:', error)
      alert('Error saving project')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!project) return
    
    if (!confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      return
    }

    try {
      // Delete from database
      const { error: dbError } = await supabase
        .from('projects')
        .delete()
        .eq('id', project.id)

      if (dbError) {
        console.error('Error deleting project:', dbError)
        alert('Error deleting project')
        return
      }

      // Delete files from storage
      const filesToDelete = []
      
      if (project.thumbnail_url) {
        const thumbnailPath = project.thumbnail_url.split('/').pop()?.split('?')[0]
        if (thumbnailPath) {
          filesToDelete.push(`images/thumbnails/${thumbnailPath}`)
        }
      }

      if (project.model_url) {
        const modelPath = project.model_url.split('/').pop()?.split('?')[0]
        if (modelPath) {
          filesToDelete.push(`models/${project.id}/${modelPath}`)
        }
      }

      project.images?.forEach(imageUrl => {
        const imagePath = imageUrl.split('/').pop()?.split('?')[0]
        if (imagePath) {
          filesToDelete.push(`images/renders/${imagePath}`)
        }
      })

      project.videos?.forEach(videoUrl => {
        const videoPath = videoUrl.split('/').pop()?.split('?')[0]
        if (videoPath) {
          filesToDelete.push(`videos/${videoPath}`)
        }
      })

      if (filesToDelete.length > 0) {
        await supabase.storage
          .from('portfolio-files')
          .remove(filesToDelete)
      }

      onClose()
      window.location.reload()
    } catch (error) {
      console.error('Error deleting project:', error)
      alert('Error deleting project')
    }
  }

  if (showModelViewer) {
    return (
      <ModelModal
        isOpen={showModelViewer}
        onClose={() => setShowModelViewer(false)}
        modelUrl={project.model_url}
        title={project.title}
      />
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-slate-900 rounded-lg w-full max-w-6xl max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={editForm.title}
                    onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                    className="text-2xl font-bold text-white bg-slate-800 border border-purple-400/30 rounded px-3 py-1 w-full"
                  />
                  <textarea
                    value={editForm.description}
                    onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                    className="text-gray-300 bg-slate-800 border border-purple-400/30 rounded px-3 py-2 w-full resize-none"
                    rows={2}
                  />
                  <div className="flex items-center gap-4">
                    <select
                      value={editForm.category}
                      onChange={(e) => setEditForm(prev => ({ ...prev, category: e.target.value }))}
                      className="text-sm bg-slate-800 border border-purple-400/30 rounded px-2 py-1"
                    >
                      <option value="character-design">Character Design</option>
                      <option value="environment-art">Environment Art</option>
                      <option value="props-objects">Props & Objects</option>
                      <option value="animations">Animations</option>
                      <option value="concept-art">Concept Art</option>
                    </select>
                    <label className="flex items-center gap-2 text-sm text-gray-300">
                      <input
                        type="checkbox"
                        checked={editForm.featured}
                        onChange={(e) => setEditForm(prev => ({ ...prev, featured: e.target.checked }))}
                        className="rounded"
                      />
                      Featured
                    </label>
                  </div>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-white mb-2">{project.title}</h2>
                  <p className="text-gray-300">{project.description}</p>
                  <div className="flex items-center gap-4 mt-3">
                    <span className="text-sm text-gray-400">
                      Category: {project.category.replace('-', ' ')}
                    </span>
                    {project.featured && (
                      <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded-full">
                        Featured
                      </span>
                    )}
                  </div>
                </>
              )}
            </div>
            <div className="flex items-center gap-2">
              {isAdmin && (
                <>
                  {isEditing ? (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsEditing(false)}
                        className="text-gray-400 hover:text-white"
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleSave}
                        disabled={isSaving}
                        className="text-green-400 hover:text-green-300"
                      >
                        <Save className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsEditing(true)}
                        className="text-blue-400 hover:text-blue-300"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleDelete}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>

        {/* Media Gallery */}
        <div className={`relative bg-black ${isEditing ? 'flex-shrink-0 max-h-64' : 'flex-1 min-h-[60vh] overflow-y-auto'}`}>
          {allMedia.length > 0 ? (
            <div className={`w-full ${isEditing ? 'max-h-64' : 'min-h-[60vh]'} relative flex items-center justify-center`}>
              {currentMedia?.type === 'image' ? (
                currentMedia?.url && (
                  <img
                    src={currentMedia.url}
                    alt={`${project.title} - Image ${currentMediaIndex + 1}`}
                    className={`max-w-full ${isEditing ? 'max-h-64' : 'max-h-[80vh]'} object-contain`}
                  />
                )
              ) : currentMedia?.type === 'video' ? (
                currentMedia?.url && (
                  <VideoPlayer
                    src={currentMedia.url}
                    title={`${project.title} - Video ${currentMediaIndex + 1}`}
                    className={`w-full ${isEditing ? 'max-h-64' : 'h-full min-h-[60vh]'}`}
                  />
                )
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-400">Media not available</p>
                </div>
              )}

              {/* Navigation */}
              {allMedia.length > 1 && (
                <>
                  <button
                    onClick={goToPrevious}
                    className="fixed left-8 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors z-50"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={goToNext}
                    className="fixed right-8 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors z-50"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}

              {/* Media Type Indicator */}
              <div className="absolute top-4 left-4 z-10">
                <span className="px-3 py-1 bg-black/50 text-white text-sm rounded-full">
                  {currentMedia?.type === 'video' ? (
                    <span className="flex items-center gap-1">
                      <Play className="h-3 w-3" />
                      Video {currentMediaIndex + 1}/{allMedia.length}
                    </span>
                  ) : (
                    `Image ${currentMediaIndex + 1}/${allMedia.length}`
                  )}
                </span>
              </div>
            </div>
          ) : (
            <div className={`w-full ${isEditing ? 'max-h-64' : 'min-h-[60vh]'} flex items-center justify-center`}>
              <p className="text-gray-400">No media available</p>
            </div>
          )}
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto">
          {/* Media Editor */}
          {isEditing && (
            <div className="p-6 border-t border-slate-800">
              <MediaEditorFixed
                images={editedImages}
                videos={editedVideos}
                onMediaChange={(images, videos) => {
                  setEditedImages(images)
                  setEditedVideos(videos)
                }}
                onNewFilesChange={(files) => {
                  setNewMediaFiles(files)
                }}
                isEditing={isEditing}
              />
            </div>
          )}

          {/* Actions */}
          <div className="p-6 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                {project.model_url && (
                  <Button
                    onClick={openModelViewer}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    View 3D Model
                  </Button>
                )}
              </div>
              
              {/* Tags */}
              <div className="flex gap-2">
                {project.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-purple-600/20 text-purple-300 text-sm rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
