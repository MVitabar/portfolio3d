'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { storageService } from '@/lib/storage'
import { Upload, CheckCircle, XCircle, Loader2 } from 'lucide-react'

export default function UploadTester() {
  const [testResults, setTestResults] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [testPassed, setTestPassed] = useState<boolean | null>(null)

  const addResult = (message: string, type: 'info' | 'success' | 'error' = 'info') => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
    if (type === 'success') setTestPassed(true)
    if (type === 'error') setTestPassed(false)
  }

  const testUpload = async () => {
    setIsLoading(true)
    setTestResults([])
    setTestPassed(null)
    
    try {
      addResult('Iniciando prueba de upload...', 'info')
      
      // Create a test image
      const canvas = document.createElement('canvas')
      canvas.width = 400
      canvas.height = 300
      const ctx = canvas.getContext('2d')!
      
      // Create a colorful test image
      const gradient = ctx.createLinearGradient(0, 0, 400, 300)
      gradient.addColorStop(0, '#8b5cf6')
      gradient.addColorStop(1, '#ec4899')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, 400, 300)
      
      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 24px Arial'
      ctx.textAlign = 'center'
      ctx.fillText('TEST IMAGE', 200, 150)
      
      canvas.toBlob(async (blob) => {
        if (!blob) {
          addResult('Error creando imagen de prueba', 'error')
          setIsLoading(false)
          return
        }
        
        const testFile = new File([blob], 'test-upload.png', { type: 'image/png' })
        const testPath = `test/test-upload-${Date.now()}.png`
        
        addResult(`Subiendo archivo: ${testFile.name}`, 'info')
        addResult(`Tamaño: ${(testFile.size / 1024).toFixed(2)} KB`, 'info')
        addResult(`Path: ${testPath}`, 'info')
        
        try {
          const { data, error } = await storageService.uploadFile(testFile, testPath)
          
          if (error) {
            addResult(`ERROR Upload: ${error.message}`, 'error')
            addResult(`Error code: ${error.code || 'N/A'}`, 'error')
            
            if (error.message.includes('bucket')) {
              addResult('Sugerencia: Problema con el bucket', 'info')
            } else if (error.message.includes('policy')) {
              addResult('Sugerencia: Problema con políticas RLS', 'info')
            } else if (error.message.includes('permission')) {
              addResult('Sugerencia: Problema de permisos', 'info')
            }
          } else {
            addResult('Upload exitoso!', 'success')
            addResult(`File ID: ${data?.id}`, 'info')
            addResult(`Path: ${data?.path}`, 'info')
            
            // Test public URL
            const publicUrl = storageService.getPublicUrl(testPath)
            addResult(`URL pública: ${publicUrl}`, 'info')
            
            // Test if URL is accessible
            try {
              const response = await fetch(publicUrl)
              if (response.ok) {
                addResult('URL pública accesible (status: ' + response.status + ')', 'success')
              } else {
                addResult(`URL no accesible (status: ${response.status})`, 'error')
              }
            } catch (urlError) {
              addResult('Error accediendo a URL pública', 'error')
            }
            
            // Clean up test file
            const { error: deleteError } = await storageService.deleteFile(testPath)
            if (deleteError) {
              addResult(`Error eliminando archivo: ${deleteError.message}`, 'error')
            } else {
              addResult('Archivo de prueba eliminado', 'success')
            }
          }
        } catch (uploadError) {
          addResult(`Error inesperado en upload: ${uploadError}`, 'error')
        } finally {
          setIsLoading(false)
        }
      }, 'image/png')
      
    } catch (error) {
      addResult(`Error general: ${error}`, 'error')
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
        <h3 className="text-xl font-bold text-white">Upload Tester</h3>
        {testPassed === true && <CheckCircle className="h-5 w-5 text-green-400" />}
        {testPassed === false && <XCircle className="h-5 w-5 text-red-400" />}
      </div>
      
      <div className="flex gap-4 mb-4">
        <Button 
          onClick={testUpload}
          disabled={isLoading}
          className="bg-purple-600 hover:bg-purple-700"
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Testing...
            </div>
          ) : (
            'Test Upload'
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
          <h4 className="text-lg font-semibold text-purple-300 mb-2">Results:</h4>
          {testResults.map((result, index) => {
            let className = 'text-sm mb-1'
            if (result.includes('ERROR') || result.includes('Error')) {
              className += ' text-red-400'
            } else if (result.includes('exitoso') || result.includes('accesible')) {
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
