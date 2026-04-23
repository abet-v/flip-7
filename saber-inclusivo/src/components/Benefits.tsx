import { motion } from 'framer-motion'
import { Plus, Minus } from 'lucide-react'
import { benefits } from '../data/content'
import { fadeUp, stagger, viewportOnce } from '../lib/motion'

export function Benefits() {
  return (
    <section id="rotina" className="py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-5">
        <motion.h2
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={fadeUp}
          className="text-3xl md:text-4xl font-semibold max-w-3xl"
        >
          {benefits.title}
        </motion.h2>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-4">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            variants={fadeUp}
            className="p-6 md:p-8 rounded-3xl bg-primary-50 border border-primary/20"
          >
            <h3 className="flex items-center gap-2 text-xl font-semibold text-primary-700">
              <Plus className="w-5 h-5" aria-hidden />
              Mais
            </h3>
            <motion.ul
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={viewportOnce}
              className="mt-4 space-y-2.5"
            >
              {benefits.more.map((b) => (
                <motion.li
                  key={b}
                  variants={fadeUp}
                  className="flex items-start gap-2 text-sm md:text-base"
                >
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                  {b}
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            variants={fadeUp}
            className="p-6 md:p-8 rounded-3xl bg-accent-50 border border-accent/20"
          >
            <h3 className="flex items-center gap-2 text-xl font-semibold text-accent-600">
              <Minus className="w-5 h-5" aria-hidden />
              Menos
            </h3>
            <motion.ul
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={viewportOnce}
              className="mt-4 space-y-2.5"
            >
              {benefits.less.map((b) => (
                <motion.li
                  key={b}
                  variants={fadeUp}
                  className="flex items-start gap-2 text-sm md:text-base"
                >
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                  {b}
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
