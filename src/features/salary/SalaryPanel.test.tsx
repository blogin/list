import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { SalaryPanel } from '@/features/salary/SalaryPanel'

describe('SalaryPanel', () => {
  it('renders salary and budget values', () => {
    render(
      <SalaryPanel
        loading={false}
        salary={{ name: 'May', salary: 1000, backfire: 500 }}
        budget={{ allExpenses: 350, restOfMoney: 650, usesBackfire: false }}
      />,
    )

    expect(screen.getByText(/1[\s\u00a0]000\s*₽/)).toBeInTheDocument()
    expect(screen.getByText(/650\s*₽/)).toBeInTheDocument()
    expect(screen.getByText(/350\s*₽/)).toBeInTheDocument()
  })
})
