import * as A from './automata'

// Examples offered in the Automata lab: the lecture and exercise 1 automata.
export const PRESETS = [
  { id: 'one-b', label: 'Lecture: exactly one b', text: A.EXACTLY_ONE_B, tests: ['aba', 'a', 'bb', 'abab'] },
  { id: 'one-b-complete', label: 'Lecture: exactly one b (complete DFA)', text: A.EXACTLY_ONE_B_COMPLETE, tests: ['aba', 'a', 'bb', 'abab'] },
  { id: 'at-least-one-b', label: 'Lecture example 1: at least one b', text: A.AT_LEAST_ONE_B, tests: ['aaaaab', 'aaabbb', 'aaaa'] },
  { id: 'bb', label: 'Contains bb', text: A.CONTAINS_BB, tests: ['abab', 'abba', 'bb'] },
  { id: 'parity', label: 'Lecture example 2: ones odd or zeros odd', text: A.PARITY_01, tests: ['01', '00', '11', '10', '101', '110', '000', '1100', '1000'] },
  { id: 't1', label: 'T1: sum modulo 6', text: A.SUM_MOD_6, tests: ['123', '11', '33', '1122'] },
  { id: 't2', label: 'T2 full: sum modulo 6 with negative values', text: A.SUM_MOD_6_NEGATIVE, tests: ['-1', '-1-2', '2-2', '3-1'] },
  { id: 't3', label: 'T3: no substring abc', text: A.NO_ABC, tests: ['aabca', 'cabbc', 'abc', ''] },
  { id: 't4', label: 'T4: contains 00', text: A.CONTAINS_00, tests: ['1101', '01001', '00', '0101'] },
  { id: 't5', label: 'T5: list contains 112', text: A.HAS_112, tests: ['2575,45777,9803,112,3567', '295,430,1121,23,0', '112', '1121'] },
  { id: 't6a', label: 'T6 a): odd number of a', text: A.ODD_A, tests: ['a', 'bca', 'aa'] },
  { id: 't6b', label: 'T6 b): a odd OR b even', text: A.A_ODD_OR_B_EVEN, tests: ['', 'b', 'a', 'ab', 'abb'] },
  { id: 't6c', label: 'T6 c): either a odd or b even', text: A.A_ODD_XOR_B_EVEN, tests: ['', 'b', 'a', 'ab', 'abb'] },
  {
    id: 'blank',
    label: 'Start from scratch',
    text: `# Your own automaton. Transitions: from-state, symbols, "->", to-state
start: q0
accept: q1
q0 a -> q1
q1 a b -> q1
q1 c -> q0`,
    tests: ['a', 'ab', 'c'],
  },
]
