// Glossary terms for Web Programming I.
// Course terms. `w3` is the W3Schools page that explains the term (opened in a new tab; W3Schools has no API, so its text is never copied).
// `mdn` is the folder of the MDN Web Docs page (shown as a summary popup, see src/api/mdn.js). Terms with neither show a Wikipedia summary: `wiki` is the article key. `words` are what to look for
// in a Learn card (matched as whole words, case-insensitive), `week` places it in the "By week" list.
export const TERMS = [
  { label: 'World Wide Web', mdn: 'glossary/world_wide_web', wiki: 'World_Wide_Web', words: ['the web'], week: 1 },
  { label: 'HTTP', mdn: 'web/http/guides/overview', wiki: 'Hypertext_Transfer_Protocol', words: ['http'], week: 1 },
  { label: 'URL', mdn: 'learn_web_development/howto/web_mechanics/what_is_a_url', wiki: 'Uniform_Resource_Locator', words: ['url', 'urls'], week: 1 },
  { label: 'Client–server model', mdn: 'learn_web_development/extensions/server-side/first_steps/client-server_overview', wiki: 'Client–server_model', words: ['client-server', 'client/server'], week: 1 },
  { label: 'HTML', mdn: 'web/html', w3: 'html/default.asp', wiki: 'HTML', words: ['html'], week: 1 },
  { label: 'HTML element', mdn: 'glossary/element', w3: 'html/html_elements.asp', wiki: 'HTML_element', words: ['element', 'elements', 'tag', 'tags'], week: 1 },
  { label: 'Semantic HTML', mdn: 'glossary/semantics', w3: 'html/html5_semantic_elements.asp', wiki: 'Semantic_HTML', words: ['semantic'], week: 1 },
  { label: 'HTML form', mdn: 'learn_web_development/extensions/forms/your_first_form', w3: 'html/html_forms.asp', wiki: 'Form_(HTML)', words: ['form', 'forms'], week: 1 },
  { label: 'CSS', mdn: 'web/css', w3: 'css/default.asp', wiki: 'CSS', words: ['css'], week: 1 },
  { label: 'Flexbox', mdn: 'web/css/guides/flexible_box_layout/basic_concepts', w3: 'css/css3_flexbox.asp', wiki: 'Flexbox', words: ['flexbox', 'flex'], week: 1 },
  { label: 'CSS grid layout', mdn: 'web/css/guides/grid_layout/basic_concepts', w3: 'css/css_grid.asp', wiki: 'CSS_grid_layout', words: ['grid'], week: 1 },
  { label: 'Media queries', mdn: 'web/css/guides/media_queries', w3: 'css/css3_mediaqueries.asp', wiki: 'Media_queries', words: ['media query', 'media queries'], week: 1 },
  { label: 'Responsive web design', mdn: 'learn_web_development/core/css_layout/responsive_design', w3: 'css/css_rwd_intro.asp', wiki: 'Responsive_web_design', words: ['responsive'], week: 1 },
  { label: 'Version control', w3: 'git/git_intro.asp', wiki: 'Version_control', words: ['version control'], week: 2 },
  { label: 'Git', w3: 'git/default.asp', wiki: 'Git', words: ['git'], week: 2 },
  { label: 'GitHub', w3: 'git/git_remote_getstarted.asp', wiki: 'GitHub', words: ['github'], week: 2 },
  { label: 'Commit', w3: 'git/git_commit.asp', wiki: 'Commit_(version_control)', words: ['commit', 'commits'], week: 2 },
  { label: 'Branching', w3: 'git/git_branch.asp', wiki: 'Branching_(version_control)', words: ['branch', 'branches'], week: 2 },
  { label: 'Merge', w3: 'git/git_branch_merge.asp', wiki: 'Merge_(version_control)', words: ['merge', 'merging'], week: 2 },
  { label: 'Pull request', w3: 'git/git_github_flow.asp', wiki: 'Pull_request', words: ['pull request', 'pull requests'], week: 2 },
  { label: 'Web accessibility', mdn: 'web/accessibility', w3: 'accessibility/default.asp', wiki: 'Web_accessibility', words: ['accessibility', 'accessible'], week: 3 },
  { label: 'WCAG', mdn: 'web/accessibility/guides/understanding_wcag', wiki: 'Web_Content_Accessibility_Guidelines', words: ['wcag'], week: 3 },
  { label: 'Bootstrap', w3: 'bootstrap5/default.asp', wiki: 'Bootstrap_(front-end_framework)', words: ['bootstrap'], week: 3 },
  { label: 'Content delivery network', mdn: 'glossary/cdn', wiki: 'Content_delivery_network', words: ['cdn'], week: 3 },
  { label: 'JavaScript', mdn: 'web/javascript', w3: 'js/default.asp', wiki: 'JavaScript', words: ['javascript'], week: 4 },
  { label: 'Document Object Model', mdn: 'web/api/document_object_model', w3: 'js/js_htmldom.asp', wiki: 'Document_Object_Model', words: ['dom'], week: 4 },
  { label: 'Event', mdn: 'learn_web_development/core/scripting/events', w3: 'js/js_events.asp', wiki: 'Event_(computing)', words: ['event', 'events'], week: 4 },
  { label: 'Callback', mdn: 'glossary/callback_function', w3: 'js/js_callback.asp', wiki: 'Callback_(computer_programming)', words: ['callback', 'callbacks'], week: 4 },
  { label: 'Promise', mdn: 'web/javascript/reference/global_objects/promise', w3: 'js/js_promise.asp', wiki: 'Futures_and_promises', words: ['promise', 'promises'], week: 4 },
  { label: 'Ajax', mdn: 'glossary/ajax', w3: 'js/js_ajax_intro.asp', wiki: 'Ajax_(programming)', words: ['ajax', 'fetch'], week: 4 },
  { label: 'API', mdn: 'glossary/api', w3: 'js/js_api_intro.asp', wiki: 'API', words: ['api', 'apis'], week: 4 },
  { label: 'REST', mdn: 'glossary/rest', wiki: 'REST', words: ['rest', 'restful'], week: 4 },
  { label: 'JSON', mdn: 'web/javascript/reference/global_objects/json', w3: 'js/js_json_intro.asp', wiki: 'JSON', words: ['json'], week: 4 },
  { label: 'Chart.js', wiki: 'Chart.js', words: ['chart.js'], week: 4 },
  { label: 'Node.js', mdn: 'glossary/node.js', w3: 'nodejs/default.asp', wiki: 'Node.js', words: ['node.js', 'node'], week: 5 },
  { label: 'npm', w3: 'nodejs/nodejs_npm.asp', wiki: 'Npm', words: ['npm'], week: 5 },
  { label: 'Vite', wiki: 'Vite_(software)', words: ['vite'], week: 5 },
  { label: 'React', mdn: 'learn_web_development/core/frameworks_libraries/react_getting_started', w3: 'react/default.asp', wiki: 'React_(software)', words: ['react'], week: 5 },
  { label: 'JSX', w3: 'react/react_jsx.asp', wiki: 'JSX_(JavaScript)', words: ['jsx'], week: 5 },
  { label: 'Virtual DOM', wiki: 'Virtual_DOM', words: ['virtual dom'], week: 5 },
  { label: 'Single-page application', mdn: 'glossary/spa', wiki: 'Single-page_application', words: ['spa', 'single-page'], week: 5 },
  { label: 'Large language model', wiki: 'Large_language_model', words: ['llm', 'llms', 'large language model'], week: 6 },
  { label: 'Chatbot', wiki: 'Chatbot', words: ['chatbot', 'chatbots'], week: 6 },
  { label: 'GitHub Copilot', wiki: 'GitHub_Copilot', words: ['copilot'], week: 6 },
  { label: 'Prompt engineering', wiki: 'Prompt_engineering', words: ['prompt engineering', 'prompting'], week: 6 },
  { label: 'Vibe coding', wiki: 'Vibe_coding', words: ['vibe coding', 'vibe coders'], week: 6 },
  { label: 'AI slop', wiki: 'AI_slop', words: ['ai slop'], week: 6 },
  { label: 'Cursor', wiki: 'Cursor_(code_editor)', words: ['cursor'], week: 6 },
  { label: 'Replit', wiki: 'Replit', words: ['replit'], week: 6 },
  { label: 'Integrated development environment', mdn: 'glossary/ide', wiki: 'Integrated_development_environment', words: ['ide', 'ides'], week: 6 },
  { label: 'Visual Studio Code', wiki: 'Visual_Studio_Code', words: ['vs code', 'visual studio code'], week: 6 },
]

export const w3Url = (term) => `https://www.w3schools.com/${term.w3}`

const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
const matchers = TERMS.map((t) => ({ term: t, re: new RegExp(`(?<![\\w-])(?:${t.words.map(escape).join('|')})(?![\\w-])`, 'i') }))

// Terms mentioned in a piece of text, in glossary order. A card's own title counts too.
export const findTerms = (...texts) => {
  const text = texts.join(' ')
  return matchers.filter(({ re }) => re.test(text)).map(({ term }) => term)
}
