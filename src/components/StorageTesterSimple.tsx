'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { storageService } from '@/lib/storage'
import { Upload, CheckCircle, XCircle } from 'lucide-react'

export default function StorageTesterSimple() {
  const [testResults, setTestResults] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [testPassed, setTestPassed] = useState<boolean | null>(null)

  const addResult = (message: string, type: 'info' | 'success' | 'error' = 'info') => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
    if (type === 'success') setTestPassed(true)
    if (type === 'error') setTestPassed(false)
  }

  const testDirectUpload = async () => {
    setIsLoading(true)
    setTestResults([])
    setTestPassed(null)
    
    try {
      addResult('Iniciando prueba directa de upload...', 'info')
      
      // Create a simple test image
      const canvas = document.createElement('canvas')
      canvas.width = 200
      canvas.height = 200
      const ctx = canvas.getContext('2d')!
      ctx.fillStyle = '#8b5cf6'
      ctx.fillRect(0, 0, 200, 200)
      ctx.fillStyle = '#ffffff'
      ctx.font = '20px Arial'
      ctx.fillText('TEST', 70, 100)
      
      canvas.toBlob(async (blob) => {
        if (!blob) {
          addResult('Error creando imagen de prueba', 'error')
          setIsLoading(false)
          return
        }
        
        const testFile = new File([blob], 'test-upload.png', { type: 'image/png' })
        const testPath = `test/test-upload-${Date.now()}.png`
        
        addResult(`Subiendo archivo: ${testFile.name}`, 'info')
        
        try {
          const { data, error } = await storageService.uploadFile(testFile, testPath)
          
          if (error) {
            addResult(`ERROR Upload: ${error.message}`, 'error')
            addResult(`Error code: ${error.code || 'N/A'}`, 'error')
            
            // Try to get more info about the error
            if (error.message.includes('bucket') || error.message.includes('not found')) {
              addResult('Sugerencia: El bucket puede no existir o no ser accesible', 'info')
              addResult('Verifica que el bucket "portfolio-files" exista y sea público', 'info')
            } else if (error.message.includes('policy') || error.message.includes('permission')) {
              addResult('Sugerencia: Problema de políticas de acceso', 'info')
              addResult('Verifica las políticas RLS para storage.objects', 'info')
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
        <h3 className="text-xl font-bold text-white">Storage Test (Direct Upload)</h3>
        {testPassed === true && <CheckCircle className="h-5 w-5 text-green-400" />}
        {testPassed === false && <XCircle className="h-5 w-5 text-red-400" />}
      </div>
      
      <div className="flex gap-4 mb-4">
        <Button 
          onClick={testDirectUpload}
          disabled={isLoading}
          className="bg-purple-600 hover:bg-purple-700"
        >
          {isLoading ? 'Testing...' : 'Test Direct Upload'}
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
      
      <div className="mt-4 p-4 bg-slate-700/50 rounded-lg">
        <p className="text-sm text-gray-300">
          <strong>Nota:</strong> Esta prueba intenta subir un archivo directamente al bucket 
          <code className="bg-slate-600 px-2 py-1 rounded text-xs ml-1">portfolio-files</code>
          {' '}sin verificar si el bucket existe primero.
        </p>
      </div>
    </div>
  )
}
