// Basic Models of Computation, week 1: deterministic finite automata (lecture + exercise 1 with the teacher's solutions).
// Diagrams are written in the text format of src/automata/model.js; answers to trace questions are computed, not typed.
import { parseAutomaton, run } from '../../automata/model'
import * as A from './automata'

const base = { subject: 'bmc', week: 1 }
const auto = (text) => parseAutomaton(text)

// Lecture example 2 as a table: what the machine does with each input.
const parityTable = ['input  ones  zeros  ends in  result', ...['01', '00', '11', '10', '101', '1100', '1000'].map((w) => {
  const ones = [...w].filter((c) => c === '1').length
  const r = run(auto(A.PARITY_01), w)
  return `${w.padEnd(7)}${String(ones).padEnd(6)}${String(w.length - ones).padEnd(7)}${r.state.padEnd(9)}${r.accepted ? 'accepted' : 'rejected'}`
})].join('\n')

export const topics = {
  'bmc-dfa': 'DFA basics',
  'bmc-trace': 'Reading and tracing automata',
  'bmc-design': 'Designing DFAs (exercise 1)',
}

export const learn = [
  // ---------- DFA basics ----------
  { ...base, topic: 'bmc-dfa', title: 'What a DFA is and how it decides',
    text: 'A DFA (deterministic finite automaton) is a tiny machine that reads a string one symbol at a time, from left to right. At every moment it is in exactly one state. For each symbol it follows the one arrow that has that symbol on it and moves to the next state. When the input ends it looks where it stopped: in an accepting state (drawn as a double circle) the input is accepted; in any other state the input is not accepted. Try it below: press Step to watch the machine move. This automaton accepts the strings over {a, b} that contain exactly one b.',
    code: `input ends in an accepting state      -> ACCEPTED
input ends in any other state         -> NOT accepted
no arrow for the next symbol (stuck)  -> NOT accepted`,
    automaton: A.EXACTLY_ONE_B, tryThese: ['aba', 'a', 'bb', 'aabaa'] },
  { ...base, topic: 'bmc-dfa', title: 'How to read the picture',
    text: 'Circle = a state (a situation the machine can be in). Arrow = a transition; the label is the symbol that makes the machine take it. Triangle pointing at a state = the start state. Double circle = accepting (final) state. Several symbols on one arrow mean that any of them takes that arrow. An arrow from a state to itself is a loop. JFLAP draws the current state in a different colour while it runs.',
    code: `triangle  ->  (A)  --b-->  ((B))  --a-->  ((B))
 start        state   symbol   accepting     loop on a`,
    automaton: A.EXACTLY_ONE_B },
  { ...base, topic: 'bmc-dfa', title: 'The formal definition: Q, Σ, δ, s, F',
    text: 'On paper a DFA is written as five things. Q is the set of states. Σ (sigma) is the alphabet, the set of allowed symbols. δ (delta) is the transition function: it takes a state and a symbol and gives the next state, δ: Q × Σ → Q. s is the start state. F is the set of accepting states. "Deterministic" means that for each state and each symbol there is exactly one next state: no choices. Below is exercise T4 written both ways. Open "Formal definition and table" under the diagram to see how any diagram turns into these five parts.',
    code: `Q = {q0, q1, q2}
Σ = {0, 1}
s = q0
F = {q2}
δ = { δ(q0, 1) = q0,  δ(q0, 0) = q1,
      δ(q1, 1) = q0,  δ(q1, 0) = q2,
      δ(q2, 0) = q2,  δ(q2, 1) = q2 }`,
    automaton: A.CONTAINS_00, tryThese: ['1101', '01001'] },
  { ...base, topic: 'bmc-dfa', title: 'Complete DFAs, stuck inputs and dead states',
    text: 'A DFA needs a transition for every state and every symbol. In the lecture picture of "exactly one b", state B has no arrow for b, so on "abb" the machine gets stuck and the input is rejected. Drawing programs like JFLAP allow this shortcut, but in a strict definition δ must be defined everywhere. The fix is a dead (trap) state: a non-accepting state that loops on every symbol. Both automata accept exactly the same strings. On paper, always check: does every state have an arrow for every symbol?',
    code: `incomplete:  B has no arrow on b      -> stuck -> reject
complete:    B --b--> dead, dead loops on a and b`,
    automaton: A.EXACTLY_ONE_B_COMPLETE, tryThese: ['abb', 'abab', 'bab'] },
  { ...base, topic: 'bmc-dfa', title: 'Lecture example 1: at least one b',
    text: 'Alphabet {a, b}. The automaton accepts a word if it contains at least one b. It waits in A while it only sees a. The first b moves it to B, and B is accepting and stays there whatever comes next (it loops on a and b). So aaaaab, aaabbb and aaaaabbbaa are all accepted, and so is any other word with a b in it. Note: the lecture notes say "one bb" but the drawn automaton (and the Finnish line "yksi tai useampi b") is about one or more b. A word with the substring bb needs a third state, shown in the next card.',
    code: `aaaaab      A A A A A B      accepted
aaabbb      A A A A B B B    accepted
aaaaabbbaa  ... B B B B B    accepted
aaaa        A A A A A        rejected (no b)`,
    automaton: A.AT_LEAST_ONE_B, tryThese: ['aaaaab', 'aaabbb', 'aaaa', ''] },
  { ...base, topic: 'bmc-dfa', title: 'Contains the substring bb: remembering the previous symbol',
    text: 'To accept words that contain bb the machine must remember whether the last symbol was a b. That is why it needs three states: "none" (no b just read), "one" (the last symbol was b) and "bb" (we have seen bb, accepting forever). An a after a single b resets the memory. The number of states is the amount of information the machine can remember: a DFA has no other memory.',
    code: `none --b--> one --b--> bb (accepting, loops)
one  --a--> none`,
    automaton: A.CONTAINS_BB, tryThese: ['abab', 'abba', 'bb', 'b'] },
  { ...base, topic: 'bmc-dfa', title: 'Lecture example 2: two facts at once (parity)',
    text: 'Accept a bit string if the number of ones is odd or the number of zeros is odd. The machine only has to remember two things: is the count of ones even or odd, and is the count of zeros even or odd. Each state is a pair, named xy: x = parity of ones, y = parity of zeros (0 = even, 1 = odd). Reading a 1 flips the first digit, reading a 0 flips the second. The start state 00 (nothing read yet, both even) is the only one that is not accepting. Same result as the lecture table: 01 and 10 and 101 are accepted; 11, 00 and 1100 are rejected.',
    code: parityTable,
    automaton: A.PARITY_01, tryThese: ['01', '00', '11', '10', '101', '1100', '1000'] },
  { ...base, topic: 'bmc-dfa', title: 'A recipe for designing a DFA on paper',
    text: '1) Say in words what the automaton must accept. 2) Ask: what does the machine need to remember while reading? Every different thing worth remembering becomes a state (a count modulo n, the last few symbols, which parts of a pattern are done, whether it already failed). 3) Draw the start state and ask for each state "what if the next symbol is x?" until every state has an arrow for every symbol. 4) Mark accepting states: those whose memory means "the input so far is good". 5) Add a dead state if some input can never become good again. 6) Test with short strings, especially the empty string and the shortest accepted and rejected strings.',
    code: `state  = what I must remember
arrow  = how that memory changes when I read a symbol
double circle = memory says "good so far"
dead state = memory says "this can never be good"`, },

  // ---------- Exercise 1: the T tasks ----------
  { ...base, topic: 'bmc-design', title: 'T1: sum modulo 6 (counting in a circle)',
    text: 'Task: Σ = {1, 2, 3}. The automaton adds up the numbers it reads modulo 6 and accepts when the total is 0 (mod 6). Memory needed: only the current sum modulo 6, so six states q0..q5, where qi means "sum ≡ i (mod 6)". Start in q0 (sum 0). Reading k moves from qi to q(i+k) mod 6, so every state has exactly three arrows (one per symbol): sketch the transitions from q0 first, then make sure every state has all three. Only q0 accepts. Example: 1,2,3 sums to 6 ≡ 0 so it is accepted; 1,1 sums to 2 so it is rejected.',
    code: `Q = {q0, q1, q2, q3, q4, q5}    Σ = {1, 2, 3}
s = q0      F = {q0}
δ(qi, k) = q((i + k) mod 6)
e.g. δ(q3, 3) = q0     δ(q4, 3) = q1`,
    automaton: A.SUM_MOD_6, tryThese: ['123', '11', '33', '1122'] },
  { ...base, topic: 'bmc-design', title: 'T2: also accept negative values -1, -2, -3',
    text: 'Idea: you cannot add "-1" as one symbol because a DFA reads single symbols from a finite alphabet; a transition on a multi-character string would need δ: Q × Σ* → Q, which has infinitely many pairs and breaks finiteness. Instead add "-" to the alphabet and remember that a minus was just read: a second set of states q0-..q5-. From qi, reading "-" goes to qi-. From qi-, reading a digit k goes to q((i - k) mod 6): the digit is subtracted. The picture below is the excerpt from q0 (the full automaton is in the Automata lab: choose "T2 full"). Example: "-1" goes q0 → q0- → q5, which is -1 ≡ 5 (mod 6).',
    code: `Σ = {1, 2, 3, -}
δ(qi, -)   = qi-           minus read
δ(qi-, k)  = q((i - k) mod 6)   digit after minus
e.g. δ(q0-, 1) = q5   δ(q0-, 2) = q4   δ(q0-, 3) = q3`,
    automaton: A.SUM_MOD_6_NEGATIVE_EXCERPT, tryThese: ['-1', '-2', '-3', '1'] },
  { ...base, topic: 'bmc-design', title: 'T3: no substring abc (progress states and a trap)',
    text: 'Task: accept every string over {a, b, c} except those that contain abc. Remember how much of "abc" has just been read: q0 = no progress, q_a = the last symbol was a, q_ab = the last two were ab, q_abc = abc has been seen. q_abc is a trap: it is not accepting and loops on every symbol, since once abc appears the string can never be good again. All other states accept. Careful with the arrows going back: from q_a, another a keeps the progress (still one a at the end); from q_ab, an a starts a new attempt (q_a); a b or c from the earlier states breaks the pattern and goes back to q0 (except q_a on b).',
    code: `q0:   b,c -> q0      a -> q_a
q_a:  a -> q_a       b -> q_ab    c -> q0
q_ab: a -> q_a       b -> q0      c -> q_abc
q_abc: a,b,c -> q_abc   (trap)
F = {q0, q_a, q_ab}`,
    automaton: A.NO_ABC, tryThese: ['aabca', 'abc', 'ababc', 'cabcab', 'aabbcc'] },
  { ...base, topic: 'bmc-design', title: 'T4: read a DFA and say what it does',
    text: 'The DFA has Q = {q0, q1, q2}, Σ = {0, 1}, s = q0, F = {q2}. Reading the diagram: q0 means "the last symbol was not a 0 that could start 00", q1 means "the last symbol was a 0", and q2 means "00 was seen" and it is a trap that is accepting. So L = { w ∈ {0,1}* | w contains the substring 00 }. Solving the δ-transitions as a chain: 1101 gives q0 →1 q0 →1 q0 →0 q1 →1 q0, which ends in q0, rejected. 01001 gives q0 →0 q1 →1 q0 →0 q1 →0 q2 →1 q2, which ends in q2, accepted.',
    code: `1 1 0 1          q0 -> q0 -> q0 -> q1 -> q0    ends in q0: rejected
0 1 0 0 1        q0 -> q1 -> q0 -> q1 -> q2 -> q2    ends in q2: accepted`,
    automaton: A.CONTAINS_00, tryThese: ['1101', '01001', '00', '0101'] },
  { ...base, topic: 'bmc-design', title: 'T5: a list that contains the number 112',
    text: 'Task: read numbers separated by commas and accept if the list contains the number 112 (2575,45777,9803,112,3567 is accepted, 295,430,1121,23,0 is not). The machine follows the digits of the current number: "new" (at the start of a number), "1" (read 1), "11" (read 11), "112" (read exactly 112, accepting). A comma ends the number: from "new", "1", "11" it goes back to "new"; from "112" it goes to OK, which stays accepting whatever follows. Any other digit makes the current number the wrong one, so go to "nope" and wait there for the next comma. Careful: 1121 must NOT count, so after 112 a digit sends you to "nope". The notation [2-9] is a symbol class: any digit from 2 to 9. As in the teacher\'s picture some arrows are missing (it is an incomplete DFA): a missing arrow means rejected.',
    code: `new:  1 -> "1"      [2-9],0 -> nope      , -> new
"1":  1 -> "11"     [2-9],0 -> nope      , -> new
"11": 2 -> "112"    [3-9],1,0 -> nope    , -> new
"112": , -> OK      [0-9] -> nope
OK:   , and [0-9] -> OK (accepting forever)
nope: [0-9] -> nope        , -> new`,
    automaton: A.HAS_112, tryThese: ['2575,45777,9803,112,3567', '295,430,1121,23,0', '112', '1121'] },
  { ...base, topic: 'bmc-design', title: 'T6 a): the number of a is odd (a parity switch)',
    text: 'Σ = {a, b, c}. Only the letter a matters, so two states are enough: a0 = an even number of a so far (the start; rejects) and a1 = an odd number of a so far (accepts). Reading a toggles between them; reading b or c does nothing, so they are loops. In math: |w|ₐ mod 2 = 1. Justification for the answer: the automaton is in a1 exactly when it has read an odd number of a, because a toggles the state and b, c leave it unchanged.',
    code: `Rejects when |w|a mod 2 = 0
Accepts when |w|a mod 2 = 1`,
    automaton: A.ODD_A, tryThese: ['a', 'bca', 'aa', 'abcab'] },
  { ...base, topic: 'bmc-design', title: 'T6 b) and c): combining two parities (OR and XOR)',
    text: 'Now two facts matter: the parity of the number of a and the parity of the number of b. That is four states: a0b0, a0b1, a1b0, a1b1 (the digit after a is the parity of a, the digit after b the parity of b; 0 = even, 1 = odd). Reading a flips the first digit, reading b flips the second, reading c changes nothing. The start state is a0b0. The same four-state machine solves both b) and c); only the set of accepting states changes, and you find it with a truth table. Let A = "a is odd" and B = "b is even". b) A OR B: accept when at least one is true: a0b0 (B true), a1b0 and a1b1 (A true); only a0b1 rejects. c) EITHER A OR B (exactly one is true): a0b0 (only B) and a1b1 (only A) accept; a1b0 (both true) and a0b1 (neither) reject. The picture shows b); in the Automata lab, "T6 c" shows the other.',
    code: `a b    b) OR   c) XOR     (a, b = parity of the number of a and b: 0 even, 1 odd)
0 0     1       1          a0b0: b even
0 1     0       0          a0b1: neither
1 0     1       0          a1b0: both
1 1     1       1          a1b1: a odd
b) accepting: a0b0, a1b0, a1b1
c) accepting: a0b0, a1b1`,
    automaton: A.A_ODD_OR_B_EVEN, tryThese: ['', 'b', 'a', 'ab', 'abb'] },
  { ...base, topic: 'bmc-design', title: 'Pen-and-paper checklist for the test',
    text: 'The test is on paper, so practise drawing. For every automaton you draw or read: 1) name the states by what they remember; 2) mark the start state with an arrow and the accepting states with double circles; 3) check every state has exactly one arrow for every symbol of Σ (add a dead state if needed); 4) test the shortest accepted string, the shortest rejected string and the empty string by tracing them with the chain notation q0 → q1 → ...; 5) when asked "what does it do?", describe the language in one sentence (for example "all bit strings containing 00"); 6) when asked to justify, say why every accepted string ends in an accepting state and every rejected one does not. The same is described in the formal way with Q, Σ, δ, s, F.',
    code: `Chain notation:   1   1   0   1
              q0 -> q0 -> q0 -> q1 -> q0
Result: look at the LAST state.` },
]

// ---------- Exercise 1 ----------
// Design tasks: the student draws on paper first, then compares with the model solution (diagram + formal definition).
const design = (id, q, keyPoints, model, modelAutomaton) => ({ ...base, id: `bmc1-${id}`, topic: 'bmc-design', kind: 'explain', exercise: 'Exercise 1', q, keyPoints, model, modelAutomaton })
const designs = [
  design('d1', 'T1. Make an automaton: Σ = {1, 2, 3}. It sums the numbers it receives modulo 6 and accepts when the sum is 0 (mod 6). Draw it on paper, then compare.',
    ['six states q0..q5; qi means "sum is i modulo 6"', 'start state q0, and q0 is the only accepting state', 'δ(qi, k) = q((i + k) mod 6)', 'every state has an arrow for each of 1, 2 and 3'],
    'Q = {q0..q5}, Σ = {1, 2, 3}, s = q0, F = {q0}. The only thing to remember is the sum modulo 6, so state qi stands for "the sum so far is ≡ i (mod 6)". Reading k moves from qi to q((i + k) mod 6). Start with the three arrows from q0 (to q1, q2, q3), then give every other state all three arrows. For example δ(q3, 3) = q0 and δ(q5, 2) = q1.', A.SUM_MOD_6),
  design('d2', 'T2. Modify the T1 automaton so that it also accepts negative values -1, -2, -3. Explain why a transition labelled "-1" is not allowed.',
    ['add "-" to the alphabet: Σ = {1, 2, 3, -}', 'add states q0-..q5- that remember a minus sign was read', 'δ(qi, -) = qi- and δ(qi-, k) = q((i - k) mod 6)', 'a multi-character label would need δ on Q × Σ*, which has infinitely many pairs, so the automaton would not be finite'],
    'A DFA transition reads one symbol of a finite alphabet, δ: Q × Σ → Q. A label like "-1" would be a string, requiring δ: Q × Σ* → Q with infinitely many pairs. Instead put "-" into the alphabet and add six minus-remembering states: from qi a minus leads to qi-, and from qi- the digit k goes to q((i - k) mod 6). The accepting state is still only q0. The excerpt shows the arrows from q0; the full automaton is in the Automata lab.', A.SUM_MOD_6_NEGATIVE_EXCERPT),
  design('d3', 'T3. Make an automaton (Σ = {a, b, c}) that does not accept any input containing the string abc as a part (but accepts all others).',
    ['states track the progress of abc: q0, q_a, q_ab', 'a trap state q_abc that is not accepting and loops on a, b and c', 'all states except q_abc are accepting', 'correct arrows back: q_a on a stays in q_a, q_ab on a goes to q_a, wrong symbols go to q0'],
    'Remember how much of abc has just been read. q0 = nothing useful yet, q_a = last symbol a, q_ab = last two symbols ab, q_abc = abc was seen (trap, not accepting, loops on a, b, c). F = {q0, q_a, q_ab}. Arrows: q0 on a → q_a, on b or c → q0; q_a on a → q_a, on b → q_ab, on c → q0; q_ab on a → q_a, on b → q0, on c → q_abc.', A.NO_ABC),
  design('d4', 'T4. The DFA has Q = {q0, q1, q2}, Σ = {0, 1}, δ(q0,1) = q0, δ(q0,0) = q1, δ(q1,1) = q0, δ(q1,0) = q2, δ(q2,0) = δ(q2,1) = q2, s = q0, F = {q2}. Draw it, say what it does, and solve the chains for 1101 and 01001.',
    ['the automaton accepts exactly the bit strings that contain the substring 00', 'q2 is an accepting trap, q1 means "last symbol was 0"', '1101: q0 → q0 → q0 → q1 → q0, ends in q0, rejected', '01001: q0 → q1 → q0 → q1 → q2 → q2, ends in q2, accepted'],
    'L = { w ∈ {0,1}* | w contains the substring "00" }. q0: no 0 pending, q1: the last symbol was a 0, q2: 00 has been seen and the input is accepted whatever follows. Chain for 1101: q0 →1 q0 →1 q0 →0 q1 →1 q0 (rejected). Chain for 01001: q0 →0 q1 →1 q0 →0 q1 →0 q2 →1 q2 (accepted).', A.CONTAINS_00),
  design('d5', 'T5. Make a DFA that reads numbers separated by commas from a list and accepts if the list contains the number 112. Example: 2575,45777,9803,112,3567 is accepted but 295,430,1121,23,0 is not.',
    ['states follow the digits of the current number: new, 1, 11, 112', 'a comma goes back to new (from 112 to OK)', 'OK is accepting and stays accepting on commas and digits', 'a wrong digit leads to nope until the next comma, and a digit after 112 goes to nope so 1121 does not count'],
    'States: new (start of a number), "1", "11", "112" (accepting), OK (accepting, absorbing) and nope (this number is not 112). new on 1 → "1"; "1" on 1 → "11"; "11" on 2 → "112"; "112" on comma → OK; a comma in new, "1" or "11" → new; any other digit → nope; nope on comma → new; "112" followed by a digit → nope (so 1121 is rejected). OK loops on commas and digits because the list already contains 112.', A.HAS_112),
  design('d6a', 'T6 a). Σ = {a, b, c}. Construct an automaton that accepts exactly the strings in which the number of a is odd. Justify.',
    ['two states a0 (even number of a, start) and a1 (odd, accepting)', 'a toggles between the states', 'b and c are loops on both states', 'justification: the state is a1 exactly when an odd number of a has been read'],
    'Two states are enough because only the parity of the number of a matters. a0 (start, rejecting) means an even number of a so far, a1 (accepting) means an odd number. Reading a switches between a0 and a1; b and c leave the state unchanged. Justification: by induction on the input, the automaton is in a1 exactly when |w|a is odd, so it accepts exactly those strings.', A.ODD_A),
  design('d6b', 'T6 b). Σ = {a, b, c}. Construct an automaton that accepts exactly the strings in which the number of a is odd OR the number of b is even. Justify.',
    ['four states, one for each pair of parities (a, b)', 'a toggles the first parity, b toggles the second, c is a loop', 'start in a0b0 (both even)', 'accepting states: where a is odd or b is even: a0b0, a1b0, a1b1'],
    'The automaton must remember two parities, so it has four states a0b0, a0b1, a1b0, a1b1. Reading a flips the a-part, reading b flips the b-part and c changes nothing. The start state is a0b0. Accepting: a is odd OR b is even gives a0b0 (b even), a1b0 and a1b1 (a odd). Only a0b1 is rejecting. Justification: the state always records the parities of a and b read so far, and the accepting set is exactly the pairs for which the condition holds.', A.A_ODD_OR_B_EVEN),
  design('d6c', 'T6 c). Σ = {a, b, c}. Construct an automaton that accepts exactly the strings in which EITHER the number of a is odd OR the number of b is even (exactly one of the two holds). Justify.',
    ['the same four parity states and arrows as in b)', 'only the accepting set changes', 'accepting states: a0b0 and a1b1', 'in a0b0 only "b even" holds, in a1b1 only "a odd" holds; in a1b0 both hold and in a0b1 neither'],
    'Use the same four-state machine as in b). "Either a is odd or b is even" means exactly one of the two is true, so a1b0 (both true) and a0b1 (both false) are rejecting. The accepting states are a0b0 (a even, b even: only "b even" holds) and a1b1 (a odd, b odd: only "a odd" holds). Truth table: (0,0)→1, (0,1)→0, (1,0)→0, (1,1)→1.', A.A_ODD_XOR_B_EVEN),
  design('d7', 'Explain what this automaton does and trace the input aaabbb (lecture example 1).',
    ['it accepts every word over {a, b} that contains at least one b', 'A is the start and waits through a', 'the first b leads to B, which is accepting and loops on a and b', 'aaabbb: A A A A B B B, ends in the accepting B, accepted'],
    'It accepts exactly the words over {a, b} with at least one b. It stays in A while reading a; the first b moves to B, which is accepting and loops on a and b because once a b has been seen nothing can undo that. Trace of aaabbb: A →a A →a A →a A →b B →b B →b B, which ends in the accepting state B: accepted. aaaa ends in A and is rejected.', A.AT_LEAST_ONE_B),
]

export const questions = designs
