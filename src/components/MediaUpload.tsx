'use client'

import { useState } from 'react'
import { Upload, X, FileImage, Video, Box, File } from 'lucide-react'

interface MediaUploadProps {
  mediaFiles: File[]
  onMediaFilesChange: (files: File[]) => void
  maxFiles?: number
  accept?: string
  title: string
  description?: string
}

export default function MediaUpload({ 
  mediaFiles, 
  onMediaFilesChange, 
  maxFiles = 10,
  accept = "image/*,video/*,.glb,.gltf,.fbx,.obj,.blend,.dae,.3ds",
  title,
  description
}: MediaUploadProps) {
  const [dragActive, setDragActive] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (mediaFiles.length + files.length <= maxFiles) {
      onMediaFilesChange([...mediaFiles, ...files])
    }
  }

  const removeFile = (index: number) => {
    const newFiles = mediaFiles.filter((_, i) => i !== index)
    onMediaFilesChange(newFiles)
  }

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <FileImage className="h-4 w-4" />
    if (file.type.startsWith('video/')) return <Video className="h-4 w-4" />
    if (file.name.match(/\.(glb|gltf|fbx|obj|blend|dae|3ds)$/i)) return <Box className="h-4 w-4" />
    return <File className="h-4 w-4" />
  }

  const getFileType = (file: File) => {
    if (file.type.startsWith('image/')) return 'Image'
    if (file.type.startsWith('video/')) return 'Video'
    if (file.name.match(/\.(glb|gltf|fbx|obj|blend|dae|3ds)$/i)) return '3D Model'
    return 'File'
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
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
    
    const files = Array.from(e.dataTransfer.files)
    if (mediaFiles.length + files.length <= maxFiles) {
      onMediaFilesChange([...mediaFiles, ...files])
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-white font-medium mb-2">{title}</h4>
        {description && (
          <p className="text-gray-400 text-sm mb-4">{description}</p>
        )}
      </div>

      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
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
          accept={accept}
          multiple
          onChange={handleFileChange}
          className="hidden"
          id={`media-upload-${title}`}
        />
        <label
          htmlFor={`media-upload-${title}`}
          className="cursor-pointer flex flex-col items-center"
        >
          <Upload className="h-8 w-8 text-purple-400 mb-2" />
          <span className="text-gray-300 mb-2">
            {dragActive ? 'Drop files here' : `Click to upload or drag and drop`}
          </span>
          <span className="text-gray-500 text-sm">
            Supported: Images, Videos, 3D Models (GLB, GLTF, FBX, OBJ, Blend, etc.)
          </span>
          <span className="text-gray-500 text-xs mt-1">
            Max {maxFiles} files
          </span>
        </label>
      </div>

      {mediaFiles.length > 0 && (
        <div className="space-y-2">
          <h5 className="text-white font-medium">Selected Files ({mediaFiles.length}/{maxFiles})</h5>
          <div className="grid gap-2">
            {mediaFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-slate-800 rounded-lg p-3"
              >
                <div className="flex items-center gap-3">
                  <div className="text-purple-400">
                    {getFileIcon(file)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm truncate">{file.name}</p>
                    <p className="text-gray-400 text-xs">
                      {getFileType(file)} - {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="text-red-400 hover:text-red-300 p-1"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
