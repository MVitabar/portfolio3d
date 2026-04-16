import Hero from '@/components/Hero'
import Navbar from '@/components/Navbar'
import ProjectGallery from '@/components/ProjectGallery'
import Contact from '@/components/Contact'

export default function Home() {
  return (
    <>
      <Navbar />
      <div id="home">
        <Hero />
      </div>
      <div id="portfolio">
        <ProjectGallery />
      </div>
      <div id="contact">
        <Contact />
      </div>
    </>
  )
}
