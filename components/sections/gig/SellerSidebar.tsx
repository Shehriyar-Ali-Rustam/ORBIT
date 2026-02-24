'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { User } from 'lucide-react'
import { Button } from '@/components/ui/Button'

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1]

interface SellerSidebarProps {
  sellerId: string
  sellerName: string
  sellerPhoto: string | null
}

export function SellerSidebar({ sellerId, sellerName, sellerPhoto }: SellerSidebarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2, ease }}
      className="rounded-xl border border-border bg-surface p-6"
    >
      {/* Seller info */}
      <div className="flex items-center gap-4">
        {sellerPhoto ? (
          <Image
            src={sellerPhoto}
            alt={sellerName}
            width={64}
            height={64}
            className="h-14 w-14 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-dim">
            <User className="h-6 w-6 text-orange" />
          </div>
        )}
        <div>
          <h3 className="font-semibold text-text-primary">{sellerName}</h3>
          <p className="text-xs text-text-tertiary">Seller</p>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-5 space-y-3">
        <Link href="/dashboard/messages" className="block">
          <Button variant="ghost" className="w-full" size="md">
            Contact Me
          </Button>
        </Link>
        <Link href={`/freelancers/${sellerId}`} className="block">
          <Button variant="outline" className="w-full" size="md">
            View Profile
          </Button>
        </Link>
      </div>
    </motion.div>
  )
}
