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

interface AddItemFormProps {
  categories: Category[]
  onAdd: (input: { cost: string; name: string; sel: string }) => boolean
}

export function AddItemForm({ categories, onAdd }: AddItemFormProps) {
  const [cost, setCost] = useState('')
  const [name, setName] = useState('')
  const [sel, setSel] = useState('')

  function handleAdd() {
    const ok = onAdd({ cost, name, sel })
    if (ok) {
      setCost('')
      setName('')
      setSel('')
    }
  }

  return (
    <div className="grid gap-2 md:grid-cols-[100px_1fr_140px_auto]">
      <Input
        inputMode="numeric"
        placeholder="Цена"
        value={cost}
        onChange={(event) => setCost(event.target.value)}
        className="h-11"
      />
      <Input
        placeholder="Название"
        value={name}
        onChange={(event) => setName(event.target.value)}
        className="h-11"
      />
      <Select value={sel} onValueChange={setSel}>
        <SelectTrigger className="h-11 w-full">
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
      <Button type="button" className="h-11" onClick={handleAdd}>
        +
      </Button>
    </div>
  )
}
