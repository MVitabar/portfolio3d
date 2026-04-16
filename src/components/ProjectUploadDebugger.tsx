'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'
import { storageService } from '@/lib/storage'
import { Upload, CheckCircle, XCircle, Loader2, Bug } from 'lucide-react'

export default function ProjectUploadDebugger() {
  const [testResults, setTestResults] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [testPassed, setTestPassed] = useState<boolean | null>(null)

  const addResult = (message: string, type: 'info' | 'success' | 'error' = 'info') => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
    if (type === 'success') setTestPassed(true)
    if (type === 'error') setTestPassed(false)
  }

  const testProjectUpload = async () => {
    setIsLoading(true)
    setTestResults([])
    setTestPassed(null)
    
    try {
      addResult('Iniciando prueba completa de ProjectUpload...', 'info')
      
      // 1. Test project creation
      addResult('1. Creando proyecto de prueba...', 'info')
      
      const projectData = {
        title: 'Test Project ' + Date.now(),
        description: 'Test project for debugging',
        category: 'character-design',
        featured: false,
        thumbnail_url: 'https://picsum.photos/400/300?random=' + Date.now(),
        images: [],
        videos: [],
        tags: ['test', 'debug']
      }
      
      const { data: project, error: projectError } = await supabase
        .from('projects')
        .insert(projectData)
        .select()
        .single()

      if (projectError) {
        addResult(`ERROR creando proyecto: ${projectError.message}`, 'error')
        return
      }
      
      addResult(`Proyecto creado exitosamente: ${project.id}`, 'success')
      
      // 2. Test file upload
      addResult('2. Creando archivo de prueba...', 'info')
      
      const canvas = document.createElement('canvas')
      canvas.width = 400
      canvas.height = 300
      const ctx = canvas.getContext('2d')!
      
      const gradient = ctx.createLinearGradient(0, 0, 400, 300)
      gradient.addColorStop(0, '#3b82f6')
      gradient.addColorStop(1, '#8b5cf6')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, 400, 300)
      
      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 24px Arial'
      ctx.textAlign = 'center'
      ctx.fillText('DEBUG', 200, 150)
      
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => resolve(blob!), 'image/png')
      })
      
      const testFile = new File([blob!], 'debug-test.png', { type: 'image/png' })
      addResult(`Archivo creado: ${testFile.name} (${(testFile.size / 1024).toFixed(2)} KB)`, 'info')
      
      // 3. Test uploadProjectFiles
      addResult('3. Subiendo archivo con uploadProjectFiles...', 'info')
      
      const uploadResult = await storageService.uploadProjectFiles(
        project.id,
        undefined,
        undefined,
        [testFile]
      )
      
      if (uploadResult.errors.length > 0) {
        addResult(`ERROR en upload: ${uploadResult.errors.join(', ')}`, 'error')
        return
      }
      
      addResult(`Upload exitoso!`, 'success')
      addResult(`Imágenes subidas: ${uploadResult.imageUrls.length}`, 'info')
      addResult(`Videos subidos: ${uploadResult.videoUrls.length}`, 'info')
      
      if (uploadResult.imageUrls.length > 0) {
        addResult(`URL de imagen: ${uploadResult.imageUrls[0]}`, 'info')
        
        // Test URL accessibility
        try {
          const response = await fetch(uploadResult.imageUrls[0])
          addResult(`URL accesible: ${response.ok ? 'YES' : 'NO'} (${response.status})`, response.ok ? 'success' : 'error')
        } catch (urlError) {
          addResult('Error accediendo a URL', 'error')
        }
      }
      
      // 4. Test database update
      addResult('4. Actualizando proyecto con URLs...', 'info')
      
      const { error: updateError } = await supabase
        .from('projects')
        .update({
          images: uploadResult.imageUrls,
          videos: uploadResult.videoUrls,
          updated_at: new Date().toISOString()
        })
        .eq('id', project.id)

      if (updateError) {
        addResult(`ERROR actualizando proyecto: ${updateError.message}`, 'error')
        return
      }
      
      addResult('Proyecto actualizado exitosamente!', 'success')
      
      // 5. Verify final state
      addResult('5. Verificando estado final...', 'info')
      
      const { data: finalProject, error: fetchError } = await supabase
        .from('projects')
        .select('*')
        .eq('id', project.id)
        .single()

      if (fetchError) {
        addResult(`ERROR verificando proyecto: ${fetchError.message}`, 'error')
        return
      }
      
      addResult(`Proyecto final tiene ${finalProject.images?.length || 0} imágenes`, 'info')
      addResult(`Proyecto final tiene ${finalProject.videos?.length || 0} videos`, 'info')
      
      addResult('¡Prueba completa exitosa!', 'success')
      
      // Clean up
      await supabase.from('projects').delete().eq('id', project.id)
      addResult('Proyecto de prueba eliminado', 'info')
      
    } catch (error) {
      addResult(`Error inesperado: ${error}`, 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const clearResults = () => {
    setTestResults([])
    setTestPassed(null)
  }

  return (
    <div className="bg-slate-800 rounded-lg p-6 mb-8">
      <div className="flex items-center gap-3 mb-4">
        <h3 className="text-xl font-bold text-white">Project Upload Debugger</h3>
        <Bug className="h-5 w-5 text-purple-400" />
        {testPassed === true && <CheckCircle className="h-5 w-5 text-green-400" />}
        {testPassed === false && <XCircle className="h-5 w-5 text-red-400" />}
      </div>
      
      <div className="flex gap-4 mb-4">
        <Button 
          onClick={testProjectUpload}
          disabled={isLoading}
          className="bg-purple-600 hover:bg-purple-700"
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Testing...
            </div>
          ) : (
            'Debug Project Upload'
          )}
        </Button>
        <Button 
          onClick={clearResults}
          variant="outline"
          className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white"
        >
          Clear Results
        </Button>
      </div>
      
      {testResults.length > 0 && (
        <div className="bg-slate-900 rounded-lg p-4 max-h-96 overflow-y-auto">
          <h4 className="text-lg font-semibold text-purple-300 mb-2">Debug Results:</h4>
          {testResults.map((result, index) => {
            let className = 'text-sm mb-1'
            if (result.includes('ERROR') || result.includes('Error')) {
              className += ' text-red-400'
            } else if (result.includes('exitosa') || result.includes('accesible') || result.includes('success')) {
              className += ' text-green-400'
            } else {
              className += ' text-gray-300'
            }
            
            return (
              <div key={index} className={className}>
                {result}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
