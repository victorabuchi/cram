import * as exercise1 from './exercise1'
import * as exercise2 from './exercise2'
import * as exercise3 from './exercise3'
import * as exercise4 from './exercise4'
import * as exercise5 from './exercise5'
import * as exercise6 from './exercise6'
import * as exercise7 from './exercise7'
import { docs } from './docs'
import { explain } from './explain'
import { extraItems } from './extraPractice'

// Basic Models of Computation: the lecture PDFs (docs, shown by Learn), the exercise tasks and the extra practice. No learn cards.
const exercises = [exercise1, exercise2, exercise3, exercise4, exercise5, exercise6, exercise7]

export default {
  topics: { 'bmc-ex1': 'Exercise 1', 'bmc-ex2': 'Exercise 2', 'bmc-ex3': 'Exercise 3', 'bmc-ex4': 'Exercise 4', 'bmc-ex5': 'Exercise 5', 'bmc-ex6': 'Exercise 6', 'bmc-ex7': 'Exercise 7' },
  learn: [],
  questions: [...exercises.flatMap((e) => e.questions).map((q) => ({ ...q, ...explain[q.id] }))], // plus the plain-words explanation and the terms to look up
  docs,
  extraPractice: extraItems, // extra practice, solved; not counted in the progress totals
}
