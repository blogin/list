import { Plus } from 'lucide-react'
import { useState } from 'react'
import type { Category } from '@/domain/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { useIsMobile } from '@/hooks/use-mobile'
import { useKeyboardInset } from '@/hooks/use-keyboard-inset'
import { cn } from '@/lib/utils'

interface AddItemFormProps {
  categories: Category[]
  onAdd: (input: { cost: string; name: string; sel: string }) => boolean
}

const formFieldClass = 'h-10 w-full text-sm'
const mobileFieldClass = 'h-11 w-full text-base'

function scrollFieldIntoView(event: React.FocusEvent<HTMLElement>) {
  requestAnimationFrame(() => {
    event.target.scrollIntoView({ block: 'center', behavior: 'smooth' })
  })
}

function AddItemFields({
  categories,
  onAdd,
  onSuccess,
  mobile = false,
}: AddItemFormProps & { onSuccess?: () => void; mobile?: boolean }) {
  const [cost, setCost] = useState('')
  const [name, setName] = useState('')
  const [sel, setSel] = useState('')

  function handleAdd() {
    const ok = onAdd({ cost, name, sel })
    if (ok) {
      setCost('')
      setName('')
      setSel('')
      onSuccess?.()
    }
  }

  const fieldClass = mobile ? mobileFieldClass : formFieldClass

  if (mobile) {
    return (
      <div className="space-y-3">
        <Input
          inputMode="numeric"
          placeholder="Цена"
          value={cost}
          onChange={(event) => setCost(event.target.value)}
          onFocus={scrollFieldIntoView}
          className={fieldClass}
        />
        <Input
          placeholder="Название"
          value={name}
          onChange={(event) => setName(event.target.value)}
          onFocus={scrollFieldIntoView}
          className={fieldClass}
        />
        <Select value={sel} onValueChange={setSel}>
          <SelectTrigger className={cn(fieldClass, '!h-11 py-0')} onFocus={scrollFieldIntoView}>
            <SelectValue placeholder="Категория" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.name} value={category.name}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button type="button" className="h-11 w-full" onClick={handleAdd}>
          <Plus className="size-4" />
          Добавить
        </Button>
      </div>
    )
  }

  return (
    <div className="grid items-center gap-2 md:grid-cols-[88px_minmax(0,1fr)_132px_auto]">
      <Input
        inputMode="numeric"
        placeholder="Цена"
        value={cost}
        onChange={(event) => setCost(event.target.value)}
        className={fieldClass}
      />
      <Input
        placeholder="Название"
        value={name}
        onChange={(event) => setName(event.target.value)}
        className={fieldClass}
      />
      <Select value={sel} onValueChange={setSel}>
        <SelectTrigger className={cn(formFieldClass, '!h-10 py-0')}>
          <SelectValue placeholder="Категория" />
        </SelectTrigger>
        <SelectContent>
          {categories.map((category) => (
            <SelectItem key={category.name} value={category.name}>
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button type="button" size="lg" className="h-10 px-4" onClick={handleAdd}>
        <Plus className="size-4" />
      </Button>
    </div>
  )
}

export function AddItemForm(props: AddItemFormProps) {
  const isMobile = useIsMobile()
  const [open, setOpen] = useState(false)
  const keyboardInset = useKeyboardInset(open)

  if (isMobile) {
    return (
      <>
        <Button
          type="button"
          variant="outline"
          className="h-11 w-full border-primary/30 text-primary"
          onClick={() => setOpen(true)}
        >
          <Plus className="size-4" />
          Добавить позицию
        </Button>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetContent
            side="bottom"
            className="max-h-[85dvh] overflow-y-auto rounded-t-xl"
            style={{ bottom: keyboardInset }}
            onOpenAutoFocus={(event) => event.preventDefault()}
          >
            <SheetHeader>
              <SheetTitle>Новая позиция</SheetTitle>
            </SheetHeader>
            <div className="px-4 pb-6">
              <AddItemFields {...props} mobile onSuccess={() => setOpen(false)} />
            </div>
            <SheetFooter />
          </SheetContent>
        </Sheet>
      </>
    )
  }

  return <AddItemFields {...props} />
}
