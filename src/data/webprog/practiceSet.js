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
  { ...base, id: 'ep-11', setNo: 11, week: 4, topic: 'jsapi', q: 'A user updates their existing profile information on a website. Which HTTP method is most appropriate for this action?',
    options: ['PUT', 'GET', 'POST', 'DELETE'],
    why: 'PUT (or PATCH) updates an existing resource. GET reads, POST creates, DELETE removes.' },
  { ...base, id: 'ep-12', setNo: 12, week: 4, topic: 'jsapi', q: 'What is a REST API used for in web development?',
    options: ['To communicate between two systems over HTTP', 'To convert JavaScript code into HTML content', 'To handle browser events like clicks and form submissions', 'To provide reusable UI components across pages'],
    why: 'A REST API lets a client (for example your app) talk to a server over HTTP, usually exchanging JSON. Events are handled with the DOM API, reusable UI parts are components.' },
  { ...base, id: 'ep-13', setNo: 13, week: 4, topic: 'jsdom', q: 'You want to change the visible text of an HTML element from JavaScript. Which DOM method is most appropriate?',
    options: ['textContent', 'addEventListener', 'createElement', 'getElementById'],
    why: 'textContent sets the text of an element. getElementById only finds the element, createElement makes a new one, addEventListener reacts to events.' },
  { ...base, id: 'ep-14', setNo: 14, week: 4, topic: 'jsdom', kind: 'explain',
    q: 'Based on the code block, answer the questions: a) What is this event listener for? b) The code uses event.preventDefault(). Based on the context, what do you think happens if this line is removed? c) What is the meaning of the row including document.createElement("li")?',
    code: `form.addEventListener("submit", (event) => {
    event.preventDefault();
    const task = input.value;
    const li = document.createElement('li');
    li.textContent = task;
    list.appendChild(li);
    input.value = "";
});`,
    keyPoints: [
      'the listener runs when the form is submitted and adds the text from the input as a new item (li) to the list',
      'event.preventDefault() stops the browser\'s default form submission',
      'without it the form would submit and the page would reload, so the new list item would disappear (the JavaScript result is lost)',
      'document.createElement("li") creates a new <li> element in memory; it is not yet visible until it is added with appendChild',
      'then the text is set with textContent, the item is added to the list, and the input is cleared',
    ],
    model: 'a) The event listener is for the form\'s submit event. When the form is submitted it reads the text from the input (input.value), makes a new list item containing that text, adds it to the list and clears the input, so it is a way to add a task to a to-do list. b) event.preventDefault() cancels the browser\'s default behaviour of submitting the form, which reloads (or navigates) the page. If the line is removed, the page would reload when the form is submitted, so the new item would be lost and the list would reset. c) document.createElement("li") creates a new <li> element object in memory. It does not appear on the page yet: the next lines set its text with textContent and append it to the list with list.appendChild(li), and only then is it visible.' },
  { ...base, id: 'ep-15', setNo: 15, week: 1, topic: 'web', q: 'What is the main difference between the Internet and the Web?',
    options: ['The Internet is the network infrastructure, the Web is an application on it', 'They are the same technology with different names', 'The Web is older and more fundamental than the Internet', 'The Web is the physical network, the Internet is the content'],
    why: 'The Internet is the network (TCP/IP). The Web (URL, HTML, HTTP) is one application on top of it, like email is another.' },
  { ...base, id: 'ep-16', setNo: 16, week: 5, topic: 'react', kind: 'explain',
    q: 'Based on the given code, answer the questions: a) Why is ProductCard defined as a separate component? b) How does the App component use the ProductCard component? c) What JSX syntax is used in the code?',
    code: `function ProductCard(props) {
    return (
        <div className="card">
            <h2>{props.name}</h2>
            <p>Price: {props.price}€</p>
        </div>
    );
}

function App() {
    return (
        <div>
            <ProductCard name="Coffee" price={2.50} />
            <ProductCard name="Tea" price={2.00} />
        </div>
    );
}`,
    keyPoints: [
      'ProductCard is a reusable component: one definition, used many times for different products, so code is not repeated and is easier to maintain',
      'App uses ProductCard like an HTML tag, once for each product, and passes different data to each instance as props (name, price)',
      'inside ProductCard the props arrive in the props object and are shown with props.name and props.price',
      'JSX syntax: HTML-like tags in JavaScript, className instead of class, curly braces {} to embed JavaScript expressions, components written as capitalised tags, self-closing tags, attributes with strings (name="Coffee") and expressions (price={2.50})',
    ],
    model: 'a) ProductCard is a separate component so that the structure of a product card is written once and can be reused for any product. That avoids repeated code, makes changes in one place, and follows the component idea of splitting the UI into independent reusable parts that receive data as props. b) App returns a div that contains two ProductCard elements. Each is used like an HTML tag and is given different props, name and price, so the same component renders two different cards (Coffee 2.5 and Tea 2). Inside ProductCard the values are read from the props object: props.name and props.price. c) The code uses JSX, a syntax extension that lets you write HTML-like markup inside JavaScript: tags such as div, h2 and p; className instead of class; curly braces {} to insert JavaScript expressions like {props.name} and price={2.50}; a capitalised tag name <ProductCard /> for a component; self-closing tags; and a single parent element (div) wrapped around the returned content.' },
  { ...base, id: 'ep-17', setNo: 17, week: 5, topic: 'react', q: 'What does client-side routing in a Single Page Application do?',
    options: ['It changes the URL and view without reloading', 'It reloads the entire page when navigation happens', 'It stores the current component into React state', 'It creates a new component for each URL automatically'],
    why: 'In an SPA the router (for example react-router) changes the address and renders another component in the same page, without a full reload. You still write the components and routes yourself.' },
  { ...base, id: 'ep-18', setNo: 18, week: 5, topic: 'react', q: 'When fetching data from an API in a React component, where should the fetch call typically be placed?',
    options: ['Inside a useEffect hook that runs when needed', 'Inside a useState hook that stores the fetched data', 'Directly in the component body without any wrapper', 'In a <script> tag placed directly in the JSX'],
    why: 'Fetching is a side effect. In the component body it would run on every render. useEffect runs it when needed (for example once, with an empty dependency array), and useState only stores the result.' },
  { ...base, id: 'ep-19', setNo: 19, week: 1, topic: 'html', q: 'You want to group related HTML elements together as a container without adding any specific semantic meaning. Which tag is most appropriate?',
    options: ['<div>', '<h1>', '<article>', '<section>'],
    why: '<div> is the generic container with no meaning. <article> and <section> are semantic, and <h1> is a heading.' },
  { ...base, id: 'ep-20', setNo: 20, week: 1, topic: 'css', q: 'What does "cascading" refer to in Cascading Style Sheets?',
    options: ['Multiple styles apply and conflicts resolve by rules', 'CSS files are loaded and applied in the order they are linked', 'Browser default styles override custom developer styles', 'Styles applied to a class override styles applied to an ID'],
    why: 'Several rules can target the same element; the cascade decides which wins using origin, specificity (an id beats a class) and order. Order of linking is only one part of it.' },
]
