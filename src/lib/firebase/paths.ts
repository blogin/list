export const RTDB_PATHS = {
  salary: 'yearSalary',
  categories: 'db_opt',
  list: (periodKey: string) => `list/${periodKey}`,
} as const
