// The course PDFs, shown exactly as the teacher wrote them (public/docs). Learn opens them in a PDF viewer, one tab per document.
// `week` is the group: 1 = Finite automata and regular expressions (lectures 1 to 4, exercise 1), 2 = Regular expressions (lectures 5 and 6,
// exercises 2 and 3), 3 = Pushdown automata and context-free grammars (lectures 7 and 8, exercise 4), 4 = Context-sensitive grammars and
// Turing machines (lectures 9 and 10; the exercise follows).
const base = { subject: 'bmc' }

export const docs = [
  { ...base, week: 1, title: 'Lecture 1', file: 'bmc-lecture-1.pdf' },
  { ...base, week: 1, title: 'Lecture 2', file: 'bmc-lecture-2.pdf' },
  { ...base, week: 1, title: 'Lecture 3-4', file: 'bmc-lecture-3-4.pdf' },
  { ...base, week: 1, title: 'Exercise 1: questions and answers', file: 'bmc-exercise-1.pdf' },
  { ...base, week: 3, title: 'Lecture 7', file: 'bmc-lecture-7.pdf' },
  { ...base, week: 3, title: 'Lecture 8', file: 'bmc-lecture-8.pdf' },
  { ...base, week: 3, title: 'Exercise 4: questions and answers', file: 'bmc-exercise-4.pdf' },
  { ...base, week: 4, title: 'Lecture 9', file: 'bmc-lecture-9.pdf' },
  { ...base, week: 4, title: 'Lecture 10', file: 'bmc-lecture-10.pdf' },
  { ...base, week: 2, title: 'Lecture 5', file: 'bmc-lecture-5.pdf' },
  { ...base, week: 2, title: 'Lecture 6', file: 'bmc-lecture-6.pdf' },
  { ...base, week: 2, title: 'Exercise 2: questions and answers', file: 'bmc-exercise-2.pdf' },
  { ...base, week: 2, title: 'Exercise 3: questions and answers', file: 'bmc-exercise-3.pdf' },
]
