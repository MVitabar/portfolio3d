import Hero from '@/components/Hero'
import Navbar from '@/components/Navbar'
import ProjectGallery from '@/components/ProjectGallery'
import About from '@/components/About'
import Testimonials from '@/components/Testimonials'
import Process from '@/components/Process'
import Tools from '@/components/Tools'
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
      <Testimonials />
      <Process />
      {/* <Tools /> */}
      <div id="contact">
        <Contact />
      </div>
    </>
  )
}
