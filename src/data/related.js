import { TERMS, mdnUrl, w3Url } from './terms'

// "Learn more" links for a question, shown after you answer it: the best MDN and W3Schools pages for what the question is about.
// CONCEPTS are specific topics the questions ask about (specificity, git push, useState ...); each has the MDN page (`mdn` folder + `slug`,
// the slug is the page's real address) and/or the W3Schools page that explains it. A question gets the two concepts it mentions most
// (the question text counts most, then the correct answer, then the explanation). If no concept matches, the course terms are used.
const w3 = (path) => `https://www.w3schools.com/${path}`
const mdn = (slug) => `https://developer.mozilla.org/en-US/docs/${slug}`

const REACT = /react|jsx|usestate|useeffect|\bprops\b|\bhooks?\b/i // these concepts only count when the question is about React

const CONCEPTS = [
  { label: 'CSS specificity and the cascade', re: /specificity|cascad/gi, mdn: 'web/css/guides/cascade/specificity', slug: 'Web/CSS/Guides/Cascade/Specificity', w3: 'css/css_specificity.asp' },
  { label: 'CSS selectors', re: /selector/gi, mdn: 'web/css/guides/selectors', slug: 'Web/CSS/Guides/Selectors', w3: 'css/css_selectors.asp' },
  { label: 'Adding CSS to a page', re: /internal css|external css|inline (?:css|style)|<style>|stylesheet/gi, w3: 'css/css_howto.asp' },
  { label: 'The CSS box model', re: /box model|margin|padding/gi, mdn: 'web/css/guides/box_model/introduction', slug: 'Web/CSS/Guides/Box_model/Introduction', w3: 'css/css_boxmodel.asp' },
  { label: 'Block and inline elements', re: /block element|inline element|block-level|inline-level/gi, mdn: 'glossary/block-level_content', slug: 'Glossary/Block-level_content', w3: 'html/html_blocks.asp' },
  { label: 'The div and span elements', re: /<div>|<span>|\bdiv\b|\bspan\b/gi, mdn: 'web/html/reference/elements/div', slug: 'Web/HTML/Reference/Elements/div', w3: 'html/html_blocks.asp' },
  { label: 'The alt attribute of images', re: /\balt\b|alt text/gi, mdn: 'web/html/reference/elements/img', slug: 'Web/HTML/Reference/Elements/img', w3: 'html/html_images.asp' },
  { label: 'Bootstrap grid system', re: /col-(?:sm|md|lg|xl)|grid system|breakpoint/gi, w3: 'bootstrap5/bootstrap_grid_basic.asp' },
  { label: 'Color contrast', re: /contrast/gi, mdn: 'web/accessibility/guides/understanding_wcag/perceivable/color_contrast', slug: 'Web/Accessibility/Guides/Understanding_WCAG/Perceivable/Color_contrast' },
  { label: 'Accessibility principles (WCAG, POUR)', re: /\bPOUR\b|perceivable|operable|understandable|robust|screen reader|assistive/g, mdn: 'web/accessibility/guides/understanding_wcag', slug: 'Web/Accessibility/Guides/Understanding_WCAG' },
  { label: 'Git staging', re: /staging|git add/gi, w3: 'git/git_staging_environment.asp' },
  { label: 'Git and GitHub: what they are', weight: 3, re: /git and github|github and git|difference between git/gi, w3: 'git/git_intro.asp' },
  { label: 'Git commit', re: /commit/gi, w3: 'git/git_commit.asp' },
  { label: 'Git push', re: /\bpush/gi, w3: 'git/git_push_to_remote.asp' },
  { label: 'Git pull', re: /\bpull\b|git fetch/gi, w3: 'git/git_pull_from_remote.asp' },
  { label: 'Git and GitHub remotes', re: /remote|clone/gi, w3: 'git/git_remote_getstarted.asp' },
  { label: 'Git branches and merging', re: /branch|merge/gi, w3: 'git/git_branch.asp' },
  { label: 'GitHub flow and pull requests', re: /pull request|github flow/gi, w3: 'git/git_github_flow.asp' },
  { label: 'async and await', re: /async|await|asynchronous/gi, mdn: 'web/javascript/reference/statements/async_function', slug: 'Web/JavaScript/Reference/Statements/async_function', w3: 'js/js_async.asp' },
  { label: 'HTTP request methods', re: /\b(?:GET|POST|PUT|PATCH|DELETE)\b|http method/g, mdn: 'web/http/reference/methods', slug: 'Web/HTTP/Reference/Methods', w3: 'tags/ref_httpmethods.asp' },
  { label: 'textContent and innerHTML', re: /textContent|innerHTML|innerText/g, mdn: 'web/api/node/textcontent', slug: 'Web/API/Node/textContent', w3: 'js/js_htmldom_html.asp' },
  { label: 'Creating and adding elements', re: /createElement|appendChild|\.append\(/g, mdn: 'web/api/document/createelement', slug: 'Web/API/Document/createElement', w3: 'js/js_htmldom_nodes.asp' },
  { label: 'addEventListener', re: /addEventListener|event listener/gi, mdn: 'web/api/eventtarget/addeventlistener', slug: 'Web/API/EventTarget/addEventListener', w3: 'js/js_htmldom_eventlistener.asp' },
  { label: 'Array map and filter', re: /\bfilter\b|\bmap\b|callback/gi, mdn: 'web/javascript/reference/global_objects/array/map', slug: 'Web/JavaScript/Reference/Global_Objects/Array/map', w3: 'js/js_array_iteration.asp' },
  { label: 'Arrow functions', re: /arrow function|=>/gi, mdn: 'web/javascript/reference/functions/arrow_functions', slug: 'Web/JavaScript/Reference/Functions/Arrow_functions', w3: 'js/js_arrow_function.asp' },
  { label: 'Fetching data (fetch)', re: /\bfetch\b|fetch\(/gi, mdn: 'web/api/fetch_api/using_fetch', slug: 'Web/API/Fetch_API/Using_Fetch', w3: 'js/js_api_fetch.asp' },
  { label: 'React state (useState)', needs: REACT, re: /\bstate\b|useState/gi, w3: 'react/react_usestate.asp' },
  { label: 'React effects (useEffect)', needs: REACT, re: /useEffect|\beffect\b/gi, w3: 'react/react_useeffect.asp' },
  { label: 'React hooks', needs: REACT, re: /\bhooks?\b/gi, w3: 'react/react_hooks.asp' },
  { label: 'React components', needs: REACT, re: /component/gi, w3: 'react/react_components.asp' },
  { label: 'React props', needs: REACT, re: /\bprops\b/gi, w3: 'react/react_props.asp' },
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
    links: [c.mdn && { name: 'MDN', url: mdn(c.slug) }, c.w3 && { name: 'W3Schools', url: w3(c.w3) }].filter(Boolean),
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

  // No specific concept: a course term the question itself names (MDN, W3Schools, or Wikipedia when neither has a page).
  const term = TERMS
    .map((t) => ({ t, score: 3 * count(new RegExp(`(?<![\\w-])(?:${t.words.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})(?![\\w-])`, 'gi'), f.question) }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)[0]?.t
  if (!term) return []
  const links = [term.mdn && { name: 'MDN', url: mdnUrl(term) }, term.w3 && { name: 'W3Schools', url: w3Url(term) }].filter(Boolean)
  return [{ label: term.label, links: links.length ? links : [{ name: 'Wikipedia', url: `https://en.wikipedia.org/wiki/${term.wiki}` }] }]
}
