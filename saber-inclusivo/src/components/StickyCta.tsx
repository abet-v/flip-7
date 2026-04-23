import { hero } from '../data/content'
import { CtaButton } from './CtaButton'

export function StickyCta() {
  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 z-30 p-3 bg-background/90 backdrop-blur border-t border-border">
      <CtaButton href={hero.primaryCta.href} variant="primary" size="lg" className="w-full">
        {hero.primaryCta.label}
      </CtaButton>
    </div>
  )
}
