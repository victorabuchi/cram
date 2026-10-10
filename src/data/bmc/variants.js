// Practice: every exercise task again with different values, with the answers. Each variant has `of` (the exercise task it
// repeats), the question, and the answer as text and, where there is one, as a diagram (`diagram` in the question, `answerDiagram` in the
// answer, both in the text format of src/automata/model.js). variants.test.js checks the diagrams and grammars against the languages they claim.
import { expressionTree, node, treeText } from './trees'

const base = { subject: 'bmc', kind: 'paper' }
const ids = (n, prefix = 'q') => Array.from({ length: n }, (_, i) => `${prefix}${i}`)

// ---------- generators for the automata ----------
// "Sum modulo n" automaton: from qi, reading k goes to q((i + k) mod n); accepts q0.
const sumMod = (n, symbols) => `start: q0
accept: q0
layout: circle
${ids(n).flatMap((s, i) => symbols.map((k) => `${s} ${k} -> q${(i + k) % n}`)).join('\n')}`

// The same with negative values: "-" leads to a minus-remembering copy qi-, where the next digit is subtracted.
const sumModNegative = (n, symbols) => `start: q0
accept: q0
layout: circle
${ids(n).flatMap((s, i) => symbols.map((k) => `${s} ${k} -> q${(i + k) % n}`)).join('\n')}
${ids(n).map((s) => `${s} - -> ${s}-`).join('\n')}
${ids(n).flatMap((s, i) => symbols.map((k) => `${s}- ${k} -> q${(((i - k) % n) + n) % n}`)).join('\n')}`

// Two parities (of b and of c) over {a, b, c}: state "b?c?"; b flips the first, c the second, a changes nothing.
const parity2 = (accepting) => `start: b0c0
accept: ${accepting.join(' ')}
b0c0 a -> b0c0
b0c1 a -> b0c1
b1c0 a -> b1c0
b1c1 a -> b1c1
b0c0 b -> b1c0
b1c0 b -> b0c0
b0c1 b -> b1c1
b1c1 b -> b0c1
b0c0 c -> b0c1
b0c1 c -> b0c0
b1c0 c -> b1c1
b1c1 c -> b1c0
at b0c0 0 0
at b1c0 280 0
at b0c1 0 230
at b1c1 280 230`

export const AUTOMATA = {
  sum5: sumMod(5, [1, 2, 4]),
  sum5neg: sumModNegative(5, [1, 2, 4]),
  noAba: `start: q0
accept: q0 qa qab
q0 b -> q0
q0 a -> qa
qa a -> qa
qa b -> qab
qab b -> q0
qab a -> trap
trap a b -> trap
at q0 0 0
at qa 190 -100
at qab 380 0
at trap 570 0`,
  contains11: `start: q0
accept: q2
q0 0 -> q0
q0 1 -> q1
q1 0 -> q0
q1 1 -> q2
q2 0 1 -> q2
at q0 0 0
at q1 200 0
at q2 400 0`,
  has42: `# an incomplete DFA like the teacher's: a missing transition simply rejects
start: new
accept: 42 OK
new 4 -> 4
new [0-35-9] -> nope
new , -> new
4 2 -> 42
4 , -> new
4 [0-13-9] -> nope
42 , -> OK
42 [0-9] -> nope
OK , [0-9] -> OK
nope [0-9] -> nope
nope , -> new
at new 0 0
at 4 190 0
at 42 380 0
at OK 570 0
at nope 190 190`,
  evenB: `start: even
accept: even
even a c -> even
even b -> odd
odd a c -> odd
odd b -> even
at even 0 0
at odd 260 0`,
  bEvenOrCOdd: parity2(['b0c0', 'b0c1', 'b1c1']),
  bEvenXorCOdd: parity2(['b0c0', 'b1c1']),
  div8: `start: z0
accept: z3
z0 1 -> z0
z0 0 -> z1
z1 1 -> z0
z1 0 -> z2
z2 1 -> z0
z2 0 -> z3
z3 1 -> z0
z3 0 -> z3
layout: circle`,
  minimizeMe: `start: q0
accept: q3 q4
q0 a -> q1
q0 b -> q2
q1 a -> q3
q1 b -> q4
q2 a -> q3
q2 b -> q4
q3 a -> q3
q3 b -> q4
q4 a -> q3
q4 b -> q4
q5 a -> q1
q5 b -> q5
at q0 0 100
at q1 200 20
at q2 200 180
at q3 400 20
at q4 400 180
at q5 0 260`,
  minimized: `start: A
accept: C
A a b -> B
B a b -> C
C a b -> C
at A 0 0
at B 200 0
at C 400 0`,
  hasAb: `start: S
accept: B
S b -> S
S a -> A
A a -> A
A b -> B
B a b -> B
at S 0 0
at A 200 0
at B 400 0`,
  signedDecimal: `start: N
accept: D F
N + - -> M
N [0-9] -> D
M [0-9] -> D
D [0-9] -> D
D . -> P
P [0-9] -> F
F [0-9] -> F
at N 0 0
at M 200 -110
at D 400 0
at P 600 0
at F 800 0`,
  secondLastA: `# nondeterministic: from S an a may stay in S or move on
start: S
accept: F
S a b -> S
S a -> A
A a b -> F
at S 0 0
at A 220 0
at F 440 0`,
  evenA: `start: E
accept: E
E b -> E
E a -> O
O b -> O
O a -> E
at E 0 0
at O 240 0`,
  nfaPair: `start: S
accept: A B
S a -> A
S a -> B
A b -> A
B c -> B
at S 0 100
at A 240 20
at B 240 180`,
  endsIn1: `start: S0
accept: S1
S0 0 -> S0
S0 1 -> S1
S1 0 -> S0
S1 1 -> S1
at S0 0 0
at S1 240 0`,
  weighted4: `start: q0
accept: q0
layout: circle
q0 a -> q1
q0 b -> q2
q1 a -> q2
q1 b -> q3
q2 a -> q3
q2 b -> q0
q3 a -> q0
q3 b -> q1`,
  weighted4Q2: `start: q0
accept: q0 q2
layout: circle
q0 a -> q1
q0 b -> q2
q1 a -> q2
q1 b -> q3
q2 a -> q3
q2 b -> q0
q3 a -> q0
q3 b -> q1`,
}

// Pushdown automata as data (shown in the answers and run in the tests). A rule is [state, read, top, next, push]:
// in `state`, reading `read` ('' = nothing) with `top` on top of the stack, go to `next` and replace the top by `push` (top first, '' = pop).
// A word is accepted when the input is used up in an accepting state.
export const PDAS = {
  abc2: { start: 'A', accept: ['ok'], rules: [
    ['A', 'a', 'Z', 'A', 'ccZ'], ['A', 'a', 'c', 'A', 'ccc'],
    ['A', 'b', 'Z', 'B', 'cZ'], ['A', 'b', 'c', 'B', 'cc'], ['B', 'b', 'c', 'B', 'cc'],
    ['A', 'c', 'c', 'C', ''], ['B', 'c', 'c', 'C', ''], ['C', 'c', 'c', 'C', ''],
    ['A', '', 'Z', 'ok', ''], ['C', '', 'Z', 'ok', ''],
  ] },
  atMost: { start: 'A', accept: ['ok'], rules: [
    ['A', 'a', 'Z', 'A', 'cZ'], ['A', 'a', 'c', 'A', 'cc'],
    ['A', 'b', 'Z', 'B', 'cZ'], ['A', 'b', 'c', 'B', 'cc'], ['B', 'b', 'c', 'B', 'cc'],
    ['A', 'c', 'c', 'C', ''], ['B', 'c', 'c', 'C', ''], ['C', 'c', 'c', 'C', ''],
    ['A', '', 'Z', 'ok', 'Z'], ['C', '', 'Z', 'ok', 'Z'], ['ok', 'c', 'Z', 'ok', 'Z'],
  ] },
  brackets: { start: 'q', accept: ['ok'], rules: [
    ...['Z', '(', '['].flatMap((top) => [['q', '(', top, 'q', `(${top}`], ['q', '[', top, 'q', `[${top}`]]),
    ['q', ')', '(', 'q', ''], ['q', ']', '[', 'q', ''],
    ['q', '', 'Z', 'ok', ''],
  ] },
}

// The rules the way JFLAP and the teacher write them: "read, top ; replacement".
export const pdaText = (pda) => pda.rules.map(([from, read, top, to, push]) => `${from} → ${to}:  ${read || 'ε'}, ${top} ; ${push || 'ε'}`).join('\n')

// Grammars as text (for the answers and for the tests).
export const GRAMMARS = {
  intLiteral: 'S → 0X | NY\nX → l | ε\nY → TY | X\nN → 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9\nT → 0 | N',
  binaryLiteral: 'S → 0A\nA → bX\nX → _Y | 0Z | 1Z\nY → 0Z | 1Z\nZ → _Y | 0Z | 1Z | ε',
  abc2: 'S → aScc | B\nB → bBc | ε',
  atMost: 'S → A\nA → aAc | B\nB → bBc | C\nC → cC | ε',
  ambiguous: 'E → E+E | E*E | n',
}

const v = (of, id, title, prompt, answer, extra = {}) => ({ ...base, id: `bmc-v-${id}`, of, exercise: 'Practice', title, prompt, answer, ...extra })

export const variants = [
  // ---------- Exercise 1 ----------
  v('bmc1-d1', 'x1t1', 'P1 T1. Sum modulo 5',
    ['Make an automaton: Σ = {1, 2, 4}. The automaton sums the numbers it receives modulo 5. The automaton accepts the input when the sum is 0 (mod 5).'],
    [
      'Q = {q0, q1, q2, q3, q4}, Σ = {1, 2, 4}, s = q0, F = {q0}. State qi means "the sum so far leaves remainder i when divided by 5".',
      'δ(qi, k) = q((i + k) mod 5). From q0: δ(q0,1) = q1, δ(q0,2) = q2, δ(q0,4) = q4. From q1: q2, q3, q0 (1 + 4 = 5, remainder 0). From q2: q3, q4, q1. From q3: q4, q0, q2. From q4: q0, q1, q3.',
      'Every state has an arrow for each of 1, 2 and 4. Check: 1 2 2 → q1, q3, q0 (sum 5, accepted). 4 4 → q4, q3 (sum 8, remainder 3, rejected).',
    ], { answerDiagram: AUTOMATA.sum5 }),
  v('bmc1-d2', 'x1t2', 'P1 T2. Negative values, modulo 5',
    ['Modify the previous automaton (Σ = {1, 2, 4}, modulo 5) so that it also accepts the negative values -1, -2, -4. Explain why a transition labelled "-1" is not allowed.'],
    [
      'A DFA arrow reads ONE symbol of a finite alphabet, δ: Q × Σ → Q. "-1" is two characters, so it cannot label an arrow. Add "-" to the alphabet: Σ = {1, 2, 4, -}.',
      'Add a minus-remembering copy of every state: q0-, q1-, ..., q4-. δ(qi, -) = qi-. From qi- a digit is SUBTRACTED: δ(qi-, k) = q((i - k) mod 5). Example: δ(q0-, 1) = q4 (0 - 1 = -1, and -1 mod 5 = 4), δ(q1-, 2) = q4 (1 - 2 = -1), δ(q3-, 4) = q4 (3 - 4 = -1).',
      'The old arrows for positive numbers stay as they were. Check: "-1 1" goes q0 → q0- → q4 → q0 (sum 0, accepted).',
    ], { answerDiagram: AUTOMATA.sum5neg }),
  v('bmc1-d3', 'x1t3', 'P1 T3. No substring aba',
    ['Make an automaton (Σ = {a, b}) that does not accept any input containing the string aba as a part (but accepts all others).'],
    [
      'Remember how much of "aba" has just been read. q0 = nothing useful yet; qa = the last symbol was a; qab = the last two symbols were ab; trap = "aba" was seen (not accepting, loops on a and b for ever).',
      'Arrows: q0 -b→ q0, q0 -a→ qa; qa -a→ qa (the new a may start another aba), qa -b→ qab; qab -b→ q0, qab -a→ trap (aba completed!); trap loops on a and b.',
      'Accepting states: q0, qa, qab (everything except the trap). Check: "abba" ends in qa, accepted. "baba" reaches the trap, rejected.',
    ], { answerDiagram: AUTOMATA.noAba }),
  v('bmc1-d4', 'x1t4', 'P1 T4. Read a DFA and solve the chains',
    ['The DFA is defined as follows: Q = {q0, q1, q2}, Σ = {0, 1}, δ(q0,0) = q0, δ(q0,1) = q1, δ(q1,0) = q0, δ(q1,1) = q2, δ(q2,0) = δ(q2,1) = q2, s = q0, F = {q2}.', 'Draw the automaton. What does it do? Solve the δ-transitions as a chain for 0110 and 10101, that is, expand δ(q0, 0110) and δ(q0, 10101).'],
    [
      'It accepts exactly the bit strings that contain the substring 11: q1 means "the last symbol was 1", and q2 means "11 has been seen" (accepting, and it stays there).',
      'Chain for 0110: q0 -0→ q0 -1→ q1 -1→ q2 -0→ q2. It ends in q2, so it is accepted.',
      'Chain for 10101: q0 -1→ q1 -0→ q0 -1→ q1 -0→ q0 -1→ q1. It ends in q1, which is not accepting, so it is rejected.',
    ], { answerDiagram: AUTOMATA.contains11 }),
  v('bmc1-d5', 'x1t5', 'P1 T5. List contains 42',
    ['Make a DFA that reads numbers separated by commas (,) from a list and accepts if the list contains the number 42. For example 7,42,100 and 42 would be accepted, but 142,5,24 would not.'],
    [
      'Follow the digits of the CURRENT number. States: new (start of a number), 4 (read 4), 42 (read exactly 42 so far, accepting), OK (found it: accepting and absorbing), nope (this number is not 42).',
      'Arrows: new -4→ 4 -2→ 42; from 42, a comma → OK. A comma from new, 4 or nope → new (next number). Any digit that does not continue 42 → nope until the next comma, and a digit after 42 (like 421) → nope. OK loops on digits and commas.',
      'Check: 7,42,100 reaches OK. 42 alone ends in the accepting state 42. 142,5,24 never does: 142 goes to nope, 24 goes to nope.',
    ], { answerDiagram: AUTOMATA.has42 }),
  v('bmc1-d6a', 'x1t6a', 'P1 T6 a). Even number of b',
    ['Let the alphabet be Σ = {a, b, c}. Construct an automaton that accepts exactly the strings in which the number of b is even (0, 2, 4 ...). Justify why your automaton accepts every string it should accept, but none of the strings it should not accept.'],
    [
      'Two states: even (start, accepting) and odd. Reading b switches between them; a and c are loops on both states.',
      'Justification: the automaton is in state even exactly when an even number of b has been read, so it accepts exactly the strings with an even number of b. The empty string is accepted (zero b is even).',
    ], { answerDiagram: AUTOMATA.evenB }),
  v('bmc1-d6b', 'x1t6b', 'P1 T6 b). b even OR c odd',
    ['Let the alphabet be Σ = {a, b, c}. Construct an automaton that accepts exactly the strings in which the number of b is even OR the number of c is odd. Justify.'],
    [
      'Remember two parities, so four states: b0c0, b0c1, b1c0, b1c1 (number of b even/odd, number of c even/odd). b flips the first part, c flips the second part, a changes nothing. Start in b0c0.',
      'Accepting states: where b is even or c is odd: b0c0 (b even), b0c1, b1c1 (c odd). Not accepting: b1c0 (b odd and c even).',
    ], { answerDiagram: AUTOMATA.bEvenOrCOdd }),
  v('bmc1-d6c', 'x1t6c', 'P1 T6 c). Either b even or c odd',
    ['Let the alphabet be Σ = {a, b, c}. Construct an automaton that accepts exactly the strings in which EITHER the number of b is even OR the number of c is odd (exactly one of the two). Justify.'],
    [
      'Use the same four states and arrows as in b). Only the accepting states change, because "either ... or" is exclusive.',
      'Truth table: b even and c even → only the first is true → accept (b0c0). b even and c odd → both true → reject. b odd and c even → neither → reject. b odd and c odd → only the second is true → accept (b1c1). So F = {b0c0, b1c1}.',
    ], { answerDiagram: AUTOMATA.bEvenXorCOdd }),

  // ---------- Exercise 2 ----------
  v('bmc-x2-1', 'x2t1', 'P2 T1. Binary numbers divisible by eight',
    ['a) What do all binary representations of numbers divisible by eight have in common?', 'b) Create an automaton that accepts all binary numbers divisible by eight.'],
    [
      'a) The last three bits are 000. (1000 = 8, 10000 = 16, 11000 = 24, 101000 = 40.) The places left of the last three bits are worth 8, 16, 32 ..., all multiples of 8.',
      'b) Count the zeros at the end: z0 = the last bit was 1 (or nothing yet), z1 = one 0 at the end, z2 = two 0s, z3 = three or more 0s (accepting). Reading 1 always goes back to z0; reading 0 goes z0 → z1 → z2 → z3, and z3 stays in z3 on 0.',
      'This version rejects the short words 0 and 00 (they have fewer than three bits). To accept the single 0 as well, make z0 accepting too, or start there.',
    ], { answerDiagram: AUTOMATA.div8 }),
  v('bmc-x2-2', 'x2t2', 'P2 T2. Minimize the automaton',
    ['Minimize the automaton according to the method presented in the lecture.', 'Σ = {a, b}, start q0, accepting q3 and q4. δ(q0,a)=q1, δ(q0,b)=q2; δ(q1,a)=q3, δ(q1,b)=q4; δ(q2,a)=q3, δ(q2,b)=q4; δ(q3,a)=q3, δ(q3,b)=q4; δ(q4,a)=q3, δ(q4,b)=q4; δ(q5,a)=q1, δ(q5,b)=q5.'],
    [
      'q5 is unreachable (no arrow leads to it): remove it.',
      'P0 = {{q3, q4}, {q0, q1, q2}} (accepting and not accepting). q3 and q4 stay together: both go to {q3, q4} on both a and b. In {q0, q1, q2}: q0 goes to {q1, q2} on both symbols (not accepting group), but q1 and q2 go to {q3, q4} on both symbols. So q0 is split off.',
      'P1 = {{q0}, {q1, q2}, {q3, q4}}. q1 and q2 behave the same (both go to {q3, q4} on a and b), so nothing splits any more. The minimized automaton has three states: {q0} → {q1,q2} → {q3,q4}, accepting every word with at least two symbols.',
    ], { diagram: AUTOMATA.minimizeMe, answerDiagram: AUTOMATA.minimized }),
  v('bmc-x2-3', 'x2t3', 'P2 T3. Grammar to automaton',
    ['Create an automaton corresponding to the grammar below. What could be the language accepted by the automaton? The start symbol of the grammar is S.', 'S → aA | bS\nA → aA | bB\nB → aB | bB | λ'],
    [
      'Each nonterminal is a state, each rule X → yZ an arrow X -y→ Z, and X → λ makes X accepting. So: S -b→ S, S -a→ A, A -a→ A, A -b→ B, B loops on a and b, and B is accepting.',
      'Language: strings that contain the substring ab. S waits (b loops), after an a the machine is in A, an a keeps it in A, and the first b after an a ("ab") moves to B, which accepts whatever follows. L = { w ∈ {a,b}* | w contains ab }.',
    ], { answerDiagram: AUTOMATA.hasAb }),
  v('bmc-x2-4', 'x2t4', 'P2 T4. Signed decimal numbers',
    ['Create a DFA that accepts signed decimal numbers described by this EBNF:', 'number ::= [ "+" | "-" ] digit { digit } [ "." digit { digit } ]\ndigit ::= 0 | 1 | 2 | ... | 9\n\n::= "is defined as", | or, [] optional element, {} repeat 0...n times. So +5, -12.50 and 7 are numbers, but 5. and .5 are not.'],
    [
      'States: N (start), M (after the sign), D (digits of the integer part, accepting), P (after the dot), F (digits after the dot, accepting).',
      'Arrows: N -"+" or "-"→ M; N -[0-9]→ D; M -[0-9]→ D; D loops on [0-9]; D -.→ P; P -[0-9]→ F; F loops on [0-9]. A dot must be followed by at least one digit, so P is not accepting; at least one digit is needed before the dot or the end, so N and M are not accepting.',
    ], { answerDiagram: AUTOMATA.signedDecimal }),
  v('bmc-x2-5', 'x2t5', 'P2 T5. Integer literal grammar',
    ['A decimal integer literal is 0, or a non-zero digit followed by any digits, and may end with the type suffix l. So 0, 7, 120 and 99l are literals, but 007, l and 12ll are not.', 'Create a simplified grammar using the notation used in the lecture: each nonterminal is represented by a single uppercase letter and each input symbol by a lowercase letter or a digit. Alternatives are separated by |. Repetition is produced recursively using the empty symbol (ε), for example Y → 1Y | ε.'],
    [
      GRAMMARS.intLiteral,
      'S is the literal; after the single digit 0 only the optional suffix may follow (X), after a non-zero digit N any number of digits T may follow (Y → TY), and then the optional suffix X. T is any digit, N a non-zero digit. The optional parts are "X → l | ε" and the repetition "Y → TY | X".',
      'Check: 120l = S → NY → 1Y → 1TY → 12Y → 12TY → 120Y → 120X → 120l. And 007 cannot be derived: after 0 only X can follow.',
    ]),
  v('bmc-x2-6', 'x2t6', 'P2 T6. NFA: second-to-last character is a',
    ['The strings accepted consist of the characters a and b (Σ = {a, b}). The second-to-last character of the string must be a. Implement a nondeterministic automaton that accepts the language.'],
    [
      'The automaton guesses nondeterministically which a is the second-to-last character. State S loops on a and b. On an a it may also move to state A (the guess "this a is second to last"). From A any one more symbol leads to F, which is accepting and has no arrows (a longer word would make the guess wrong).',
      'Arrows: S -a,b→ S; S -a→ A; A -a,b→ F. F accepts.',
      'Check: "bab" is accepted (guess the a, then b). "abb" is rejected (the only a is third from the end). "aa" is accepted.',
    ], { answerDiagram: AUTOMATA.secondLastA }),

  // ---------- Exercise 3 ----------
  v('bmc-x3-1', 'x3t1', 'P3 T1. Grammar and regular expression from a DFA',
    ['Convert this automaton (it accepts the strings over {a, b} with an even number of a: states E (start, accepting) and O; E -b→ E, E -a→ O, O -b→ O, O -a→ E)', 'a) into a grammar', 'b) into a regular expression'],
    [
      'a) Each state is a nonterminal; each arrow X -y→ Z is a rule X → yZ; an accepting state also gets X → ε.\nE → bE | aO | ε\nO → bO | aE',
      'b) Every a must be paired with a later a, and any number of b may stand anywhere: (b | a b* a)*. Read it as: repeat "a single b" or "an a, any b, then another a".',
    ], { diagram: AUTOMATA.evenA }),
  v('bmc-x3-2', 'x3t2', 'P3 T2. Two machines as grammars',
    ['Convert these two machines into grammars. How do the grammars differ from each other?', 'Machine 1: start S, accepting A and B. S -a→ A, S -a→ B, A -b→ A, B -c→ B.', 'Machine 2: start S0, accepting S1. S0 -0→ S0, S0 -1→ S1, S1 -0→ S0, S1 -1→ S1.'],
    [
      'Machine 1:\nS → aA | aB\nA → bA | ε\nB → cB | ε',
      'Machine 2:\nS0 → 0S0 | 1S1\nS1 → 0S0 | 1S1 | ε',
      'The difference: machine 1 is nondeterministic. From S there are two arrows on the same symbol a (to A and to B), so S has two rules that start with a. Machine 2 is deterministic: every state has exactly one arrow (one rule) for each symbol 0 and 1.',
    ], { diagram: AUTOMATA.nfaPair }),
  v('bmc-x3-3', 'x3t3', 'P3 T3. Regular or context-free?',
    ['Look at these three grammars (S is the start symbol):', 'G1: S → aS | b\nG2: S → aSb | ε\nG3: S → AB, A → aA | a, B → bB | b', 'a) Which of them are regular grammars (right-linear: a terminal followed by at most one nonterminal), and which are only context-free?', 'b) Which of the three languages are regular? Justify briefly.'],
    [
      'a) G1 is regular: every rule is a terminal with at most one nonterminal after it. G2 is context-free only: S → aSb has the nonterminal in the middle, with a terminal on both sides. G3 is context-free as written: S → AB has two nonterminals on the right-hand side (it is neither left-linear nor right-linear).',
      'b) G1 gives the language a*b, which is regular (a loop on a, then one b). G2 gives { aⁿbⁿ | n ≥ 0 }, which is NOT regular: a finite automaton cannot count an unlimited number of a. G3 gives the language a⁺b⁺ (at least one a, then at least one b), which is regular, even though this grammar is not in regular form: the regular grammar S → aA, A → aA | bB, B → bB | ε describes exactly the same language. So a language can be regular although a given grammar for it is not.',
    ]),
  v('bmc-x3-4', 'x3t4', 'P3 T4. What does the automaton accept?',
    ['Answer based on the diagram. Σ = {a, b}, start q0, accepting only q0.', 'a) What lengths of words can the automaton accept (for which lengths is there at least one accepted word)?', 'b) What is the formal language it accepts?'],
    [
      'b) L = { w ∈ {a,b}* | |w|a + 2|w|b ≡ 0 (mod 4) }: each a is worth 1, each b is worth 2, and the weighted sum must be a multiple of 4. The state qi means "the weighted sum is i mod 4".',
      'a) The empty word is accepted. Length 1: the weights are 1 (a) or 2 (b), never a multiple of 4, so no word of length 1 is accepted. Length 2: aa = 2, ab = 3, bb = 4, so bb is accepted. Length n ≥ 2: the total weight can be any value from n (all a) to 2n (all b), and for n ≥ 2 that range contains a multiple of 4 (for example, n = 3: aab = 4; n = 4: aaaa = 4). So some word is accepted for every length except 1.',
    ], { diagram: AUTOMATA.weighted4 }),
  v('bmc-x3-5', 'x3t5', 'P3 T5. Minimal? And what if q2 accepts?',
    ['Answer based on the same diagram as in the previous task (the automaton with the weighted sum modulo 4: a = 1, b = 2, start q0, accepting only q0).', 'a) Is the automaton already minimal or could it still be minimized? Justify briefly.', 'b) If q2 is changed from rejecting to accepting, what is the formal language it accepts now? Can the new automaton be minimized?'],
    [
      'a) It is already minimal. Partition method: P0 = {q0}, {q1, q2, q3} (accepting and not accepting). P1: q2 goes to the accepting q0 on b and q3 goes to q0 on a, but q1 goes to non-accepting states on both symbols, so q1 splits off: {q0}, {q1}, {q2, q3}. P2: q2 on a goes to q3 (inside the group) while q3 on a goes to q0 (a different group), so q2 and q3 split. All states are alone, nothing can be merged.',
      'b) With q2 accepting, the language is the weighted sum ≡ 0 or 2 (mod 4). Since each b adds 2 (0 or 2 mod 4), this is the same as "the number of a is even": |w|a even. The new automaton can be minimized: q0 and q2 behave the same, and so do q1 and q3 (q0 ≡ q2, q1 ≡ q3), so two states are enough.',
    ], { diagram: AUTOMATA.weighted4, answerDiagram: AUTOMATA.evenA }),
  v('bmc-x3-6', 'x3t6', 'P3 T6. Python binary literals',
    ['A Python binary literal starts with 0b, followed by one or more binary digits (0 or 1), and a single underscore may stand between digits or right after the 0b. So 0b1, 0b_1 and 0b1_0 are accepted, but 0b, 0b1_ and 0b__1 are not.', 'Write the grammar using the notation from the lectures (one uppercase letter per nonterminal, lowercase letters and digits as terminals). Test it with the numbers 0b101, 0b_1 and 0b1_. The last one is not accepted; why?'],
    [
      GRAMMARS.binaryLiteral,
      '0b101: S → 0A → 0bX → 0b1Z → 0b10Z → 0b101Z → 0b101 (Z → ε). 0b_1: S → 0A → 0bX → 0b_Y → 0b_1Z → 0b_1.',
      '0b1_ is rejected: after 0b1 we are in Z, the rule Z → _Y leads to Y, and Y must produce a digit (Y → 0Z | 1Z, there is no ε in Y), but the word has ended. The nonterminal Y remains, so there is no valid derivation. A final underscore is not allowed because an underscore must be followed by a digit.',
    ]),

  // ---------- Exercise 4 ----------
  v('bmc-x4-1', 'x4t1', 'P4 T1. Pushdown automaton for a^k b^l c^(2k+l)',
    ['Let\'s define the words accepted by a language such that the language includes words { a^k b^l c^(2k+l) | k, l ∈ N }. For example abccc (k = 1, l = 1) and aacccc (k = 2, l = 0).', 'Define a pushdown automaton that accepts the language.'],
    [
      'Every a is matched by TWO c, every b by one c. So: for every a push two c onto the stack, for every b push one c, and for every c pop one c. At the end only Z may be left (the stack is empty), and then the word is accepted.',
      { code: pdaText(PDAS.abc2) },
      'Reading rule: "A → A:  a, c ; ccc" means in state A, reading a with c on top, replace that c by ccc, which is two new c on top (a push of two). "C → C:  c, c ; ε" pops one c. A → ok:  ε, Z ; ε accepts the empty word (k = l = 0).',
      'Check abccc: a pushes cc, b pushes c, so the stack holds ccc; the three c pop them one by one; ε, Z ; ε leads to ok. Check abcc: after two c one c is left on the stack, so the word is rejected.',
    ]),
  v('bmc-x4-2', 'x4t2', 'P4 T2. Grammar for a^k b^l c^(2k+l)',
    ['Define a grammar for the language { a^k b^l c^(2k+l) | k, l ∈ N }.'],
    [
      'Grow the word from the middle outwards. Each a is paired with two c on the right, each b with one c, and the pairs are nested: the a pairs on the outside, the b pairs inside.',
      { code: GRAMMARS.abc2 },
      'S → aScc adds an a on the left and two c on the right. S → B stops the a part. B → bBc adds a b on the left and one c on the right. B → ε ends the word.',
      'Check abccc: S → aScc → aBcc → abBccc → abccc.',
    ]),
  v('bmc-x4-3', 'x4t3', 'P4 T3. Pushdown automaton and grammar for k + l ≤ m',
    ['Let\'s define the words accepted by a language such that the language includes words { a^k b^l c^m | k + l ≤ m, k, l, m ∈ N }. For example abcc and abccc, but not abc.', 'a) define a pushdown automaton that accepts the language', 'b) define a grammar for this language'],
    [
      'a) Push a c for every a and every b, and pop a c for every c. Now at least as many c as a and b together are enough, so when the stack is back at Z the word may be accepted, and further c may follow (they just do nothing to the stack).',
      { code: pdaText(PDAS.atMost) },
      'b) Compared with the previous exercise (strictly more c) the extra c is now optional: the nonterminal C in the middle may produce any number of c, including none.',
      { code: GRAMMARS.atMost },
      'Check abcc: a pushes c, b pushes c, two c pop them, the stack is Z, ε, Z ; Z leads to ok. Check abc: after one c a c is still on the stack, so the word cannot finish.',
    ]),
  v('bmc-x4-4', 'x4t4', 'P4 T4. A pushdown automaton for nested brackets',
    ['Define a pushdown automaton that checks that round and square brackets are correctly nested. For example ([])[()] and () are accepted, but ([)], (() and ]( are not.'],
    [
      'This is the same idea as the HTML automaton: push every opening bracket, and pop it when the matching closing bracket comes. The stack always shows which brackets are still open. A closing bracket that does not match the top has no rule, so the word is rejected.',
      { code: pdaText(PDAS.brackets) },
      'Check ([])[()]: ( [ push, ] pops [, ) pops (, then [ ( push and ) ] pop. The stack is Z, ε, Z ; ε accepts. Check ([)]: ) comes while [ is on top, no rule: rejected. Check (() : one ( is left on the stack at the end: rejected.',
    ]),
  v('bmc-x4-5', 'x4t5', 'P4 T5. Another ambiguous grammar',
    ['Consider the grammar  E → E + E | E * E | n   (Σ = { +, *, n }).', 'a) Derive the string  n + n * n  with the grammar.', 'b) Present two different parse trees for the string.', 'c) Briefly explain why the two trees differ and why this shows that the grammar is ambiguous.'],
    [
      'a) One derivation:',
      { code: 'E → E + E → n + E → n + E * E → n + n * E → n + n * n' },
      'Another derivation of the same string:',
      { code: 'E → E * E → E + E * E → n + E * E → n + n * E → n + n * n' },
      'b) Two parse trees (the first has + at the top, the second has * at the top):',
      { code: treeText(node('E', node('E', node('n')), node('+'), node('E', node('E', node('n')), node('*'), node('E', node('n'))))) },
      { code: treeText(node('E', node('E', node('E', node('n')), node('+'), node('E', node('n'))), node('*'), node('E', node('n')))) },
      'c) Both trees have the same leaves n + n * n. In the first tree the * is applied first (n * n is a subtree) and then the +, so it means n + (n * n). In the second tree the + is applied first and then the *, so it means (n + n) * n. A grammar is ambiguous when some string has two or more parse trees. Here one string has two trees with different meaning, so the grammar is ambiguous. (The grammar of exercise 4 task 6 avoids this by putting * lower than +.)',
    ]),
  v('bmc-x4-6', 'x4t6', 'P4 T6. Parse trees of arithmetic expressions',
    ['Use the grammar from exercise 4 task 6:  S → E,  E → E + T | T,  T → T * F | F,  F → n | ( E ).', 'Present parse trees for:\na) (n+n)*n\nb) n*n+n*n\nc) n+n+n'],
    [
      'The lower a nonterminal is in the grammar, the tighter it binds: * (in T) binds tighter than + (in E), and parentheses (F → ( E )) start a new expression.',
      'a) (n+n)*n: the parentheses make the sum a factor F, so the * is applied last.',
      { code: treeText(expressionTree('(n+n)*n')) },
      'b) n*n+n*n: two products (T) joined by +.',
      { code: treeText(expressionTree('n*n+n*n')) },
      'c) n+n+n: operators of the same level group from the left, so it means (n+n)+n.',
      { code: treeText(expressionTree('n+n+n')) },
    ]),
]
