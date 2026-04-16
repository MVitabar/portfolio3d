'use client'

import { useState } from 'react'
import { Upload, X, Plus, Trash2, FileVideo, FileImage } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface MediaEditorProps {
  images: string[]
  videos: string[]
  onMediaChange: (images: string[], videos: string[]) => void
  onNewFilesChange: (files: File[]) => void
  isEditing: boolean
}

export default function MediaEditorFixed({ 
  images, 
  videos, 
  onMediaChange, 
  onNewFilesChange,
  isEditing 
}: MediaEditorProps) {
  const [newFiles, setNewFiles] = useState<File[]>([])
  const [dragActive, setDragActive] = useState(false)

  const handleFileChange = (files: FileList | null) => {
    if (!files || !isEditing) return
    const updatedFiles = [...newFiles, ...Array.from(files)]
    setNewFiles(updatedFiles)
    onNewFilesChange(updatedFiles)
  }

  const removeNewFile = (index: number) => {
    const updatedFiles = newFiles.filter((_, i) => i !== index)
    setNewFiles(updatedFiles)
    onNewFilesChange(updatedFiles)
  }

  const removeExistingImage = (imageUrl: string) => {
    if (!isEditing) return
    const newImages = images.filter(img => img !== imageUrl)
    onMediaChange(newImages, videos)
  }

  const removeExistingVideo = (videoUrl: string) => {
    if (!isEditing) return
    const newVideos = videos.filter(vid => vid !== videoUrl)
    onMediaChange(images, newVideos)
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (isEditing) {
      handleFileChange(e.dataTransfer.files)
    }
  }

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <FileImage className="h-4 w-4" />
    if (file.type.startsWith('video/')) return <FileVideo className="h-4 w-4" />
    return <FileVideo className="h-4 w-4" />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="space-y-4">
      {/* Existing Media */}
      {(images.length > 0 || videos.length > 0) && (
        <div>
          <h4 className="text-white font-medium mb-3">Current Media</h4>
          
          {/* Images */}
          {images.length > 0 && (
            <div className="mb-4">
              <h5 className="text-gray-300 text-sm mb-2">Images ({images.length})</h5>
              <div className="grid grid-cols-3 gap-2">
                {images.map((imageUrl, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={imageUrl}
                      alt={`Image ${index + 1}`}
                      className="w-full h-24 object-cover rounded border border-purple-400/30"
                    />
                    {isEditing && (
                      <button
                        onClick={() => removeExistingImage(imageUrl)}
                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Videos */}
          {videos.length > 0 && (
            <div>
              <h5 className="text-gray-300 text-sm mb-2">Videos ({videos.length})</h5>
              <div className="space-y-2">
                {videos.map((videoUrl, index) => (
                  <div key={index} className="flex items-center justify-between bg-slate-800 p-2 rounded border border-purple-400/30">
                    <div className="flex items-center gap-2">
                      <FileVideo className="h-4 w-4 text-purple-400" />
                      <span className="text-gray-300 text-sm">Video {index + 1}</span>
                    </div>
                    {isEditing && (
                      <button
                        onClick={() => removeExistingVideo(videoUrl)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Add New Media */}
      {isEditing && (
        <div>
          <h4 className="text-white font-medium mb-3">Add New Media</h4>
          
          <div
            className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
              dragActive 
                ? 'border-purple-400 bg-purple-400/10' 
                : 'border-purple-400/30 hover:border-purple-400/50'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              accept="image/*,video/*,.glb,.gltf,.fbx,.obj,.blend,.dae,.3ds"
              multiple
              onChange={(e) => handleFileChange(e.target.files)}
              className="hidden"
              id="media-editor-upload"
            />
            <label
              htmlFor="media-editor-upload"
              className="cursor-pointer flex flex-col items-center"
            >
              <Upload className="h-8 w-8 text-purple-400 mb-2" />
              <span className="text-gray-300 mb-2">
                {dragActive ? 'Drop files here' : 'Click to upload or drag and drop'}
              </span>
              <span className="text-gray-500 text-sm">
                Images, Videos, 3D Models
              </span>
            </label>
          </div>

          {/* New Files Preview */}
          {newFiles.length > 0 && (
            <div className="mt-4">
              <h5 className="text-gray-300 text-sm mb-2">New Files ({newFiles.length})</h5>
              <div className="space-y-2">
                {newFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-slate-800 p-2 rounded">
                    <div className="flex items-center gap-2">
                      {getFileIcon(file)}
                      <div>
                        <p className="text-gray-300 text-sm truncate max-w-xs">{file.name}</p>
                        <p className="text-gray-500 text-xs">{formatFileSize(file.size)}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeNewFile(index)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
