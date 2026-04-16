'use client'

import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js'
import { Button } from '@/components/ui/button'
import { Maximize2, RotateCcw, Sun, Box } from 'lucide-react'

interface Model3DViewerProps {
  modelUrl?: string
  thumbnailUrl?: string
  title?: string
}

export default function Model3DViewer({ modelUrl, thumbnailUrl, title = "3D Model" }: Model3DViewerProps) {
  const mountRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const frameIdRef = useRef<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    if (!mountRef.current) return

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
    camera.position.set(0, 1, 5)

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1
    mountRef.current.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.minDistance = 1
    controls.maxDistance = 20
    controls.autoRotate = true
    controls.autoRotateSpeed = 2

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
    directionalLight.position.set(5, 10, 5)
    directionalLight.castShadow = true
    directionalLight.shadow.camera.near = 0.1
    directionalLight.shadow.camera.far = 50
    directionalLight.shadow.camera.left = -10
    directionalLight.shadow.camera.right = 10
    directionalLight.shadow.camera.top = 10
    directionalLight.shadow.camera.bottom = -10
    scene.add(directionalLight)

    // Environment
    const rgbeLoader = new RGBELoader()
    rgbeLoader.load(
      'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/studio_small_03_1k.hdr',
      (texture) => {
        texture.mapping = THREE.EquirectangularReflectionMapping
        scene.environment = texture
        scene.background = new THREE.Color(0x0a0a0a)
      }
    )

    // Load model or create default
    const loader = new GLTFLoader()
    
    if (modelUrl && modelUrl !== '') {
      loader.load(
        modelUrl,
        (gltf) => {
          const model = gltf.scene
          model.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
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
        (progress) => {
          // Loading progress
        },
        (error) => {
          console.error('Error loading model:', error)
          createDefaultModel(scene)
          setError('Failed to load 3D model. Showing default geometry.')
          setIsLoading(false)
        }
      )
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
  }, [modelUrl])

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

  const toggleFullscreen = () => {
    if (!mountRef.current) return
    
    if (!isFullscreen) {
      mountRef.current.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  const resetCamera = () => {
    // Reset camera position and controls
    if (rendererRef.current && sceneRef.current) {
      const camera = new THREE.PerspectiveCamera(
        75,
        mountRef.current!.clientWidth / mountRef.current!.clientHeight,
        0.1,
        1000
      )
      camera.position.set(0, 1, 5)
      
      const controls = new OrbitControls(camera, rendererRef.current.domElement)
      controls.target.set(0, 0, 0)
      controls.update()
    }
  }

  return (
    <div className="relative w-full h-full min-h-[400px] bg-slate-900 rounded-lg overflow-hidden">
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

      {/* Error message */}
      {error && (
        <div className="absolute top-4 left-4 right-4 bg-red-500/20 border border-red-500/50 rounded-lg p-3">
          <p className="text-red-300 text-sm">{error}</p>
        </div>
      )}

      {/* Controls */}
      <div className="absolute bottom-4 right-4 flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={resetCamera}
          className="bg-slate-800/80 border-purple-400/50 text-purple-300 hover:bg-purple-600/20"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={toggleFullscreen}
          className="bg-slate-800/80 border-purple-400/50 text-purple-300 hover:bg-purple-600/20"
        >
          <Maximize2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Title */}
      {title && (
        <div className="absolute top-4 left-4">
          <h3 className="text-white font-semibold text-lg bg-slate-800/80 backdrop-blur-sm px-3 py-1 rounded">
            {title}
          </h3>
        </div>
      )}

      {/* Fallback thumbnail */}
      {thumbnailUrl && !modelUrl && (
        <div className="absolute inset-0 flex items-center justify-center">
          <img
            src={thumbnailUrl}
            alt={title}
            className="max-w-full max-h-full object-contain"
          />
          <div className="absolute bottom-4 left-4 bg-slate-800/80 backdrop-blur-sm px-3 py-1 rounded">
            <p className="text-purple-300 text-sm flex items-center gap-2">
              <Box className="h-4 w-4" />
              3D Model Available
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
