import { useParams } from 'react-router-dom'
import { getSubject } from './data/subjects'
import { scopedItems, scopedLearn } from './data/content'

// Which subject and week (or 'all') the current tool page is working on.
export function useScope() {
  const { subjectId, week } = useParams()
  const subject = getSubject(subjectId)
  return {
    subjectId,
    week,
    subject,
    valid: !!subject && (week === 'all' || subject.weeks.some((w) => w.n === Number(week))),
    items: scopedItems(subjectId, week),
    learn: scopedLearn(subjectId, week),
    label: week === 'all' ? 'All weeks' : `Week ${week}`,
  }
}
