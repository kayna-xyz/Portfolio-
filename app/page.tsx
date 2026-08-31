import Navbar from "@/components/navbar"
import HeroSection from "@/components/hero-section"
import WorkSection from "@/components/work-section"
import Footer from "@/components/footer"
export default function Page() {
  return (
    <main className="relative page-fade-in">
      <Navbar />
      <HeroSection />
      <WorkSection />
      <Footer />
    </main>
  )
}
