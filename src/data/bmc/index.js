import * as exercise1 from './exercise1'
import * as exercise2 from './exercise2'
import * as exercise3 from './exercise3'
import { docs } from './docs'
import { explain } from './explain'

// Basic Models of Computation: the lecture PDFs (docs, shown by Learn) and the exercise tasks. No learn cards.
const exercises = [exercise1, exercise2, exercise3]

export default {
  topics: { 'bmc-ex1': 'Exercise 1', 'bmc-ex2': 'Exercise 2', 'bmc-ex3': 'Exercise 3' },
  learn: [],
  questions: exercises.flatMap((e) => e.questions).map((q) => ({ ...q, ...explain[q.id] })), // plus the plain-words explanation and the terms to look up
  docs,
}
