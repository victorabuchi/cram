import * as week1 from './week1'
import * as exercise2 from './exercise2'
import { docs } from './docs'

// One entry per source file, merged in the shape content.js expects: { topics, learn, questions, docs }.
// Exercise 2 and the lecture PDFs (docs) come with the later lectures.
const parts = [week1, exercise2]

export default {
  topics: { ...Object.assign({}, ...parts.map((w) => w.topics ?? {})), 'bmc-ex2': 'Exercise 2' },
  learn: parts.flatMap((w) => w.learn ?? []),
  questions: parts.flatMap((w) => w.questions),
  docs,
}
