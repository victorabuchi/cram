import webprog from './content.json'
import bmc from './bmc/index.js'
import * as webprogWeek6 from './webprog/week6.js'
import * as jsSyntax from './webprog/jsSyntax.js'
import { docs as webprogDocs } from './webprog/docs.js'
import * as practiceSet from './webprog/practiceSet.js'
import * as extraSet from './webprog/extraSet.js'
import * as prog2 from './prog2/index.js'
import { getSubject } from './subjects'

// One data file per subject, each { topics, learn, questions }. Topic keys must be unique across subjects.
const SOURCES = [webprog, jsSyntax, practiceSet, extraSet, webprogWeek6, bmc, prog2]

export const TOPICS = Object.assign({}, ...SOURCES.map((s) => s.topics))
export const LEARN = SOURCES.flatMap((s) => s.learn)
// Web Programming I offers the question set (its Practice), the Moodle practice-quiz questions (the Practice quiz quiz)
// and the code exercises. The older question bank stays in the data files but is not offered.
const offered = (q) => q.subject !== 'webprog' || q.setNo || q.listNo || q.kind === 'code'
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
// The questions a course practises and counts on its cards and Progress page: all of them, or only its practice set
// (Web Programming I: the questions of the question set).
export function practiceItems(subjectId, week) {
  const subject = getSubject(subjectId)
  return scopedItems(subjectId, week).filter((i) => !subject?.practiceKey || (i.kind !== 'code' && i[subject.practiceKey]))
}
export const scopedLearn = (subjectId, week) => LEARN.filter((c) => inScope(c, subjectId, week))

export const topicsIn = (items) => Object.keys(TOPICS).filter((k) => items.some((i) => i.topic === k))

// The fixed question sets shown in Moodle order: the Moodle "Practice quiz" and the question set. `key` is the question-number field of the set.
export const QUESTION_SETS = {
  practice: {
    key: 'setNo',
    title: 'Practice quiz',
    quizPath: 'test',
    intro: 'The official practice questions from Moodle, in the same order. They are made to get you familiar with the format and question types, not to represent the question set questions, and they may be shorter and simpler. Multiple-choice questions are checked for you; the open code-explanation questions are for your own practice and self-reflection: compare your answer with the model answer and tick the points you covered.',
  },
  real: {
    key: 'listNo',
    title: 'Question set',
    listTitle: 'Question set',
    quizPath: 'question-set',
    listPath: 'question-list',
    intro: 'The Web Programming I question set, all {n} questions in the test order. Answer them like in the test: no feedback until the end. Multiple-choice questions are checked for you; for the open questions, compare your answer with the model answer and tick the points you covered.',
    listIntro: 'The question set, all {n} questions in the test order, with the options in the same order as in Moodle. Read them, then show the answer.',
  },
}
