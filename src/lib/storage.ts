import { supabase } from './supabase'

export class StorageService {
  private bucketName = 'portfolio-files'

  // Supported file types
  private supportedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
  private supportedVideoTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime']
  private supportedModelTypes = [
    'model/gltf+json', 'model/gltf-binary', 
    'application/octet-stream', // For .blend, .fbx, .obj files
    'application/x-blender', 'application/x-fbx', 'application/x-obj'
  ]

  isImageFile(file: File): boolean {
    return this.supportedImageTypes.includes(file.type) || 
           /\.(jpg|jpeg|png|webp|gif)$/i.test(file.name)
  }

  isVideoFile(file: File): boolean {
    return this.supportedVideoTypes.includes(file.type) || 
           /\.(mp4|webm|ogg|mov)$/i.test(file.name)
  }

  isModelFile(file: File): boolean {
    return this.supportedModelTypes.includes(file.type) || 
           /\.(glb|gltf|fbx|obj|blend|dae|3ds)$/i.test(file.name)
  }

  getFileCategory(file: File): 'images' | 'videos' | 'models' {
    if (this.isImageFile(file)) return 'images'
    if (this.isVideoFile(file)) return 'videos'
    if (this.isModelFile(file)) return 'images' // Treat 3D models as additional images for processing
    return 'images' // default
  }

  // Upload file to Supabase Storage
  async uploadFile(file: File, path: string): Promise<{ data: any; error: any }> {
    console.log('Uploading file:', file.name, 'to path:', path)
    
    const { data, error } = await supabase.storage
      .from(this.bucketName)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: true
      })

    if (error) {
      console.error('Storage upload error:', error)
    } else {
      console.log('Upload successful:', data)
    }

    return { data, error }
  }

  // Get public URL for a file
  getPublicUrl(path: string): string {
    const { data } = supabase.storage
      .from(this.bucketName)
      .getPublicUrl(path)

    return data.publicUrl
  }

  // Delete file from storage
  async deleteFile(path: string): Promise<{ error: any }> {
    const { error } = await supabase.storage
      .from(this.bucketName)
      .remove([path])

    return { error }
  }

  // Upload project files (model, thumbnail, images, videos)
  async uploadProjectFiles(
    projectId: string,
    modelFile?: File,
    thumbnailFile?: File,
    mediaFiles?: File[]
  ): Promise<{
    modelUrl?: string
    thumbnailUrl?: string
    imageUrls: string[]
    videoUrls: string[]
    errors: string[]
  }> {
    const errors: string[] = []
    let modelUrl: string | undefined
    let thumbnailUrl: string | undefined
    const imageUrls: string[] = []
    const videoUrls: string[] = []

    // Upload model
    if (modelFile) {
      const modelPath = `models/${projectId}/${modelFile.name}`
      const { error } = await this.uploadFile(modelFile, modelPath)
      if (error) {
        errors.push(`Error uploading model: ${error.message}`)
      } else {
        modelUrl = this.getPublicUrl(modelPath)
      }
    }

    // Upload thumbnail
    if (thumbnailFile) {
      const thumbnailPath = `images/thumbnails/${projectId}-thumb.${thumbnailFile.name.split('.').pop()}`
      const { error } = await this.uploadFile(thumbnailFile, thumbnailPath)
      if (error) {
        errors.push(`Error uploading thumbnail: ${error.message}`)
      } else {
        thumbnailUrl = this.getPublicUrl(thumbnailPath)
      }
    }

    // Upload media files (images, videos, and 3D models)
    if (mediaFiles) {
      for (let i = 0; i < mediaFiles.length; i++) {
        const mediaFile = mediaFiles[i]
        const fileCategory = this.getFileCategory(mediaFile)
        const fileExt = mediaFile.name.split('.').pop()
        
        let mediaPath: string
        if (fileCategory === 'videos') {
          mediaPath = `videos/${projectId}-video-${i + 1}.${fileExt}`
        } else if (this.isModelFile(mediaFile)) {
          mediaPath = `models/${projectId}/${mediaFile.name}`
        } else {
          mediaPath = `images/renders/${projectId}-render-${i + 1}.${fileExt}`
        }
        
        const { error } = await this.uploadFile(mediaFile, mediaPath)
        if (error) {
          errors.push(`Error uploading ${fileCategory} ${i + 1}: ${error.message}`)
        } else {
          const publicUrl = this.getPublicUrl(mediaPath)
          if (fileCategory === 'videos') {
            videoUrls.push(publicUrl)
          } else {
            // Include 3D models in imageUrls for gallery display
            imageUrls.push(publicUrl)
          }
        }
      }
    }

    return {
      modelUrl,
      thumbnailUrl,
      imageUrls,
      videoUrls,
      errors
    }
  }

  // List files in a directory
  async listFiles(path: string = ''): Promise<{ data: any; error: any }> {
    const { data, error } = await supabase.storage
      .from(this.bucketName)
      .list(path)

    return { data, error }
  }

  // Download file
  async downloadFile(path: string): Promise<{ data: any; error: any }> {
    const { data, error } = await supabase.storage
      .from(this.bucketName)
      .download(path)

    return { data, error }
  }
}

export const storageService = new StorageService()
