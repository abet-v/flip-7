import { motion } from 'framer-motion'
import {
  FileText,
  ShieldCheck,
  ClipboardList,
  UserCheck,
  BookOpen,
  NotebookPen,
  Briefcase,
  Compass,
  Users,
  LineChart,
  ArrowUpRight,
} from 'lucide-react'
import { collection, HOTMART } from '../data/content'
import { fadeUp, stagger, viewportOnce } from '../lib/motion'

const iconMap = {
  FileText,
  ShieldCheck,
  ClipboardList,
  UserCheck,
  BookOpen,
  NotebookPen,
  Briefcase,
  Compass,
  Users,
  LineChart,
}

export function Collection() {
  return (
    <section id="colecao" className="py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-5">
        <motion.h2
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={fadeUp}
          className="text-3xl md:text-4xl font-semibold max-w-2xl"
        >
          {collection.title}
        </motion.h2>
        <motion.p
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={fadeUp}
          className="mt-3 max-w-2xl text-muted-foreground"
        >
          {collection.lead}
        </motion.p>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {collection.items.map((m) => {
            const Icon = iconMap[m.icon]
            const href = HOTMART[m.key]
            return (
              <motion.a
                key={m.key}
                variants={fadeUp}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="group p-6 rounded-3xl bg-surface border border-border hover:border-primary hover:-translate-y-1 hover:shadow-[0_20px_40px_-25px_rgba(14,138,122,0.45)] transition-all duration-200 flex flex-col"
              >
                <span className="inline-flex w-11 h-11 items-center justify-center rounded-xl bg-primary-50 text-primary-700 group-hover:bg-primary group-hover:text-white transition-colors">
                  <Icon className="w-5 h-5" aria-hidden />
                </span>
                <h3 className="mt-4 text-lg font-semibold leading-snug">{m.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed flex-1">
                  {m.summary}
                </p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-accent group-hover:text-accent-600">
                  Comprar avulso
                  <ArrowUpRight className="w-4 h-4" aria-hidden />
                </span>
              </motion.a>
            )
          })}
        </motion.div>

        <p className="mt-6 text-xs text-muted-foreground">
          Valor avulso: R$ 36,90 cada. Combine materiais em combos para pagar menos.
        </p>
      </div>
    </section>
  )
}
