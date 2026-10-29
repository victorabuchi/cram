// Exercise 6 (questions and the teacher's answers), one task per page of public/docs/bmc-exercise-6.pdf.
// Lines starting "Also" are added here.
const base = { subject: 'bmc', week: 5, topic: 'bmc-ex6', kind: 'paper', exercise: 'Exercise 6', pdf: 'bmc-exercise-6.pdf' }

export const questions = [
  { ...base, id: 'bmc-x6-1', page: 1, title: 'X6 T1. Subset sum: how hard is it?',
    prompt: ['Subset sum problem (SSP). Let us have a set of integers {a1, a2, …, an}. The question is whether it is possible to select a subset of these numbers such that the sum of its elements is exactly S, a given integer.', 'What is the time complexity of solving this problem? How do you analyze it? Does this problem belong to class P or NP?'],
    answer: [
      'Counting subsets: each of the n elements has two options, it is in the subset or not, so the set has 2ⁿ subsets: exponential growth. Brute force checks all 2ⁿ subsets, and no general pattern lets us skip without guessing, so in general the solving time is exponential, O(kⁿ) with a fixed base k > 1.',
      'Nondeterministically, checking is polynomial: guess 0...n elements (n), calculate their sum (n − 1 operations), test if the sum equals S (1): n + (n − 1) + 1 = 2n → O(n), nondeterministic polynomial time.',
      { code: 'P  = polynomial time, n^k for a fixed k, e.g. O(n²) or O(n) (linear is polynomial too)\nNP = nondeterministic polynomial time: a proposed answer is easy to verify in polynomial time,\n     but solving may be hard' },
      'So SSP is in NP. No polynomial algorithm is known for it (it is NP-complete), so it is not known to be in P.',
      'Also: dynamic programming solves it in O(n·S) steps, but that is not polynomial in the length of the input, because S is written with only about log S digits (it is "pseudo-polynomial").',
    ] },
  { ...base, id: 'bmc-x6-2', page: 2, title: 'X6 T2. Subset sum running times in days',
    prompt: ['Based on the analysis of the previous task, calculate the execution times for solving the subset sum problem when the number of integers is 2, 5, 10, 20, 30, 50, 75, 100, 200 and the number of operations per second you can perform is 100, 10 000 or 1 000 000. Report the result in days.'],
    answer: [
      'Brute force checks 2ⁿ subsets. With x operations per second: runtime = 2ⁿ / x seconds = 2ⁿ / x / (24 · 60 · 60) days.',
      { code: '  n | 2^n        | 100/s      | 10,000/s   | 1,000,000/s\n----|------------|------------|------------|------------\n  2 | 4          | 4.63E-7    | 4.63E-9    | 4.63E-11\n  5 | 32         | 3.70E-6    | 3.70E-8    | 3.70E-10\n 10 | 1,024      | 1.18E-4    | 1.18E-6    | 1.18E-8\n 20 | 1,048,576  | 0.121      | 0.00121    | 1.21E-5\n 30 | 1,073M     | 124.2      | 1.242      | 0.0124\n 50 | 1.126E+15  | 130M       | 1.30M      | 13,000 *\n 75 | 3.778E+22  | 4.37E+15   | 4.37E+13   | 4.37E+11\n100 | 1.268E+30  | 1.47E+23   | 1.47E+21   | 1.47E+19\n200 | 1.607E+60  | 1.86E+53   | 1.86E+51   | 1.86E+49' },
      'Also (correction): the teacher\'s table shows 13.0 for n = 50 at 1 000 000 operations per second; 2⁵⁰ / 10⁶ / 86 400 is about 13 000 days (about 36 years), marked * above.',
      'From n = 30 on (with 100 operations per second) it takes more than a day. For comparison, the universe is about 13.8 billion years old, about 5.04 · 10¹² days, so n = 75 is already hopeless even at a million operations per second.',
    ] },
  { ...base, id: 'bmc-x6-3', page: 3, title: 'X6 T3. SAT: how many variables can you check?',
    prompt: ['SAT, the satisfiability problem. Choose a propositional logic formula with n variables x1 ... xn, for example (x1 ∧ ¬x2) ∨ ¬(x1 ∧ x3 ∨ x4). The problem asks whether there exist values xi = T | F such that the formula evaluates to true. What is the time complexity of obtaining a solution? How do you analyze it?', 'Assume that testing one variable assignment takes 0.03 seconds. How many variables can you deterministically check a) in one hour b) in 24 hours c) in one week?'],
    answer: [
      'Each variable xi is T or F, so n variables have 2ⁿ combinations. The simplest algorithm tries every combination: exponential, so it is not known to be in P. Nondeterministically: guess the values {x1, ..., xn} and compute the result; checking that the formula is true for given values is quick, so a solution can be verified in polynomial time → NP.',
      { code: 'assignments per second = 1 / 0.03 = 33.33\nmax n = floor(log2(assignments))\n\ntime     | seconds | assignments | largest 2^n  | max n | next: 2^(n+1)\n1 hour   | 3,600   | 120,000     | 65,536       | 16    | 131,072\n24 hours | 86,400  | 2,880,000   | 2,097,152    | 21    | 4,194,304\n1 week   | 604,800 | 20,160,000  | 16,777,216   | 24    | 33,554,432' },
      'a) 16 variables, b) 21 variables, c) 24 variables. If the available assignments are fewer than 2ⁿ, a solution cannot be guaranteed.',
    ] },
  { ...base, id: 'bmc-x6-4', page: 4, title: 'X6 T4. Are these grammars LL(1)?',
    prompt: ['Study the LL(1) parsing presented in the LAP_LL1.pdf file on elearn. Based on the description, interpret whether all LL(1) conditions are met for the following grammars or if some remain unmet.', 'a) S → Ac | Bd\n   A → a | Se\n   B → a\nb) S → aA | bB\n   A → cD\n   D → d | ε\n   B → e'],
    answer: [
      'a) Not LL(1). The two alternatives of S start with the same symbol: FIRST(Ac) = FIRST(A) = {a} and FIRST(Bd) = FIRST(B) = {a}, so with input a the parser cannot choose. There is also (indirect) left recursion: S → Ac → Sec.',
      { code: 'FIRST(S) = {a}   FIRST(A) = {a}   FIRST(B) = {a}\nS → Ac and A → a   /   S → Bd and B → a   → FIRST/FIRST conflict' },
      'b) LL(1). The alternatives of S start differently: FIRST(aA) = {a}, FIRST(bB) = {b}. D is the only nullable nonterminal: FIRST(d) = {d} and FOLLOW(D) = {$} do not overlap, so no FIRST/FOLLOW conflict. No left recursion.',
      { code: 'FIRST(S) = {a, b}   FIRST(A) = {c}   FIRST(B) = {e}   FIRST(D) = {d, ε}\nFOLLOW(S) = {$}   FOLLOW(A) = {$}   FOLLOW(B) = {$}   FOLLOW(D) = {$}\n→ no overlapping FIRST sets, no FIRST/FOLLOW conflict, no left recursion → LL(1)' },
    ] },
  { ...base, id: 'bmc-x6-5', page: 5, title: 'X6 T5. What does this Turing machine do? (1, 2, 3)',
    prompt: ['In the Turing machine on the teacher\'s page, the input alphabet is {1, 2, 3} and the tape alphabet is {1, 2, 3, Y, K}. Can you deduce what the machine does? You can build it in JFLAP and test it.'],
    answer: [
      'It sorts the input: bubble sort on the symbols 1, 2, 3. It repeatedly scans the input and swaps adjacent symbols that are in the wrong order. The markers Y and K remember that a swap happened during the pass, so the machine starts another pass. It accepts when a full scan back to the left finds no markers (the tape is sorted).',
      { code: 'q0          read the current symbol (1, 2 or 3) and move right;\n            on blank: accept at once (empty input) or go to q9 to finish the pass\nstates 1/2/3  handle "I just read 1 / 2 / 3"\nv21, v13, v32  swap 2 and 1, 1 and 3, 3 and 2\nq9          end of pass, scan back left; on Y / K restore it (1 / 2) and go to q1:\n            a swap happened, another pass is needed\nq1          move left to the left-end blank restoring Y → 1 and K → 2, then start a new pass\nq5          accepting halt' },
    ] },
  { ...base, id: 'bmc-x6-6', page: 6, title: 'X6 T6. What does this Turing machine do? (0, 1)',
    prompt: ['In the Turing machine on the teacher\'s page, the input alphabet is {1, 0} and the tape alphabet is {1, 0, L, #, X, Y}. What does the automaton do, what is its purpose? (H6T6.jff on elearn.)'],
    answer: [
      'It reverses a binary string. It repeatedly marks the leftmost unprocessed bit (0 → X, 1 → Y), copies that bit to the far right after a separator #, and loops until all bits are copied. After building the reversed output it erases the original (marked) input.',
      { code: 'q0 → q1    write the left-end marker L\nq1 → q2t   write the separator #\nq3 / q4    after marking 0 / 1, scan right to the separator #\nq5 / q6    past #, go to the right end of the output, write 0 / 1, move left\nq7         move left across the output, the separator and the marked input to L\nq8         move right, from L to #\nq2t → q9 → q10   clean up (erase the marked input)\nq10        accept when the clean-up reaches #' },
    ] },
]
