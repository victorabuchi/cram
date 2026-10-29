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
const PDA = t('Pushdown automaton (PDA)', 'Pushdown_automaton')
const STACK = t('Stack', 'Stack_(abstract_data_type)')
const TREE = t('Parse tree', 'Parse_tree')
const AMBIG = t('Ambiguous grammar', 'Ambiguous_grammar')
const DANGLING = t('Dangling else', 'Dangling_else')
const ORDER = t('Order of operations', 'Order_of_operations')
const TM = t('Turing machine', 'Turing_machine')
const PCLASS = t('P (complexity)', 'P_(complexity)')
const NPCLASS = t('NP (complexity)', 'NP_(complexity)')
const NPC = t('NP-completeness', 'NP-completeness')
const SSP = t('Subset sum problem', 'Subset_sum_problem')
const SAT = t('Boolean satisfiability problem (SAT)', 'Boolean_satisfiability_problem')
const LL = t('LL parser', 'LL_parser')
const EXP = t('Time complexity', 'Time_complexity')

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

  'bmc-x4-1': {
    terms: [PDA, STACK, t('Context-free language', 'Context-free_language')],
    simple: [
      'A pushdown automaton (PDA) is a finite automaton with a stack: a pile where you can only add to the top (push) and take from the top (pop). The stack gives it a memory, so it can count.',
      'Here it must check that the number of c equals the number of a plus the number of b. So: every time it reads an a or a b, it pushes one c on the stack. Every time it reads a c, it pops one c. If the stack is empty again exactly when the input ends, the counts matched.',
      'Reading a transition "a, Z ; cZ": the next input symbol is a, the top of the stack is Z (the bottom marker), and we replace Z by cZ, which is pushing a c on top of Z. "c, c ; ε" means: read c, top is c, replace it by nothing, which is a pop. ε in the first place means "read nothing".',
      'The states only follow the order of the letters: A while reading a\'s, B while reading b\'s, C while reading c\'s, and ok when the stack is empty. After a\'s the word may go straight to c\'s (l = 0), and a word with no a or b at all goes straight to ok.',
      'Check aabbcccc: two a push cc, two b push cc, four c pop all four, and ε, Z ; ε leads to ok.',
    ],
  },
  'bmc-x4-2': {
    terms: [t('Context-free grammar', 'Context-free_grammar'), PDA],
    simple: [
      'A grammar builds a word by rewriting. Here: a^k b^l c^(k+l) means every a and every b is matched by one c, and the matching pairs are nested like brackets: the first a pairs with the LAST c, the last b with the FIRST c of the c-block.',
      'So grow the word from the middle outwards. A → aAc puts an a on the left and a c on the right (an "ac" pair). B → bBc puts a "bc" pair. The a pairs go on the outside and the b pairs inside, so the a\'s come first, then the b\'s, then the c\'s.',
      'A → B lets the a-part stop and the b-part begin; A → ε and B → ε end the word. S → ε allows the empty word.',
      'To turn a grammar into a PDA: for each production X → α, a rule that pops X and pushes α; for each terminal t, a rule that pops t and reads t from the input. The PDA starts by pushing S, and accepts when the stack is empty again.',
    ],
  },
  'bmc-x4-3': {
    terms: [PDA, t('Context-free grammar', 'Context-free_grammar')],
    simple: [
      'Same idea as task 1, but the condition is k + l < m: strictly MORE c than a and b together. So after all the matching c are popped there must be at least ONE more c.',
      'PDA: push a c for every a and b, pop a c for every c. When the stack is down to Z, a c can still be read (c, Z ; ε) and that goes to the accepting state ok. In ok, more c are allowed, but any other symbol leads to the trap and the word is rejected.',
      'Grammar: take the task 2 grammar (a^k b^l c^(k+l)) and make sure there is always one extra c: replace the empty productions by c. Then let a new nonterminal C produce any further c: C → cC | c, and use it in the middle of the word.',
      'Check abcccc: k = 1, l = 1, m = 4 and 1 + 1 < 4, so it is in the language. Derivation: S → A → aAc → aBc → abBcc → abCcc → abcCcc → abcccc.',
    ],
  },
  'bmc-x4-4': {
    terms: [PDA, STACK, t('HTML', 'HTML')],
    simple: [
      'HTML tags must be closed in the right order: <html><head></head></html> is fine, <html><head></html></head> is not. That is exactly what a stack is good at: the most recently opened tag is the first to be closed.',
      'So the PDA pushes the tag name when it reads an opening tag, and pops it when it reads the closing tag with the same name. If the closing tag does not match the top of the stack, there is no rule, and the input is rejected.',
      'The rules write which tag may open where: "<title>, <head> ; <title><head>" says that <title> may be opened when <head> is on top (a title lives inside the head). "<h1>, <body> ; <h1><body>" says an <h1> lives inside the <body>.',
      'The words between the tags (t, a dot, a space) are just read without touching the stack.',
    ],
  },
  'bmc-x4-5': {
    terms: [AMBIG, TREE, DANGLING],
    simple: [
      'A derivation rewrites the start symbol step by step until only terminals are left. A parse tree is the picture of the same thing: the start symbol at the top, each node\'s children are the right-hand side of the rule used.',
      'The string "if c then if c then s else s" has two ifs but only one else. The grammar does not say which if the else belongs to.',
      'If the else belongs to the OUTER if, the outer statement is an <if-then-else> whose then-part is the inner <if-then>. If the else belongs to the INNER if, the outer statement is an <if-then> whose body is the inner <if-then-else>.',
      'Both trees have the same leaves, so the grammar gives two meanings for one string. That is the definition of ambiguous. Programming languages avoid it by a rule (the else belongs to the nearest if).',
    ],
  },
  'bmc-x4-6': {
    terms: [TREE, ORDER, t('Context-free grammar', 'Context-free_grammar')],
    simple: [
      'To build a parse tree for a string, start from S and split it by the rules: S → E, then E is either E + T or just T, T is either T * F or F, and F is a number n or a parenthesised ( E ).',
      'The lower a nonterminal is in the grammar, the tighter it binds. * lives in T, which is below E (where + lives). So in n+n*n the n*n is grouped first (as a T) and the + joins it later. That is why multiplication comes before addition.',
      'Parentheses restart the whole thing inside: F → ( E ). In n*(n+n) the sum is inside an F, so it is computed before the multiplication.',
      'Same-level operators group from the left, because E → E + T and T → T * F put the repeated part on the left: n*n+n is (n*n)+n, and n+n+n is (n+n)+n.',
      'Practical method: first find the top-level + (outside any parentheses): split the string there. If there is none, split at the top-level *. If there is none, it is a single n or a parenthesised expression.',
    ],
  },

  'bmc-x5-1': {
    terms: [TREE, CFG],
    simple: [
      'A parse tree starts with S at the top; every node\'s children are one rule of the grammar, and the leaves read left to right give the word.',
      'In this grammar each rule adds a matching pair around the middle: A → aAc puts an a on the left and a c on the right, B → bBc the same with b. C → cC | c fills the middle with at least one c.',
      'So for a word aᵏbˡcᵐ: use A → aAc k times, then A → B, B → bBc l times, then B → C and C produces the remaining m − k − l c\'s (at least one).',
      'aabbccc fails because after aabb four c\'s are already paired and C must still add at least one more: at least 5 c\'s are needed, the word has only 3.',
    ],
  },
  'bmc-x5-2': {
    terms: [REGGRAM, CFG, REGEX],
    simple: [
      'Work out what each nonterminal produces by itself: A → a | bA gives b*a (some b\'s, then an a); B → ε | bBb gives (bb)* (pairs of b\'s); B → b | bBb gives an odd number of b\'s.',
      'Then look at S. S → ABS just repeats the block AB after itself (ABAB...), which is a star in a regular expression. S → ASB puts A\'s on the left and the same number of B\'s on the right (like aⁿbⁿ).',
      'AᵏBᵏ is only a problem when the B\'s are visible. If B can be empty, the number of B\'s cannot be seen and the language is still regular. If every B adds at least one b, the word must have at least as many b\'s as a\'s: a finite automaton cannot count that, it needs a stack (PDA).',
    ],
  },
  'bmc-x5-3': {
    terms: [CFG, GRAMMAR],
    simple: [
      'Read each grammar and ask: what does every rule add? Then compare with the descriptions.',
      'S → A111A: something, 111, something: contains 111. S → BA with A → BBA: one symbol, then two at a time: odd length. S → 0A0 | 1A1: same first and last symbol, at least two symbols.',
      'S → SS | 0S1 | 1S0 | ε: every step adds one 0 and one 1 together, so the counts stay equal.',
    ],
  },
  'bmc-x5-4': {
    terms: [DFA, PDA, REGLANG],
    simple: [
      'Ask: how much does the machine have to remember? A fixed amount (the last two symbols, even or odd) → a finite automaton. An unbounded count that must be compared later → a pushdown automaton (stack).',
      '0ⁿ1ⁿ and 0ᵖ1ʳ0ᵖ⁻ʳ compare the lengths of separate blocks, so they need a stack: push the zeros, pop for the later symbols.',
      '(0|1)*10 only looks at the end, and 0ⁿ0ⁿ is just an even number of zeros: both are regular.',
    ],
  },
  'bmc-x5-5': {
    terms: [TM, PDA],
    simple: [
      'A Turing machine has a tape it can read, write and move on in both directions. It cannot "count" with a stack, so it matches symbols by marking them on the tape.',
      'Strategy: find an unmarked a, mark it, walk to an unmarked c and mark it too, walk back. Repeat for every a, then for every b.',
      'If some a or b has no c to match, reject. When all a\'s and b\'s are marked, check that no unmarked c is left: then accept.',
    ],
  },
  'bmc-x5-6': {
    terms: [AMBIG, TREE, ORDER],
    simple: [
      'The grammar E → E + E | E * E puts + and * on the same level, so 1+2*3 has two parse trees: (1+2)*3 and 1+(2*3). That is what ambiguous means.',
      'Fix: one nonterminal per precedence level. E handles + and −, T handles * and /, F handles digits and parentheses. The lower the level, the tighter it binds.',
      'Writing E → E + T (not E + E) also fixes the order inside one level: operators group from the left, so there is only one tree.',
    ],
  },
  'bmc-x6-1': {
    terms: [SSP, PCLASS, NPCLASS, EXP],
    simple: [
      'Count the possibilities: every number is either in the subset or not, so n numbers give 2ⁿ subsets. Trying them all is exponential: doubling with every extra number.',
      'Checking one proposed subset is fast: add its numbers (about n steps) and compare with S. Fast checking = NP.',
      'Fast solving would be P. No polynomial algorithm is known for subset sum, so it is in NP but not known to be in P (it is NP-complete).',
    ],
  },
  'bmc-x6-2': {
    terms: [EXP, SSP],
    simple: [
      'Number of steps = 2ⁿ (one per subset). Time in seconds = 2ⁿ / (operations per second). Days = seconds / 86 400 (24 · 60 · 60).',
      'Example: n = 30 at 100 operations per second: 2³⁰ ≈ 1 073 741 824, / 100 = 10 737 418 s, / 86 400 ≈ 124 days.',
      'The point of the table: adding 10 numbers multiplies the time by about 1000, so a faster computer helps very little against exponential growth.',
    ],
  },
  'bmc-x6-3': {
    terms: [SAT, EXP, NPCLASS],
    simple: [
      'n true/false variables give 2ⁿ assignments; trying all of them is exponential.',
      'One assignment takes 0.03 s, so in t seconds you can try t / 0.03 assignments. The largest n you can finish is the largest n with 2ⁿ ≤ that number: n = floor(log₂(assignments)).',
      'One hour: 3600 / 0.03 = 120 000; 2¹⁶ = 65 536 ≤ 120 000 < 2¹⁷, so 16 variables.',
    ],
  },
  'bmc-x6-4': {
    terms: [LL, CFG],
    simple: [
      'An LL(1) parser chooses the rule by looking at ONE next input symbol. So the alternatives of a nonterminal must start with different symbols (no FIRST/FIRST conflict).',
      'If an alternative can be empty (ε), the next symbol may come from what follows the nonterminal (FOLLOW), and that must not overlap with FIRST of the other alternatives (no FIRST/FOLLOW conflict).',
      'And no left recursion: S → ... → S... would make the parser loop for ever.',
    ],
  },
  'bmc-x6-5': {
    terms: [TM, t('Bubble sort', 'Bubble_sort')],
    simple: [
      'To find out what a Turing machine does, run it on a few short inputs by hand (or in JFLAP) and look at the tape at the end.',
      'Here: on 21 it ends with 12, on 312 with 123. The states named v21, v13, v32 swap two neighbouring symbols, so it sorts: bubble sort.',
      'Y and K are temporary marks that remember "a swap happened in this pass", so the machine knows it must do another pass.',
    ],
  },
  'bmc-x6-6': {
    terms: [TM],
    simple: [
      'Run it on a short input like 110 and watch the tape: the machine writes L at the left end and # after the input.',
      'It then marks the leftmost unmarked bit (X for 0, Y for 1) and writes the same bit at the right end, after #. The first input bit ends up nearest #, the last one farthest: reversed.',
      'Finally it erases the marked input, so only the reversed string is left.',
    ],
  },
  'bmc-x7-1': {
    terms: [t('Independent set', 'Independent_set_(graph_theory)'), NPC],
    simple: [
      'Checking a proposed answer: take the k vertices and look at every pair: is there an edge? That is about k² checks: fast (polynomial) → in NP.',
      'Finding an answer: without a clever trick you try sets of vertices, up to 2ⁿ of them: exponential.',
      'It is also NP-hard (every NP problem can be turned into it), so it is NP-complete.',
    ],
  },
  'bmc-x7-2': {
    terms: [REGEX, KLEENE],
    simple: [
      'a) "somewhere ac or ca": anything, then ac or ca, then anything.',
      'b) a and c never next to each other: cut the word at the b\'s; each piece must be only a\'s or only c\'s.',
      'c) exactly one meeting point of a and c: exactly one piece is a⁺c⁺ or c⁺a⁺, the others are only a\'s or only c\'s.',
      'd) Think about how the word can start (c, b, ab, ac) and what is still missing; after that, anything except a second c.',
    ],
  },
  'bmc-x7-3': {
    terms: [TM, t('Binary number', 'Binary_number')],
    simple: [
      'Adding 1 in binary works from the right, like on paper: 1 + 1 = 10, so a 1 becomes 0 and the carry moves left; the first 0 becomes 1 and you are done.',
      'So the machine first walks to the right end, steps back onto the last digit, turns 1\'s into 0\'s while moving left, and turns the first 0 (or the blank before the number) into 1.',
      'Check 1011: the end is 1 → 0, 1 → 0, then 0 → 1: 1100.',
    ],
  },
  'bmc-x7-4': {
    terms: [DFA, REGEX],
    simple: [
      'Translate the expression piece by piece: x* is a loop on x, xy is two arrows one after the other, x+ is one arrow and then a loop.',
      'For (ab)* and (abba)* make a cycle back to the start, and the start is also accepting (zero repetitions).',
      'For (0|1)⁸ you need to count to 8: 9 states in a row, only the last one accepting.',
    ],
  },
  'bmc-x7-5': {
    terms: [PDA, STACK],
    simple: [
      'aⁿb²ⁿ: every a must be matched by two b\'s, so push two symbols for every a and pop one for every b.',
      'aⁿbᵐ with m > n > 1: push one symbol per a (read at least two a\'s), pop one per b, and when the stack is empty at least one more b must still come.',
      'Accept when the stack is back at Z exactly when it should be.',
    ],
  },
  'bmc-x7-6': {
    terms: [AMBIG, TREE, CFG],
    simple: [
      'a) Use each rule once as cheaply as possible: S → SS gives two C\'s, B → bCd adds b, d and another C, D → cC adds c and another C. Every C is at least "a": 7 symbols.',
      'c) S → SS can split a word in different places: aaa = (aa)a or a(aa). Two parse trees for one word = ambiguous.',
      'e) S → CS | C still makes one or more C\'s, but there is only one way to split: the first C, then the rest.',
    ],
  },
}
