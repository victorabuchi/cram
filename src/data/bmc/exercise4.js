// Exercise 4 (questions and the teacher's answers), one task per page of public/docs/bmc-exercise-4.pdf
// (T2 uses pages 2 and 3, T5 pages 6 and 7, T6 pages 8 and 9; the images are in public/docs/pages).
// An answer entry is text, or { code } for text that must keep its layout (rules, trees). Lines starting "Also" are added here,
// they are not from the teacher's page. PDA rules are written "read, top ; replacement" like in JFLAP (ε = nothing).
import { expressionTree, node, treeText } from './trees'

const base = { subject: 'bmc', week: 3, topic: 'bmc-ex4', kind: 'paper', exercise: 'Exercise 4', pdf: 'bmc-exercise-4.pdf' }

const ifStatement = (...kids) => node('<statement>', ...kids)
const innerIfThen = node('<if-then>', node('if'), node('c'), node('then'), ifStatement(node('s')))
const innerIfThenElse = node('<if-then-else>', node('if'), node('c'), node('then'), ifStatement(node('s')), node('else'), ifStatement(node('s')))
const tree1 = ifStatement(node('<if-then-else>', node('if'), node('c'), node('then'), ifStatement(innerIfThen), node('else'), ifStatement(node('s'))))
const tree2 = ifStatement(node('<if-then>', node('if'), node('c'), node('then'), ifStatement(innerIfThenElse)))

export const questions = [
  { ...base, id: 'bmc-x4-1', page: 1, title: 'X4 T1. Pushdown automaton for a^k b^l c^(k+l)',
    prompt: ['Let\'s define the words accepted by a language such that the language includes words { a^k b^l c^(k+l) | k, l ∈ N }. For example aabbcccc.', 'Define a pushdown automaton that accepts the language.'],
    answer: [
      'For every a and b, push c onto the stack. For every c, pop c from the stack. At the end, only the bottom symbol Z must be left. "nop / peek" is done by taking the topmost symbol from the stack and then putting the same symbol back (the stack does not change).',
      { code: 'A (start): a, Z ; cZ     a, c ; cc      (loop: every a pushes a c)\nA → B:     b, Z ; cZ     b, c ; cc      (the first b pushes a c)\nB:         b, c ; cc                     (loop: every b pushes a c)\nA → C and B → C:  c, c ; ε               (the first c pops a c)\nC:         c, c ; ε                      (loop: every c pops a c)\nA → ok and C → ok:  ε, Z ; ε             (stack empty again: accept)\nok = the final state' },
    ] },
  { ...base, id: 'bmc-x4-2', page: 2, pages: [2, 3], title: 'X4 T2. Grammar for a^k b^l c^(k+l)',
    prompt: ['Define a grammar for the language { a^k b^l c^(k+l) | k, l ∈ N }.'],
    answer: [
      'Think of the string as growing from the middle: new "ac" pairs are added around the middle first, then new "bc" pairs inside them. First grammar:',
      { code: 'S → A | ε\nA → aAc | ε | B\nB → bBc | ε' },
      'Other versions on the teacher\'s pages (the c\'s are produced by their own nonterminal C):',
      { code: 'S → aAC | bBC | ε          S → aA | bB | ε\nA → aAC | bBC | ε           A → aAC | bBC | c\nB → bBC | ε                B → bBC | c\nC → c                      C → c' },
      'Grammar to (nondeterministic) PDA: for each production X → α, pop X from the stack and push α. For each terminal symbol t, pop t from the stack and read t from the input. The PDA has three states: q1 -ε, Z ; SZ→ q1 (push the start symbol), q1 loops on all these rules, and q1 -ε, Z ; ε→ q2 (accepting).',
      { code: 'ε, S ; aA    ε, S ; bB    ε, S ; ε\nε, A ; aAC   ε, A ; bBC   ε, A ; c\nε, B ; bBC   ε, B ; c\nε, C ; c\na, a ; ε     b, b ; ε     c, c ; ε' },
    ] },
  { ...base, id: 'bmc-x4-3', page: 4, title: 'X4 T3. Pushdown automaton and grammar for k + l < m',
    prompt: ['Let\'s define the words accepted by a language such that the language includes words { a^k b^l c^m | k + l < m, k, l, m ∈ N }. For example abcccc.', 'a) define a pushdown automaton that accepts the language', 'b) define a grammar for this language'],
    answer: [
      'a) Like task 1, push a c for every a and every b and pop a c for every c. But now at least ONE more c must follow after the stack is empty (strictly more c than a and b together). So when Z is on top, a c still has to be read before accepting.',
      { code: 'A: a, Z ; cZ    a, c ; cc\nA → B: b, Z ; cZ    b, c ; cc          B: b, c ; cc\nA → C and B → C: c, c ; ε            C: c, c ; ε\nC → ok and A → ok: c, Z ; ε          (the extra c: stack was empty)\nok (final): c, ε ; ε                  (more c are fine)\nok → trap: a, ε ; ε   b, ε ; ε   c, ε ; ε   (any other symbol: reject; trap loops)' },
      'b) Take the grammar from task 2 and replace the empty productions by c. This always adds one extra c:',
      { code: 'S → A | c\nA → aAc | B | c\nB → bBc | c' },
      'Then let a nonterminal C produce additional c\'s:',
      { code: 'S → A | C\nA → aAc | C | B\nB → bBc | C\nC → cC | c' },
    ] },
  { ...base, id: 'bmc-x4-4', page: 5, title: 'X4 T4. A pushdown automaton for HTML',
    prompt: ['In elearn, there is a "start" for a pushdown automaton that checks the correctness of HTML syntax (https://www.w3schools.com/html/html_intro.asp). Complete it so that it accepts the following HTML parts: <head>, <title>, <body>, <h1>, <p>.', 'The yellow boxes on the teacher\'s page are example documents the automaton must accept, such as <html> <head> <title>tttt</title> </head> <body> <h1>ttttt</h1> <p>ttttt...</p> </body> </html>.'],
    answer: [
      'The automaton has one working state (html). Every opening tag is pushed on the stack, on top of its parent tag; every closing tag pops its own opening tag. Text characters are just read (the stack is not changed). The last transition, </html> on <html>Z, leads to the final state OK.',
      { code: 'Text:     t, ε ; ε     . , ε ; ε     (space), ε ; ε\n<html>, Z ; <html>Z\n<head>, <html> ; <head><html>\n<title>, <head> ; <title><head>\n</title>, <title> ; ε\n</head>, <head> ; ε\n<body>, <html> ; <body><html>\n<h1>, <body> ; <h1><body>\n</h1>, <h1> ; ε\n<p>, <body> ; <p><body>\n</p>, <p> ; ε\n</body>, <body> ; ε\nhtml → OK:  </html>, <html>Z ; ε' },
      'Reading rule: "<h1>, <body> ; <h1><body>" means: the next input is <h1> and the top of the stack is <body>; replace <body> by <h1> on top of <body> (a push). "</h1>, <h1> ; ε" pops the <h1> again, so the stack remembers which tags are still open.',
    ] },
  { ...base, id: 'bmc-x4-5', page: 6, pages: [6, 7], title: 'X4 T5. An ambiguous grammar (if-then-else)',
    prompt: ['Consider the grammar', '<statement> → <if-then-else> | <if-then> | s\n<if-then-else> → if c then <statement> else <statement>\n<if-then> → if c then <statement>', 'The alphabet Σ = { if, then, else, c, s }. The keywords if, then and else are single symbols (spaces are added for readability).', 'a) Derive the string  if c then if c then s else s  with the given grammar: present one possible derivation chain starting from <statement> and ending with this string.', 'b) Using the same grammar, present two different parse trees for the string.', 'c) Briefly explain why the two trees differ from each other and why this shows that the grammar is ambiguous.'],
    answer: [
      'a) First derivation (the else belongs to the OUTER if):',
      { code: '<statement>\n→ <if-then-else>\n→ if c then <statement> else <statement>\n→ if c then <if-then> else <statement>\n→ if c then if c then <statement> else <statement>\n→ if c then if c then s else s' },
      'Second derivation (the else belongs to the INNER if):',
      { code: '<statement>\n→ <if-then>\n→ if c then <statement>\n→ if c then <if-then-else>\n→ if c then if c then <statement> else <statement>\n→ if c then if c then s else s' },
      'b) The two parse trees (the first for the first derivation, the second for the second):',
      { code: treeText(tree1) },
      { code: treeText(tree2) },
      'c) Both trees have exactly the same leaves, the string if c then if c then s else s, but different structure. In the first tree the else belongs to the outer if (the inner if has no else); in the second tree the else belongs to the inner if. A grammar is ambiguous when some string has two or more parse trees (or derivations). This string has two, so the grammar is ambiguous. (This is the "dangling else" problem: which if does an else belong to?)',
    ] },
  { ...base, id: 'bmc-x4-6', page: 8, pages: [8, 9], title: 'X4 T6. Parse trees of arithmetic expressions',
    prompt: ['Grammar of arithmetic expressions. An arithmetic expression (E) contains terms (T), factors (F) and numbers (n); n can be any number. Σ = { +, *, (, ), n }', 'S → E\nE → E + T | T\nT → T * F | F\nF → n | ( E )', 'Present parse trees for:\na) n*(n+n)   (for example 2*(1+6))\nb) n+n*n   (for example 5+5*2)\nc) n*n+n'],
    answer: [
      'In this grammar, the lower a nonterminal is, the stronger it binds. F handles numbers and parentheses (E). Since T is below E in the grammar, * binds more tightly than +, so + is applied last (it is higher up in the tree).',
      'a) n*(n+n):',
      { code: treeText(expressionTree('n*(n+n)')) },
      'b) n+n*n (the * is inside a T, so it is computed first):',
      { code: treeText(expressionTree('n+n*n')) },
      'c) n*n+n (the n*n is a T, then the + joins it with the last n):',
      { code: treeText(expressionTree('n*n+n')) },
      'Also: the trees above are drawn by the same rules as the teacher\'s page (read them top to bottom; each node\'s children are one production of the grammar).',
    ] },
]
