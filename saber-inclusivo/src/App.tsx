import { Nav } from './components/Nav'
import { Hero } from './components/Hero'
import { ForWhom } from './components/ForWhom'
import { Problem } from './components/Problem'
import { Trust } from './components/Trust'
import { Collection } from './components/Collection'
import { Pricing } from './components/Pricing'
import { Benefits } from './components/Benefits'
import { Guarantee } from './components/Guarantee'
import { Faq } from './components/Faq'
import { Footer } from './components/Footer'
import { StickyCta } from './components/StickyCta'

export default function App() {
  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <Nav />
      <main>
        <Hero />
        <ForWhom />
        <Problem />
        <Trust />
        <Collection />
        <Pricing />
        <Benefits />
        <Guarantee />
        <Faq />
      </main>
      <Footer />
      <StickyCta />
    </div>
  )
}
