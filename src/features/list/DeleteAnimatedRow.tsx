import { useEffect, useRef, type ReactNode } from 'react'
import { TableRow } from '@/components/ui/table'
import { cn } from '@/lib/utils'

function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

interface DeleteAnimatedBlockProps {
  exiting: boolean
  onExitComplete: () => void
  className?: string
  children: ReactNode
}

export function DeleteAnimatedBlock({
  exiting,
  onExitComplete,
  className,
  children,
}: DeleteAnimatedBlockProps) {
  const handledRef = useRef(false)

  useEffect(() => {
    if (!exiting) {
      handledRef.current = false
      return
    }

    if (prefersReducedMotion()) {
      if (!handledRef.current) {
        handledRef.current = true
        onExitComplete()
      }
    }
  }, [exiting, onExitComplete])

  function handleAnimationEnd(event: React.AnimationEvent<HTMLDivElement>) {
    if (event.animationName !== 'expense-row-exit' || handledRef.current) return
    handledRef.current = true
    onExitComplete()
  }

  return (
    <div
      className={cn(
        'grid transition-[grid-template-rows] duration-300 ease-out',
        exiting ? 'grid-rows-[0fr]' : 'grid-rows-[1fr]',
      )}
    >
      <div className="min-h-0 overflow-hidden">
        <div
          className={cn(className, exiting && 'animate-expense-row-exit')}
          onAnimationEnd={handleAnimationEnd}
        >
          {children}
        </div>
      </div>
    </div>
  )
}

interface DeleteAnimatedTableRowProps {
  exiting: boolean
  onExitComplete: () => void
  className?: string
  children: ReactNode
}

export function DeleteAnimatedTableRow({
  exiting,
  onExitComplete,
  className,
  children,
}: DeleteAnimatedTableRowProps) {
  const handledRef = useRef(false)

  useEffect(() => {
    if (!exiting) {
      handledRef.current = false
      return
    }

    if (prefersReducedMotion()) {
      if (!handledRef.current) {
        handledRef.current = true
        onExitComplete()
      }
    }
  }, [exiting, onExitComplete])

  function handleAnimationEnd(event: React.AnimationEvent<HTMLTableRowElement>) {
    if (event.animationName !== 'expense-row-exit' || handledRef.current) return
    handledRef.current = true
    onExitComplete()
  }

  return (
    <TableRow
      className={cn(className, exiting && 'animate-expense-row-exit')}
      onAnimationEnd={handleAnimationEnd}
    >
      {children}
    </TableRow>
  )
}

export function makeExpenseItemKey(item: { name: string; cost: string; sel: string }, index: number) {
  return `${index}:${item.cost}:${item.name}:${item.sel}`
}
