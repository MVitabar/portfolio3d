'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { storageService } from '@/lib/storage'
import { supabase } from '@/lib/supabase'
import { debugSupabase, debugConnection } from '@/lib/supabase-debug'

export default function StorageTester() {
  const [testResults, setTestResults] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  const testStorageConnection = async () => {
    setIsLoading(true)
    setTestResults([])
    
    try {
      addResult('Iniciando pruebas de Storage...')
      
      // Test 0: Debug connection
      addResult('Verificando conexión con Supabase...')
      const connectionOk = await debugConnection()
      if (!connectionOk) {
        addResult('ERROR: Falló la conexión con Supabase')
        return
      }
      addResult('Conexión con Supabase OK')
      
      // Test 1: Check if bucket exists
      addResult('Verificando bucket...')
      const { data: buckets, error: bucketError } = await debugSupabase.storage.listBuckets()
      
      if (bucketError) {
        addResult(`Error listando buckets: ${bucketError.message}`)
        return
      }
      
      let portfolioBucket = buckets?.find(b => b.name === 'portfolio-files')
      if (!portfolioBucket) {
        addResult('ERROR: Bucket "portfolio-files" no existe')
        addResult('Intentando crear bucket automáticamente...')
        
        // Try to create bucket
        const { data: createData, error: createError } = await debugSupabase.storage.createBucket('portfolio-files', {
          public: true,
          allowedMimeTypes: ['image/*', 'model/*', 'application/octet-stream'],
          fileSizeLimit: 52428800 // 50MB
        })
        
        if (createError) {
          addResult(`ERROR creando bucket: ${createError.message}`)
          addResult('Por favor, crea el bucket manualmente en la interfaz de Supabase')
          return
        }
        
        addResult('Bucket creado exitosamente')
        
        // Re-check buckets
        const { data: newBuckets } = await debugSupabase.storage.listBuckets()
        const newPortfolioBucket = newBuckets?.find(b => b.name === 'portfolio-files')
        if (!newPortfolioBucket) {
          addResult('ERROR: Bucket creado pero no aparece en la lista')
          return
        }
        
        addResult('Bucket verificado exitosamente')
        
        // Update portfolioBucket for rest of tests
        portfolioBucket = newPortfolioBucket
      }
      
      addResult('Bucket "portfolio-files" encontrado')
      addResult(`Bucket público: ${portfolioBucket.public}`)
      
      // Test 2: Try to list files
      addResult('Listando archivos existentes...')
      const { data: files, error: listError } = await supabase.storage
        .from('portfolio-files')
        .list()
      
      if (listError) {
        addResult(`Error listando archivos: ${listError.message}`)
      } else {
        addResult(`Archivos encontrados: ${files?.length || 0}`)
        files?.forEach(file => {
          addResult(`  - ${file.name} (${file.id})`)
        })
      }
      
      // Test 3: Test upload with a simple file
      addResult('Probando upload...')
      const testFile = new File(['test content'], 'test.txt', { type: 'text/plain' })
      const { data: uploadData, error: uploadError } = await storageService.uploadFile(
        testFile, 
        'test/test.txt'
      )
      
      if (uploadError) {
        addResult(`ERROR Upload: ${uploadError.message}`)
        addResult(`Error code: ${uploadError.code}`)
      } else {
        addResult('Upload exitoso')
        addResult(`File path: ${uploadData?.path}`)
        
        // Test 4: Get public URL
        const publicUrl = storageService.getPublicUrl('test/test.txt')
        addResult(`URL pública: ${publicUrl}`)
        
        // Clean up test file
        const { error: deleteError } = await supabase.storage
          .from('portfolio-files')
          .remove(['test/test.txt'])
        
        if (deleteError) {
          addResult(`Error eliminando archivo de prueba: ${deleteError.message}`)
        } else {
          addResult('Archivo de prueba eliminado')
        }
      }
      
      addResult('Pruebas completadas')
      
    } catch (error) {
      addResult(`Error inesperado: ${error}`)
    } finally {
      setIsLoading(false)
    }
  }

  const clearResults = () => {
    setTestResults([])
  }

  return (
    <div className="bg-slate-800 rounded-lg p-6 mb-8">
      <h3 className="text-xl font-bold text-white mb-4">Storage Diagnostics</h3>
      
      <div className="flex gap-4 mb-4">
        <Button 
          onClick={testStorageConnection}
          disabled={isLoading}
          className="bg-purple-600 hover:bg-purple-700"
        >
          {isLoading ? 'Testing...' : 'Test Storage Connection'}
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
          {testResults.map((result, index) => (
            <div 
              key={index} 
              className={`text-sm mb-1 ${
                result.includes('ERROR') ? 'text-red-400' : 
                result.includes('exitoso') || result.includes('encontrado') ? 'text-green-400' : 
                'text-gray-300'
              }`}
            >
              {result}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
