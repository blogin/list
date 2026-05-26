import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ActionBarProps {
  saving: boolean
  onSave: () => void
  onShowList: () => void
  onReset: () => void
  className?: string
}

export function ActionBar({
  saving,
  onSave,
  onShowList,
  onReset,
  className,
}: ActionBarProps) {
  return (
    <div
      className={cn(
        'flex flex-wrap gap-2',
        'md:static md:border-0 md:bg-transparent md:p-0',
        'fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur supports-[backdrop-filter]:bg-background/80',
        className,
      )}
    >
      <Button className="h-11 flex-1 md:flex-none" disabled={saving} onClick={onSave}>
        {saving ? 'Сохранение...' : 'Сохранить'}
      </Button>
      <Button className="h-11 flex-1 md:flex-none" variant="secondary" onClick={onShowList}>
        Список
      </Button>
      <Button className="h-11 flex-1 md:flex-none" variant="outline" onClick={onReset}>
        Сбросить
      </Button>
    </div>
  )
}
