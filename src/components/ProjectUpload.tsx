'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Upload, X, FileImage, Box, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { storageService } from '@/lib/storage'
import { supabase } from '@/lib/supabase'
import type { Database } from '@/lib/supabase'
import MediaUpload from '@/components/MediaUpload'

type Project = Database['public']['Tables']['projects']['Insert']

interface ProjectUploadProps {
  onProjectUploaded?: () => void
}

export default function ProjectUpload({ onProjectUploaded }: ProjectUploadProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [errors, setErrors] = useState<string[]>([])

  const [formData, setFormData] = useState<Project>({
    title: '',
    description: '',
    category: 'character-design',
    featured: false,
    thumbnail_url: '',
    model_url: '',
    images: [],
    videos: [],
    tags: []
  })

  const [files, setFiles] = useState<{
    model?: File
    thumbnail?: File
    mediaFiles: File[]
  }>({
    mediaFiles: []
  })

  const [tagInput, setTagInput] = useState('')

  const categories = [
    'character-design',
    'environment-art',
    'props-objects',
    'animations',
    'concept-art'
  ]

  // Add edit mode detection
  const isEditMode = !!formData.id

  const handleSubmit = async (e: React.FormEvent) => {
    console.log('=== FORM SUBMIT TRIGGERED ===')
    console.log('Event type:', e.type)
    console.log('Current formData:', formData)
    console.log('Current files:', files)
    console.log('=============================')
    
    e.preventDefault()
    setIsUploading(true)
    setErrors([])
    setUploadProgress(0)

    try {
      console.log('Starting validation...')
      
      // Validate required fields
      if (!formData.title || !formData.description) {
        console.log('Validation failed: missing title or description')
        setErrors(['Title and description are required'])
        setIsUploading(false)
        return
      }
      
      console.log('Validation passed!')

      let project: any

      if (isEditMode) {
        // Update existing project
        const { data: updatedProject, error: updateError } = await supabase
          .from('projects')
          .update(formData)
          .eq('id', formData.id)
          .select()
          .single()

        if (updateError) throw updateError
        project = updatedProject
      } else {
        // Create new project
        const { data: newProject, error: projectError } = await supabase
          .from('projects')
          .insert([formData])
          .select()
          .single()

        if (projectError) throw projectError
        project = newProject
      }

      // Upload files
      setUploadProgress(25)
      
      // DEBUG: Log files state
      console.log('=== PROJECT UPLOAD DEBUG ===')
      console.log('Project ID:', project.id)
      console.log('files.model:', files.model)
      console.log('files.thumbnail:', files.thumbnail)
      console.log('files.mediaFiles:', files.mediaFiles)
      console.log('files.mediaFiles.length:', files.mediaFiles.length)
      if (files.mediaFiles.length > 0) {
        files.mediaFiles.forEach((file, index) => {
          console.log(`mediaFile ${index}:`, file.name, file.type, file.size)
        })
      }
      console.log('==========================')
      
      const {
        modelUrl,
        thumbnailUrl,
        imageUrls,
        videoUrls,
        errors: uploadErrors
      } = await storageService.uploadProjectFiles(
        project.id,
        files.model,
        files.thumbnail,
        files.mediaFiles.length > 0 ? files.mediaFiles : undefined
      )

      // DEBUG: Log upload results
      console.log('=== UPLOAD RESULTS DEBUG ===')
      console.log('uploadErrors:', uploadErrors)
      console.log('modelUrl:', modelUrl)
      console.log('thumbnailUrl:', thumbnailUrl)
      console.log('imageUrls:', imageUrls)
      console.log('videoUrls:', videoUrls)
      console.log('============================')

      if (uploadErrors.length > 0) {
        setErrors(uploadErrors)
      }

      setUploadProgress(75)

      // Update project with file URLs
      const updateData: Partial<Project> = {
        thumbnail_url: thumbnailUrl || formData.thumbnail_url,
        model_url: modelUrl,
        images: imageUrls,
        videos: videoUrls
      }

      const { error: updateError } = await supabase
        .from('projects')
        .update(updateData)
        .eq('id', project.id)

      if (updateError) throw updateError

      setUploadProgress(100)
      onProjectUploaded?.()
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        category: 'character-design',
        featured: false,
        thumbnail_url: '',
        model_url: '',
        images: [],
        videos: [],
        tags: []
      })
      setFiles({ mediaFiles: [] })
      setIsOpen(false)

    } catch (error) {
      console.error('Error uploading project:', error)
      setErrors([`Failed to upload project: ${error instanceof Error ? error.message : 'Unknown error'}`])
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  const handleFileChange = (type: 'model' | 'thumbnail', file: File | FileList | null) => {
    if (type === 'model' && file instanceof File) {
      setFiles(prev => ({ ...prev, model: file }))
    } else if (type === 'thumbnail' && file instanceof File) {
      setFiles(prev => ({ ...prev, thumbnail: file }))
    }
  }

  const handleMediaFilesChange = (mediaFiles: File[]) => {
    console.log('=== MEDIA FILES CHANGED ===')
    console.log('New mediaFiles:', mediaFiles)
    console.log('Length:', mediaFiles.length)
    if (mediaFiles.length > 0) {
      mediaFiles.forEach((file, index) => {
        console.log(`File ${index}:`, file.name, file.type, file.size)
      })
    }
    console.log('==========================')
    setFiles(prev => ({ ...prev, mediaFiles }))
  }

  const addTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()]
      }))
      setTagInput('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || []
    }))
  }

  if (!isOpen) {
    return (
      <div className="flex justify-center py-8">
        <Button
          onClick={() => setIsOpen(true)}
          className="bg-purple-600 hover:bg-purple-700"
          size="lg"
        >
          <Upload className="h-5 w-5 mr-2" />
          Upload New Project
        </Button>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
    >
      <div className="bg-slate-900 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Upload New Project</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {errors.length > 0 && (
            <div className="mb-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
              {errors.map((error, index) => (
                <p key={index} className="text-red-300 text-sm">{error}</p>
              ))}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-800 border border-purple-400/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-800 border border-purple-400/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>
                      {cat.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 bg-slate-800 border border-purple-400/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none"
                required
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Tags
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  placeholder="Add tags..."
                  className="flex-1 px-3 py-2 bg-slate-800 border border-purple-400/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
                <Button type="button" onClick={addTag} variant="outline">
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags?.map(tag => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-purple-600/30 text-purple-300 text-sm rounded-full flex items-center gap-1"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="text-purple-400 hover:text-purple-200"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* File Uploads */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Thumbnail Image *
                </label>
                <div className="border-2 border-dashed border-purple-400/30 rounded-lg p-4 text-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange('thumbnail', e.target.files?.[0] || null)}
                    className="hidden"
                    id="thumbnail-upload"
                  />
                  <label
                    htmlFor="thumbnail-upload"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <FileImage className="h-8 w-8 text-purple-400 mb-2" />
                    <span className="text-gray-300">
                      {files.thumbnail?.name || 'Click to upload thumbnail'}
                    </span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  3D Model (GLB/GLTF/Blend/FBX/OBJ supported)
                </label>
                <div className="border-2 border-dashed border-purple-400/30 rounded-lg p-4 text-center">
                  <input
                    type="file"
                    accept=".glb,.gltf,.fbx,.obj,.blend,.dae,.3ds"
                    onChange={(e) => handleFileChange('model', e.target.files?.[0] || null)}
                    className="hidden"
                    id="model-upload"
                  />
                  <label
                    htmlFor="model-upload"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <Box className="h-8 w-8 text-purple-400 mb-2" />
                    <span className="text-gray-300">
                      {files.model?.name || 'Click to upload 3D model'}
                    </span>
                  </label>
                </div>
              </div>

              <MediaUpload
                mediaFiles={files.mediaFiles}
                onMediaFilesChange={handleMediaFilesChange}
                maxFiles={10}
                title="Media Files (Images & Videos)"
                description="Upload additional images, videos, and other media files. Videos will be displayed in a separate gallery section."
              />
            </div>

            {/* Featured checkbox */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="featured"
                checked={formData.featured}
                onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                className="mr-2"
              />
              <label htmlFor="featured" className="text-gray-300">
                Featured project
              </label>
            </div>

            {/* Progress */}
            {isUploading && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-purple-400" />
                  <span className="text-purple-300">Uploading... {uploadProgress}%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div
                    className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={isUploading}
                className="flex-1 bg-purple-600 hover:bg-purple-700"
              >
                {isUploading ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Uploading...
                  </div>
                ) : (
                  'Upload Project'
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                disabled={isUploading}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  )
}
