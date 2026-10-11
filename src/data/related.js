import { TERMS, mdnUrl } from './terms.js'

// "Learn more" links for a question, shown after you answer it: the best MDN page (or, where MDN has none, the official docs of the tool)
// for what the question is about. CONCEPTS are specific topics the questions ask about (specificity, git push, useState ...); each has the
// MDN page (`mdn` folder + `slug`, the slug is the page's real address) and/or `docs`, the official documentation of Git, GitHub, React or Bootstrap. A question gets the two concepts it mentions most
// (the question text counts most, then the correct answer, then the explanation). If no concept matches, the course terms are used.
const mdn = (slug) => `https://developer.mozilla.org/en-US/docs/${slug}`

const GIT_CHANGES = 'https://git-scm.com/book/en/v2/Git-Basics-Recording-Changes-to-the-Repository'
const GIT_REMOTES = 'https://git-scm.com/book/en/v2/Git-Basics-Working-with-Remotes'
const GIT_BRANCHES = 'https://git-scm.com/book/en/v2/Git-Branching-Basic-Branching-and-Merging'
const REACT = /react|jsx|usestate|useeffect|\bprops\b|\bhooks?\b/i // these concepts only count when the question is about React

const CONCEPTS = [
  { label: 'CSS specificity and the cascade', re: /specificity|cascad/gi, mdn: 'web/css/guides/cascade/specificity', slug: 'Web/CSS/Guides/Cascade/Specificity' },
  { label: 'CSS selectors', re: /selector/gi, mdn: 'web/css/guides/selectors', slug: 'Web/CSS/Guides/Selectors' },
  { label: 'Adding CSS to a page', re: /internal css|external css|inline (?:css|style)|<style>|stylesheet/gi, mdn: 'learn_web_development/core/styling_basics/getting_started', slug: 'Learn_web_development/Core/Styling_basics/Getting_started' },
  { label: 'The CSS box model', re: /box model|margin|padding/gi, mdn: 'web/css/guides/box_model/introduction', slug: 'Web/CSS/Guides/Box_model/Introduction' },
  { label: 'Block and inline elements', re: /block element|inline element|block-level|inline-level/gi, mdn: 'glossary/block-level_content', slug: 'Glossary/Block-level_content' },
  { label: 'The div and span elements', re: /<div>|<span>|\bdiv\b|\bspan\b/gi, mdn: 'web/html/reference/elements/div', slug: 'Web/HTML/Reference/Elements/div' },
  { label: 'The alt attribute of images', re: /\balt\b|alt text/gi, mdn: 'web/html/reference/elements/img', slug: 'Web/HTML/Reference/Elements/img' },
  { label: 'Bootstrap grid system', re: /col-(?:sm|md|lg|xl)|grid system|breakpoint/gi, mdn: 'learn_web_development/core/css_layout/responsive_design', slug: 'Learn_web_development/Core/CSS_layout/Responsive_Design', docs: { name: 'Bootstrap docs', url: 'https://getbootstrap.com/docs/5.3/layout/grid/' } },
  { label: 'Color contrast', re: /contrast/gi, mdn: 'web/accessibility/guides/understanding_wcag/perceivable/color_contrast', slug: 'Web/Accessibility/Guides/Understanding_WCAG/Perceivable/Color_contrast' },
  { label: 'Accessibility principles (WCAG, POUR)', re: /\bPOUR\b|perceivable|operable|understandable|robust|screen reader|assistive/g, mdn: 'web/accessibility/guides/understanding_wcag', slug: 'Web/Accessibility/Guides/Understanding_WCAG' },
  { label: 'Git staging', re: /staging|git add/gi, docs: { name: 'Git docs', url: GIT_CHANGES } },
  { label: 'Git and GitHub: what they are', weight: 3, re: /git and github|github and git|difference between git/gi, docs: { name: 'Git docs', url: 'https://git-scm.com/book/en/v2/Getting-Started-What-is-Git%3F' } },
  { label: 'Git commit', re: /commit/gi, docs: { name: 'Git docs', url: GIT_CHANGES } },
  { label: 'Git push', re: /\bpush/gi, docs: { name: 'Git docs', url: GIT_REMOTES } },
  { label: 'Git pull', re: /\bpull\b|git fetch/gi, docs: { name: 'Git docs', url: GIT_REMOTES } },
  { label: 'Git and GitHub remotes', re: /remote|clone/gi, docs: { name: 'Git docs', url: GIT_REMOTES } },
  { label: 'Git branches and merging', re: /branch|merge/gi, docs: { name: 'Git docs', url: GIT_BRANCHES } },
  { label: 'GitHub flow and pull requests', re: /pull request|github flow/gi, docs: { name: 'GitHub docs', url: 'https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-pull-requests' } },
  { label: 'async and await', re: /async|await|asynchronous/gi, mdn: 'web/javascript/reference/statements/async_function', slug: 'Web/JavaScript/Reference/Statements/async_function' },
  { label: 'HTTP request methods', re: /\b(?:GET|POST|PUT|PATCH|DELETE)\b|http method/g, mdn: 'web/http/reference/methods', slug: 'Web/HTTP/Reference/Methods' },
  { label: 'textContent and innerHTML', re: /textContent|innerHTML|innerText/g, mdn: 'web/api/node/textcontent', slug: 'Web/API/Node/textContent' },
  { label: 'Creating and adding elements', re: /createElement|appendChild|\.append\(/g, mdn: 'web/api/document/createelement', slug: 'Web/API/Document/createElement' },
  { label: 'addEventListener', re: /addEventListener|event listener/gi, mdn: 'web/api/eventtarget/addeventlistener', slug: 'Web/API/EventTarget/addEventListener' },
  { label: 'Array map and filter', re: /\bfilter\b|\bmap\b|callback/gi, mdn: 'web/javascript/reference/global_objects/array/map', slug: 'Web/JavaScript/Reference/Global_Objects/Array/map' },
  { label: 'Arrow functions', re: /arrow function|=>/gi, mdn: 'web/javascript/reference/functions/arrow_functions', slug: 'Web/JavaScript/Reference/Functions/Arrow_functions' },
  { label: 'Fetching data (fetch)', re: /\bfetch\b|fetch\(/gi, mdn: 'web/api/fetch_api/using_fetch', slug: 'Web/API/Fetch_API/Using_Fetch' },
  { label: 'React state (useState)', needs: REACT, re: /\bstate\b|useState/gi, docs: { name: 'React docs', url: 'https://react.dev/learn/state-a-components-memory' } },
  { label: 'React effects (useEffect)', needs: REACT, re: /useEffect|\beffect\b/gi, docs: { name: 'React docs', url: 'https://react.dev/learn/synchronizing-with-effects' } },
  { label: 'React hooks', needs: REACT, re: /\bhooks?\b/gi, docs: { name: 'React docs', url: 'https://react.dev/reference/react/hooks' } },
  { label: 'React components', needs: REACT, re: /component/gi, docs: { name: 'React docs', url: 'https://react.dev/learn/your-first-component' } },
  { label: 'React props', needs: REACT, re: /\bprops\b/gi, docs: { name: 'React docs', url: 'https://react.dev/learn/passing-props-to-a-component' } },
  { label: 'Single-page apps and routing', re: /routing|\brouter\b|single.page|\bSPA\b/gi, mdn: 'glossary/spa', slug: 'Glossary/SPA' },
]

const count = (re, text) => (text ? (text.match(re) ?? []).length : 0)

const fieldsOf = (item) => ({
  question: [item.q, item.title].filter(Boolean).join(' '),
  code: item.code,
  answer: item.kind === 'mcq' ? item.options[0] : [...(item.answers ?? []).flat(), ...(item.keyPoints ?? [])].join(' '),
  explanation: [item.why, item.note, item.model].filter(Boolean).join(' '),
})

const scoreOf = (re, f) => 3 * count(re, f.question) + 3 * count(re, f.code) + 2 * count(re, f.answer) + count(re, f.explanation)

// [{ label, links: [{ name, url }] }], at most `max` topics.
export function learnMoreLinks(item, max = 2) {
  const f = fieldsOf(item)
  const toLinks = (c) => ({
    label: c.label,
    links: [c.mdn && { name: 'MDN', url: mdn(c.slug) }, c.docs].filter(Boolean),
  })
  const all = Object.values(f).filter(Boolean).join(' ')
  const ranked = CONCEPTS
    .filter((c) => !c.needs || c.needs.test(all))
    .map((c) => ({ c, score: (c.weight ?? 1) * scoreOf(c.re, f) }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
  // a second topic only when it matters nearly as much as the first
  const concepts = ranked.length ? ranked.filter((r) => r.score >= Math.max(3, ranked[0].score / 2)).slice(0, max).map((r) => toLinks(r.c)) : []
  if (concepts.length) return concepts

  // No specific concept: a course term the question itself names (MDN, or Wikipedia when MDN has no page).
  const term = TERMS
    .map((t) => ({ t, score: 3 * count(new RegExp(`(?<![\\w-])(?:${t.words.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})(?![\\w-])`, 'gi'), f.question) }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)[0]?.t
  if (!term) return []
  const links = [term.mdn && { name: 'MDN', url: mdnUrl(term) }].filter(Boolean)
  return [{ label: term.label, links: links.length ? links : [{ name: 'Wikipedia', url: `https://en.wikipedia.org/wiki/${term.wiki}` }] }]
}

// Every address the "Learn more" links can point to (used by `npm run check-links` to see that they all still open).
export const linkUrls = () => [...new Set([
  ...CONCEPTS.flatMap((c) => [c.mdn && mdn(c.slug), c.docs?.url]),
  ...TERMS.map((t) => t.mdn && mdnUrl(t)),
].filter(Boolean))]
