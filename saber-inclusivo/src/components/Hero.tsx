import { motion } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'
import { hero } from '../data/content'
import { CtaButton } from './CtaButton'
import { fadeUp, stagger, viewportOnce } from '../lib/motion'

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 -z-10 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 40% at 90% 0%, rgba(14,138,122,0.12), transparent 60%), radial-gradient(ellipse 50% 40% at 0% 100%, rgba(242,106,79,0.10), transparent 60%)',
        }}
      />
      <div className="mx-auto max-w-6xl px-5 pt-10 pb-16 md:pt-20 md:pb-28">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="max-w-3xl"
        >
          <motion.span
            variants={fadeUp}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-50 text-primary-700 text-xs font-semibold tracking-wide uppercase"
          >
            {hero.kicker}
          </motion.span>

          <motion.h1
            variants={fadeUp}
            className="mt-5 text-4xl sm:text-5xl md:text-[56px] font-semibold"
            style={{ fontSize: 'clamp(2rem, 5vw + 1rem, 3.5rem)' }}
          >
            {hero.title}
          </motion.h1>

          <motion.p variants={fadeUp} className="mt-5 text-lg text-muted-foreground leading-relaxed">
            {hero.subtitle}
          </motion.p>

          <motion.p
            variants={fadeUp}
            className="mt-4 text-base md:text-lg leading-relaxed"
          >
            <span className="font-semibold">Aqui você não encontra apostilas soltas.</span>{' '}
            Você encontra <em className="not-italic text-primary-700 font-semibold">documentos estruturantes</em>, pensados para planejar, registrar, formalizar e proteger o trabalho pedagógico.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-8 flex flex-wrap gap-3">
            <CtaButton href={hero.primaryCta.href} variant="primary" size="lg">
              {hero.primaryCta.label}
            </CtaButton>
            <CtaButton
              href={hero.secondaryCta.href}
              variant="ghost"
              size="lg"
              external={false}
              withIcon={false}
            >
              {hero.secondaryCta.label}
            </CtaButton>
          </motion.div>

          <motion.ul
            variants={fadeUp}
            className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm"
          >
            {[
              'Base legal: LBI, ECA, BNCC, LGPD',
              'Garantia de 7 dias',
              'Acesso imediato por email',
            ].map((t) => (
              <li key={t} className="flex items-center gap-2 text-muted-foreground">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0" aria-hidden />
                {t}
              </li>
            ))}
          </motion.ul>
        </motion.div>
      </div>

      {/* decorative shapes — hidden on small screens for perf */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={viewportOnce}
        transition={{ duration: 0.6 }}
        className="hidden lg:block absolute right-8 top-24 w-[420px] h-[420px] pointer-events-none"
      >
        <svg viewBox="0 0 420 420" className="w-full h-full">
          <defs>
            <linearGradient id="g1" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0" stopColor="#0E8A7A" stopOpacity="0.15" />
              <stop offset="1" stopColor="#F26A4F" stopOpacity="0.12" />
            </linearGradient>
          </defs>
          <circle cx="210" cy="210" r="200" fill="url(#g1)" />
          <g transform="translate(100 110)" opacity="0.9">
            <rect width="220" height="200" rx="18" fill="#FFFFFF" stroke="#E7E0D5" />
            <rect x="22" y="28" width="120" height="10" rx="5" fill="#0E8A7A" opacity="0.6" />
            <rect x="22" y="50" width="170" height="6" rx="3" fill="#52606D" opacity="0.35" />
            <rect x="22" y="66" width="140" height="6" rx="3" fill="#52606D" opacity="0.35" />
            <rect x="22" y="94" width="80" height="8" rx="4" fill="#F26A4F" opacity="0.7" />
            <rect x="22" y="114" width="170" height="6" rx="3" fill="#52606D" opacity="0.25" />
            <rect x="22" y="130" width="150" height="6" rx="3" fill="#52606D" opacity="0.25" />
            <rect x="22" y="146" width="120" height="6" rx="3" fill="#52606D" opacity="0.25" />
            <circle cx="180" cy="178" r="14" fill="#0E8A7A" />
            <path d="M174 178 l5 5 l9 -10" stroke="#FFFFFF" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          </g>
        </svg>
      </motion.div>
    </section>
  )
}
