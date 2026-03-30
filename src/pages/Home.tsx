import AnnouncementBar from '../components/AnnouncementBar'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import HowItWorks from '../components/HowItWorks'
import Fleet from '../components/Fleet'
import CarShowcase from '../components/CarShowcase'
import About from '../components/About'
import Testimonials from '../components/Testimonials'
import FAQ from '../components/FAQ'
import Footer from '../components/Footer'
import FloatingWhatsApp from '../components/FloatingWhatsApp'

export default function Home() {
  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <Hero />
      <HowItWorks />
      <Fleet />
      <CarShowcase />
      <About />
      <Testimonials />
      <FAQ />
      <Footer />
      <FloatingWhatsApp />
    </>
  )
}
