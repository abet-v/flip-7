import { motion } from 'framer-motion'
import { ShieldCheck } from 'lucide-react'
import { guarantee } from '../data/content'
import { fadeUp, viewportOnce } from '../lib/motion'

export function Guarantee() {
  return (
    <section className="py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-5">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={fadeUp}
          className="relative overflow-hidden rounded-3xl bg-foreground text-background p-8 md:p-12"
        >
          <div
            aria-hidden
            className="absolute -right-16 -top-16 w-64 h-64 rounded-full"
            style={{ background: 'radial-gradient(closest-side, rgba(14,138,122,0.35), transparent)' }}
          />
          <div className="relative flex flex-col md:flex-row items-start md:items-center gap-6">
            <span className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary text-white shrink-0">
              <ShieldCheck className="w-8 h-8" aria-hidden />
            </span>
            <div>
              <h3 className="text-2xl md:text-3xl font-semibold">{guarantee.title}</h3>
              <p className="mt-2 text-background/80 leading-relaxed max-w-2xl">{guarantee.body}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
