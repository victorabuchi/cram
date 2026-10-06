// Glossary terms for Web Programming I.
// Course terms that can be looked up on Wikipedia. `wiki` is the article key, `words` are what to look for
// in a Learn card (matched as whole words, case-insensitive), `week` places it in the "By week" list.
export const TERMS = [
  { label: 'World Wide Web', wiki: 'World_Wide_Web', words: ['the web'], week: 1 },
  { label: 'HTTP', wiki: 'Hypertext_Transfer_Protocol', words: ['http'], week: 1 },
  { label: 'URL', wiki: 'Uniform_Resource_Locator', words: ['url', 'urls'], week: 1 },
  { label: 'Client–server model', wiki: 'Client–server_model', words: ['client-server', 'client/server'], week: 1 },
  { label: 'HTML', wiki: 'HTML', words: ['html'], week: 1 },
  { label: 'HTML element', wiki: 'HTML_element', words: ['element', 'elements', 'tag', 'tags'], week: 1 },
  { label: 'Semantic HTML', wiki: 'Semantic_HTML', words: ['semantic'], week: 1 },
  { label: 'HTML form', wiki: 'Form_(HTML)', words: ['form', 'forms'], week: 1 },
  { label: 'CSS', wiki: 'CSS', words: ['css'], week: 1 },
  { label: 'Flexbox', wiki: 'Flexbox', words: ['flexbox', 'flex'], week: 1 },
  { label: 'CSS grid layout', wiki: 'CSS_grid_layout', words: ['grid'], week: 1 },
  { label: 'Media queries', wiki: 'Media_queries', words: ['media query', 'media queries'], week: 1 },
  { label: 'Responsive web design', wiki: 'Responsive_web_design', words: ['responsive'], week: 1 },
  { label: 'Version control', wiki: 'Version_control', words: ['version control'], week: 2 },
  { label: 'Git', wiki: 'Git', words: ['git'], week: 2 },
  { label: 'GitHub', wiki: 'GitHub', words: ['github'], week: 2 },
  { label: 'Commit', wiki: 'Commit_(version_control)', words: ['commit', 'commits'], week: 2 },
  { label: 'Branching', wiki: 'Branching_(version_control)', words: ['branch', 'branches'], week: 2 },
  { label: 'Merge', wiki: 'Merge_(version_control)', words: ['merge', 'merging'], week: 2 },
  { label: 'Pull request', wiki: 'Pull_request', words: ['pull request', 'pull requests'], week: 2 },
  { label: 'Web accessibility', wiki: 'Web_accessibility', words: ['accessibility', 'accessible'], week: 3 },
  { label: 'WCAG', wiki: 'Web_Content_Accessibility_Guidelines', words: ['wcag'], week: 3 },
  { label: 'Bootstrap', wiki: 'Bootstrap_(front-end_framework)', words: ['bootstrap'], week: 3 },
  { label: 'Content delivery network', wiki: 'Content_delivery_network', words: ['cdn'], week: 3 },
  { label: 'JavaScript', wiki: 'JavaScript', words: ['javascript'], week: 4 },
  { label: 'Document Object Model', wiki: 'Document_Object_Model', words: ['dom'], week: 4 },
  { label: 'Event', wiki: 'Event_(computing)', words: ['event', 'events'], week: 4 },
  { label: 'Callback', wiki: 'Callback_(computer_programming)', words: ['callback', 'callbacks'], week: 4 },
  { label: 'Promise', wiki: 'Futures_and_promises', words: ['promise', 'promises'], week: 4 },
  { label: 'Ajax', wiki: 'Ajax_(programming)', words: ['ajax', 'fetch'], week: 4 },
  { label: 'API', wiki: 'API', words: ['api', 'apis'], week: 4 },
  { label: 'REST', wiki: 'REST', words: ['rest', 'restful'], week: 4 },
  { label: 'JSON', wiki: 'JSON', words: ['json'], week: 4 },
  { label: 'Chart.js', wiki: 'Chart.js', words: ['chart.js'], week: 4 },
  { label: 'Node.js', wiki: 'Node.js', words: ['node.js', 'node'], week: 5 },
  { label: 'npm', wiki: 'Npm', words: ['npm'], week: 5 },
  { label: 'Vite', wiki: 'Vite_(software)', words: ['vite'], week: 5 },
  { label: 'React', wiki: 'React_(software)', words: ['react'], week: 5 },
  { label: 'JSX', wiki: 'JSX_(JavaScript)', words: ['jsx'], week: 5 },
  { label: 'Virtual DOM', wiki: 'Virtual_DOM', words: ['virtual dom'], week: 5 },
  { label: 'Single-page application', wiki: 'Single-page_application', words: ['spa', 'single-page'], week: 5 },
]

const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
const matchers = TERMS.map((t) => ({ term: t, re: new RegExp(`(?<![\\w-])(?:${t.words.map(escape).join('|')})(?![\\w-])`, 'i') }))

// Terms mentioned in a piece of text, in glossary order. A card's own title counts too.
export const findTerms = (...texts) => {
  const text = texts.join(' ')
  return matchers.filter(({ re }) => re.test(text)).map(({ term }) => term)
}
