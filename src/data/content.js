import webprog from './content.json'
import bmc from './bmc/index.js'
import * as webprogWeek6 from './webprog/week6.js'
import { getSubject } from './subjects'

// One data file per subject, each { topics, learn, questions }. Topic keys must be unique across subjects.
const SOURCES = [webprog, webprogWeek6, bmc]

export const TOPICS = Object.assign({}, ...SOURCES.map((s) => s.topics))
export const LEARN = SOURCES.flatMap((s) => s.learn)
export const ITEMS = SOURCES.flatMap((s) => s.questions)

export const KIND_NAMES = {
  fill: 'Code blanks',
  predict: 'Predict the output',
  mcq: 'Multiple choice',
  explain: 'Explain the code',
}

// week is a number, or 'all' for every week of the subject
export function inScope(item, subjectId, week) {
  const subject = getSubject(subjectId)
  if (item.subject !== subjectId || !subject?.weeks.some((w) => w.n === item.week)) return false
  return week === 'all' || item.week === Number(week)
}

export const scopedItems = (subjectId, week) => ITEMS.filter((i) => inScope(i, subjectId, week))
export const scopedLearn = (subjectId, week) => LEARN.filter((c) => inScope(c, subjectId, week))

export const topicsIn = (items) => Object.keys(TOPICS).filter((k) => items.some((i) => i.topic === k))
