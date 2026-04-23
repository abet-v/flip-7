import { motion } from 'framer-motion'
import { AlertTriangle, Frown } from 'lucide-react'
import { problem } from '../data/content'
import { fadeUp, stagger, viewportOnce } from '../lib/motion'

export function Problem() {
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-5">
        <motion.h2
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={fadeUp}
          className="text-3xl md:text-4xl font-semibold max-w-3xl"
        >
          {problem.title}
        </motion.h2>
        <motion.p
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={fadeUp}
          className="mt-3 text-muted-foreground"
        >
          {problem.lead}
        </motion.p>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-5 gap-6 items-stretch">
          <motion.ul
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-3"
          >
            {problem.pains.map((p) => (
              <motion.li
                key={p}
                variants={fadeUp}
                className="flex items-start gap-3 p-4 rounded-2xl bg-surface border border-border"
              >
                <AlertTriangle className="w-5 h-5 mt-0.5 text-accent shrink-0" aria-hidden />
                <span className="text-sm md:text-base">{p}</span>
              </motion.li>
            ))}
          </motion.ul>

          <motion.aside
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            variants={fadeUp}
            className="md:col-span-2 p-6 rounded-3xl bg-foreground text-background"
          >
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <Frown className="w-5 h-5" aria-hidden />
              {problem.resultTitle}
            </h3>
            <ul className="mt-4 space-y-2 text-sm">
              {problem.results.map((r) => (
                <li key={r} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                  {r}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm text-background/75 leading-relaxed">
              Cada um destes pontos tem uma causa comum: falta de processo e de registro. É exatamente aí que a coleção atua.
            </p>
          </motion.aside>
        </div>
      </div>
    </section>
  )
}
