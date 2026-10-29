// Exercise 7 (questions and the teacher's answers), one task per page of public/docs/bmc-exercise-7.pdf
// (t2 uses pages 2-3, t3 pages 4-5, t6 pages 8-9). Lines starting "Also" are added here.
// The automata are checked in exercise7.test.js.
import { pdaText } from './variants'

const base = { subject: 'bmc', week: 5, topic: 'bmc-ex7', kind: 'paper', exercise: 'Exercise 7', pdf: 'bmc-exercise-7.pdf' }

export const FA7 = {
  a: `start: q0\naccept: q1\nq0 a -> q0\nq0 c -> q1\nq1 b -> q1\nat q0 0 0\nat q1 220 0`,
  b: `start: q0\naccept: q0\nq0 a -> q1\nq1 b -> q0\nat q0 0 0\nat q1 220 0`,
  c: `start: q0\naccept: q0\nq0 a -> q1\nq1 b -> q2\nq2 b -> q3\nq3 a -> q0\nat q0 0 0\nat q1 200 90\nat q2 400 0\nat q3 200 -90`,
  d: `start: q0\naccept: q2\nq0 a -> q1\nq1 a -> q1\nq1 b -> q2\nq2 b -> q2\nat q0 0 0\nat q1 200 0\nat q2 400 0`,
  e: `start: q0\naccept: q8\n${Array.from({ length: 8 }, (_, i) => `q${i} 0 1 -> q${i + 1}`).join('\n')}\n${Array.from({ length: 9 }, (_, i) => `at q${i} ${i * 120} 0`).join('\n')}`,
}

export const PDA7 = {
  a: { start: 'q0', accept: ['qf'], rules: [['q0', 'a', 'Z', 'q1', 'XXZ'], ['q1', 'a', 'X', 'q1', 'XXX'], ['q1', 'b', 'X', 'q2', ''], ['q2', 'b', 'X', 'q2', ''], ['q2', '', 'Z', 'qf', '']] },
  b: { start: 'q0', accept: ['qf'], rules: [['q0', 'a', 'Z', 'q1', 'XZ'], ['q1', 'a', 'X', 'q2', 'XX'], ['q2', 'a', 'X', 'q2', 'XX'], ['q2', 'b', 'X', 'q3', ''], ['q3', 'b', 'X', 'q3', ''], ['q3', 'b', 'Z', 'q4', 'Z'], ['q4', 'b', 'Z', 'q4', 'Z'], ['q4', '', 'Z', 'qf', 'Z']] },
}

// The +1 Turing machine: [state, read, write, move, next]; '_' is the blank.
export const TM_PLUS_ONE = { start: 'q0', accept: ['q2'], rules: [['q0', '1', '1', 'R', 'q0'], ['q0', '0', '0', 'R', 'q0'], ['q0', '_', '_', 'L', 'q1'], ['q1', '1', '0', 'L', 'q1'], ['q1', '0', '1', 'S', 'q2'], ['q1', '_', '1', 'S', 'q2']] }

export const REGEX7 = {
  a: '(a|b|c)*(ac|ca)(a|b|c)*',
  b: '(a*|c*)(b(a*|c*))*',
  c: '(a*acc*|c*caa*)(b(a*|c*))*|(a*|c*)(b(a*|c*))*b(a*acc*|c*caa*)(b(a*|c*))*',
  d1: '(c(a|b)|(a|(a|)b(a|b)*)c)(a|b)*',
  d2: '(c(a|b)|b(a|b)*c|ab(a|b)*c|ac)(a|b)*',
}

export const questions = [
  { ...base, id: 'bmc-x7-1', page: 1, title: 'X7 t1. Independent set: how difficult is it?',
    prompt: ['Independent set. An independent set is a set of vertices in an undirected graph, among which there are no edges: if you take any two vertices from the set, there is no edge between them (a path between them is allowed). How difficult is it to find such a set in a graph, given the constraint that it must contain at least k vertices?'],
    answer: [
      'Checking is easy: given k vertices, just verify that no pair of them has an edge (k(k − 1)/2 pairs, polynomial). But searching for those k vertices means trying the vertex sets, 2ⁿ combinations (exponential time), with no fast general algorithm.',
      'Independent set is BOTH in NP (easy to verify) AND NP-hard (at least as hard as all NP problems), so it is NP-complete.',
    ] },
  { ...base, id: 'bmc-x7-2', page: 2, pages: [2, 3], title: 'X7 t2. Languages as regular expressions',
    prompt: ['Describe these languages over the alphabet Σ = {a, b, c} as regular expressions:', 'a) The strings in which the characters a and c appear at least once consecutively.\nb) The strings in which the characters a and c do not appear consecutively at all.\nc) The strings in which the characters a and c appear exactly once consecutively.\nd) The strings in which the character c appears exactly once, there is at least one other character besides it, and which do not start with two consecutive a characters.'],
    answer: [
      { code: `a) ${REGEX7.a}\nb) ${REGEX7.b}` },
      'b) Between the b\'s there may only be blocks of a\'s or blocks of c\'s, never both. c) Exactly one block (between b\'s) has both a and c, and it has only one change: a⁺c⁺ = a*acc* or c⁺a⁺ = c*caa*. That block comes either first or after some b:',
      { code: `c) ${REGEX7.c.replace('|(a*|c*)', '\n   | (a*|c*)')}` },
      'd) Which symbols can the word start with? c: then at least one other symbol is needed after it. b: then the one c can come later. ab: the same. ac: everything required is already there. Once everything required is there, anything except a second c is allowed (a or b):',
      { code: 'd) (c (a | b) | b (a | b)* c | ab (a | b)* c | ac) (a | b)*\n   another way:  (c (a | b) | (a | (a | ε) b (a | b)*) c) (a | b)*' },
    ] },
  { ...base, id: 'bmc-x7-3', page: 4, pages: [4, 5], title: 'X7 t3. A Turing machine that adds 1',
    prompt: ['Make a Turing machine that takes a binary number as input and adds 1 to it. For example 1101 → 1110 or 000111 → 001000.'],
    answer: [
      'Go to the right end of the number, then add 1 from the right like on paper: a 1 becomes 0 and the carry moves left; the first 0 (or the blank in front of the number) becomes 1 and the machine stops.',
      { code: 'q0: 1 ; 1, R    0 ; 0, R      (move right to the end)\nq0 → q1: □ ; □, L              (the blank after the number: step back)\nq1: 1 ; 0, L                   (1 + carry = 0, carry on)\nq1 → q2: 0 ; 1, S   □ ; 1, S   (the carry is absorbed; q2 accepts)\n\nexamples: 0 → 1,  1 → 10,  100 → 101,  111 → 1000,  1011 → 1100' },
      'In JFLAP the result looks wrong only because of where the head stops: move the pointer to the leftmost non-blank symbol to read the output. (We assume the machine outputs the whole tape.)',
    ] },
  { ...base, id: 'bmc-x7-4', page: 6, title: 'X7 t4. Draw the languages as finite automata',
    prompt: ['Draw the following languages as finite automata:', 'a) a*cb*\nb) (ab)*\nc) (abba)*\nd) a+b+\ne) (0|1)^8, an eight-character binary representation (a byte)'],
    answer: [
      'a) loop a in q0, c to the accepting q1, loop b in q1. b) q0 (start and accepting) -a→ q1 -b→ q0. c) a cycle q0 -a→ q1 -b→ q2 -b→ q3 -a→ q0, q0 accepting. d) q0 -a→ q1 (loop a) -b→ q2 (loop b, accepting). e) a chain of 8 steps q0 → q1 → ... → q8, each on 0 or 1; only q8 accepts.',
      'Missing arrows simply reject (like in JFLAP).',
    ],
    answerDiagrams: [{ label: 'a) a*cb*', text: FA7.a }, { label: 'b) (ab)*', text: FA7.b }, { label: 'c) (abba)*', text: FA7.c }, { label: 'd) a+b+', text: FA7.d }, { label: 'e) (0|1)^8', text: FA7.e }] },
  { ...base, id: 'bmc-x7-5', page: 7, title: 'X7 t5. Pushdown automata for aⁿb²ⁿ and aⁿbᵐ (m > n > 1)',
    prompt: ['Construct pushdown automata for the following languages:', 'a) L4 = { aⁿ b²ⁿ | n > 0 }\nb) L5 = { aⁿ bᵐ | m > n > 1 }'],
    answer: [
      'a) Push two X\'s for every a, pop one X for every b. When only Z is left after the b\'s, accept.',
      { code: pdaText(PDA7.a) },
      'b) n > 1: the first two a\'s are read in their own states (q0, q1), every a pushes one X. Every b pops one X; m > n: at least one more b has to be read when Z is on top (q3 → q4), and more b\'s are fine (loop in q4).',
      { code: pdaText(PDA7.b) },
    ] },
  { ...base, id: 'bmc-x7-6', page: 8, pages: [8, 9], title: 'X7 t6. The grammar F: shortest string, ambiguity, a fix',
    prompt: ['Consider the context-free grammar with alphabet Σ = {a, b, c, d}:', 'S → SS | C\nA → aB\nB → bCd | ε\nC → AD\nD → cC | ε', 'Let the language generated by it be called F.', 'a) Provide the shortest possible string belonging to F for which the derivation must use each grammar rule at least once.\nb) Draw the parse tree for your answer to part (a).\nc) Show that the grammar is ambiguous by drawing two different parse trees for some string of F.\nd) Briefly explain why the issue in part (c) is a problem that needs correction.\ne) Suggest a correction to the rules of the start nonterminal S such that the grammar still generates exactly F but no longer has the problem of part (c).'],
    answer: [
      'a) S → SS gives two C\'s, each at least "a". B → bCd adds b ... d with another C inside (at least "a"), and D → cC adds c and a C. So 2 + 3 + 2 = 7 symbols are needed, for example:',
      { code: 'S → SS → CS → CC → ADC → aBDC → aDC → aC → aAD\n  → aaBD → aabCdD → aabADdD → aabaBDdD → aabaDdD\n  → aabacCdD → aabacADdD → aabacaBDdD → aabacaDdD → aabacad\n\n(another answer of the same length: abacada)' },
      'b) The parse tree of aabacad: S → S S; the first S → C → A D → a (B → ε, D → ε); the second S → C → A D, where A → a B, B → b C d, the inner C → A D with A → a, and D → c C, C → a.',
      'c) The string aaa has two parse trees: S → SS where the first S produces aa (S → SS → CC) and the second a, or the first S produces a and the second aa. (aa)a vs a(aa).',
      'd) S → SS allows several groupings for the same string, so it has several parse trees. A parser cannot decide which structure to use, which leads to inconsistent analysis (different meanings for the same string).',
      'e) Replace S → SS | C by S → CS | C. It generates the same language F (one or more C\'s), but forces one structure (right-associative): aaa is only a(a(a)).',
    ] },
]
