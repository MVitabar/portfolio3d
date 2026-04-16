'use client'

import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { BoxHelper } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
import { Button } from '@/components/ui/button'
import { X, Maximize2, RotateCcw } from 'lucide-react'

interface ModelModalProps {
  isOpen: boolean
  onClose: () => void
  modelUrl?: string | string[]
  title?: string
}

export default function ModelModal({ isOpen, onClose, modelUrl, title }: ModelModalProps) {
  const mountRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const frameIdRef = useRef<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!isOpen || !mountRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x0a0a0a)
    sceneRef.current = scene

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    )
    camera.position.set(0, 1, 3)
    
    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.shadowMap.enabled = true
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    mountRef.current.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
        controls.autoRotate = true
    controls.autoRotateSpeed = 1

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2)
    directionalLight.position.set(5, 10, 5)
    directionalLight.castShadow = true
    scene.add(directionalLight)

    // Add additional lights for better visibility
    const pointLight = new THREE.PointLight(0xffffff, 0.8)
    pointLight.position.set(-5, 5, 0)
    scene.add(pointLight)

    // Load environment map (using RGBELoader for now)
    const rgbeLoader = new RGBELoader()
    rgbeLoader.load(
      'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/studio_small_03_1k.hdr',
      (texture: any) => {
        texture.mapping = THREE.EquirectangularReflectionMapping
        scene.environment = texture
        scene.environmentIntensity = 0.5
      }
    )

    // Load model or create default
    if (modelUrl && modelUrl !== '') {
      // Check if we have multiple models
      const modelUrls = Array.isArray(modelUrl) ? modelUrl : [modelUrl]
      
      // Load first model for now (we can add model switching later)
      const firstModelUrl = modelUrls[0]
      
      // Determine file type and use appropriate loader
      const fileExtension = firstModelUrl.split('.').pop()?.toLowerCase()
      
      if (fileExtension === 'fbx') {
        // Load FBX model
        const fbxLoader = new FBXLoader()
        fbxLoader.load(
          firstModelUrl,
          (fbx: any) => {
            
            const model = fbx
            
            // Apply materials if needed
            model.traverse((child: any) => {
              if (child.isMesh) {
                child.castShadow = true
                child.receiveShadow = true
                
                // Apply a nice material for FBX models
                const material = new THREE.MeshStandardMaterial({ 
                  color: 0x888888, // Neutral gray
                  metalness: 0.3,
                  roughness: 0.4
                })
                child.material = material
              }
            })
            
            // Center and scale model
            const box = new THREE.Box3().setFromObject(model)
            const center = box.getCenter(new THREE.Vector3())
            const size = box.getSize(new THREE.Vector3())
            
            // Place model at origin (0,0,0) after centering
            model.position.set(0, 0, 0)
            
            const maxDim = Math.max(size.x, size.y, size.z)
            const scale = 3 / maxDim // Good scale
            model.scale.multiplyScalar(scale)
            
            scene.add(model)
            
            // Position camera to look at origin where model is
            camera.position.set(0, 0, 4)
            camera.lookAt(0, 0, 0)
            
            setIsLoading(false)
          },
          (progress: any) => {
            // Progress tracking
          },
          (error: any) => {
                        createDefaultModel(scene)
            setIsLoading(false)
          }
        )
      } else {
        // Load GLTF/GLB model
        const gltfLoader = new GLTFLoader()
        gltfLoader.load(
          firstModelUrl,
          (gltf: any) => {
            const model = gltf.scene
            model.traverse((child: any) => {
              if (child.isMesh) {
                child.castShadow = true
                child.receiveShadow = true
              }
            })
            
            // Center and scale model
            const box = new THREE.Box3().setFromObject(model)
            const center = box.getCenter(new THREE.Vector3())
            model.position.sub(center)
            
            const size = box.getSize(new THREE.Vector3())
            const maxDim = Math.max(size.x, size.y, size.z)
            const scale = 2 / maxDim
            model.scale.multiplyScalar(scale)
            
            scene.add(model)
            setIsLoading(false)
          },
          (progress: any) => {
            // Progress tracking
          },
          (error: any) => {
                        createDefaultModel(scene)
            setIsLoading(false)
          }
        )
      }
    } else {
      createDefaultModel(scene)
      setIsLoading(false)
    }

    // Animation loop
    const animate = () => {
      frameIdRef.current = requestAnimationFrame(animate)
      controls.update()
      renderer.render(scene, camera)
    }
    animate()

    // Handle resize
    const handleResize = () => {
      if (!mountRef.current) return
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      if (frameIdRef.current) {
        cancelAnimationFrame(frameIdRef.current)
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement)
      }
      renderer.dispose()
    }
  }, [isOpen, modelUrl])

  const createDefaultModel = (scene: THREE.Scene) => {
    const geometry = new THREE.IcosahedronGeometry(1, 1)
    const material = new THREE.MeshPhysicalMaterial({
      color: 0x8b5cf6,
      metalness: 0.7,
      roughness: 0.2,
      clearcoat: 1,
      clearcoatRoughness: 0.1
    })
    const mesh = new THREE.Mesh(geometry, material)
    mesh.castShadow = true
    mesh.receiveShadow = true
    scene.add(mesh)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="relative w-full h-full max-w-6xl max-h-[90vh] bg-slate-900 rounded-lg overflow-hidden">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-10 bg-slate-800/80 backdrop-blur-sm p-4 flex items-center justify-between">
          <h3 className="text-white font-semibold text-lg">{title || '3D Model Viewer'}</h3>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="bg-slate-700/50 border-purple-400/50 text-purple-300 hover:bg-purple-600/20"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className="bg-slate-700/50 border-red-400/50 text-red-300 hover:bg-red-600/20"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* 3D Viewer */}
        <div ref={mountRef} className="w-full h-full" />

        {/* Loading overlay */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm">
            <div className="text-center">
              <div className="w-12 h-12 border-3 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-purple-300">Loading 3D Model...</p>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="absolute bottom-4 left-4 bg-slate-800/80 backdrop-blur-sm px-4 py-2 rounded-lg">
          <p className="text-gray-300 text-sm">
            Left click + drag to rotate | Scroll to zoom | Right click + drag to pan
          </p>
        </div>
      </div>
    </div>
  )
}
