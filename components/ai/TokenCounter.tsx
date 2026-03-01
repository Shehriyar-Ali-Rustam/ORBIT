'use client'

interface TokenCounterProps {
  used: number
  limit: number
}

export function TokenCounter({ used, limit }: TokenCounterProps) {
  const percentage = Math.min((used / limit) * 100, 100)
  const isWarning = percentage >= 80
  const isMaxed = percentage >= 100

  const barColor = isMaxed
    ? 'bg-red-500'
    : isWarning
      ? 'bg-amber-500'
      : 'bg-[#FF751F]'

  return (
    <div className="flex items-center gap-3">
      <div className="text-right">
        <span className={`text-xs ${isMaxed ? 'text-red-400' : 'text-text-secondary'}`}>
          {used} / {limit} messages today
        </span>
      </div>
      <div className="h-1 w-20 overflow-hidden rounded-full bg-border">
        <div
          className={`h-full rounded-full transition-all duration-300 ${barColor}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
