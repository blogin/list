import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import type { SalaryMonth } from '@/domain/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useAdminSalaryQuery, useSaveSalaryMutation } from '@/features/admin/hooks'

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const

function normalizeSalaryRows(rows: SalaryMonth[]): SalaryMonth[] {
  const byName = new Map(rows.map((row) => [row.name, row]))

  return MONTH_NAMES.map((name) => {
    const existing = byName.get(name)
    return {
      name,
      salary: existing?.salary ?? 0,
      backfire: existing?.backfire ?? 0,
    }
  })
}

export function SalaryAdminPanel() {
  const salaryQuery = useAdminSalaryQuery()
  const saveMutation = useSaveSalaryMutation()
  const [draft, setDraft] = useState<SalaryMonth[]>([])

  useEffect(() => {
    if (salaryQuery.data) {
      setDraft(normalizeSalaryRows(salaryQuery.data))
    }
  }, [salaryQuery.data])

  function updateRow(index: number, patch: Partial<SalaryMonth>) {
    setDraft((current) =>
      current.map((row, i) => (i === index ? { ...row, ...patch } : row)),
    )
  }

  async function save() {
    try {
      await saveMutation.mutateAsync(draft)
      toast.success('Зарплата сохранена')
    } catch {
      toast.error('Не удалось сохранить зарплату')
    }
  }

  if (salaryQuery.isLoading) {
    return <Skeleton className="h-96 w-full rounded-lg" />
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Зарплата и аванс</CardTitle>
        <CardDescription>
          Узел <code className="text-xs">yearSalary</code> — зап.плата до 14-го числа, аванс после.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="overflow-hidden rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Месяц</TableHead>
                <TableHead>Зап.плата</TableHead>
                <TableHead>Аванс</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {draft.map((row, index) => (
                <TableRow key={row.name}>
                  <TableCell className="font-medium">{row.name}</TableCell>
                  <TableCell>
                    <Input
                      inputMode="decimal"
                      value={row.salary}
                      onChange={(event) =>
                        updateRow(index, { salary: Number(event.target.value) || 0 })
                      }
                      className="h-10 max-w-36"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      inputMode="decimal"
                      value={row.backfire}
                      onChange={(event) =>
                        updateRow(index, { backfire: Number(event.target.value) || 0 })
                      }
                      className="h-10 max-w-36"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <Button
          type="button"
          className="h-10"
          disabled={saveMutation.isPending}
          onClick={() => void save()}
        >
          {saveMutation.isPending ? 'Сохранение…' : 'Сохранить зарплату'}
        </Button>
      </CardContent>
    </Card>
  )
}
