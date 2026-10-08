// Exercise 3 (questions and the teacher's answers), one task per page of public/docs/bmc-exercise-3.pdf (T3 starts on page 3 and continues on page 4).
// Pen-and-paper tasks: the student solves it on paper, shows the answer (the PDF page, plus a written version) and self-grades.
// Lines starting "Also" are explanations added here, they are not from the teacher's page.
const base = { subject: 'bmc', week: 2, topic: 'bmc-ex3', kind: 'paper', exercise: 'Exercise 3', pdf: 'bmc-exercise-3.pdf' }

export const questions = [
  { ...base, id: 'bmc-x3-1', page: 1, title: 'X3 T1. Grammar and regular expression from a DFA',
    prompt: ['Convert the automaton from task 1 of the previous exercise (the automaton that accepts all binary numbers divisible by four)', 'a) into a grammar', 'b) into a regular expression'],
    answer: [
      'a) Grammar from the DFA:\nS → 1A | 0B\nA → 0S | 1A\nB → 0B | 1A | ε',
      'b) Regular expression from the DFA: ((11*0)*00*11*0)*(11*0)*00*\nRegular expression from the NFA: (0|1)*(0|00)',
      'The NFA version has one mandatory 0 (a fixed 0 that must occur in every accepted string); all the other symbols are under * and are optional and repeatable.',
    ] },
  { ...base, id: 'bmc-x3-2', page: 2, title: 'X3 T2. Lecture examples as grammars',
    prompt: ['Convert these lecture examples into grammars (the rock-paper-scissors NFA and the DFA with states S, N, Y, M that counts the parity of 0s and 1s). How do these grammars differ from each other?'],
    answer: [
      'Rock-paper-scissors (NFA):\nS → rR | pP | sK | rO | pA | rC\nR → S\nP → S\nK → S\nO → ε\nA → ε\nC → ε',
      'Parity DFA:\nS → 0N | 1Y\nN → 0S | 1M | ε\nY → 0M | 1S | ε\nM → 0Y | 1N',
      'Also, they differ in determinism: in the first grammar S has several rules that start with the same terminal (r appears three times: rR, rO, rC), which is the NFA choice. In the second, every nonterminal has exactly one rule for each of 0 and 1, so it is a DFA.',
    ] },
  { ...base, id: 'bmc-x3-3', page: 3, title: 'X3 T3. Java floating-point constants',
    prompt: ['Last week\'s tasks dealt with Java floating-point constants.', 'a) Based on which features is the given grammar context-free and not regular?', 'b) Although the given grammar is context-free, the language of floating-point numbers is regular. Demonstrate this by providing a finite automaton that accepts Java floating-point constants. How does a Java floating-point number differ from the JSON number in last week\'s tasks?', 'c) Consider why Java floating-point numbers are presented as a context-free grammar in the documentation, if the language of floating-point numbers is regular.'],
    answer: [
      'a) It is not regular because rules have multiple nonterminals on the right-hand side, and the grammar is neither left-linear nor right-linear. It is not context-sensitive in the strict sense because on the left-hand side every rule has a single nonterminal (no surrounding context), so it is context-free.',
      'b) The teacher\'s page (page 4) shows the Java automaton next to the JSON one, and a right-linear regular grammar for it (simplified so that 0 stands for [0-9]), for example L → 0D | .O, D → 0D | _U | fF | dF | eX | .P, U → _U | 0D, F → ε, P → ε | eX | 0I | fF | dF, O → 0I, and so on. Every rule is a terminal followed by at most one nonterminal, so the language is regular.',
      'Also, for (b): compared with a JSON number, a Java literal may contain underscores between digits, can start with a dot (.5), and can end with a type suffix f, F, d or D. A JSON number can have a leading minus, but no underscores and no suffix.',
      'Also, for (c): every regular grammar is also context-free, and the documentation uses the compact context-free notation with named parts (Digits, ExponentPart, ...) because it is easier to read and to write than a long right-linear grammar.',
    ] },
  { ...base, id: 'bmc-x3-4', page: 5, title: 'X3 T4. What does the automaton accept?',
    prompt: ['Answer based on the image (the automaton with states q0..q5 on the teacher\'s page).', 'a) What lengths of words does the automaton accept?', 'b) What is the formal language it accepts?'],
    answer: [
      'b) L = { w ∈ {a,b}* | |w|a + 2|w|b ≡ 0 (mod 6) }: strings where the weighted count of symbols is a multiple of 6, with each a worth 1 and each b worth 2.',
      'a) It accepts the empty word, rejects all words of length 1 and 2 (a, b, aa, ab, ba, bb), and accepts words of every length from 3 up (for example bbb, aabb, aaaab, aaaaaa).',
      'Why: with n symbols the total weight can be anything from n (all a) to 2n (all b). For n ≥ 3 the span [n, 2n] always contains a multiple of 6. For n = 1 (weights 1, 2) and n = 2 (weights 2, 3, 4) it does not.',
    ] },
  { ...base, id: 'bmc-x3-5', page: 6, title: 'X3 T5. Minimal? And what if state 3 accepts?',
    prompt: ['Answer based on the image.', 'a) Is the automaton in the image (the one from T4) already minimal or could it still be minimized? Justify your answer briefly.', 'b) If state 3 in the image is changed from rejecting to accepting, what answers would the new automaton give to the questions (a) and (b) in task T4?'],
    answer: [
      'a) It is already minimal. Partition method: P0 = {q0}, {q1,q2,q3,q4,q5} (final and non-final). P1 = {q0}, {q1,q2,q3}, {q4,q5} (q4 and q5 go to the {q0} group on some input). P2 = {q0}, {q1}, {q2,q3}, {q4,q5} (only q2 and q3 go to {q4,q5}). P3 = {q0}, {q1}, {q2}, {q3}, {q4,q5}. The last split separates q4 and q5 (they go to different groups), so all states are separate and none can merge.',
      'b) The language becomes L = { w ∈ {a,b}* | |w|a + 2|w|b ≡ 0 (mod 3) }: strings whose weighted count is a multiple of 3 (a worth 1, b worth 2). It accepts the empty word, rejects every word of length 1 (a gives 1, b gives 2), and accepts words of length 2 and up (the range [n, 2n] always contains a multiple of 3 from n = 2). The automaton has two final states and can be minimized (the teacher\'s page shows the minimized DFA).',
    ] },
  { ...base, id: 'bmc-x3-6', page: 8, title: 'X3 T6. Python floating-point numbers',
    prompt: ['Familiarize yourself with Python\'s grammar and its NUMBER element (docs.python.org, lexical analysis, numbers). Write the grammar for floating-point numbers (NUMBER → floatnumber) using the notation from the lectures. Extend the grammar to terminal symbols.', 'Test the grammar with the numbers 3.14, 1e-10 and 1e. The last one is not accepted; why?'],
    answer: [
      'Python\'s grammar:\nNUMBER → Floatnumber\nFloatnumber → Digitpart . [Digitpart] [Exponent] | . Digitpart [Exponent] | Digitpart Exponent\nDigitpart → Digit ( [ _ ] Digit )*\nExponent → ( e | E ) [ + | - ] Digitpart\nDigit → 0 | 1 | 2 | … | 9',
      'In the lecture notation:\nS → F\nF → D.OE | .DE | DX\nO → D | ε   (optional digit part)\nE → X | ε   (optional exponent)\nX → eMD | EMD\nM → + | - | ε\nD → IG\nG → UD | ε\nU → _ | ε\nI → 0 | 1 | 2 | … | 9',
      '3.14 and 1e-10 can be derived all the way to terminals (the teacher\'s page shows the derivations step by step). 1e cannot: after X → eMD with M → ε, the nonterminal D must still produce at least one digit, but there is none left. No valid path ends in only terminals, so the incomplete exponent is rejected. (Python agrees: float("1e") raises ValueError.)',
    ] },
]
