// Exercise 2 (questions and the teacher's answers), one task per page of public/docs/bmc-exercise-2.pdf.
// Pen-and-paper tasks: the student solves it on paper, shows the answer (the PDF page, plus a short written version) and self-grades.
const base = { subject: 'bmc', week: 2, topic: 'bmc-ex2', kind: 'paper', exercise: 'Exercise 2', pdf: 'bmc-exercise-2.pdf' }

export const questions = [
  { ...base, id: 'bmc-x2-1', page: 1, title: 'X2 T1. Binary numbers',
    prompt: ['a) What do all binary representations of numbers divisible by four have in common?', 'b) Create an automaton that accepts all binary numbers divisible by four.'],
    answer: [
      'a) The last two bits are 00 (100 = 4, 1000 = 8, 1100 = 12). 1, 10, 11 and 1001 are not divisible by four.',
      'b) The state remembers the last bits. DFA (accepts the single 0): q0 is the start, q0 -0-> q2, q0 -1-> q1; q1 loops on 1 and goes to q0 on 0; q2 (accepting) loops on 0 and goes to q1 on 1. So q2 means "the last two bits are 00".',
      'Other versions are drawn too: a DFA that rejects the single 0 (q0 -0-> q1 -0-> q2, with 1 going back to q0), and an NFA (q0 loops on 0 and 1, q0 -0-> q1 -0-> q2) that also rejects the single 0.',
    ] },
  { ...base, id: 'bmc-x2-2', page: 2, title: 'X2 T2. Minimize the automaton',
    prompt: ['Minimize the automaton according to the method presented in the lecture. Check the result with JFLAP.', 'Transitions: δ(q0,0)=q3, δ(q0,1)=q4; δ(q3,0)=q3, δ(q3,1)=q2; δ(q2,0)=q6, δ(q2,1)=q5; δ(q4,0)=q5, δ(q4,1)=q5; δ(q6,0)=q5, δ(q6,1)=q5; δ(q5,0)=q6, δ(q5,1)=q6. q1 has no incoming transition. Accepting: q5, q6.'],
    answer: [
      'q1 is unreachable (no transition leads to it): remove it.',
      'P0 = {{q0, q2, q3, q4}, {q5, q6}}. q5 and q6 stay together (both inputs lead to the same set). q2 and q4 belong together (both inputs lead to {q5, q6}). q0 and q3 belong together (input 0 stays in their group, input 1 leads to {q2, q4}).',
      'P1 = {{q0, q3}, {q2, q4}, {q5, q6}}: the minimized automaton has three states.',
    ] },
  { ...base, id: 'bmc-x2-3', page: 3, title: 'X2 T3. Grammar to automaton',
    prompt: ['Create an automaton corresponding to the grammar below. What could be the language accepted by the automaton? The start symbol is S.', 'S → aA | bC\nA → aA | bB | λ\nB → bB | aA\nC → aD | bC | λ\nD → aD | bC'],
    answer: [
      'Each nonterminal becomes a state, each rule X → yZ an arrow from X to Z labelled y, and a rule X → λ makes X accepting. Here A and C are accepting.',
      'Language: strings that begin with the same character they end with. L = { w ∈ {a,b}* | (w = aza) ∨ (w = bzb), z ∈ {a,b}* }.',
    ] },
  { ...base, id: 'bmc-x2-4', page: 4, title: 'X2 T4. JSON numbers',
    prompt: ['Familiarize yourself with the JSON syntax for number representation (json.org). Create a DFA corresponding to the railroad diagram, i.e. an automaton that accepts JSON numbers.', 'number ::= [ "-" ] int [ frac ] [ exp ]\nint ::= "0" | digit1-9 { digit }\nfrac ::= "." digit { digit }\nexp ::= ("e" | "E") [ "+" | "-" ] digit { digit }'],
    answer: [
      'States: N (start), M (after "-"), Z (int = 0, accepting), T (int starting with 1-9, accepting, loops on [0-9]), D (after "."), F (fraction digits, accepting, loops on [0-9]), E (after e or E), S (after the exponent sign), X (exponent digits, accepting, loops on [0-9]).',
      'Arrows: N -0-> Z, N -[1-9]-> T, N --> M; M -0-> Z, M -[1-9]-> T; Z and T on "." -> D; D -[0-9]-> F; Z, T and F on e -> E; E -[0-9]-> X; E -+/-> S; S -[0-9]-> X.',
    ] },
  { ...base, id: 'bmc-x2-5', page: 5, title: 'X2 T5. Floating-point literal grammar',
    prompt: ['Based on the Java documentation grammar for DecimalFloatingPointLiteral (JLS 3.10.2), create a simplified grammar using the lecture notation: each nonterminal is a single uppercase letter, each input symbol a lowercase letter, alternatives separated by |, repetition produced recursively with ε (for example Y → 1Y | ε).'],
    answer: [
      'Optional parts named "Maybe..." become a nonterminal that produces the part or ε. The terminals E, F and D are written as lowercase e, f and d because uppercase letters are nonterminals.',
      'K → C\nC → G.IPL | .GPL | GXL | GPF\nG → D | DND\nD → 0 | T\nT → 1|2|3|4|5|6|7|8|9\nI → G | ε\nP → X | ε\nL → F | ε\nX → EN\nE → e\nN → MG\nM → S | ε\nS → + | -\nF → f | d\nN → A | ε\nA → UO\nO → UO | ε\nU → D | _',
    ] },
  { ...base, id: 'bmc-x2-6', page: 6, title: 'X2 T6. NFA: an a among the last three characters',
    prompt: ['The strings accepted consist of the characters a, b and c (Σ = {a, b, c}). Among the last three characters of the string there must be at least one a. Implement a nondeterministic automaton that accepts the language. Epsilon transitions may be used.'],
    answer: [
      'Short version: state S loops on a, b, c. On the guess "this a is among the last three", S -a-> ??A, then any symbol -> ?A?, then any symbol -> A??. All three of ??A, ?A? and A?? accept. (The longer version has separate branches A_xx, X_ax and X_xa, which end after exactly three characters.)',
      'The automaton guesses nondeterministically which a is the one near the end, and the string is accepted only if at most two more characters follow it.',
    ] },
]
