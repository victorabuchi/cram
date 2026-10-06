import content from './content.json'
import { getSubject } from './subjects'

export const TOPICS = content.topics
export const LEARN = content.learn
export const ITEMS = content.questions

export const KIND_NAMES = {
  fill: 'Code blanks',
  predict: 'Predict the output',
  mcq: 'Multiple choice',
  explain: 'Explain the code',
}

// week is a number, or 'all' for every week of the subject
export function inScope(item, subjectId, week) {
  const subject = getSubject(subjectId)
  if (!subject?.weeks.some((w) => w.n === item.week)) return false
  return week === 'all' || item.week === Number(week)
}

export const scopedItems = (subjectId, week) => ITEMS.filter((i) => inScope(i, subjectId, week))
export const scopedLearn = (subjectId, week) => LEARN.filter((c) => inScope(c, subjectId, week))

export const topicsIn = (items) => Object.keys(TOPICS).filter((k) => items.some((i) => i.topic === k))
