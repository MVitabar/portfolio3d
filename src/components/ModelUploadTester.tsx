'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { storageService } from '@/lib/storage'
import { Upload, CheckCircle, XCircle, Loader2, Box } from 'lucide-react'

export default function ModelUploadTester() {
  const [testResults, setTestResults] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [testPassed, setTestPassed] = useState<boolean | null>(null)

  const addResult = (message: string, type: 'info' | 'success' | 'error' = 'info') => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
    if (type === 'success') setTestPassed(true)
    if (type === 'error') setTestPassed(false)
  }

  const testModelUpload = async () => {
    setIsLoading(true)
    setTestResults([])
    setTestPassed(null)
    
    try {
      addResult('Iniciando prueba de upload de modelo 3D...', 'info')
      
      // Create a test 3D model file (simple text file with .fbx extension)
      const testModelContent = `; FBX 7.4.0 project file
; Generated for testing purposes
; This is a test model file
`
      
      const testFile = new File([testModelContent], 'test-model.fbx', { type: 'application/octet-stream' })
      addResult(`Archivo creado: ${testFile.name} (${(testFile.size / 1024).toFixed(2)} KB)`, 'info')
      addResult(`Tipo MIME: ${testFile.type}`, 'info')
      
      // Test 1: Check if file is recognized as model
      const isModel = storageService.isModelFile(testFile)
      addResult(`Es reconocido como modelo: ${isModel ? 'YES' : 'NO'}`, isModel ? 'success' : 'error')
      
      // Test 2: Try direct upload
      addResult('2. Intentando upload directo...', 'info')
      const testPath = `models/test/test-model-${Date.now()}.fbx`
      
      const { data: directData, error: directError } = await storageService.uploadFile(testFile, testPath)
      
      if (directError) {
        addResult(`ERROR upload directo: ${directError.message}`, 'error')
        addResult(`Error code: ${directError.code || 'N/A'}`, 'error')
        
        if (directError.message.includes('bucket')) {
          addResult('Sugerencia: Revisa configuración del bucket', 'info')
        } else if (directError.message.includes('policy')) {
          addResult('Sugerencia: Revisa RLS policies', 'info')
        } else if (directError.message.includes('permission')) {
          addResult('Sugerencia: Revisa permisos del bucket', 'info')
        } else if (directError.message.includes('file size')) {
          addResult('Sugerencia: Archivo muy grande', 'info')
        } else if (directError.message.includes('413')) {
          addResult('Sugerencia: Payload Too Large', 'info')
        }
      } else {
        addResult('Upload directo exitoso!', 'success')
        addResult(`File ID: ${directData?.id}`, 'info')
        addResult(`Path: ${directData?.path}`, 'info')
        
        // Test 3: Check public URL
        const publicUrl = storageService.getPublicUrl(testPath)
        addResult(`URL pública: ${publicUrl}`, 'info')
        
        // Test 4: Try to access the URL
        try {
          const response = await fetch(publicUrl, { method: 'HEAD' })
          addResult(`URL accesible: ${response.ok ? 'YES' : 'NO'} (${response.status})`, response.ok ? 'success' : 'error')
          
          if (response.ok) {
            const contentType = response.headers.get('content-type')
            addResult(`Content-Type: ${contentType || 'No especificado'}`, 'info')
          }
        } catch (urlError) {
          addResult(`Error accediendo a URL: ${urlError}`, 'error')
        }
        
        // Test 5: Try uploadProjectFiles
        addResult('3. Intentando uploadProjectFiles...', 'info')
        
        const uploadResult = await storageService.uploadProjectFiles(
          'test-project-id',
          undefined,
          undefined,
          [testFile]
        )
        
        if (uploadResult.errors.length > 0) {
          addResult(`ERROR en uploadProjectFiles: ${uploadResult.errors.join(', ')}`, 'error')
        } else {
          addResult('uploadProjectFiles exitoso!', 'success')
          addResult(`Imágenes retornadas: ${uploadResult.imageUrls.length}`, 'info')
          
          if (uploadResult.imageUrls.length > 0) {
            addResult(`URL de modelo: ${uploadResult.imageUrls[0]}`, 'info')
          }
        }
        
        // Clean up test file
        const { error: deleteError } = await storageService.deleteFile(testPath)
        if (deleteError) {
          addResult(`Error eliminando archivo: ${deleteError.message}`, 'error')
        } else {
          addResult('Archivo de prueba eliminado', 'success')
        }
      }
      
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
        <h3 className="text-xl font-bold text-white">3D Model Upload Tester</h3>
        <Box className="h-5 w-5 text-purple-400" />
        {testPassed === true && <CheckCircle className="h-5 w-5 text-green-400" />}
        {testPassed === false && <XCircle className="h-5 w-5 text-red-400" />}
      </div>
      
      <div className="flex gap-4 mb-4">
        <Button 
          onClick={testModelUpload}
          disabled={isLoading}
          className="bg-purple-600 hover:bg-purple-700"
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Testing...
            </div>
          ) : (
            'Test 3D Upload'
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
          <h4 className="text-lg font-semibold text-purple-300 mb-2">Test Results:</h4>
          {testResults.map((result, index) => {
            let className = 'text-sm mb-1'
            if (result.includes('ERROR') || result.includes('Error')) {
              className += ' text-red-400'
            } else if (result.includes('exitoso') || result.includes('accesible') || result.includes('YES')) {
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
