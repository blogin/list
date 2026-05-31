import { useState } from 'react'
import { toast } from 'sonner'
import { Calculator } from 'lucide-react'
import { getCurrentSalaryMonthName } from '@/domain/list-period'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ADVANCE_GROSS_RATIO, BONUS_COEFFICIENT_OPTIONS } from '@/domain/salary-projection'
import { useSaveSalaryMutation } from '@/features/admin/hooks'
import { useSalaryCalculator } from '@/features/salary-calculator/useSalaryCalculator'
import { formatMoney, formatIntegerWithSpaces, formatSalaryMonthName, parseDigitsOnly } from '@/lib/format'
import { cn } from '@/lib/utils'

export function SalaryCalculatorPage() {
  const {
    okladDigits,
    setOkladDigits,
    bonusCoefficient,
    setBonusCoefficient,
    projection,
    salaryRows,
    hasValidOklad,
  } = useSalaryCalculator()
  const saveMutation = useSaveSalaryMutation()
  const [confirmOpen, setConfirmOpen] = useState(false)
  const currentMonthName = getCurrentSalaryMonthName()

  async function applyToDatabase() {
    try {
      await saveMutation.mutateAsync(salaryRows)
      toast.success('Зарплата записана в yearSalary')
      setConfirmOpen(false)
    } catch {
      toast.error('Не удалось сохранить зарплату')
    }
  }

  return (
    <div className="mx-auto max-w-5xl space-y-4 p-4 md:p-6">
      <div>
        <h2 className="text-lg font-semibold md:text-xl">Калькулятор зарплаты</h2>
        <p className="text-sm text-muted-foreground">
          Аванс 25-го — 40% оклада без НДФЛ. Премия за квартал — в авансе следующего месяца
          (апр / июл / окт / янв). Зап.плата 10-го — остаток net за месяц. Прогрессивный НДФЛ.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base md:text-lg">
            <Calculator className="size-4" />
            Месячный оклад
          </CardTitle>
          <CardDescription>
            Оклад до вычета налогов и коэффициент квартальной премии от оклада.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap items-end gap-3">
            <div className="space-y-1.5">
              <label className="text-sm font-medium" htmlFor="oklad-input">
                Оклад
              </label>
              <Input
                id="oklad-input"
                inputMode="numeric"
                placeholder="Например, 470 588"
                value={formatIntegerWithSpaces(okladDigits)}
                onChange={(event) => setOkladDigits(parseDigitsOnly(event.target.value))}
                className="h-10 w-full max-w-xs tabular-nums"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium" htmlFor="bonus-coef">
                Премия, × оклад
              </label>
              <Select
                value={String(bonusCoefficient)}
                onValueChange={(value) =>
                  setBonusCoefficient(Number(value) as (typeof BONUS_COEFFICIENT_OPTIONS)[number])
                }
              >
                <SelectTrigger id="bonus-coef" className="h-10 w-[120px]">
                  <SelectValue placeholder="Нет" />
                </SelectTrigger>
                <SelectContent>
                  {BONUS_COEFFICIENT_OPTIONS.map((option) => (
                    <SelectItem key={option} value={String(option)}>
                      {option === 0 ? 'Нет' : option === 1 ? '1.0' : option.toFixed(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {hasValidOklad ? (
              <ApplyToDatabaseDialog
                open={confirmOpen}
                onOpenChange={setConfirmOpen}
                pending={saveMutation.isPending}
                onConfirm={() => void applyToDatabase()}
              />
            ) : null}
          </div>
        </CardContent>
      </Card>

      {hasValidOklad ? (
        <>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            <SummaryPill label="Gross за год" value={formatMoney(projection.totalGross)} />
            <SummaryPill label="Премии за год" value={formatMoney(projection.totalBonusNet)} />
            <SummaryPill label="НДФЛ за год" value={formatMoney(projection.totalTax)} />
            <SummaryPill
              label="На руки за год"
              value={`${formatMoney(projection.totalNet)} (${projection.effectiveRate}%)`}
            />
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead>Месяц</TableHead>
                      <TableHead className="text-right">Зап.плата 10-го</TableHead>
                      <TableHead className="text-right">Аванс 25-го</TableHead>
                      <TableHead className="text-right">Премия</TableHead>
                      <TableHead className="text-right">Всего</TableHead>
                      <TableHead className="text-right">НДФЛ</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {projection.months.map((row) => {
                      const isCurrentMonth = row.name === currentMonthName
                      const totalNet = row.salary + row.grossBackfire + row.bonusNet
                      const totalGross = row.grossSalary + row.grossBackfire + row.grossBonus
                      return (
                      <TableRow
                        key={row.name}
                        className={cn(isCurrentMonth && 'bg-muted/50')}
                        aria-current={isCurrentMonth ? 'true' : undefined}
                      >
                        <TableCell className="font-medium">{formatSalaryMonthName(row.name)}</TableCell>
                        <TableCell>
                          <NetPaymentCell net={row.salary} grossParts={[row.grossSalary]} />
                        </TableCell>
                        <TableCell>
                          <NetPaymentCell
                            net={row.grossBackfire}
                            grossParts={[row.grossBackfire]}
                            subtitle={`${ADVANCE_GROSS_RATIO * 100}% оклада`}
                          />
                        </TableCell>
                        <TableCell>
                          {row.grossBonus > 0 ? (
                            <NetPaymentCell net={row.bonusNet} grossParts={[row.grossBonus]} />
                          ) : (
                            <div className="text-right text-muted-foreground">—</div>
                          )}
                        </TableCell>
                        <TableCell>
                          <NetPaymentCell net={totalNet} grossParts={[totalGross]} />
                        </TableCell>
                        <TableCell className="text-right tabular-nums text-muted-foreground">
                          {formatMoney(row.taxSalary + row.taxBackfire)}
                        </TableCell>
                      </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

        </>
      ) : null}
    </div>
  )
}

function NetPaymentCell({
  net,
  grossParts,
  hideGrossWhenSameAsNet = false,
  subtitle,
}: {
  net: number
  grossParts: number[]
  hideGrossWhenSameAsNet?: boolean
  subtitle?: string
}) {
  const grossSum = grossParts.reduce((sum, part) => sum + part, 0)
  const showGross =
    !subtitle &&
    grossParts.length > 0 &&
    !(hideGrossWhenSameAsNet && grossParts.length === 1 && grossSum === net)

  return (
    <div className="tabular-nums text-right">
      <div className="font-semibold">{formatMoney(net)}</div>
      {subtitle ? (
        <div className="mt-0.5 text-xs text-muted-foreground">{subtitle}</div>
      ) : showGross ? (
        <div className="mt-0.5 text-xs text-muted-foreground">
          {grossParts.map((part) => formatIntegerWithSpaces(part)).join(' + ')}
        </div>
      ) : null}
    </div>
  )
}

function ApplyToDatabaseDialog({
  open,
  onOpenChange,
  pending,
  onConfirm,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  pending: boolean
  onConfirm: () => void
}) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogTrigger asChild>
        <Button type="button" className="h-10 shrink-0" disabled={pending}>
          Применить в базу
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Записать в yearSalary?</AlertDialogTitle>
          <AlertDialogDescription>
            Текущие значения зарплаты и аванса в Firebase будут заменены рассчитанными суммами для
            всех 12 месяцев.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Отмена</AlertDialogCancel>
          <AlertDialogAction
            disabled={pending}
            onClick={(event) => {
              event.preventDefault()
              onConfirm()
            }}
          >
            {pending ? 'Сохранение…' : 'Записать'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

function SummaryPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border bg-card px-3 py-2">
      <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="truncate text-base font-semibold tabular-nums">{value}</p>
    </div>
  )
}
