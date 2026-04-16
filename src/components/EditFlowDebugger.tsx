'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'
import { storageService } from '@/lib/storage'
import { Upload, CheckCircle, XCircle, Loader2, Bug, FileText } from 'lucide-react'

export default function EditFlowDebugger() {
  const [testResults, setTestResults] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [testPassed, setTestPassed] = useState<boolean | null>(null)

  const addResult = (message: string, type: 'info' | 'success' | 'error' = 'info') => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
    if (type === 'success') setTestPassed(true)
    if (type === 'error') setTestPassed(false)
  }

  const debugProjectUploadFlow = async () => {
    setIsLoading(true)
    setTestResults([])
    setTestPassed(null)
    
    try {
      addResult('=== DEBUG COMPLETO DE PROJECT UPLOAD ===', 'info')
      
      // 1. Simular datos de formulario como si editaras "Red Bull"
      addResult('1. Simulando datos del formulario...', 'info')
      
      const mockFormData = {
        id: 'adc856a0-202c-4da0-8fa3-56d0a0e713af', // ID real de Red Bull
        title: 'Red Bull Test Edit',
        description: 'Testing edit flow with 3D model',
        category: 'animations',
        featured: false,
        tags: ['test', 'debug']
      }
      
      addResult(`ID del proyecto: ${mockFormData.id}`, 'info')
      addResult(`Título: ${mockFormData.title}`, 'info')
      
      // 2. Crear archivo .fbx de prueba
      addResult('2. Creando archivo .fbx de prueba...', 'info')
      
      const testModelContent = `; FBX 7.4.0 project file
; Generated for testing Project Upload edit flow
; File: debug-model.fbx
; Size: ${new Date().toISOString()}
`
      
      const testFile = new File([testModelContent], 'debug-model.fbx', { type: 'application/octet-stream' })
      addResult(`Archivo creado: ${testFile.name} (${(testFile.size / 1024).toFixed(2)} KB)`, 'info')
      
      // 3. Verificar si es reconocido como modelo
      const isModel = storageService.isModelFile(testFile)
      addResult(`Reconocido como modelo: ${isModel ? 'YES' : 'NO'}`, isModel ? 'success' : 'error')
      
      // 4. Simular mediaFiles array (como lo haría el MediaUpload component)
      addResult('3. Simulando mediaFiles...', 'info')
      const mediaFiles = [testFile]
      addResult(`MediaFiles length: ${mediaFiles.length}`, 'info')
      
      // 5. Llamar a uploadProjectFiles exactamente como lo hace ProjectUpload
      addResult('4. Llamando uploadProjectFiles...', 'info')
      
      const uploadResult = await storageService.uploadProjectFiles(
        mockFormData.id,
        undefined, // modelFile
        undefined, // thumbnailFile
        mediaFiles  // mediaFiles
      )
      
      addResult(`Errores de upload: ${uploadResult.errors.length}`, 'info')
      if (uploadResult.errors.length > 0) {
        uploadResult.errors.forEach(error => addResult(`ERROR: ${error}`, 'error'))
      }
      
      addResult(`Imágenes retornadas: ${uploadResult.imageUrls.length}`, 'info')
      addResult(`Videos retornados: ${uploadResult.videoUrls.length}`, 'info')
      
      if (uploadResult.imageUrls.length > 0) {
        uploadResult.imageUrls.forEach((url, index) => {
          addResult(`Imagen ${index + 1}: ${url}`, 'info')
        })
      }
      
      // 6. Verificar si el archivo existe en el storage
      addResult('5. Verificando archivo en storage...', 'info')
      
      if (uploadResult.imageUrls.length > 0) {
        const firstImageUrl = uploadResult.imageUrls[0]
        const pathFromUrl = firstImageUrl.split('/').pop()?.split('?')[0]
        addResult(`Path extraído: ${pathFromUrl}`, 'info')
        
        try {
          // Intentar acceder directamente al archivo
          const response = await fetch(firstImageUrl, { method: 'HEAD' })
          addResult(`Acceso directo: ${response.ok ? 'EXITOSO' : 'FALLÓ'} (${response.status})`, response.ok ? 'success' : 'error')
          
          if (response.ok) {
            const contentType = response.headers.get('content-type')
            const contentLength = response.headers.get('content-length')
            addResult(`Content-Type: ${contentType || 'No especificado'}`, 'info')
            addResult(`Content-Length: ${contentLength || 'No especificado'} bytes`, 'info')
          }
        } catch (fetchError) {
          addResult(`Error accediendo: ${fetchError}`, 'error')
        }
      }
      
      // 7. Listar archivos en la carpeta models del proyecto
      addResult('6. Listando archivos en carpeta models...', 'info')
      
      try {
        const { data: filesList, error: listError } = await storageService.listFiles(`models/${mockFormData.id}/`)
        
        if (listError) {
          addResult(`Error listando archivos: ${listError.message}`, 'error')
        } else {
          addResult(`Archivos encontrados: ${filesList?.length || 0}`, 'info')
          
          if (filesList && filesList.length > 0) {
            filesList.forEach((file: any, index) => {
              addResult(`Archivo ${index + 1}: ${file.name} (${file.size || 'N/A'} bytes)`, 'info')
            })
          }
        }
      } catch (listFetchError) {
        addResult(`Error obteniendo lista: ${listFetchError}`, 'error')
      }
      
      addResult('=== DEBUG COMPLETADO ===', 'success')
      
    } catch (error) {
      addResult(`Error general: ${error}`, 'error')
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
        <h3 className="text-xl font-bold text-white">Edit Flow Debugger</h3>
        <Bug className="h-5 w-5 text-purple-400" />
        {testPassed === true && <CheckCircle className="h-5 w-5 text-green-400" />}
        {testPassed === false && <XCircle className="h-5 w-5 text-red-400" />}
      </div>
      
      <div className="flex gap-4 mb-4">
        <Button 
          onClick={debugProjectUploadFlow}
          disabled={isLoading}
          className="bg-purple-600 hover:bg-purple-700"
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Debugging...
            </div>
          ) : (
            'Debug Edit Flow'
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
            let className = 'text-sm mb-1 font-mono'
            if (result.includes('ERROR') || result.includes('Error') || result.includes('FALLÓ')) {
              className += ' text-red-400'
            } else if (result.includes('EXITOSO') || result.includes('success') || result.includes('SÍ')) {
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
