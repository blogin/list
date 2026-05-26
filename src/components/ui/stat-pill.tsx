import { type VariantProps, cva } from 'class-variance-authority'

export const statPillVariants = cva(
  'inline-flex min-w-0 flex-1 flex-col rounded-lg border px-3 py-2 text-left',
  {
    variants: {
      tone: {
        budget: 'border-sky-200 bg-sky-50 text-sky-800',
        success: 'border-emerald-200 bg-emerald-50 text-emerald-800',
        expense: 'border-rose-200 bg-rose-50 text-rose-800',
        neutral: 'border-border bg-muted/40 text-foreground',
      },
    },
    defaultVariants: {
      tone: 'neutral',
    },
  },
)

export type StatPillTone = VariantProps<typeof statPillVariants>['tone']
