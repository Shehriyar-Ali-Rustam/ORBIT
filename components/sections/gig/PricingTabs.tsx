'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Clock, RefreshCw, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import type { PricingTier, TierPricing } from '@/types/marketplace'

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1]

const tiers: PricingTier[] = ['basic', 'standard', 'premium']

const tierLabels: Record<PricingTier, string> = {
  basic: 'Basic',
  standard: 'Standard',
  premium: 'Premium',
}

interface PricingTabsProps {
  pricing: Record<PricingTier, TierPricing>
  onOrder?: (tier: PricingTier) => void
}

export function PricingTabs({ pricing, onOrder }: PricingTabsProps) {
  const [activeTier, setActiveTier] = useState<PricingTier>('basic')
  const active = pricing[activeTier]

  return (
    <div className="sticky top-24 rounded-xl border border-border bg-surface">
      {/* Tab headers */}
      <div className="relative flex border-b border-border">
        {tiers.map((tier) => (
          <button
            key={tier}
            onClick={() => setActiveTier(tier)}
            className={cn(
              'relative flex-1 px-4 py-3 text-sm font-semibold uppercase tracking-wider transition-colors',
              tier === activeTier ? 'text-orange' : 'text-text-tertiary hover:text-text-secondary'
            )}
          >
            {tierLabels[tier]}
            {tier === activeTier && (
              <motion.div
                layoutId="pricing-tab-indicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange"
                transition={{ duration: 0.3, ease }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Tier content */}
      <div className="p-6">
        <motion.div
          key={activeTier}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease }}
        >
          {/* Title & description */}
          <h3 className="text-lg font-bold text-text-primary">{active.title}</h3>
          <p className="mt-1 text-sm leading-relaxed text-text-secondary">
            {active.description}
          </p>

          {/* Price */}
          <div className="mt-4">
            <span className="text-3xl font-black tracking-tight text-text-primary">
              ${active.price}
            </span>
          </div>

          {/* Delivery & revisions */}
          <div className="mt-4 flex items-center gap-6 text-sm text-text-secondary">
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-text-tertiary" />
              <span>{active.deliveryDays}-day delivery</span>
            </div>
            <div className="flex items-center gap-1.5">
              <RefreshCw className="h-4 w-4 text-text-tertiary" />
              <span>
                {active.revisions === -1 ? 'Unlimited' : active.revisions} revision
                {active.revisions !== 1 && 's'}
              </span>
            </div>
          </div>

          {/* Features */}
          {active.features.length > 0 && (
            <ul className="mt-5 space-y-2.5">
              {active.features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-text-secondary">
                  <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-orange" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          )}

          {/* CTA */}
          <Button
            className="mt-6 w-full"
            variant="primary"
            size="lg"
            onClick={() => onOrder?.(activeTier)}
          >
            Continue (${active.price})
          </Button>
        </motion.div>
      </div>
    </div>
  )
}
