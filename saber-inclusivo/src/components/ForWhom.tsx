import { motion } from 'framer-motion'
import { UserRound } from 'lucide-react'
import { forWhom } from '../data/content'
import { fadeUp, stagger, viewportOnce } from '../lib/motion'

export function ForWhom() {
  return (
    <section className="py-16 md:py-24 bg-surface border-y border-border">
      <div className="mx-auto max-w-6xl px-5">
        <motion.h2
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={fadeUp}
          className="text-3xl md:text-4xl font-semibold max-w-2xl"
        >
          {forWhom.title}
        </motion.h2>
        <motion.p
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={fadeUp}
          className="mt-3 text-muted-foreground"
        >
          {forWhom.intro}
        </motion.p>

        <motion.ul
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
        >
          {forWhom.items.map((it) => (
            <motion.li
              key={it}
              variants={fadeUp}
              className="flex items-start gap-3 p-4 rounded-2xl bg-background border border-border"
            >
              <span className="mt-0.5 inline-flex items-center justify-center w-8 h-8 rounded-lg bg-primary-50 text-primary-700 shrink-0">
                <UserRound className="w-4 h-4" aria-hidden />
              </span>
              <span className="text-sm md:text-base leading-relaxed">{it}</span>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  )
}
