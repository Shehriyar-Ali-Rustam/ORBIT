'use client'

import { useRef, useEffect } from 'react'
import Link from 'next/link'
import { MessageSquare, ShoppingBag, Star, Bell, CheckCheck } from 'lucide-react'
import { markNotificationRead, markAllNotificationsRead } from '@/lib/marketplace/mutations'
import type { Notification, NotificationType } from '@/types/marketplace'
import { cn } from '@/lib/utils'
import { formatDistanceToNow } from 'date-fns'

const TYPE_ICONS: Record<NotificationType, typeof Bell> = {
  message: MessageSquare,
  order: ShoppingBag,
  review: Star,
  system: Bell,
}

interface NotificationDropdownProps {
  notifications: Notification[]
  userId: string
  onClose: () => void
}

export function NotificationDropdown({ notifications, userId, onClose }: NotificationDropdownProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [onClose])

  const hasUnread = notifications.some((n) => !n.read)

  async function handleMarkAllRead() {
    await markAllNotificationsRead(userId)
  }

  async function handleClick(notification: Notification) {
    if (!notification.read) {
      await markNotificationRead(notification.id)
    }
    onClose()
  }

  return (
    <div
      ref={ref}
      className="absolute right-0 top-full z-50 mt-2 w-80 rounded-xl border border-border bg-surface shadow-xl"
    >
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <h3 className="text-sm font-bold text-text-primary">Notifications</h3>
        {hasUnread && (
          <button
            type="button"
            onClick={handleMarkAllRead}
            className="flex items-center gap-1 text-xs text-orange hover:underline"
          >
            <CheckCheck className="h-3 w-3" /> Mark all read
          </button>
        )}
      </div>

      <div className="max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="px-4 py-8 text-center">
            <Bell className="mx-auto mb-2 h-6 w-6 text-text-tertiary" />
            <p className="text-xs text-text-tertiary">No notifications yet</p>
          </div>
        ) : (
          notifications.slice(0, 20).map((notification) => {
            const Icon = TYPE_ICONS[notification.type]
            const sharedClassName = cn(
              'flex cursor-pointer gap-3 border-b border-border px-4 py-3 transition-colors hover:bg-background',
              !notification.read && 'bg-orange-dim/30'
            )

            const content = (
              <>
                <div className={cn(
                  'mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
                  !notification.read ? 'bg-orange/10 text-orange' : 'bg-surface text-text-tertiary'
                )}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className={cn('text-xs', !notification.read ? 'font-medium text-text-primary' : 'text-text-secondary')}>
                    {notification.title}
                  </p>
                  <p className="mt-0.5 truncate text-[10px] text-text-tertiary">{notification.message}</p>
                  <p className="mt-1 text-[10px] text-text-tertiary">
                    {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                  </p>
                </div>
                {!notification.read && <div className="mt-2 h-2 w-2 shrink-0 rounded-full bg-orange" />}
              </>
            )

            return notification.link ? (
              <Link
                key={notification.id}
                href={notification.link}
                onClick={() => handleClick(notification)}
                className={sharedClassName}
              >
                {content}
              </Link>
            ) : (
              <div
                key={notification.id}
                onClick={() => handleClick(notification)}
                className={sharedClassName}
              >
                {content}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
