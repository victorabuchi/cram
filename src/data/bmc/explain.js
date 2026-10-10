// "Explain it simply" for every exercise task: the idea in plain words, step by step, plus the topics to look up (Wikipedia popups).
// `terms` are { label, wiki } (the Wikipedia article key). Merged into the tasks in index.js.
const t = (label, wiki) => ({ label, wiki, noGlossary: true })
const DFA = t('Deterministic finite automaton (DFA)', 'Deterministic_finite_automaton')
const NFA = t('Nondeterministic finite automaton (NFA)', 'Nondeterministic_finite_automaton')
const MOD = t('Modular arithmetic (mod)', 'Modular_arithmetic')
const MIN = t('DFA minimization', 'DFA_minimization')
const GRAMMAR = t('Formal grammar', 'Formal_grammar')
const REGGRAM = t('Regular grammar', 'Regular_grammar')
const CFG = t('Context-free grammar', 'Context-free_grammar')
const REGEX = t('Regular expression', 'Regular_expression')
const REGLANG = t('Regular language', 'Regular_language')
const TABLE = t('State-transition table', 'State-transition_table')
const HIER = t('Chomsky hierarchy', 'Chomsky_hierarchy')
const KLEENE = t('Kleene star', 'Kleene_star')

export const explain = {
  'bmc1-d1': {
    terms: [DFA, MOD, TABLE],
    simple: [
      'The machine only has to remember one thing: the sum so far, but only its remainder when you divide by 6 (that is what "mod 6" means: 7 mod 6 = 1, 12 mod 6 = 0). A remainder can only be 0, 1, 2, 3, 4 or 5, so six states are enough.',
      'State qi means "the sum so far leaves remainder i". You start with sum 0, so the start state is q0, and q0 is the only accepting state (accept when the sum is 0 mod 6).',
      'Reading a number k moves you from qi to q(i + k mod 6). Example: in q4, reading 3 gives 4 + 3 = 7, and 7 mod 6 = 1, so you go to q1. That is exactly the line δ(q4, 3) = q1 in the big block.',
      'The big block in the picture is just this rule written out as a table: one row per state, one column per symbol (1, 2, 3). Every state has an arrow for every symbol. In the block, Q is the set of states, Σ the alphabet, s the start state, F the accepting states and δ the arrows.',
      'Check it: the input 1 2 3 goes q0 → q1 → q3 → q0. It ends in q0, which is accepting, and indeed 1 + 2 + 3 = 6.',
    ],
  },
  'bmc1-d2': {
    terms: [DFA, MOD],
    simple: [
      'An arrow in a DFA is labelled with exactly one symbol from the alphabet. A label like "-1" is two characters, so it is not allowed. That is the point of the question.',
      'Fix: make "-" a symbol of its own (the alphabet becomes {1, 2, 3, -}) and add a second copy of every state that means "a minus sign was just read": q0-, q1-, ..., q5-.',
      'From qi reading "-" you go to qi-. From qi- the digit now SUBTRACTS: qi- on k goes to q(i - k mod 6). Example: "-2" from q0: q0 → q0- (read "-") → q4 (read 2: 0 - 2 = -2, and -2 mod 6 = 4).',
      'Everything else stays as in the first automaton, so positive numbers still work.',
    ],
  },
  'bmc1-d3': {
    terms: [DFA, REGLANG],
    simple: [
      'We must reject any word that contains "abc" somewhere, and accept every other word. So the machine only has to watch how much of "abc" it has just seen.',
      'States: q0 = nothing useful yet; qa = the last symbol was a; qab = the last two symbols were a b; and a TRAP state = "abc" was seen. The trap is not accepting and never leaves (it loops on a, b and c). All other states are accepting.',
      'Arrows: from q0: a → qa, b or c → q0. From qa: a → qa (the new a may start another abc), b → qab, c → q0. From qab: a → qa, b → q0, c → TRAP (abc completed!).',
      'Check: "aabca" never reaches the trap, so it is accepted. "abc" reaches the trap, so it is rejected.',
    ],
  },
  'bmc1-d4': {
    terms: [DFA, TABLE],
    simple: [
      'The formal description is just a list of arrows: δ(q0, 1) = q0 means "in q0, reading 1, stay in q0". Draw one circle per state, one arrow per line.',
      'Meaning of the states: q0 = no 0 just before; q1 = the last symbol was 0; q2 = we have seen "00" (accepting, and it never leaves, whatever comes next).',
      'So the automaton accepts exactly the bit strings that contain 00 somewhere.',
      'Chain for 1101: q0 -1→ q0 -1→ q0 -0→ q1 -1→ q0. It ends in q0, not accepting, so 1101 is rejected. Chain for 01001: q0 -0→ q1 -1→ q0 -0→ q1 -0→ q2 -1→ q2. It ends in q2, accepting.',
      'A "chain" just means: write the current state, read the next symbol, write the next state, and repeat until the input is used up. Look at the LAST state.',
    ],
  },
  'bmc1-d5': {
    terms: [DFA, REGLANG],
    simple: [
      'We read the list one character at a time. We only care whether some number in the list is exactly 112, so the machine follows the digits of the CURRENT number.',
      'States: "new" (start of a number), "1" (read 1), "11" (read 11), "112" (read exactly 112 so far), OK (found it: accepting, stays OK for ever) and "nope" (this number is not 112).',
      'Arrows: new -1→ "1" -1→ "11" -2→ "112". From "112", a comma means the number was exactly 112 → OK. A comma anywhere else goes back to "new" (start the next number). A wrong digit, or another digit after 112 (like 1121), goes to "nope" until the next comma.',
      'Check: 2575,45777,9803,112,3567 reaches OK, so it is accepted. 295,430,1121,23,0 never does, because 1121 goes to "nope" after the 112.',
    ],
  },
  'bmc1-d6a': {
    terms: [DFA, MOD],
    simple: [
      'Only the PARITY of the number of a matters (even or odd), so two states are enough: "even number of a so far" (start) and "odd number of a so far" (accepting).',
      'Reading an a switches between the two states. Reading b or c changes nothing, so they are loops on both states.',
      'Why it is correct: the machine is in the odd state exactly when an odd number of a has been read, so it accepts exactly the right strings.',
    ],
  },
  'bmc1-d6b': {
    terms: [DFA],
    simple: [
      'Now we must remember two things at once: is the number of a odd or even, and is the number of b odd or even. Two yes/no facts make 2 × 2 = 4 states: a0b0, a0b1, a1b0, a1b1.',
      'Reading a flips the first fact, reading b flips the second, reading c changes nothing. Start in a0b0.',
      'Accepting rule: "a is odd OR b is even". Check each state: a0b0 (b even) yes; a0b1 no; a1b0 yes; a1b1 (a odd) yes.',
    ],
  },
  'bmc1-d6c': {
    terms: [DFA],
    simple: [
      'Use exactly the same four states and arrows as in b). Only the accepting states change.',
      '"EITHER a odd OR b even" means exactly ONE of the two is true (exclusive or). Truth table: a odd and b even → both true → reject. a odd and b odd → only the first → accept. a even and b even → only the second → accept. a even and b odd → neither → reject.',
      'So the accepting states are a0b0 and a1b1.',
    ],
  },

  'bmc-x2-1': {
    terms: [DFA, NFA, t('Binary number', 'Binary_number')],
    simple: [
      'In binary, the places are worth 1, 2, 4, 8, 16, ... Everything to the left of the last two bits is a multiple of 4 (4, 8, 12 ...). So a number is divisible by 4 exactly when its last two bits are 00. That answers part a.',
      'For part b the machine only has to notice "the last two symbols were 0 0". It does not need to count anything else.',
      'The DFA remembers the last bits: after a 1 it starts over; after one 0 it is "halfway"; after a second 0 in a row it is in the accepting state, and it stays there while 0s keep coming.',
      'The three drawings differ only in small details: the NFA guesses where the final "00" starts; the DFAs differ in whether the single word "0" is accepted.',
    ],
  },
  'bmc-x2-2': {
    terms: [MIN, DFA],
    simple: [
      'Minimizing means: merge states that behave the same, so the machine gets smaller but accepts the same words.',
      'Step 1: remove unreachable states (no arrow leads to them). Here q1.',
      'Step 2: put the states into two groups: accepting (q5, q6) and not accepting (q0, q2, q3, q4). This is P0.',
      'Step 3: look at each group. If two states go to DIFFERENT groups on some symbol, they cannot be merged: split them apart. Keep splitting until no group changes.',
      'Here q0 and q3 stay together (0 keeps them in their group, 1 leads to the group {q2, q4}), q2 and q4 stay together (both go to {q5, q6}), and q5, q6 stay together. Result: three states.',
    ],
  },
  'bmc-x2-3': {
    terms: [GRAMMAR, REGGRAM, DFA],
    simple: [
      'A grammar like this (every rule is "a symbol, then at most one nonterminal") is a machine in disguise. Each nonterminal (S, A, B, C, D) becomes a state.',
      'A rule X → yZ becomes an arrow from X to Z labelled y. A rule X → λ (empty) makes X an accepting state. Start at S.',
      'S → aA | bC means: from S read a and go to A, or read b and go to C. A and C are accepting (they have λ rules).',
      'Now find the pattern: from A you can only get back to A or B again, and B only goes to A or B. So once you start with a you end in A or B, and only A accepts: the last symbol is a. The same story with b and C. So: the word ends with the same letter it starts with.',
    ],
  },
  'bmc-x2-4': {
    terms: [t('JSON', 'JSON'), DFA, REGEX],
    simple: [
      'Read the number rule as a recipe in four optional steps: an optional minus; an integer part (either a single 0, or a digit 1-9 followed by any digits); an optional fraction (a dot, then one or more digits); an optional exponent (e or E, an optional + or -, then one or more digits).',
      'Each step becomes a few states. The accepting states are the ones where the number could end: after the integer part, after the fraction digits, and after the exponent digits.',
      'Why a leading 0 matters: after a 0 you may only continue with ".", "e" or "E" (not another digit), which is why "0" and "T" (digits) are separate states.',
      'Check: "-12.5e+3" goes N → M → T → T → D → F → E → S → X, which is accepting.',
    ],
  },
  'bmc-x2-5': {
    terms: [GRAMMAR, CFG, t('Backus–Naur form', 'Backus%E2%80%93Naur_form')],
    simple: [
      'The Java documentation names every part (Digits, ExponentPart, ...). The task: rewrite it with one capital letter per part and lowercase letters for the symbols.',
      '"Maybe" parts mean the part OR nothing: MaybeExponentPart → ExponentPart | ε. In the short grammar that is a rule like P → X | ε.',
      '"Zero or more" is written with recursion: Y → 1Y | ε means "1 repeated zero or more times".',
      'Pick a letter for each name (K, C, G, D, T, I, P, L, X, E, N, M, S, F, A, O, U) and replace every name. The terminals e, E, f, F, d, D become lowercase letters in the rules.',
    ],
  },
  'bmc-x2-6': {
    terms: [NFA, DFA],
    simple: [
      'An NFA may choose between several arrows, and it accepts if ANY choice works. Here: "an a among the last three characters".',
      'Idea: wander through the word looping on a, b, c in the start state. Then GUESS "this a is within the last three characters": read it, and then at most two more characters may follow.',
      'So: S loops on a, b, c. S -a→ state 1 (accepting, the a was the last character) -any→ state 2 (accepting) -any→ state 3 (accepting). A fourth character after the a has no arrow, so that guess dies (but another guess may still work).',
      'Check "bcab": guess the a at position 3; one character (b) follows; accepted. Check "abcc": the a has three characters after it, so that guess fails, and there is no other a: rejected.',
    ],
  },

  'bmc-x3-1': {
    terms: [REGGRAM, REGEX, DFA, KLEENE],
    simple: [
      'DFA → grammar is a direct translation. Each state becomes a nonterminal. An arrow from state X to state Y on symbol y becomes the rule X → yY. An accepting state also gets X → ε (it may stop here).',
      'Example from the DFA: S → 1A | 0B means "from S, on 1 go to A, on 0 go to B". B → ε says B is accepting.',
      'DFA → regular expression: describe every way of getting from the start to an accepting state. A loop becomes a star: "stay here for as long as you like" is x*. "Either this or that" is |.',
      'The simpler NFA gives the simpler expression (0|1)*(0|00): any sequence of 0s and 1s, then the last bits "0" or "00".',
    ],
  },
  'bmc-x3-2': {
    terms: [REGGRAM, NFA, DFA],
    simple: [
      'Use the same translation as before: states become nonterminals and each arrow X -y→ Y becomes the rule X → yY. Accepting states get X → ε.',
      'The first machine (rock-paper-scissors) is an NFA: from S there are several arrows on the SAME symbol (r goes to R, O and C). So the grammar has several rules starting with the same terminal: S → rR | rO | rC.',
      'The second machine is a DFA: from every state there is exactly one arrow for each symbol, so each nonterminal has exactly one rule for 0 and one for 1.',
      'That is the difference to say in the answer: the first grammar is nondeterministic, the second deterministic.',
    ],
  },
  'bmc-x3-3': {
    terms: [CFG, REGGRAM, HIER],
    simple: [
      'A REGULAR grammar has rules of a very strict shape: a terminal and at most one nonterminal (for example A → aB). A CONTEXT-FREE grammar may have anything on the right side, but only one nonterminal on the left.',
      'The Java documentation grammar has rules like Digits → Digit MaybeDigitsAndUnderscores Digit, with several nonterminals on the right and not in right-linear shape. So as written it is context-free and not regular (part a).',
      'But the SET of Java floating-point numbers is still regular: the teacher draws a finite automaton for it, and a right-linear grammar. A language is regular if SOME regular grammar or DFA describes it, even when the book chooses another way to write it.',
      'Why the documentation uses the context-free form (part c): every regular grammar is also context-free, and the named parts make it much easier to read than a long right-linear grammar.',
    ],
  },
  'bmc-x3-4': {
    terms: [DFA, MOD, REGLANG],
    simple: [
      'This is the "sum modulo" idea from Exercise 1 task 1, with weights: every a adds 1, every b adds 2, and we only keep the remainder mod 6. The states q0..q5 are those remainders.',
      'A word is accepted when the total weight is a multiple of 6: |w|a + 2·|w|b ≡ 0 (mod 6).',
      'Lengths: with n symbols the total weight can be anything from n (all a) up to 2n (all b). For n = 3 or more that range always contains a multiple of 6, so there is some accepted word of every length from 3 up. For n = 1 (weights 1, 2) and n = 2 (weights 2, 3, 4) it never contains one.',
      'Examples: bbb = 6 ✓, aabb = 6 ✓, aaaab = 6 ✓, aaaaaa = 6 ✓; a, b, aa, ab, ba, bb are rejected.',
    ],
  },
  'bmc-x3-5': {
    terms: [MIN, DFA],
    simple: [
      'Use the partition method again. Start with two groups: accepting and not accepting.',
      'Split any group whose states go to different groups on some symbol, and repeat until nothing changes.',
      'In this automaton every split separates the states, and in the end every state is alone in its group. Nothing can be merged, so it was already minimal.',
      'Part b: if state 3 also accepts, the machine now accepts when the weight is a multiple of 3 (state 3 and the old state 0), so the language is |w|a + 2·|w|b ≡ 0 (mod 3). Now states can be merged, so the minimal machine has fewer states.',
    ],
  },
  'bmc-x3-6': {
    terms: [GRAMMAR, t('Floating-point arithmetic', 'Floating-point_arithmetic'), REGEX],
    simple: [
      'Read the Python rule piece by piece: a float is digits, a dot, optional digits, and an optional exponent; OR a dot and digits; OR digits and an exponent. Digits may contain single underscores between digits.',
      'Turn each named part into one capital letter with rules, using ε for "optional" and recursion for "repeat" (just as in Exercise 2 task 5).',
      'To test 3.14 you start with S and apply rules until only symbols remain: S → F → D.OE → 3.14. Writing the derivation step by step is how you "test" a grammar.',
      '1e fails: after "1e" the grammar still needs at least one digit for the exponent, but the word ends. A leftover nonterminal means there is no valid derivation, so the word is rejected. (Python agrees: float("1e") raises ValueError.)',
    ],
  },
}
