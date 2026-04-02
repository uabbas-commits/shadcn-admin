export type WorkerStatus = 'verified' | 'pending' | 'unverified'
export type WorkerState = 'active' | 'inactive' | 'blocked'

export type Worker = {
  pk: number
  name: string
  phone: string
  status: WorkerStatus
  violations: number
  blocks: number
  state: WorkerState
  dateJoined: string
}

export const workers: Worker[] = [
  {
    pk: 181,
    name: 'Shehab Eldin ghazy',
    phone: '+965902020',
    status: 'verified',
    violations: 2,
    blocks: 0,
    state: 'active',
    dateJoined: 'March 13, 2026, 3:57 a.m.',
  },
  {
    pk: 127,
    name: 'Milton Sheikh',
    phone: '+965902020',
    status: 'pending',
    violations: 6,
    blocks: 1,
    state: 'inactive',
    dateJoined: 'March 13, 2026, 3:57 a.m.',
  },
  {
    pk: 328,
    name: 'Forhad',
    phone: '+965902020',
    status: 'unverified',
    violations: 1,
    blocks: 2,
    state: 'blocked',
    dateJoined: 'March 13, 2026, 3:57 a.m.',
  },
]

export const statusLabels: Record<WorkerStatus, string> = {
  verified: 'Verified',
  pending: 'Pending',
  unverified: 'Unverified',
}

export const statusBadgeClasses: Record<WorkerStatus, string> = {
  verified:
    'rounded-full border-0 bg-emerald-100 px-2.5 py-0.5 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200',
  pending:
    'rounded-full border-0 bg-amber-100 px-2.5 py-0.5 text-amber-700 dark:bg-amber-500/20 dark:text-amber-200',
  unverified:
    'rounded-full border-0 bg-slate-100 px-2.5 py-0.5 text-slate-600 dark:bg-slate-500/20 dark:text-slate-200',
}

export const stateLabels: Record<WorkerState, string> = {
  active: 'Active',
  inactive: 'Inactive',
  blocked: 'Blocked',
}

export const stateBadgeClasses: Record<WorkerState, string> = {
  active:
    'rounded-full border-0 bg-emerald-100 px-2.5 py-0.5 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200',
  inactive:
    'rounded-full border-0 bg-slate-100 px-2.5 py-0.5 text-slate-600 dark:bg-slate-500/20 dark:text-slate-200',
  blocked:
    'rounded-full border-0 bg-red-100 px-2.5 py-0.5 text-red-700 dark:bg-red-500/20 dark:text-red-200',
}

export function getWorkerByPk(pk: number | undefined) {
  if (pk === undefined) return undefined
  return workers.find((w) => w.pk === pk)
}
