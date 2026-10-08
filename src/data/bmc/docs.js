// The course PDFs, shown exactly as the teacher wrote them (public/docs). Learn opens them in a PDF viewer, one per lecture.
// `week` decides where a lecture appears. A week with no PDF falls back to the learn cards.
const base = { subject: 'bmc' }

export const docs = [
  { ...base, week: 2, title: 'Lecture 2: Deterministic finite automata', file: 'bmc-lecture-2.pdf' },
  { ...base, week: 3, title: 'Lecture 3-4: Languages, trap state, NFA, minimization', file: 'bmc-lecture-3-4.pdf' },
  { ...base, week: 4, title: 'Lecture 5: Grammars and regular expressions', file: 'bmc-lecture-5.pdf' },
  { ...base, week: 4, title: 'Exercise 2: questions and answers', file: 'bmc-exercise-2.pdf' },
]
