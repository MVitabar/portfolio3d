'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Eye, ExternalLink, Calendar, Tag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'
import type { Database } from '@/lib/supabase'
import ModelModal from '@/components/ModelModal'
import ProjectUpload from '@/components/ProjectUpload'
import ProjectCard from '@/components/ProjectCard'
import AdminProjectCard from '@/components/AdminProjectCard'
import ProjectModal from '@/components/ProjectModal'
import { useAuth } from '@/components/AuthProvider'

type Project = Database['public']['Tables']['projects']['Row']

export default function ProjectGallery() {
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [loading, setLoading] = useState(true)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedProjectForModal, setSelectedProjectForModal] = useState<Project | null>(null)
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const { isAdmin } = useAuth()

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setProjects(data || [])
    } catch (error) {
      console.error('Error fetching projects:', error)
      // Set empty array to show no projects instead of mock data
      setProjects([])
    } finally {
      setLoading(false)
    }
  }

  const openModelViewer = (project: Project) => {
    // Find all 3D models in the project's media
    let modelUrls: string[] = []
    
    // Add main model_url if exists
    if (project.model_url) {
      modelUrls.push(project.model_url)
    }
    
    // Look for 3D models in images array
    if (project.images && project.images.length > 0) {
      const modelExtensions = ['.fbx', '.glb', '.gltf', '.obj', '.blend']
      const modelImages = project.images.filter(img => 
        modelExtensions.some(ext => img.toLowerCase().includes(ext))
      )
      modelUrls = [...modelUrls, ...modelImages]
    }
    
    console.log('Opening 3D viewer with models:', modelUrls)
    
    setSelectedProject({ ...project, model_url: modelUrls[0] })
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedProject(null)
  }

  const refreshProjects = () => {
    fetchProjects()
  }

  const openProjectModal = (project: Project) => {
    setSelectedProjectForModal(project)
    setIsProjectModalOpen(true)
  }

  const closeProjectModal = () => {
    setIsProjectModalOpen(false)
    setSelectedProjectForModal(null)
  }

  const handleProjectEdit = (project: Project) => {
    setEditingProject(project)
  }

  const handleProjectDelete = (projectId: string) => {
    setProjects(prev => prev.filter(p => p.id !== projectId))
  }

  const filteredProjects = selectedCategory === 'all' 
    ? projects 
    : projects.filter(p => p.category === selectedCategory)

  const categories = ['all', ...Array.from(new Set(projects.map(p => p.category)))]

  if (loading) {
    return (
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Loading Projects...</h2>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 px-4 bg-slate-900">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            My Portfolio
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Explore my collection of 3D artworks and animations
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className={`capitalize ${
                selectedCategory === category 
                  ? 'bg-purple-600 hover:bg-purple-700' 
                  : 'border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white'
              }`}
            >
              {category}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              {isAdmin ? (
                <AdminProjectCard
                  project={project}
                  onView3D={openModelViewer}
                  onProjectDetails={openProjectModal}
                  onProjectEdit={handleProjectEdit}
                  onProjectDelete={handleProjectDelete}
                />
              ) : (
                <ProjectCard 
                  project={project} 
                  onView3D={openModelViewer}
                  onProjectDetails={openProjectModal}
                />
              )}
            </motion.div>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No projects found in this category.</p>
          </div>
        )}

        <ModelModal
          isOpen={isModalOpen}
          onClose={closeModal}
          modelUrl={selectedProject?.model_url}
          title={selectedProject?.title}
        />

        <ProjectModal
          project={selectedProjectForModal}
          isOpen={isProjectModalOpen}
          onClose={closeProjectModal}
        />

        <ProjectUpload 
          onProjectUploaded={() => {
            refreshProjects()
            setEditingProject(null)
          }} 
          editProject={editingProject || undefined}
        />
      </div>
    </section>
  )
}
