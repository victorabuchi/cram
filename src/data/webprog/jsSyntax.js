// Web Programming I, week 4: the Moodle "JavaScript syntax" practice exercise (write a function, run the tests).
// kind "code": the student writes `fn`; tests are { args, expected }; the first ones are the examples from the task.
// `solution` is shown on request. The solutions are checked against the tests in jsSyntax.test.js.
const base = { subject: 'webprog', week: 4, topic: 'jscode', kind: 'code' }
const t = (args, expected) => ({ args, expected })
const fn = (source) => ({ __fn: source }) // a function passed as an argument, written as source text

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
  { ...base, id: 'js-syntax-6', fn: 'getFirstName', title: 'getFirstName',
    prompt: [
      'Write a function called getFirstName that takes a full name as a string (first name and last name separated by a single space) and returns only the first name.',
      'Use the split method in your solution.',
      'You can assume the input always contains exactly one space between first and last name.',
      'Examples:\n- getFirstName("Ann Smith") returns "Ann"\n- getFirstName("Bob Clark") returns "Bob"',
    ],
    starter: 'const getFirstName = (fullName) => {\n    // TODO\n\n};',
    tests: [t(['Ann Smith'], 'Ann'), t(['Bob Clark'], 'Bob'), t(['Alice Johnson'], 'Alice'), t(['Li Wu'], 'Li')],
    examples: 2,
    requires: ['split'],
    solution: `const getFirstName = (fullName) => {
    const parts = fullName.split(" ");
    return parts[0];
};` },
  { ...base, id: 'js-syntax-7', fn: 'countLetters', title: 'countLetters',
    prompt: [
      'Write a function called countLetters that takes a full name (first name and last name separated by a single space) and returns the total number of letters in the name, NOT counting the space between names.',
      'Use the split method in your solution.',
      'Examples:\n- countLetters("Alice Smith") returns 10 (5 + 5)\n- countLetters("Jane Doe") returns 7 (4 + 3)\n- countLetters("Sam Pi") returns 5 (3 + 2)',
      'Hint:\n- split(" ") divides the name into an array of parts\n- You can access each part with an index\n- The length property gives the number of characters in a string',
    ],
    starter: 'const countLetters = (fullName) => {\n    // TODO\n\n};',
    tests: [t(['Alice Smith'], 10), t(['Jane Doe'], 7), t(['Sam Pi'], 5), t(['Al Bo'], 4), t(['Christopher Lee'], 14)],
    examples: 3,
    requires: ['split'],
    solution: `const countLetters = (fullName) => {
    const parts = fullName.split(" ");
    return parts[0].length + parts[1].length;
};` },
  { ...base, id: 'js-syntax-8', fn: 'createGreeting', title: 'createGreeting',
    prompt: [
      'Write a function named createGreeting that takes two string parameters: a name and a greeting time of day (for example, "morning" or "evening").',
      'The function should return a greeting in the following format:\n"Good [greeting], [name]! Welcome to Web Programming."',
      'Use template literals (backticks `) in your solution.',
      'Examples:\ncreateGreeting("Alice", "evening") returns "Good evening, Alice! Welcome to Web Programming."\ncreateGreeting("Bob", "morning") returns "Good morning, Bob! Welcome to Web Programming."',
      'The parameters can be assumed to be valid strings. In a template literal, variables can be inserted into a string using the syntax:\n`Some ${variable} inside a string`',
    ],
    starter: 'const createGreeting = (name, greeting) => {\n    // TODO\n\n};',
    tests: [
      t(['Alice', 'evening'], 'Good evening, Alice! Welcome to Web Programming.'), t(['Bob', 'morning'], 'Good morning, Bob! Welcome to Web Programming.'),
      t(['Kim', 'afternoon'], 'Good afternoon, Kim! Welcome to Web Programming.'), t(['Toast', 'night'], 'Good night, Toast! Welcome to Web Programming.'),
    ],
    examples: 2,
    requires: ['template'],
    solution: `const createGreeting = (name, greeting) => {
    return \`Good \${greeting}, \${name}! Welcome to Web Programming.\`;
};` },
  { ...base, id: 'js-syntax-9', fn: 'doubleValues', title: 'doubleValues',
    prompt: [
      'Write a function named doubleValues that takes an array of numeric values as a parameter and returns a new array where each number has been multiplied by two.',
      'Use the map() method in your solution.',
      'Examples:\ndoubleValues([1, 2, 3]) returns [2, 4, 6]\ndoubleValues([10, -5, 0]) returns [20, -10, 0]\ndoubleValues([]) returns []',
      'The map() method is often used with arrow functions in the following form:\narray.map(item => expression). The expression determines what value will be placed in the new array for each element.',
    ],
    starter: 'const doubleValues = (numbers) => {\n    // Use map method and arrow function\n    return // TODO\n};',
    tests: [t([[1, 2, 3]], [2, 4, 6]), t([[10, -5, 0]], [20, -10, 0]), t([[]], []), t([[0.5]], [1]), t([[7]], [14])],
    examples: 3,
    requires: ['map'],
    solution: `const doubleValues = (numbers) => {
    return numbers.map(n => n * 2);
};` },
  { ...base, id: 'js-syntax-10', fn: 'filterLongWords', title: 'filterLongWords',
    prompt: [
      'Write a function called filterLongWords that takes an array of strings and a minimum length as parameters. Return a new array containing only the words that are longer than the given minimum length.',
      'Use the filter method and an arrow function.',
      'Examples:\n- filterLongWords(["cat", "dog", "elephant", "ant"], 3) returns ["elephant"]\n- filterLongWords(["hello", "world", "hi"], 4) returns ["hello", "world"]\n- filterLongWords([], 5) returns []',
    ],
    starter: 'const filterLongWords = (words, minLength) => {\n    // Use filter method and arrow function\n    return // TODO\n};',
    tests: [
      t([['cat', 'dog', 'elephant', 'ant'], 3], ['elephant']), t([['hello', 'world', 'hi'], 4], ['hello', 'world']), t([[], 5], []),
      t([['abc', 'abcd'], 3], ['abcd']), t([['a', 'bb'], 0], ['a', 'bb']),
    ],
    examples: 3,
    requires: ['filter'],
    solution: `const filterLongWords = (words, minLength) => {
    return words.filter(word => word.length > minLength);
};` },
  { ...base, id: 'js-syntax-11', fn: 'formatCatInfo', title: 'formatCatInfo',
    prompt: [
      'Write a function called formatCatInfo that takes a cat object with properties name, age, and isSleeping (boolean). Return a formatted string.',
      'Format: "[name] is [age] years old. Currently: [status]"\nwhere status is "sleeping" if isSleeping is true, otherwise "awake".',
      'Examples:\n- formatCatInfo({name: "Toast", age: 6, isSleeping: true})\n returns "Toast is 6 years old. Currently: sleeping"\n- formatCatInfo({name: "Naranja", age: 3, isSleeping: false})\n returns "Naranja is 3 years old. Currently: awake"',
      'Hint:\n- Access object properties with dot notation, obj.property\n- Use ternary operator: condition ? valueIfTrue : valueIfFalse\n- Use template literals with ${...}',
    ],
    starter: 'const formatCatInfo = (cat) => {\n    // Use ternary operator to decide the status\n    // Use template literal to build the result string\n    // TODO\n\n};',
    tests: [
      t([{ name: 'Toast', age: 6, isSleeping: true }], 'Toast is 6 years old. Currently: sleeping'),
      t([{ name: 'Naranja', age: 3, isSleeping: false }], 'Naranja is 3 years old. Currently: awake'),
      t([{ name: 'Kinsky', age: 0, isSleeping: false }], 'Kinsky is 0 years old. Currently: awake'),
      t([{ name: 'Ramona', age: 12, isSleeping: true }], 'Ramona is 12 years old. Currently: sleeping'),
    ],
    examples: 2,
    solution: `const formatCatInfo = (cat) => {
    const status = cat.isSleeping ? "sleeping" : "awake";
    return \`\${cat.name} is \${cat.age} years old. Currently: \${status}\`;
};` },
  { ...base, id: 'js-syntax-12', fn: 'toggleCatSleep', title: 'toggleCatSleep',
    prompt: [
      'Write a function called toggleCatSleep that takes a cat object with properties name and isAsleep (boolean). Return a new cat object where the isAsleep value has been reversed.',
      'The original cat object should NOT be modified.',
      'Examples:\n- toggleCatSleep({name: "Toast", isAsleep: true})\n returns {name: "Toast", isAsleep: false}\n- toggleCatSleep({name: "Naranja", isAsleep: false})\n returns {name: "Naranja", isAsleep: true}',
      'Hint:\n- Use the spread operator (...) to copy the object\n- Use the logical NOT operator (!) to reverse the boolean value',
      'Note: This pattern is common in React state updates where you need to change one property of an object.',
    ],
    starter: 'const toggleCatSleep = (cat) => {\n    return // TODO\n};',
    tests: [
      { ...t([{ name: 'Toast', isAsleep: true }], { name: 'Toast', isAsleep: false }), noMutation: true },
      { ...t([{ name: 'Naranja', isAsleep: false }], { name: 'Naranja', isAsleep: true }), noMutation: true },
      { ...t([{ name: 'Kinsky', isAsleep: true }], { name: 'Kinsky', isAsleep: false }), noMutation: true },
    ],
    examples: 2,
    solution: `const toggleCatSleep = (cat) => {
    return { ...cat, isAsleep: !cat.isAsleep };
};` },
  { ...base, id: 'js-syntax-13', fn: 'handleItemAction', title: 'handleItemAction',
    prompt: [
      'Write a function called handleItemAction that takes two parameters:\n• items: an array\n• callback: a function to apply to each item',
      'Return a new array where the callback function has been applied to each item.',
      'Use the map method in your solution.',
      'Examples:\n- handleItemAction([1, 2, 3], x => x * 2) returns [2, 4, 6]\n- handleItemAction(["a", "b"], x => x.toUpperCase()) returns ["A", "B"]\n- handleItemAction([], x => x * 10) returns []',
      'Hint:\n• The callback is a function that takes one item and returns a new value\n• You can use array.map with the callback directly',
      'Note: In React, this pattern is very common. For example, you might have a list of items and want to render each one as a React component.',
    ],
    starter: 'const handleItemAction = (items, callback) => {\n    // TODO\n};',
    tests: [
      t([[1, 2, 3], fn('x => x * 2')], [2, 4, 6]), t([['a', 'b'], fn('x => x.toUpperCase()')], ['A', 'B']), t([[], fn('x => x * 10')], []),
      t([['hi', 'there'], fn('s => s.length')], [2, 5]), t([[1, 2], fn('n => n + 1')], [2, 3]),
    ],
    examples: 3,
    requires: ['map'],
    solution: `const handleItemAction = (items, callback) => {
    return items.map(callback);
};` },
]
