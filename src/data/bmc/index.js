import * as week1 from './week1'

// One entry per week file, merged in the shape content.js expects: { topics, learn, questions }.
const weeks = [week1]

export default {
  topics: Object.assign({}, ...weeks.map((w) => w.topics)),
  learn: weeks.flatMap((w) => w.learn),
  questions: weeks.flatMap((w) => w.questions),
}
