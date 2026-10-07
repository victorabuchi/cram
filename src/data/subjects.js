import automaton from '../assets/logos/automaton.svg'
import bootstrap from '../assets/logos/bootstrap.svg'
import css from '../assets/logos/css.svg'
import git from '../assets/logos/git.svg'
import copilot from '../assets/logos/githubcopilot.svg'
import github from '../assets/logos/github.svg'
import html5 from '../assets/logos/html5.svg'
import javascript from '../assets/logos/javascript.svg'
import java from '../assets/logos/java.svg'
import json from '../assets/logos/json.svg'
import react from '../assets/logos/react.svg'

// Logos are { src, alt }. Brand logos are Simple Icons (CC0), tinted with their brand colour.
const logo = (src, alt) => ({ src, alt })

// Dashboard cards. Items in content.json / bmc.json carry `subject` (id) and `week` (number).
// `quiz: false` hides Practice and Practice test for a course that only has Learn and Code exercises.
// `tools` are course-specific pages shown in the top bar while inside that course: /s/<id>/<path>.
// To add a week: add it to `weeks` here, then add its learn cards and questions to the subject's data file.
export const SUBJECTS = [
  {
    id: 'webprog',
    title: 'Web Programming I',
    org: 'School of Computing',
    courseDate: '2026-10-23',
    tools: [{ path: 'all/test', label: 'Practice quiz' }, { path: 'glossary', label: 'Glossary' }],
    logos: [logo(html5, 'HTML'), logo(css, 'CSS'), logo(javascript, 'JavaScript'), logo(react, 'React')],
    weeks: [
      { n: 1, title: 'Intro to the web, HTML, CSS', logos: [logo(html5, 'HTML'), logo(css, 'CSS')] },
      { n: 2, title: 'Git + GitHub', logos: [logo(git, 'Git'), logo(github, 'GitHub')] },
      { n: 3, title: 'Accessibility + Bootstrap', logos: [logo(bootstrap, 'Bootstrap')] },
      { n: 4, title: 'JavaScript I + II: DOM, libraries, async, REST, fetch', logos: [logo(javascript, 'JavaScript'), logo(json, 'JSON')] },
      { n: 5, title: 'React basics', logos: [logo(react, 'React')] },
      { n: 6, title: 'Programming with AI + AI assignment', logos: [logo(copilot, 'GitHub Copilot')] },
    ],
  },
  {
    id: 'bmc',
    title: 'Basic Models of Computation',
    org: 'School of Computing',
    tools: [{ path: 'automata', label: 'Automata lab' }],
    logos: [logo(automaton, 'Finite automaton')],
    weeks: [{ n: 1, title: 'Deterministic finite automata (DFA)', logos: [logo(automaton, 'Finite automaton')] }], // more weeks are added as the materials arrive
  },
  {
    id: 'prog2',
    title: 'Programming II (Java)',
    org: 'School of Computing',
    quiz: false, // Learn and Code exercises only: no Practice or Practice test
    tools: [{ path: 'all/learn', label: 'Learn' }, { path: 'all/code', label: 'Code exercises' }],
    logos: [logo(java, 'Java')],
    weeks: [
      { n: 1, title: 'Java basics: variables, operators, conditionals, loops', logos: [logo(java, 'Java')] },
      { n: 2, title: 'Methods, strings and arrays', logos: [logo(java, 'Java')] },
      { n: 3, title: 'Classes and objects', logos: [logo(java, 'Java')] },
      { n: 4, title: 'Inheritance, abstract classes, interfaces', logos: [logo(java, 'Java')] },
      { n: 5, title: 'Exceptions, collections, generics, lambdas', logos: [logo(java, 'Java')] },
      { n: 6, title: 'Threads', logos: [logo(java, 'Java')] },
      { n: 7, title: 'JavaFX', logos: [logo(java, 'Java')] },
    ],
  },
]

export const getSubject = (id) => SUBJECTS.find((s) => s.id === id)
