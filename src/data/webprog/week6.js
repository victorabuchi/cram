// Web Programming I, week 6: Programming with AI (lecture) and the AI assignment (Snake game with a custom tutor agent).
// mcq: options[0] is the CORRECT answer; the app shuffles them when shown.
const base = { subject: 'webprog', week: 6 }

export const topics = {
  ai: 'Programming with AI',
  aiassign: 'AI assignment: Snake with a tutor agent',
}

export const learn = [
  // ---------- Where does AI fit in? ----------
  { ...base, topic: 'ai', title: 'Where AI fits in this course',
    text: 'The course covers version control (Git), content structure (HTML), style and layout (CSS, Bootstrap), interactivity (JavaScript, DOM API), external APIs (fetch, async/await) and component-based apps (React). AI can help with all of these, often producing working code in seconds. The question is therefore not whether AI can generate code, but whether YOU can: decide what code is needed (the project requirements), evaluate the design choices the AI makes, recognize when its output has issues, and take responsibility for the final result. Short version: AI tools can produce code; you produce the judgment about that code.',
    code: `AI can:   generate code in seconds
You must: decide what is needed (requirements)
          evaluate the design choices
          recognize problems in the output
          take responsibility for the result` },
  { ...base, topic: 'ai', title: 'LLMs, chatbots and what is inside a chatbot',
    text: 'LLMs (large language models) have developed very fast; the lecture showed a timeline of major releases from 2023 to early 2025. An LLM is not the same as a chatbot. A system that interacts with users (a chatbot) is much more than just an LLM: it also has security mechanisms, conversation management, use of external resources, and model selection depending on the question or conversation.',
    code: `chatbot = LLM
        + security mechanisms
        + conversation management
        + use of external resources
        + model selection (depending on the question)` },
  { ...base, topic: 'ai', title: 'The trade-off between automation and control',
    text: 'AI coding tools can be placed on an axis between control and automation. With chatbots you keep the most control: you copy, adapt and decide everything. Assistants (such as GitHub Copilot code completion) suggest code while you work. AI-powered IDEs (Cursor, Lovable, Replit, Bolt) can change several files from a description. Agents have the most automation: you describe a task and the AI carries it out, so you hold the least control. The more you automate, the more you must be able to check what was done.',
    code: `more control  <------------------------------>  more automation
Chatbots  ->  Assistants  ->  AI-powered IDEs  ->  Agents` },
  { ...base, topic: 'ai', title: 'GitHub Copilot and AI-powered IDEs',
    text: 'GitHub Copilot is an AI-powered code completion tool. It was launched as a technical preview in 2021 and became generally available for Visual Studio Code in 2022. AI-powered IDEs go further. Cursor is an AI-powered IDE based on VS Code; it connects to an LLM using an API key, has an Agent Mode (you describe a task in natural language and the AI implements it across the project) and supports multi-file editing with project-wide context. Lovable is built with no-code and non-technical users in mind: from idea to product without coding skills. Replit is an AI-powered, cloud-based development environment where you write, run and share code directly in the browser. Bolt is a cloud-based environment similar to Lovable, with no local setup required.',
    code: `Copilot : code completion        (preview 2021, general availability in VS Code 2022)
Cursor  : AI IDE on VS Code      (API key, Agent Mode, multi-file editing)
Lovable : AI IDE for non-technical users (idea -> product)
Replit  : cloud IDE in the browser (write, run, share)
Bolt    : cloud IDE like Lovable, no local setup` },
  { ...base, topic: 'ai', title: 'System prompts and user prompts',
    text: 'A system prompt is a set of instructions given to an AI model. It can define a personality (a helpful assistant, a witty comedian, a professional editor: this shapes the tone and style of the outputs), set constraints (what the AI should and should not do, for example answer only in a certain language or avoid certain topics) and provide context (the background information the AI needs to process the user\'s requests). The user prompt is what the user types in each message. The chatbot\'s behaviour comes from the system prompt together with the user prompt, and the system prompts of real chatbots can be found online.',
    code: `system prompt : "You are a tutor. Never give the full solution."   (set once by the developer)
user prompt   : "How do I move the snake?"                      (typed by the user each time)
-> the answer follows BOTH` },

  // ---------- Working with AI ----------
  { ...base, topic: 'ai', title: 'Using chatbots for programming: they do not see your project',
    text: 'Many general-purpose LLMs, and the chatbots that integrate them, can be used for programming. But unless you explicitly say so, the chatbot has no information about your file structure, the names of your variables, the versions of your tools and so on. It answers from what you gave it, so the quality of the answer depends on the quality of your question and the context you share.',
    code: `Weak:   "my code does not work"
Better: "In index.html this function moves the snake [code]. After pressing ArrowUp it still goes
         right. Browser: Chrome. What could cause this?"` },
  { ...base, topic: 'ai', title: 'Copy-paste is not prompt engineering',
    text: 'Effective prompting requires understanding what you are building. Patterns that create problems: pasting the whole assignment and asking for a solution; accepting code you do not understand; applying changes without checking what they do; assuming the first answer is the right one. Patterns that work better: break the problem into small steps; ask about concepts you do not understand; ask for specific changes to the existing code you shared; ask the AI to explain a solution and consider different options before applying one. The difference is not about knowing everything, it is about being able to make informed decisions about what the AI suggests.',
    code: `Problems                                   Better
paste the whole assignment, ask solution   break the problem into small steps
accept code you do not understand          ask about concepts you do not understand
apply changes without checking             ask for specific changes to YOUR code
assume the first answer is right           ask for an explanation and options first` },
  { ...base, topic: 'ai', title: 'The role of your understanding',
    text: 'You can get AI-generated code for an app in seconds. You can also get code from a tutorial, a template or a colleague. The question is not where the code came from, but what happens when the app breaks and nobody wrote the code, a user reports a bug and you must fix it, the requirements change and you must adapt, the code becomes yours to maintain, or something goes wrong and someone asks who is accountable. AI-generated code is like any other code you did not write yourself: someone has to understand it before it can be trusted, changed or explained.',
    code: `broken app | bug report | new requirements | maintenance | accountability
-> all need someone who UNDERSTANDS the code` },

  // ---------- Ethical and practical concerns ----------
  { ...base, topic: 'ai', title: 'Ethical and practical concerns',
    text: 'Copyright and bias: LLMs are trained on large amounts of existing material, which raises questions about copyright and about bias in what they produce. Creativity: when AI is used for coding websites, the websites start looking the same (although with Bootstrap we had the same problem). Vibe coding means building software by describing what you want and accepting what the AI produces without really reading or understanding the code. AI slop (the productivity paradox): employees use AI tools to create low-effort, passable-looking work that ends up creating more work for their coworkers. AI slop is defined as AI-generated work content that masquerades as good work, but lacks the substance to meaningfully advance a given task. One result is professionals cleaning up after vibe coders.',
    code: `copyright, bias        training data
creativity             sites start to look the same
vibe coding            accept what the AI makes without understanding it
AI slop                looks like good work, lacks substance, creates work for others` },

  // ---------- AI for learning ----------
  { ...base, topic: 'ai', title: 'AI generates: can you tell what is what?',
    text: 'AI produces code that mixes many things: JavaScript features (variables, arrays, functions, .map(), async/await), browser APIs (DOM manipulation, event listeners, fetch) and library-specific APIs. Your understanding determines what you can do with it. Level 1, accept and hope: run the code and hope it works. Level 2, read and understand: know what each part does. Level 3, evaluate and modify: judge whether the choices are good and improve them. Level 4, debug and extend: fix issues and add features. You can use AI at any of these levels, but the higher your understanding, the more you can do with it.',
    code: `level 1  accept and hope        run it, hope it works
level 2  read and understand    know what each part does
level 3  evaluate and modify    judge the choices, improve them
level 4  debug and extend       fix issues, add features` },
  { ...base, topic: 'ai', title: 'A configured prompt for learning: productive struggle',
    text: 'Most system prompts configure chatbots to give useful, direct answers. When learning something new we do not want direct answers. Learning needs "productive struggle": working on the problem yourself with support. The way to get it is a system prompt that configures the AI\'s response style to act as an experienced tutor: it asks questions, gives hints and explains concepts instead of writing the solution.',
    code: `default chatbot : direct answer
tutor prompt    : question -> hint -> you try -> feedback` },
  { ...base, topic: 'ai', title: 'Custom agents in AI coding tools',
    text: 'Modern AI coding tools let you configure how the AI responds in a specific project. In GitHub Copilot this is done with .github/agents/name.agent.md files in your project; in Cursor with .cursorrules files. You can define what role the AI plays (assistant, tutor, reviewer), what it should and should not do, and how it should respond. This makes AI coding tools not just powerful, but customizable to your needs.',
    code: `GitHub Copilot : .github/agents/<name>.agent.md
Cursor         : .cursorrules
defines  role (assistant, tutor, reviewer), do and do-not rules, response style` },

  // ---------- AI assignment ----------
  { ...base, topic: 'aiassign', title: 'The AI assignment at a glance',
    text: 'Weight 20% of the course grade, individual work, deadline 13.11.2026. Goal: use AI as a tool for LEARNING, not just for producing code faster. You configure a custom AI agent as a tutor, build a Snake game in JavaScript with its help in GitHub Copilot in VS Code, and reflect on how AI shapes your learning. The game is the vehicle; the main outcome is your understanding of how to design and use AI as a learning tool. Three parts: 1) setup (GitHub Copilot, the custom agent, a git repository), 2) build the game step by step, 3) the report. Keep notes during the work: they help you write the report.',
    code: `Part 1  Setup      Copilot + custom agent (.agent.md) + git
Part 2  Build      Snake game, step by step with the agent
Part 3  Report     400-800 words, 3-5 screenshots of Copilot Chat
Grading 0-20 p     setup 0-5, process 0-5, reflection 0-10
To pass: at least 10/20 AND the game runs AND all required files are submitted` },
  { ...base, topic: 'aiassign', title: 'Setup: Copilot, the custom agent and git',
    text: 'Set up GitHub Copilot in VS Code (students can get it free through the GitHub Student Developer Pack; verification can take a few days, so start early). A custom agent is defined in a .agent.md file; the starter file snake-tutor.agent.md goes into the .github/agents/ folder. You may modify the agent, but these principles must remain: the tools line at the top must not be changed (the agent uses only read, search and web); the agent must support your learning of JavaScript, not just help you finish the game; it must not produce a complete game or large blocks of finished code in a single response; it must guide step by step; it must remind about committing to git. You can freely change tone, level of hints and teaching approach. Initialize a git repository and commit regularly: the commit history is part of the submission.',
    code: `---
name: snake-tutor
description: A coding tutor for building a Snake game. ...
tools: ['read', 'search', 'web']      <- must NOT be changed
---
You are a JavaScript coding tutor ... guide, not do the work.` },
  { ...base, topic: 'aiassign', title: 'The starter agent: how the tutor behaves',
    text: 'The starter agent says: never produce a complete game or large blocks of finished code; help the student learn JavaScript and think through each step; remind about committing after each step. It treats the canvas drawing as already done (drawGame draws the snake and food), so the student focuses on the game logic (variables, functions, conditionals, loops, event listeners, DOM and timing APIs), not the Canvas API. When the student asks "how do I do X": break X into substeps, explain the first one conceptually, ask the student to try and wait for the attempt. When the student shares code: say what works first and ask a guiding question instead of giving the fix. When explaining concepts: name the JavaScript concept. When a step is done: congratulate, remind to commit, suggest a commit message with a prefix (feat:, fix:, refactor:, style:). Check understanding before moving on. When stuck: give a small hint; after two hints give a snippet of at most 5 lines. Decline to write the whole game.',
    code: `stuck?           small hint -> second hint -> snippet (max 5 lines)
step done?       congratulate + remind to commit + suggest message
commit prefixes  feat: new feature   fix: bug fix
                 refactor: better code, same behaviour   style: formatting
order of steps   movement -> controls -> food and growth
                 -> collisions -> game over -> improvements` },
  { ...base, topic: 'aiassign', title: 'Building the Snake game: the steps',
    text: 'The starter index.html has a canvas, minimal styling, the game configuration and a drawGame function that draws the initial state (snake and food), but nothing moves. Step 1 Movement: a game loop that moves the snake in the current direction at regular intervals. Step 2 Keyboard controls: listen for arrow key presses and change direction, and make sure the snake cannot reverse into itself. Step 3 Eating and growing: when the snake reaches the food, increase the score, put new food at a random position and make the snake longer. Step 4 Game over: end the game if the snake hits a wall or its own body, show a message and allow restarting. Step 5 Improvements of your choice (visual design, score display, speed increase, colours changing with difficulty, high score in localStorage, start screen, pause and resume, game over screen with restart button, difficulty selector). Commit at least after every step.',
    code: `1 Movement     game loop, regular intervals
2 Controls     arrow keys, no reversing
3 Eating       score, new food, longer snake
4 Game over    wall or own body, message, restart
5 Improvements your choice (see the list above)
commit after EVERY step` },
  { ...base, topic: 'aiassign', title: 'Inline suggestions are not the Chat agent',
    text: 'While you type, VS Code shows inline code suggestions (ghost text). This is a separate feature from the Chat agent. You do not need to disable it, but notice the difference: the inline suggestions complete code as you type, without any tutoring rules, while the Chat agent follows your .agent.md configuration. The report asks you to reflect on this difference.',
    code: `inline suggestion (ghost text) : completes code while you type, no .agent.md rules
Chat agent                     : follows your .agent.md (tutor behaviour)` },
  { ...base, topic: 'aiassign', title: 'The report and what to submit',
    text: 'Report: 400-800 words of your own text (screenshots do not count) and 3-5 screenshots of significant Copilot Chat interactions embedded in it. Section 1, setup and agent configuration: how you set up Copilot and the agent, problems, documentation used (or, if you already had Copilot, your prior experience and how a tutoring agent differed from your usual use), and what you changed in the starter agent and why. Section 2, development process: 3-5 significant moments, each with a screenshot, what happened, and whether you followed the agent\'s guidance or found another solution. Section 3, reflection: how the agent configuration affected the guidance; JavaScript concepts from the lectures that you used (with examples) and which were new; chat agent versus inline suggestions; what the agent suggested that was incorrect or unhelpful and how you handled it; what you would change in the configuration; where GitHub Copilot with a custom .agent.md sits among chatbots, assistants, AI-powered IDEs and agents, and whether the custom configuration moves it on the control-automation axis. Submit Lastname_Firstname_WOH-AI.zip with index.html, style.css, .github/agents/snake-tutor.agent.md, the .git/ folder, report.pdf and chat.json (Command Palette: Chat: Export Chat).',
    code: `Lastname_Firstname_WOH-AI.zip
  index.html   style.css
  .github/agents/snake-tutor.agent.md
  .git/        report.pdf        chat.json` },
]

const mcq = (id, topic, q, options, why) => ({ ...base, id: `ai-${id}`, topic, kind: 'mcq', q, options, why })

export const questions = [
  // ---- Where AI fits ----
  mcq('1', 'ai', 'According to the lecture, what is the real question about AI-generated code?',
    ['Whether you can decide what code is needed, evaluate the AI\'s choices, recognize problems and take responsibility', 'Whether AI can generate code at all', 'Whether AI code is faster than human code', 'Whether AI will replace programmers'],
    'AI tools can produce code; you produce the judgment about that code.'),
  mcq('2', 'ai', 'Which of these is NOT one of the things you must be able to do with AI output?',
    ['Write all the code yourself without any tools', 'Decide what code is needed (requirements)', 'Evaluate the design choices the AI makes', 'Take responsibility for the final result'],
    'The lecture lists: decide what is needed, evaluate design choices, recognize issues, take responsibility.'),
  mcq('3', 'ai', 'Which parts of the course can AI help with, according to the lecture?',
    ['All of them: Git, HTML, CSS, JavaScript, APIs and React', 'Only JavaScript', 'Only code generation, not Git', 'None, the course forbids it'],
    'AI can help with all of them, often producing working code in seconds.'),
  mcq('4', 'ai', 'What is the key difference between an LLM and a chatbot?',
    ['A chatbot adds things around the LLM: security, conversation management, external resources and model selection', 'A chatbot is a smaller LLM', 'An LLM can talk to users, a chatbot cannot', 'There is no difference'],
    'Systems that interact with users are much more than just an LLM.'),
  mcq('5', 'ai', 'Which is NOT listed as something a chatbot incorporates besides the LLM?',
    ['Compiling the user\'s code on their computer', 'Security mechanisms', 'Conversation management', 'Model selection depending on the question'],
    'Listed: security mechanisms, conversation management, use of external resources, model selection.'),
  mcq('6', 'ai', 'On the automation-control trade-off, which tool type has the MOST automation (and least control)?',
    ['Agents', 'Chatbots', 'Assistants', 'Plain text editors'],
    'Order: chatbots, assistants, AI-powered IDEs, agents (increasing automation).'),
  mcq('7', 'ai', 'On the automation-control trade-off, which tool type gives you the MOST control?',
    ['Chatbots', 'Agents', 'AI-powered IDEs', 'Assistants'],
    'With a chatbot you copy, adapt and decide everything yourself.'),
  mcq('8', 'ai', 'Which tools are listed as AI-powered IDEs in the lecture?',
    ['Cursor, Lovable, Replit and Bolt', 'Git, GitHub, npm and Vite', 'HTML, CSS, JavaScript and React', 'Chrome, Firefox, Safari and Edge'],
    'Cursor is based on VS Code; Lovable and Bolt target idea-to-product; Replit is cloud-based.'),
  mcq('9', 'ai', 'What is GitHub Copilot, in the lecture\'s description?',
    ['An AI-powered code completion tool, launched as a technical preview in 2021', 'A cloud-based IDE like Replit', 'A tool that replaces Git', 'A JavaScript library'],
    'It became generally available for Visual Studio Code in 2022.'),
  mcq('10', 'ai', 'What does Cursor\'s Agent Mode do?',
    ['You describe a task in natural language and the AI implements it across the project', 'It only completes the current line', 'It deploys the app to GitHub Pages', 'It disables the AI suggestions'],
    'Cursor is based on VS Code, connects to an LLM using an API key and supports multi-file editing with project-wide context.'),
  mcq('11', 'ai', 'Which tool is built with no-code and non-technical users in mind ("from idea to product, without coding skills")?',
    ['Lovable', 'Cursor', 'Visual Studio Code', 'GitHub Copilot'],
    'Bolt is a similar cloud environment; Replit is a cloud-based development environment.'),
  mcq('12', 'ai', 'What characterises Replit and Bolt?',
    ['They are cloud-based: you write and run code in the browser, with no local setup required', 'They only work offline', 'They need a local Node.js installation', 'They only edit CSS'],
    'Replit: write, run and share code directly in the browser. Bolt: cloud-based, no local setup.'),
  mcq('13', 'ai', 'Cursor connects to a large language model using:',
    ['An API key', 'A USB drive', 'A GitHub Pages site', 'The Git repository history'],
    'The lecture slide: "Connects to an LLM using an API key".'),

  // ---- System prompts ----
  mcq('14', 'ai', 'What is a system prompt?',
    ['A set of instructions given to an AI model that defines its personality, constraints and context', 'The message the user types in each turn', 'The error message when the AI fails', 'A command typed in the terminal'],
    'The user prompt is what the user types; the system prompt is set by the developer.'),
  mcq('15', 'ai', 'Which is NOT one of the three things a system prompt can do, according to the lecture?',
    ['Train the model on new data', 'Define a personality', 'Set constraints', 'Provide context'],
    'A system prompt is instructions at run time, it does not train the model.'),
  mcq('16', 'ai', 'A system prompt says "only answer in Finnish and avoid medical advice". Which of the three purposes is this?',
    ['Setting constraints (what the AI should and should not do)', 'Defining a personality', 'Providing context', 'Selecting a model'],
    'Constraints: for example answer only in a certain language or avoid certain topics.'),
  mcq('17', 'ai', 'A system prompt says "you are a professional editor, formal and concise". Which purpose is this?',
    ['Defining a personality (tone and style)', 'Setting constraints', 'Providing context', 'Compressing the output'],
    'Personality: helpful assistant, witty comedian, professional editor.'),

  // ---- Working with AI ----
  mcq('18', 'ai', 'Why can a general chatbot give an answer that does not fit your project?',
    ['Unless you tell it, it has no information about your file structure, variable names or tool versions', 'It refuses to read code', 'It only knows old JavaScript', 'It cannot answer programming questions'],
    'Share the relevant code and context.'),
  mcq('19', 'ai', 'Which of these is a pattern that creates problems?',
    ['Pasting the whole assignment and asking for a solution', 'Breaking the problem into small steps', 'Asking about concepts you do not understand', 'Asking for specific changes to code you shared'],
    'Other problem patterns: accepting code you do not understand, applying changes without checking, assuming the first answer is right.'),
  mcq('20', 'ai', 'Which of these is a pattern that works better?',
    ['Ask the AI to explain a solution and consider different options before applying one', 'Apply the first answer immediately', 'Accept code you do not understand if it runs', 'Paste everything and hope'],
    'Also: break the problem into small steps, ask about concepts, ask for specific changes.'),
  mcq('21', 'ai', 'What is the lecture\'s point about the "difference" between good and bad AI use?',
    ['It is not about knowing everything, but about being able to make informed decisions about what the AI suggests', 'Good users never use AI', 'Good users know all of JavaScript by heart', 'It depends only on which AI tool is used'],
    'Understanding lets you judge suggestions.'),
  mcq('22', 'ai', 'Why does it matter where code came from?',
    ['It does not matter where it came from; what matters is that someone understands it before it is trusted, changed or explained', 'Code from AI is always wrong', 'Code from a tutorial is always safe', 'Only code you typed yourself can be maintained'],
    'AI-generated code is like any other code you did not write yourself.'),
  mcq('23', 'ai', 'Which situation is NOT listed as a moment when understanding the code matters?',
    ['Choosing a new laptop', 'The app breaks and no one wrote the code', 'A user reports a bug you must fix', 'Someone asks who is accountable'],
    'Others: requirements change; the code becomes yours to maintain.'),

  // ---- Ethics ----
  mcq('24', 'ai', 'What is vibe coding?',
    ['Building software by describing what you want and accepting the AI\'s code without really understanding it', 'Coding while listening to music', 'A coding style that uses emojis', 'Writing code only with a keyboard shortcut'],
    'The lecture connects it to cleaning up after vibe coders.'),
  mcq('25', 'ai', 'What is "AI slop"?',
    ['AI-generated work that masquerades as good work but lacks the substance to meaningfully advance a task', 'A very fast AI model', 'A bug in the LLM timeline', 'A kind of system prompt'],
    'It creates more work for coworkers: the productivity paradox.'),
  mcq('26', 'ai', 'What is the "productivity paradox" of AI slop?',
    ['Low-effort, passable-looking work created with AI ends up creating more work for coworkers', 'AI makes everyone slower at typing', 'AI tools cost more than they save in licences', 'Productive employees refuse to use AI'],
    'The work looks fine but has no substance.'),
  mcq('27', 'ai', 'What does the lecture say about creativity when AI builds websites?',
    ['The websites start looking the same (although with Bootstrap we had the same problem)', 'AI websites are always more original', 'AI cannot generate CSS', 'AI websites cannot be responsive'],
    'Creativity?: sameness is a concern.'),

  // ---- AI for learning ----
  mcq('28', 'ai', 'In the four levels of understanding AI-generated code, what is level 1?',
    ['Accept and hope: run the code and hope it works', 'Read and understand', 'Evaluate and modify', 'Debug and extend'],
    'Levels: 1 accept and hope, 2 read and understand, 3 evaluate and modify, 4 debug and extend.'),
  mcq('29', 'ai', 'Which level means "judge whether the choices are good and improve them"?',
    ['Level 3: evaluate and modify', 'Level 1: accept and hope', 'Level 2: read and understand', 'Level 4: debug and extend'],
    'Level 4 is fixing issues and adding features.'),
  mcq('30', 'ai', 'Which level means "fix issues and add features"?',
    ['Level 4: debug and extend', 'Level 2: read and understand', 'Level 3: evaluate and modify', 'Level 1: accept and hope'],
    'The higher your understanding, the more you can do with AI.'),
  mcq('31', 'ai', 'Why do we not want direct answers when learning something new?',
    ['Learning needs productive struggle, which direct answers remove', 'Direct answers are always wrong', 'Direct answers cost more tokens', 'Chatbots cannot give direct answers'],
    'A tutor-style system prompt asks questions and gives hints instead.'),
  mcq('32', 'ai', 'Where do you put a custom agent for GitHub Copilot in a project?',
    ['In a .github/agents/name.agent.md file', 'In a .cursorrules file', 'In package.json', 'In the browser\'s developer tools'],
    'Cursor uses .cursorrules files.'),
  mcq('33', 'ai', 'Which file configures how the AI responds in Cursor?',
    ['.cursorrules', 'name.agent.md', 'index.html', '.gitignore'],
    'Copilot uses .github/agents/name.agent.md.'),
  mcq('34', 'ai', 'What can a custom agent file define?',
    ['The role the AI plays (assistant, tutor, reviewer), what it should and should not do, and how it should respond', 'Only the colour theme of the editor', 'The Git remote URL', 'The version of Node.js'],
    'This makes AI coding tools customizable to your needs.'),

  // ---- Assignment ----
  mcq('35', 'aiassign', 'What is the main goal of the AI assignment?',
    ['To learn to use AI as a tool for learning, not just for producing code faster', 'To build the best Snake game in the class', 'To compare Copilot with ChatGPT', 'To write the shortest possible code'],
    'The game is the vehicle for learning; the main outcome is your understanding of how to design and use AI as a learning tool.'),
  mcq('36', 'aiassign', 'How much of the course grade is the AI assignment worth?',
    ['20%', '10%', '40%', '5%'],
    'Final project (React) is 40%. The assignment is graded 0-20 points.'),
  mcq('37', 'aiassign', 'What must be true to pass the AI assignment?',
    ['At least 10/20 points, the game runs, and all required files are submitted', 'At least 15/20 points and a high score feature', 'Only a submitted zip file', 'Copilot Chat must be used for at least 100 messages'],
    'Passing this assignment independently is mandatory for passing the course.'),
  mcq('38', 'aiassign', 'Which line of the starter agent file must NOT be changed?',
    ['The tools line: tools: [\'read\', \'search\', \'web\']', 'The name line', 'The tone section', 'The commit-message advice'],
    'You may change tone, level of hints and teaching approach.'),
  mcq('39', 'aiassign', 'Which of these principles must remain in your modified agent?',
    ['It must not produce a complete game or large blocks of finished code in one response', 'It must always answer in one sentence', 'It must write the game over screen for you', 'It must never mention git'],
    'Also: support JavaScript learning, guide step by step, remind about committing.'),
  mcq('40', 'aiassign', 'What does the starter agent do when the student is stuck?',
    ['Gives a small hint; after two hints gives a snippet of at most 5 lines', 'Writes the whole function immediately', 'Refuses to answer', 'Switches to a different model'],
    'It never writes the whole function. For a question about X it first breaks X into substeps.'),
  mcq('41', 'aiassign', 'Which API does the starter agent say the student does NOT need to learn for this assignment?',
    ['The Canvas API (drawing is already handled by drawGame)', 'Event listeners', 'Timing functions', 'Conditionals'],
    'The focus is game logic: variables, functions, conditionals, loops, event listeners, timing.'),
  mcq('42', 'aiassign', 'When the student shares code, the starter agent first:',
    ['Points out what works well, then asks a guiding question about issues', 'Rewrites the code', 'Deletes the code', 'Asks for a screenshot'],
    'Guiding questions instead of giving the fix directly.'),
  mcq('43', 'aiassign', 'Which commit message follows the prefix convention in the starter agent?',
    ['feat: add game loop for snake movement', 'added stuff', 'Update', 'final version!!!'],
    'Prefixes: feat, fix, refactor, style.'),
  mcq('44', 'aiassign', 'Which prefix is for a bug fix?',
    ['fix:', 'feat:', 'style:', 'refactor:'],
    'refactor: improves code without changing behaviour; style: formatting.'),
  mcq('45', 'aiassign', 'What does the starter index.html give you?',
    ['A canvas, game configuration and a drawGame function that draws the snake and food, but nothing moves', 'A complete Snake game', 'Only an empty page', 'A React project'],
    'You build movement, controls, eating, game over and improvements.'),
  mcq('46', 'aiassign', 'In which order does the assignment ask you to build the game?',
    ['Movement, keyboard controls, eating and growing, game over, improvements', 'Game over, movement, controls, food', 'Improvements first, then movement', 'Any order is fine'],
    'Commit at least after completing each step.'),
  mcq('47', 'aiassign', 'Why is the snake prevented from reversing into itself in step 2?',
    ['Pressing the opposite arrow would make the head move into the neck and end the game at once', 'Because the keyboard cannot send two keys', 'Because reversing is slow', 'Because the canvas cannot draw it'],
    'A direction check must reject the opposite direction.'),
  mcq('48', 'aiassign', 'Which feature saves a high score between visits?',
    ['localStorage', 'A for loop', 'The canvas', 'git commit'],
    'localStorage is one of the suggested improvements.'),
  mcq('49', 'aiassign', 'What is "ghost text" in VS Code?',
    ['Inline code suggestions shown as you type, a feature separate from the Chat agent', 'A hidden Git branch', 'The agent\'s system prompt', 'An error message'],
    'You do not need to disable it, but notice the difference when you reflect.'),
  mcq('50', 'aiassign', 'How long must the report be?',
    ['400-800 words of your own text, with 3-5 screenshots of significant Copilot Chat interactions', '100 words, no screenshots', '2000 words', 'Only screenshots'],
    'Screenshots are not counted toward the word count.'),
  mcq('51', 'aiassign', 'Which file is the JSON chat export submitted in the zip?',
    ['chat.json (Command Palette: Chat: Export Chat)', 'report.json', 'agent.json', 'snake.json'],
    'Also submit index.html, style.css, the agent file, the .git folder and report.pdf.'),
  mcq('52', 'aiassign', 'What should the commit history reflect?',
    ['How the project evolved step by step', 'One big commit at the end', 'Only the final file', 'The names of all classmates'],
    'The commit history is part of the submission.'),

  // ---- open questions ----
  { ...base, id: 'ai-e-1', topic: 'ai', kind: 'explain',
    q: 'Explain the difference between an LLM and a chatbot, and place chatbots, assistants, AI-powered IDEs and agents on the control-automation axis.',
    keyPoints: [
      'an LLM is the model; a chatbot is a system around it with security mechanisms, conversation management, use of external resources and model selection',
      'chatbots: most control, you decide and copy the code yourself',
      'assistants (like Copilot code completion) and AI-powered IDEs (Cursor, Replit, Lovable, Bolt) automate more, up to editing several files',
      'agents have the most automation and the least control, so you must be able to check what they did',
    ],
    model: 'An LLM is only the language model. A chatbot is a system that interacts with users and incorporates much more: security mechanisms, conversation management, use of external resources and choosing a model depending on the question. On the control-automation axis, chatbots give the most control because you copy, adapt and decide everything. Assistants such as Copilot code completion suggest code as you work, and AI-powered IDEs such as Cursor, Lovable, Replit and Bolt can implement a task across the project. Agents have the most automation and the least control, so the more automation you use the more you must be able to evaluate what was done.' },
  { ...base, id: 'ai-e-2', topic: 'ai', kind: 'explain',
    q: 'Why is it not enough to copy code from an AI tool? Use the four levels of understanding and the idea of accountability.',
    keyPoints: [
      'AI code is like any code you did not write: someone must understand it before it can be trusted, changed or explained',
      'when the app breaks, requirements change or a bug is reported you need to fix or adapt it',
      'level 1 (accept and hope) is not enough; levels 2 to 4 are read and understand, evaluate and modify, debug and extend',
      'you stay accountable for the final result (AI produces code, you produce the judgment)',
    ],
    model: 'AI-generated code is like any other code you did not write: someone has to understand it before it can be trusted, changed or explained. When the app breaks, a user reports a bug, the requirements change or someone asks who is accountable, "it worked when I ran it" is not enough. Level 1 of the four levels, accept and hope, does not help then. At level 2 you read and understand each part, at level 3 you evaluate and modify the choices, at level 4 you debug and extend. The higher your understanding, the more you can do with AI, and you remain responsible for the result: AI tools produce code, you produce the judgment about it.' },
  { ...base, id: 'ai-e-3', topic: 'aiassign', kind: 'explain',
    q: 'Describe how a custom tutor agent (.agent.md) differs from using a default chatbot for learning JavaScript. Which parts of the file stay fixed in the AI assignment and why?',
    keyPoints: [
      'a default chatbot is configured to give useful direct answers; learning needs productive struggle',
      'the .agent.md file is a system prompt for the project: it defines the role (tutor), constraints and how to respond (questions, hints, small steps)',
      'the tutor must not write the whole game or large blocks of code, must guide step by step and remind about git commits',
      'the tools line (read, search, web) stays fixed so the agent can only read, search and look things up, not edit files itself',
    ],
    model: 'A default chatbot is set up to give useful, direct answers, but when learning we need productive struggle. A custom agent in .github/agents/name.agent.md works like a system prompt for the project: it defines the role (here an experienced tutor), constraints and the response style, such as asking questions, giving small hints, explaining the JavaScript concept by name and checking understanding before moving on. In the assignment the principles that must remain are: the tools line stays unchanged (read, search and web only), the agent supports learning JavaScript and does not just finish the game, it does not produce a complete game or large blocks of finished code, it guides step by step and reminds about committing to git. Tone, hint level and teaching approach can be changed.' },
]
