import webprog from './content.json'
import bmc from './bmc/index.js'
import * as webprogWeek6 from './webprog/week6.js'
import * as jsSyntax from './webprog/jsSyntax.js'
import { docs as webprogDocs } from './webprog/docs.js'
import * as practiceSet from './webprog/practiceSet.js'
import * as prog2 from './prog2/index.js'
import { RELATED_IDS } from './webprog/practiceSet.js'
import { getSubject } from './subjects'

// One data file per subject, each { topics, learn, questions }. Topic keys must be unique across subjects.
const SOURCES = [webprog, jsSyntax, practiceSet, webprogWeek6, bmc, prog2]

export const TOPICS = Object.assign({}, ...SOURCES.map((s) => s.topics))
export const LEARN = SOURCES.flatMap((s) => s.learn)
// Web Programming I offers the Moodle practice-quiz questions, the code exercises and the related questions in practiceSet.js, nothing else.
const offered = (q) => q.subject !== 'webprog' || q.setNo || q.kind === 'code' || RELATED_IDS.has(q.id)
export const ITEMS = SOURCES.flatMap((s) => s.questions).filter(offered)
export const VARIANTS = SOURCES.flatMap((s) => s.variants ?? []) // practice variants of the exercise tasks
export const DOCS = [...SOURCES.flatMap((s) => s.docs ?? []), ...webprogDocs] // course PDFs, shown as they are

export const KIND_NAMES = {
  code: 'Write the function',
  fill: 'Code blanks',
  predict: 'Predict the output',
  mcq: 'Multiple choice',
  explain: 'Explain the code',
  paper: 'Pen and paper',
}

// week is a number, or 'all' for every week of the subject
export function inScope(item, subjectId, week) {
  const subject = getSubject(subjectId)
  if (item.subject !== subjectId || !subject?.weeks.some((w) => w.n === item.week)) return false
  return week === 'all' || item.week === Number(week)
}

export const scopedItems = (subjectId, week) => ITEMS.filter((i) => inScope(i, subjectId, week))
export const scopedVariants = (subjectId, week) => VARIANTS.filter((v) => v.subject === subjectId && (week === 'all' || v.week === Number(week)))
export const scopedDocs = (subjectId, week) => DOCS.filter((d) => inScope(d, subjectId, week))
export const scopedLearn = (subjectId, week) => LEARN.filter((c) => inScope(c, subjectId, week))

export const topicsIn = (items) => Object.keys(TOPICS).filter((k) => items.some((i) => i.topic === k))
