import { motion } from 'framer-motion'
import { Check, Star } from 'lucide-react'
import { pricing } from '../data/content'
import { CtaButton } from './CtaButton'
import { fadeUp, stagger, viewportOnce } from '../lib/motion'

export function Pricing() {
  const { cards } = pricing
  const featured = cards.find((c) => c.highlight)!
  const others = cards.filter((c) => !c.highlight)

  return (
    <section id="precos" className="py-16 md:py-24 bg-surface border-y border-border">
      <div className="mx-auto max-w-6xl px-5">
        <motion.h2
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={fadeUp}
          className="text-3xl md:text-4xl font-semibold max-w-2xl"
        >
          {pricing.title}
        </motion.h2>
        <motion.p
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={fadeUp}
          className="mt-3 max-w-2xl text-muted-foreground"
        >
          {pricing.lead}
        </motion.p>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={fadeUp}
          className="mt-12 rounded-3xl border border-primary/30 bg-gradient-to-br from-primary-50 to-background p-6 md:p-10 shadow-[0_30px_60px_-40px_rgba(14,138,122,0.55)]"
        >
          <div className="flex flex-col lg:flex-row lg:items-center gap-8">
            <div className="flex-1">
              {featured.badge ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent text-white text-xs font-semibold">
                  <Star className="w-3.5 h-3.5" aria-hidden />
                  {featured.badge}
                </span>
              ) : null}
              <h3 className="mt-3 text-3xl md:text-4xl font-semibold">{featured.title}</h3>
              {featured.subtitle ? (
                <p className="mt-1 text-muted-foreground">{featured.subtitle}</p>
              ) : null}
              <ul className="mt-6 space-y-2">
                {featured.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2 text-sm md:text-base">
                    <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" aria-hidden />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="lg:w-80 p-6 rounded-2xl bg-surface border border-border">
              {featured.crossedPrice ? (
                <p className="text-sm text-muted-foreground line-through">{featured.crossedPrice}</p>
              ) : null}
              <p className="mt-1 text-4xl font-heading font-semibold text-primary-700">
                {featured.price}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">Pagamento único — acesso imediato</p>
              <CtaButton
                href={featured.cta.href}
                variant="primary"
                size="lg"
                className="mt-5 w-full"
              >
                {featured.cta.label}
              </CtaButton>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {others.map((c) => (
            <motion.article
              key={c.title}
              variants={fadeUp}
              className="p-6 rounded-3xl bg-background border border-border flex flex-col"
            >
              <h4 className="text-lg font-semibold">{c.title}</h4>
              {c.subtitle ? (
                <p className="mt-0.5 text-xs text-muted-foreground">{c.subtitle}</p>
              ) : null}
              <ul className="mt-4 space-y-1.5 text-sm flex-1">
                {c.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" aria-hidden />
                    <span className="text-muted-foreground">{b}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-5 flex items-baseline gap-2">
                {c.crossedPrice ? (
                  <span className="text-sm text-muted-foreground line-through">
                    {c.crossedPrice}
                  </span>
                ) : null}
                <span className="text-2xl font-heading font-semibold text-foreground">
                  {c.price}
                </span>
              </div>
              <CtaButton
                href={c.cta.href}
                variant="secondary"
                size="md"
                className="mt-4 w-full"
              >
                {c.cta.label}
              </CtaButton>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
