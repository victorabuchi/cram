// Dashboard cards. Each week's items are tagged with `week` in content.json.
export const SUBJECTS = [
  {
    id: 'webprog',
    title: 'Web Programming I',
    org: 'School of Computing',
    color: '#3b5bdb',
    courseDate: '2026-10-23',
    weeks: [
      { n: 1, title: 'Intro to the web, HTML, CSS' },
      { n: 2, title: 'Git + GitHub' },
      { n: 3, title: 'Accessibility + Bootstrap' },
      { n: 4, title: 'JavaScript I + II: DOM, libraries, async, REST, fetch' },
      { n: 5, title: 'React basics' },
    ],
  },
]

export const getSubject = (id) => SUBJECTS.find((s) => s.id === id)
