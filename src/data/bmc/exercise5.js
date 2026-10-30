// Exercise 5 (questions and the teacher's answers), one task per page of public/docs/bmc-exercise-5.pdf
// (T2 uses pages 2-4, T5 pages 7-9; the page images are in public/docs/pages). Lines starting "Also" are added here.
import { node, treeText } from './trees'

const base = { subject: 'bmc', week: 4, topic: 'bmc-ex5', kind: 'paper', exercise: 'Exercise 5', pdf: 'bmc-exercise-5.pdf' }
const n = node
// parse trees for S → A, A → aAc | B, B → bBc | C, C → cC | c
const C = (k) => (k === 1 ? n('C', n('c')) : n('C', n('c'), C(k - 1)))
const B = (b, k) => (b === 0 ? n('B', C(k)) : n('B', n('b'), B(b - 1, k), n('c')))
const A = (a, b, k) => (a === 0 ? n('A', B(b, k)) : n('A', n('a'), A(a - 1, b, k), n('c')))
const tree = (a, b, k) => treeText(n('S', A(a, b, k)))

export const questions = [
  { ...base, id: 'bmc-x5-1', page: 1, title: 'X5 T1. Parse trees for a^k b^l c^m, k + l < m',
    prompt: ['In task 3 of the previous exercises there was a pushdown automaton whose language consists of the words { a^k b^l c^m | k + l < m, k, l, m ∈ N }, for example abcccc. The grammar was defined as follows:', 'S → A\nA → aAc | B\nB → bBc | C\nC → cC | c', 'Present parse trees for the words aabbccccc, bbccc, c and acc. Try to parse aabbccc.'],
    answer: [
      'Every a is produced together with one c (A → aAc), every b with one c (B → bBc), and C produces the extra c\'s in the middle (at least one).',
      'aabbccccc:', { code: tree(2, 2, 1) },
      'bbccc:', { code: tree(0, 2, 1) },
      'c:', { code: tree(0, 0, 1) },
      'acc:', { code: tree(1, 0, 1) },
      'aabbccc cannot be parsed. After a a b b the tree has already produced four c\'s around the middle (two from A → aAc, two from B → bBc), and C must still produce at least one more c, so every word starting aabb has at least 5 c\'s. aabbccc has only 3 (k + l = 4 is not < m = 3).',
    ] },
  { ...base, id: 'bmc-x5-2', page: 2, pages: [2, 3, 4], title: 'X5 T2. Regular or not? Three grammars',
    prompt: ['Consider the following context-free grammars over the alphabet Σ = {a, b}. Determine what kind of language each grammar generates. If the language turns out to be regular, present the corresponding regular expression or finite automaton. If the language is not regular, briefly explain why its recognition exceeds the computational power of a finite automaton.', 'a) S → ε | ABS,  A → a | bA,  B → ε | bBb\nb) S → ε | ASB,  A → a,  B → b | bBb\nc) S → ε | ASB,  A → a | bA,  B → ε | bBb'],
    answer: [
      'a) Examine derivations: S → ε gives the empty string. A → bA | a produces 0...n b\'s and then an a: A = b*a. B → bBb | ε produces 0...n strings "bb": B = (bb)*. S → ABS adds a new pair AB after the previous ones: ABAB... So the words have the form (b*a)(bb)*(b*a)(bb)*... and the language is regular:',
      { code: '(b*a(bb)*)*' },
      'b) A produces exactly one a, B produces at least one b (b, bbb, bbbbb ...: an odd number). S → ASB puts one A on the left and one B on the right, so for every a there is a B on the right: S ⇒ aSb ⇒ aaSbb ⇒ aaabbb (aⁿbⁿ), or with B → bBb more b\'s (aaabbbbbbbbb). The number of b\'s can exceed the number of a\'s but can never be smaller. Not regular: checking that #b ≥ #a for an unbounded number of a\'s needs a memory that a finite automaton does not have. A pushdown automaton is required (push for every a, pop for b\'s).',
      'c) A = b*a, B = (bb)* and S → ASB produces A^k ... B^k: the words have the form (b*a)(b*a)...(bb)*(bb)*... A pure b-string like bbbb is impossible, because a B (bb) can only come with a matching A, which ends in a.',
      'Also (correction): the teacher\'s page argues that c) needs counting, but B can also produce ε, so the number of B\'s cannot be seen in the word: (bb)*(bb)*...(bb)* with k ≥ 1 factors is just (bb)*. The language is ε | (b*a)(b*a)*(bb)*, which is regular. The test versions of this task (see Extra practice) also say that exactly one grammar is not regular, and that is b) (test grammar (e)).',
    ] },
  { ...base, id: 'bmc-x5-3', page: 5, title: 'X5 T3. Match the grammars with the languages',
    prompt: ['Below are context-free grammars over the alphabet Σ = {0, 1}. Match the grammars with the following verbal descriptions of languages. One description doesn\'t have a corresponding grammar. Write the missing grammar.', 'a) strings that contain the substring 111\nb) strings that have an equal number of zeros and ones\nc) strings whose length is odd\nd) strings that have at least two symbols, and whose first and last symbol are the same', '1) S → BA,  A → BBA | ε,  B → 0 | 1\n2) S → A111A,  A → 0A | 1A | ε\n3) S → 0A0 | 1A1,  A → 0A | 1A | ε\n4) S → SS | 0S1 | 1S0 | ε'],
    answer: [
      'a) ↔ 2: S → A111A puts 111 somewhere, A produces any string before and after.',
      'c) ↔ 1: S → BA gives one symbol, A → BBA adds two symbols at a time, so the length is always odd.',
      'd) ↔ 3: S → 0A0 | 1A1 starts and ends with the same symbol, A is anything in between (so at least two symbols).',
      'b) ↔ 4: 0S1 and 1S0 always add one 0 and one 1 together, and SS joins two such strings, so the numbers of 0\'s and 1\'s are always equal. (Also: as printed, grammar 4 is exactly the grammar of b, so every description has a grammar. If your sheet has a different grammar 4, S → SS | 0S1 | 1S0 | ε is the missing one.)',
    ] },
  { ...base, id: 'bmc-x5-4', page: 6, title: 'X5 T4. Which model recognizes each language?',
    prompt: ['Consider the following languages over the alphabet Σ = {0, 1}. Describe in your own words what kinds of strings belong to each language. State what kind of computational model is required to recognize each and why.', 'a) { 0ⁿ1ⁿ | n ≥ 1 }\nb) { (0|1)*10 }\nc) { 0ⁿ0ⁿ | n ∈ N }\nd) { 0ᵖ1ʳ0ᵖ⁻ʳ | p ≥ r }'],
    answer: [
      'a) n zeros followed by n ones. A PDA: it pushes the zeros onto the stack and pops a zero for each one, ensuring the two quantities are equal. (A finite automaton cannot count n.)',
      'b) Binary strings that end with 10, the regular expression (0|1)*10. A finite automaton: it only has to remember the last two symbols (three states).',
      'c) An even number of zeros, (00)*. The number n does not link two separate blocks, so a finite automaton with two states (even / odd so far) is enough.',
      'd) p zeros, then r ones, then p − r zeros (p ≥ r keeps the last block non-negative), for example 000100 and 0010. A PDA: push the initial zeros, pop one for each 1, then pop one for each of the final zeros.',
    ] },
  { ...base, id: 'bmc-x5-5', page: 7, pages: [7, 8, 9], title: 'X5 T5. A Turing machine for a^k b^l c^(k+l)',
    prompt: ['In task 1 of the previous exercises there was a PDA for the words { a^k b^l c^(k+l) | k, l ∈ N }, for example aabbcccc. Construct the corresponding Turing machine.'],
    answer: [
      'Idea: repeatedly mark one unmarked a (later each b) and for each mark exactly one unmarked c. If at any point a needed c is missing, reject. When no a or b remains, accept if and only if no unmarked c remains.',
      { code: 'findA, findB   scan for an unmarked a / b, mark it (X / Y) and go to find a c\nprepB          if no a is found, switch to the b phase: move left to the tape start\nA_toC, B_toC   move right to find an unmarked c for the a / b and mark it (Z); if none: reject\nretA, retB     move left to the tape start and go back to the find state\ncheck          make sure no unmarked c is left: if one is found reject, otherwise go to OK' },
      'The second version on the teacher\'s pages marks the rightmost c each time (go to the right-end blank, then left to the first unmarked c). The principle is the same.',
    ] },
  { ...base, id: 'bmc-x5-6', page: 10, title: 'X5 T6. Make the expression grammar unambiguous',
    prompt: ['The following grammar was presented in the lectures. It was noted to be ambiguous and did not include operator precedence in any way. How would you modify the grammar to make it unambiguous?', '<E> → <D>\n<E> → ( <E> )\n<E> → <E> + <E>\n<E> → <E> - <E>\n<E> → <E> * <E>\n<E> → <E> / <E>\n<D> → 0 | 1 | 2 | ... | 9'],
    answer: [
      'In the original grammar all operators are on the same level, so it does not enforce precedence. For 1+2*3 it allows two parse trees: one groups (1+2)*3, the other 1+(2*3). Both are valid but give different results.',
      { code: '<E> → <T> | <E> + <T> | <E> - <T>\n<T> → <F> | <T> * <F> | <T> / <F>\n<F> → <D> | ( <E> )\n<D> → 0 | 1 | 2 | ... | 9' },
      'The modified grammar follows normal math precedence. <E> handles + and − (lowest precedence), so expressions are split around them first. <T> handles * and /, grouped inside each <E>. <F> handles digits and parentheses (highest precedence): parentheses force grouping and digits are the basic units. Writing <E> + <T> (not <E> + <E>) also makes the operators group from the left: 1-2-3 = (1-2)-3.',
    ] },
]
