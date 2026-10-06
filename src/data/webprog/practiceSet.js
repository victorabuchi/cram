// The official "Practice quiz" activity on Moodle (the practice test for the course), in its original order.
// `setNo` is the question number on Moodle; the question is also tagged with the week and topic it belongs to, so it
// appears in practice sessions and practice tests as well. options[0] is the correct answer (Moodle does not show it,
// so these come from the course material). Add the next questions at the end.
const base = { subject: 'webprog', kind: 'mcq' }

export const topics = {}
export const learn = []

export const questions = [
  { ...base, id: 'ep-1', setNo: 1, week: 3, topic: 'bootstrap', q: "Which class targets medium devices (≥768px) in Bootstrap's grid system?",
    options: ['.col-md-4', '.col-sm-4', '.col-lg-4', '.col-xl-4'],
    why: 'Bootstrap breakpoints: sm ≥576px, md ≥768px, lg ≥992px, xl ≥1200px.' },
  { ...base, id: 'ep-2', setNo: 2, week: 4, topic: 'jsapi', q: 'Why is asynchronous JavaScript important in web applications?',
    options: ['It prevents blocking while waiting for slow operations', 'It replaces the need for using promises and callbacks', 'It runs multiple functions at the exact same time', 'It runs JavaScript code before the HTML page loads'],
    why: 'While a slow operation (like fetch) waits, the page stays responsive. Promises and async/await are the tools for it, not replaced by it, and JavaScript is still single-threaded.' },
  { ...base, id: 'ep-3', setNo: 3, week: 3, topic: 'bootstrap', q: 'What is the main purpose of using a CSS framework like Bootstrap?',
    options: ['It provides ready-made components for faster development', 'It compiles CSS code into optimized JavaScript files', 'It automatically makes websites accessible for all users', 'It replaces the need for writing HTML code entirely'],
    why: 'Bootstrap gives ready-made, responsive components and a grid. You still write HTML and still have to check accessibility yourself.' },
  { ...base, id: 'ep-4', setNo: 4, week: 5, topic: 'react', q: 'When should you use state in a React component?',
    options: ['When the value changes and the UI should update', 'When the value never changes during runtime', 'When you need to import external libraries', 'When you need to pass data to a child component'],
    why: 'State is for values that change over time and should update the UI. Passing data to a child is done with props.' },
  { ...base, id: 'ep-5', setNo: 5, week: 5, topic: 'react', q: 'What does the useState hook return in a React component?',
    options: ['The current value and a function to update it', 'An event listener attached to the component', 'A promise that resolves with fetched data', 'A single value that can be updated directly'],
    why: 'const [value, setValue] = useState(initial). The value is never changed directly.' },
  { ...base, id: 'ep-6', setNo: 6, week: 1, topic: 'css', q: 'Which CSS selector has the highest specificity value?',
    options: ['#main (id selector)', '.item (class selector)', 'p (element selector)', '* (universal selector)'],
    why: 'Specificity order: inline style > id > class (and attribute, pseudo-class) > element > universal.' },
  { ...base, id: 'ep-7', setNo: 7, week: 3, topic: 'bootstrap', q: 'Which HTML attribute is essential for making images accessible to screen reader users?',
    options: ['alt', 'src', 'width', 'title'],
    why: 'The alt attribute is the text alternative that a screen reader reads out.' },
  { ...base, id: 'ep-8', setNo: 8, week: 5, topic: 'react', q: 'Which best describes JSX in React?',
    options: ['A syntax extension allowing HTML-like code in JavaScript', 'A CSS preprocessor for styling React components', 'A separate programming language replacing JavaScript', 'A testing framework for React applications'],
    why: 'JSX is compiled into JavaScript function calls (build tools like Vite do this).' },
  { ...base, id: 'ep-9', setNo: 9, week: 2, topic: 'git', q: 'How do Git and GitHub relate to each other?',
    options: ['Git runs locally on your computer, GitHub hosts repositories online', 'Git is a command-line tool, GitHub is its graphical user interface', 'GitHub is a required add-on that must be installed for Git to work', 'Git runs locally, GitHub automatically syncs versions to other developers'],
    why: 'Git is the version control system. GitHub is a service that hosts Git repositories for sharing. Nothing syncs automatically: you push and pull.' },
  { ...base, id: 'ep-10', setNo: 10, week: 4, topic: 'jsdom', kind: 'explain',
    q: 'Based on the given code, answer the questions: a) Explain what the filter- and map-methods do in this code. b) What does num represent in the callback functions of filter and map? Where does its value come from? c) Explain what makes thoseNumbers1 and thoseNumbers2 equivalent. Why does the second version not need the return keyword?',
    code: `const numbers = [2, 5, 10, 15, 20];
const theseNumbers = numbers.filter(num => num > 10);
const thoseNumbers1 = theseNumbers.map(function(num) {
    return num * 2;
});
const thoseNumbers2 = theseNumbers.map(num => num * 2);`,
    keyPoints: [
      'filter creates a new array with only the elements for which the callback returns true: [15, 20] (numbers greater than 10); the original array is unchanged',
      'map creates a new array by applying the callback to every element and collecting the results: [30, 40]',
      'num is the parameter of the callback: the current element of the array, passed in by filter or map once for each element (its value comes from the array the method is called on; the name could be anything)',
      'thoseNumbers1 and thoseNumbers2 both double every element and give [30, 40]: one is a function expression with a block body and an explicit return, the other an arrow function',
      'an arrow function whose body is a single expression without curly braces returns the value of that expression implicitly, so no return keyword is needed',
    ],
    model: 'a) filter goes through numbers and keeps only the elements for which the callback returns true: num > 10 keeps 15 and 20, so theseNumbers is [15, 20] and numbers is not changed. map goes through theseNumbers, applies the callback to each element and builds a new array of the results: [30, 40]. b) num is the callback\'s parameter. The method calls the callback once per element, and each time num holds the current element of the array the method was called on (an element of numbers for filter, an element of theseNumbers for map). The name num is chosen by the programmer. c) thoseNumbers1 uses a normal function with a block body {} and an explicit return num * 2; thoseNumbers2 uses an arrow function with a concise body, num => num * 2. They do the same: both return a new array [30, 40]. An arrow function without curly braces returns the value of its single expression automatically (implicit return), so return is not needed; with braces you must write return.' },
]
