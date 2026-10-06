// The automata from the Basic Models of Computation lecture and exercises, in the text format of src/automata/model.js.
// Each one is checked against the language it should accept in automata.test.js.

// Points evenly on a ring, the first one on the left (like the teacher's hexagon for T1).
const ring = (ids, radius, cx = 0, cy = 0) =>
  ids.map((id, i) => {
    const angle = Math.PI + (i / ids.length) * 2 * Math.PI
    return `at ${id} ${Math.round(cx + radius * Math.cos(angle))} ${Math.round(cy + radius * Math.sin(angle))}`
  })

export const EXACTLY_ONE_B = `# lecture: symbols a and b, the string must contain exactly one b
start: A
accept: B
A a -> A
A b -> B
B a -> B
at A 0 0
at B 230 0`

export const AT_LEAST_ONE_B = `# lecture, example 1: a word is accepted when it contains at least one b
start: A
accept: B
A a -> A
A b -> B
B a b -> B
at A 0 0
at B 230 0`

export const CONTAINS_BB = `# for comparison: a word that contains the substring bb needs three states
start: none
accept: bb
none a -> none
none b -> one
one a -> none
one b -> bb
bb a b -> bb
at none 0 0
at one 200 0
at bb 400 0`

export const PARITY_01 = `# lecture, example 2: bit string where the number of ones is odd OR the number of zeros is odd
# state "xy": x = parity of ones, y = parity of zeros
start: 00
accept: 01 10 11
00 0 -> 01
00 1 -> 10
01 0 -> 00
01 1 -> 11
10 0 -> 11
10 1 -> 00
11 0 -> 10
11 1 -> 01
at 00 0 0
at 01 260 0
at 10 0 240
at 11 260 240`

export const SUM_MOD_6 = `# T1: sums the numbers it reads modulo 6; accepts when the sum is 0 (mod 6)
start: q0
accept: q0
layout: circle
${[0, 1, 2, 3, 4, 5].flatMap((i) => [1, 2, 3].map((k) => `q${i} ${k} -> q${(i + k) % 6}`)).join('\n')}`

const ids6 = [0, 1, 2, 3, 4, 5].map((i) => `q${i}`)
const minus6 = ids6.map((s) => `${s}-`)

// T2 as the teacher built it: q0..q5 plus "minus-remembering" states q0-..q5-.
export const SUM_MOD_6_NEGATIVE = `# T2: T1 extended with a minus symbol. After "-" the automaton is in qi-, and the next digit is subtracted.
start: q0
accept: q0
${ring(ids6, 210).join('\n')}
${ring(minus6, 120).join('\n')}
${[0, 1, 2, 3, 4, 5].flatMap((i) => [1, 2, 3].map((k) => `q${i} ${k} -> q${(i + k) % 6}`)).join('\n')}
${[0, 1, 2, 3, 4, 5].map((i) => `q${i} - -> q${i}-`).join('\n')}
${[0, 1, 2, 3, 4, 5].flatMap((i) => [1, 2, 3].map((k) => `q${i}- ${k} -> q${(i - k + 6) % 6}`)).join('\n')}`

// A readable cut-out of T2: only what happens from q0.
export const SUM_MOD_6_NEGATIVE_EXCERPT = `# T2, excerpt: from q0 a minus sign leads to q0-, and the next digit goes backwards
start: q0
accept: q0
at q0 0 160
at q0- 0 0
at q1 230 300
at q2 460 160
at q3 460 0
at q4 230 -140
at q5 -230 -140
q0 1 -> q1
q0 2 -> q2
q0 3 -> q3
q0 - -> q0-
q0- 1 -> q5
q0- 2 -> q4
q0- 3 -> q3`

export const NO_ABC = `# T3: accepts every string over {a,b,c} that does NOT contain abc
start: q0
accept: q0 q_a q_ab
q0 b c -> q0
q0 a -> q_a
q_a a -> q_a
q_a b -> q_ab
q_a c -> q0
q_ab a -> q_a
q_ab b -> q0
q_ab c -> q_abc
q_abc a b c -> q_abc
at q0 0 0
at q_a 200 -110
at q_ab 400 0
at q_abc 600 0`

export const CONTAINS_00 = `# T4: accepts the bit strings that contain the substring 00
start: q0
accept: q2
q0 1 -> q0
q0 0 -> q1
q1 1 -> q0
q1 0 -> q2
q2 0 1 -> q2
at q0 0 0
at q1 200 0
at q2 400 0`

export const HAS_112 = `# T5: reads numbers separated by commas; accepts when the list contains the number 112
# (an incomplete DFA like the teacher's: a missing transition simply rejects)
start: new
accept: 112 OK
new 1 -> 1
new 0 [2-9] -> nope
new , -> new
1 1 -> 11
1 , -> new
1 0 [2-9] -> nope
11 2 -> 112
11 , -> new
11 0 1 [3-9] -> nope
112 , -> OK
112 [0-9] -> nope
OK , [0-9] -> OK
nope [0-9] -> nope
nope , -> new
at new 0 0
at 1 190 0
at 11 380 0
at 112 570 0
at OK 760 0
at nope 380 190`

export const ODD_A = `# T6 a): the number of a's is odd
start: a0
accept: a1
a0 b c -> a0
a0 a -> a1
a1 b c -> a1
a1 a -> a0
at a0 0 0
at a1 260 0`

const parity = (accepting) => `start: a0b0
accept: ${accepting.join(' ')}
a0b0 c -> a0b0
a0b1 c -> a0b1
a1b0 c -> a1b0
a1b1 c -> a1b1
a0b0 b -> a0b1
a0b1 b -> a0b0
a1b0 b -> a1b1
a1b1 b -> a1b0
a0b0 a -> a1b0
a1b0 a -> a0b0
a0b1 a -> a1b1
a1b1 a -> a0b1
at a0b0 0 0
at a0b1 280 0
at a1b0 0 230
at a1b1 280 230`

// T6 b): "a odd OR b even" -> accepting a0b0, a1b0, a1b1
export const A_ODD_OR_B_EVEN = `# T6 b): the number of a is odd OR the number of b is even. State "a?b?" = parity of a's and b's so far.
${parity(['a0b0', 'a1b0', 'a1b1'])}`

// T6 c): exclusive "either ... or" -> accepting a0b0, a1b1
export const A_ODD_XOR_B_EVEN = `# T6 c): EITHER the number of a is odd OR the number of b is even (exactly one of the two).
${parity(['a0b0', 'a1b1'])}`

// T4 as the chain-of-states example from the exercise
export const T4_TRACES = ['1101', '01001']

// The same language as EXACTLY_ONE_B, but a complete DFA: a second b goes to a dead state instead of getting stuck.
export const EXACTLY_ONE_B_COMPLETE = `# exactly one b, as a complete DFA (every state has a transition for every symbol)
start: A
accept: B
A a -> A
A b -> B
B a -> B
B b -> dead
dead a b -> dead
at A 0 0
at B 230 0
at dead 460 0`
