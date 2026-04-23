import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { faq } from '../data/content'
import { fadeUp, stagger, viewportOnce } from '../lib/motion'

export function Faq() {
  return (
    <section id="faq" className="py-16 md:py-24 bg-surface border-y border-border">
      <div className="mx-auto max-w-3xl px-5">
        <motion.h2
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={fadeUp}
          className="text-3xl md:text-4xl font-semibold text-center"
        >
          {faq.title}
        </motion.h2>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="mt-10 space-y-3"
        >
          {faq.items.map((it) => (
            <motion.details
              key={it.q}
              variants={fadeUp}
              className="group rounded-2xl border border-border bg-background overflow-hidden"
            >
              <summary className="flex items-start justify-between gap-4 list-none cursor-pointer px-5 py-4 md:px-6 md:py-5 font-semibold">
                <span className="flex-1">{it.q}</span>
                <ChevronDown
                  className="w-5 h-5 mt-0.5 text-muted-foreground transition-transform group-open:rotate-180"
                  aria-hidden
                />
              </summary>
              <div className="px-5 md:px-6 pb-5 md:pb-6 text-sm md:text-base text-muted-foreground leading-relaxed">
                {it.a}
              </div>
            </motion.details>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
