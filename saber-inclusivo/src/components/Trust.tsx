import { motion } from 'framer-motion'
import { Scale, Building2, Wrench } from 'lucide-react'
import { trust } from '../data/content'
import { fadeUp, stagger, viewportOnce } from '../lib/motion'

const icons = [Scale, Building2, Wrench]

export function Trust() {
  return (
    <section className="py-16 md:py-24 bg-surface border-y border-border">
      <div className="mx-auto max-w-6xl px-5">
        <motion.h2
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={fadeUp}
          className="text-3xl md:text-4xl font-semibold max-w-3xl"
        >
          {trust.title}
        </motion.h2>
        <motion.p
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={fadeUp}
          className="mt-4 max-w-3xl text-muted-foreground leading-relaxed"
        >
          {trust.lead}
        </motion.p>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {trust.pillars.map((p, i) => {
            const Icon = icons[i] ?? Scale
            return (
              <motion.article
                key={p.title}
                variants={fadeUp}
                className="p-6 rounded-3xl bg-background border border-border"
              >
                <span className="inline-flex w-11 h-11 items-center justify-center rounded-xl bg-primary-50 text-primary-700">
                  <Icon className="w-5 h-5" aria-hidden />
                </span>
                <h3 className="mt-4 text-xl font-semibold">{p.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{p.body}</p>
              </motion.article>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
