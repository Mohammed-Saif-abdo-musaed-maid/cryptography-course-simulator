import type { Category, SecurityStatus } from '../../types'
import { useI18n } from '../../i18n'

export function StatusBadge({ status }: { status?: SecurityStatus }) {
  const { t } = useI18n()
  if (!status) return null
  const label = t(`status.${status}`)
  return <span className={`badge badge-${status}`}>{label}</span>
}

export function CategoryBadge({ category }: { category?: Category }) {
  const { t } = useI18n()
  if (!category) return null
  return <span className={`badge badge-category`}>{t(`category.${category}`)}</span>
}