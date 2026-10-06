// Web Programming I, week 4: the Moodle "JavaScript syntax" practice exercise (write a function, run the tests).
// kind "code": the student writes `fn`; tests are { args, expected }; the first ones are the examples from the task.
// `solution` is shown on request. The solutions are checked against the tests in jsSyntax.test.js.
const base = { subject: 'webprog', week: 4, topic: 'jscode', kind: 'code' }
const t = (args, expected) => ({ args, expected })

export const topics = { jscode: 'JavaScript syntax exercises' }
export const learn = []

export const questions = [
  { ...base, id: 'js-syntax-1', fn: 'getGrade', title: 'getGrade',
    prompt: [
      'Write a function named getGrade that takes a numeric score (0–100) as a parameter and returns a grade according to the following rules:',
      '90 or more: 5\n80–89: 4\n70–79: 3\n60–69: 2\n50–59: 1\nbelow 50: 0',
      'Examples:\ngetGrade(95) returns 5\ngetGrade(72) returns 3\ngetGrade(45) returns 0',
      'The input score can be assumed to be an integer between 0 and 100.',
    ],
    starter: 'const getGrade = (points) => {\n    // TODO\n\n};',
    tests: [t([95], 5), t([72], 3), t([45], 0), t([90], 5), t([100], 5), t([89], 4), t([80], 4), t([79], 3), t([70], 3), t([69], 2), t([60], 2), t([59], 1), t([50], 1), t([49], 0), t([0], 0)],
    examples: 3,
    solution: `const getGrade = (points) => {
    if (points >= 90) return 5;
    if (points >= 80) return 4;
    if (points >= 70) return 3;
    if (points >= 60) return 2;
    if (points >= 50) return 1;
    return 0;
};` },
  { ...base, id: 'js-syntax-2', fn: 'playRound', title: 'playRound',
    prompt: [
      'Write a function called playRound that takes two parameters: player1 and player2 (both strings: "rock", "paper", or "scissors").\nThe function should return:\n- "Player 1 wins" if player 1 beats player 2\n- "Player 2 wins" if player 2 beats player 1\n- "Tie" if both choose the same',
      'Rules: rock beats scissors, scissors beats paper, paper beats rock.',
      'Examples:\n- playRound("rock", "scissors") returns "Player 1 wins"\n- playRound("paper", "rock") returns "Player 1 wins"\n- playRound("rock", "paper") returns "Player 2 wins"\n- playRound("rock", "rock") returns "Tie"',
    ],
    starter: 'const playRound = (player1, player2) => {\n    // TODO\n\n};',
    tests: [
      t(['rock', 'scissors'], 'Player 1 wins'), t(['paper', 'rock'], 'Player 1 wins'), t(['rock', 'paper'], 'Player 2 wins'), t(['rock', 'rock'], 'Tie'),
      t(['scissors', 'paper'], 'Player 1 wins'), t(['scissors', 'rock'], 'Player 2 wins'), t(['paper', 'scissors'], 'Player 2 wins'), t(['paper', 'paper'], 'Tie'), t(['scissors', 'scissors'], 'Tie'),
    ],
    examples: 4,
    solution: `const playRound = (player1, player2) => {
    if (player1 === player2) return "Tie";
    if (
        (player1 === "rock" && player2 === "scissors") ||
        (player1 === "scissors" && player2 === "paper") ||
        (player1 === "paper" && player2 === "rock")
    ) {
        return "Player 1 wins";
    }
    return "Player 2 wins";
};` },
  { ...base, id: 'js-syntax-3', fn: 'findLargest', title: 'findLargest',
    prompt: [
      'Write a function named findLargest that takes an array of numeric values as a parameter and returns the largest number in the array.',
      'Examples:\nfindLargest([3, 7, 2, 9, 5]) returns 9\nfindLargest([-1, -5, -3]) returns -1\nfindLargest([42]) returns 42',
      'You may assume that the array always contains at least one number.',
    ],
    starter: 'const findLargest = (numbers) => {\n    // TODO\n\n};',
    tests: [t([[3, 7, 2, 9, 5]], 9), t([[-1, -5, -3]], -1), t([[42]], 42), t([[0, 0, 0]], 0), t([[-10, -2]], -2), t([[5, 5, 1]], 5), t([[1, 2, 3, 4, 100]], 100)],
    examples: 3,
    solution: `const findLargest = (numbers) => {
    let largest = numbers[0];
    for (const n of numbers) {
        if (n > largest) largest = n;
    }
    return largest;
};` },
  { ...base, id: 'js-syntax-4', fn: 'sumPositive', title: 'sumPositive',
    prompt: [
      'Write a function named sumPositive that takes an array of numeric values as a parameter and returns the sum of all positive numbers in the array. Negative numbers and zero should not be included in the sum.',
      'Examples:\nsumPositive([1, -2, 3, -4, 5]) returns 9\nsumPositive([-1, -2, -3]) returns 0\nsumPositive([10, 20, 30]) returns 60',
    ],
    starter: 'const sumPositive = (numbers) => {\n    // TODO\n\n};',
    tests: [t([[1, -2, 3, -4, 5]], 9), t([[-1, -2, -3]], 0), t([[10, 20, 30]], 60), t([[0, 0]], 0), t([[0, 4, -4]], 4), t([[2.5, -1]], 2.5)],
    examples: 3,
    solution: `const sumPositive = (numbers) => {
    let sum = 0;
    for (const n of numbers) {
        if (n > 0) sum += n;
    }
    return sum;
};

// or in one expression:
// const sumPositive = (numbers) => numbers.filter(n => n > 0).reduce((a, b) => a + b, 0);` },
  { ...base, id: 'js-syntax-5', fn: 'countNamesOfType', title: 'countNamesOfType',
    prompt: [
      'Write a function called countNamesOfType that takes an array of names (strings) and a letter as parameters.\nReturn the number of names that:\n- start with an uppercase letter, AND start with the given letter',
      'Note: The comparison must be case-sensitive. This means that only names starting with a capital letter and matching the given letter should be counted.',
      'Use a for...of loop in your solution.',
      'Examples:\n- countNamesOfType(["Toast", "Tessa", "Naranja"], "T") returns 2\n- countNamesOfType(["Kinsky", "Kim"], "K") returns 2\n- countNamesOfType(["Toast", "tessa", "Tara"], "T") returns 2\n- countNamesOfType(["naranja", "toast"], "N") returns 0',
      'Hint:\n- Use for...of to iterate over the array\n- Use .startsWith() to check the first letter of a string\n- Check if the first character is uppercase by comparing it to itself using toUpperCase()',
    ],
    starter: 'const countNamesOfType = (names, letter) => {\n    // Use for...of loop to iterate over the names array\n    // Count how many names start with an uppercase letter\n    // AND start with the given letter\n    // TODO\n\n};',
    tests: [
      t([['Toast', 'Tessa', 'Naranja'], 'T'], 2), t([['Kinsky', 'Kim'], 'K'], 2), t([['Toast', 'tessa', 'Tara'], 'T'], 2), t([['naranja', 'toast'], 'N'], 0),
      t([[], 'A'], 0), t([['Anna', 'anna', 'Ada'], 'A'], 2), t([['Anna', 'Bob'], 'a'], 0),
    ],
    examples: 4,
    requires: ['forOf'],
    solution: `const countNamesOfType = (names, letter) => {
    let count = 0;
    for (const name of names) {
        const first = name[0];
        if (first === first.toUpperCase() && name.startsWith(letter)) {
            count++;
        }
    }
    return count;
};` },
]
