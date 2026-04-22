import Hero from '@/components/Hero'
import Navbar from '@/components/Navbar'
import ProjectGallery from '@/components/ProjectGallery'
import About from '@/components/About'
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
      <div id="about">
        <About />
      </div>
      <div id="contact">
        <Contact />
      </div>
    </>
  )
}
