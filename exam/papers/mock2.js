/*
 * Mock 2: a brand-new ICT paper on the same blueprint as the module mock (Mock 1), with answer key,
 * model answers and rubrics. No question repeats a Mock 1 question; some concepts return from a new angle.
 * UMD: in the browser this registers window.ACSD_PAPERS.mock2; under Node/Vitest it is module.exports.
 *
 * Paper shape: identical to mock1.js (see its header comment for the full field list).
 *   mcq:     { id, type: "mcq", marks, prompt, options[], answer: <index, 0 = A>, explain, note? }
 *   tf:      { id, type: "tf",  marks, prompt, answer: true|false, explain, note? }
 *   written: { id, type: "written", marks, title?, prompt, explain, note?,
 *              parts: [{ id, label, prompt?, marks, format: "code"|"text", model, rubric[], wrong[] }] }
 *   rubric point: { text, marks, any?: [regex strings], all?: [regex strings] }  (case-insensitive,
 *              run against the whitespace-normalised answer; marks must sum to the part's marks)
 *
 * Prompt text mini-format: one paragraph per line; lines starting "- " form a bullet list;
 * lines between ``` fences form a code block. Part prompts are plain text (no code blocks), so any
 * code a part refers to lives in the item prompt.
 *
 * Model answers use a plain fetch paren: the self-check's remote-resource grep skips papers/.
 */
(function (root, paper) {
  if (typeof module === "object" && module && module.exports) module.exports = paper;
  else (root.ACSD_PAPERS = root.ACSD_PAPERS || {})[paper.id] = paper;
})(typeof self !== "undefined" ? self : this, {
  id: "mock2",
  title: "ACSD Mock ICT 2",
  minutes: 90,
  heading: "MOCK ICT",
  module: "Advanced Client-Side Web Development",
  duration: "90 minutes - 25 extra minutes for RAF students",
  totalMarks: 100,
  instructionsTitle: "Instructions to Candidates",
  instructions: [
    "Answer all questions in Sections A-E.",
    "The examination is worth 100 marks.",
    "Select one answer for each multiple-choice question.",
    "Select True or False for each statement.",
    "Use React with TypeScript or JavaScript and JSX for programming questions, as specified.",
    "Logically correct solutions receive credit.",
    "Show your reasoning where requested.",
    "All questions are based on client-side development. Backend implementation is outside the scope of this examination.",
  ],
  distributionTitle: "Time and Mark Distribution",
  distribution: {
    columns: ["Section", "Question type", "Marks", "Time"],
    rows: [
      ["A", "Multiple choice (20 × 1)", "20", "15 min"],
      ["B", "True/False (15 × 1)", "15", "10 min"],
      ["C", "Short answer (5 × 3)", "15", "15 min"],
      ["D", "Programming and analysis (4 × 10)", "40", "40 min"],
      ["E", "Front-end security (5 × 2)", "10", "10 min"],
    ],
    total: ["Total", "", "100", "90 min"],
  },
  end: ["END OF EXAMINATION", "Total: 100 marks"],

  sections: [
    // ------------------------------------------------------------------ A
    {
      id: "A",
      title: "Section A - Multiple Choice (20 marks)",
      intro: "Choose ONE answer for each question. Each question is worth 1 mark.",
      items: [
        {
          id: "A1", type: "mcq", marks: 1,
          prompt: "A to-do app stores tasks as objects with a boolean done property. Which array method returns a new array containing every task whose done property is true?",
          options: ["find()", "map()", "some()", "filter()"],
          answer: 3,
          explain: "filter() returns a new array of every element that passes the test (possibly []). find() returns only the first match, some() returns a boolean, and map() returns one output per element.",
        },
        {
          id: "A2", type: "mcq", marks: 1,
          prompt: "What does the following expression return?\n```\n[3, 1, 10, 2].sort()\n```",
          options: [
            "[1, 2, 3, 10]",
            "[1, 10, 2, 3]",
            "[10, 3, 2, 1]",
            "[3, 1, 10, 2], because sort() returns a sorted copy and leaves this array unchanged",
          ],
          answer: 1,
          explain: "Without a compare function, sort() converts the elements to strings and compares them as text, so \"10\" comes before \"2\". For numbers, write sort((a, b) => a - b).",
          note: "sort() also mutates the original array. Copy it first ([...arr].sort(...)) or use toSorted(), especially for React state.",
        },
        {
          id: "A3", type: "mcq", marks: 1,
          prompt: "Consider this code:\n```\nasync function getUser() {\n  const res = await fetch(\"/api/me\");\n  return res.json();\n}\nconst user = getUser();\nconsole.log(user);\n```\nWhat is logged?",
          options: [
            "The user object returned by the server",
            "undefined",
            "A Promise object",
            "A SyntaxError, because getUser was not awaited",
          ],
          answer: 2,
          explain: "An async function always returns a Promise. Without await, user is the Promise itself (still pending), not the parsed data.",
          note: "To get the data, write const user = await getUser(); inside another async function, or use getUser().then((user) => ...).",
        },
        {
          id: "A4", type: "mcq", marks: 1,
          prompt: "Given an interface Product, what does the TypeScript utility type Partial<Product> produce?",
          options: [
            "A type with all of Product's properties made optional",
            "A type containing only Product's id property",
            "A type with all of Product's properties made readonly",
            "An array of Product objects",
          ],
          answer: 0,
          explain: "Partial<T> makes every property of T optional. It suits PATCH bodies (only the changed fields) and error objects.",
        },
        {
          id: "A5", type: "mcq", marks: 1,
          prompt: "A variable will hold a value whose type is not known in advance, such as parsed JSON or a caught error. Which TypeScript type accepts any value but forces you to narrow it (for example with typeof or instanceof) before you use it?",
          options: ["any", "never", "unknown", "void"],
          answer: 2,
          explain: "unknown accepts any value, but TypeScript won't let you use it until you narrow it. any accepts any value too, but it switches type checking off entirely.",
          note: "never is a type with no possible values, and void is the return type of a function that returns nothing.",
        },
        {
          id: "A6", type: "mcq", marks: 1,
          prompt: "A component declares const [items, setItems] = useState<string[]>([]). Which statement correctly adds \"pen\" to the list so that React re-renders?",
          options: [
            "items.push(\"pen\")",
            "setItems(items.push(\"pen\"))",
            "items = [...items, \"pen\"]",
            "setItems([...items, \"pen\"])",
          ],
          answer: 3,
          explain: "State must be replaced, not mutated: call the setter with a new array. push() mutates the array and returns the new length, not an array, and reassigning items doesn't tell React anything.",
        },
        {
          id: "A7", type: "mcq", marks: 1,
          prompt: "A component renders the following JSX, and messages is an empty array:\n```\n{messages.length && <MessageList messages={messages} />}\n```\nWhat appears on the page?",
          options: [
            "Nothing at all",
            "The number 0",
            "An empty <MessageList /> component",
            "A runtime error",
          ],
          answer: 1,
          explain: "&& returns its left operand when that operand is falsy. messages.length is 0, which is falsy, but React renders numbers, so 0 appears. Write messages.length > 0 && ... instead.",
        },
        {
          id: "A8", type: "mcq", marks: 1,
          prompt: "When does an effect declared as useEffect(() => { ... }, [userId]) run?",
          options: [
            "Only once, after the first render",
            "After every render, whatever changed",
            "After the first render, and again after any render in which userId has changed",
            "Only when the component unmounts",
          ],
          answer: 2,
          explain: "The dependency array lists the values the effect uses. React runs the effect after the first render and again whenever one of those values has changed since the last run.",
          note: "[] runs once after mount, no array runs after every render, and the returned cleanup function runs before the next run and on unmount.",
        },
        {
          id: "A9", type: "mcq", marks: 1,
          prompt: "A route guard must send a user who is not logged in to the login page as soon as it renders. Which React Router element does this?",
          options: [
            "<Navigate to=\"/login\" replace />",
            "<Link to=\"/login\" />",
            "<Outlet />",
            "<NavLink to=\"/login\" />",
          ],
          answer: 0,
          explain: "<Navigate> redirects as soon as it renders, which is what a guard component returns. <Link> and <NavLink> only navigate when the user clicks them, and <Outlet /> renders child routes.",
          note: "replace swaps the current history entry, so pressing Back doesn't return to the guarded page and bounce to /login again.",
        },
        {
          id: "A10", type: "mcq", marks: 1,
          prompt: "A React Router configuration ends with the route { path: \"*\", element: <NotFound /> }. What is its purpose?",
          options: [
            "It matches only the home page",
            "It protects every route behind a login",
            "It loads every route's code at start-up",
            "It matches any URL that no other route matches, so unknown URLs show a not-found page",
          ],
          answer: 3,
          explain: "\"*\" is a catch-all (splat) route. React Router ranks it below every more specific route, so it only matches URLs that nothing else matches.",
        },
        {
          id: "A11", type: "mcq", marks: 1,
          prompt: "A frontend sends PUT /api/bookings/12, but booking 12 was deleted by another user a minute ago. Which status code is the server most likely to return?",
          options: ["201 Created", "404 Not Found", "403 Forbidden", "204 No Content"],
          answer: 1,
          explain: "404 Not Found: there is no resource at that URL any more. The frontend should show a 'not found' message, perhaps with a link back to the list.",
          note: "403 would mean the user is known but not allowed. 201 and 204 are success codes.",
        },
        {
          id: "A12", type: "mcq", marks: 1,
          prompt: "After a successful DELETE request the server responds 204 No Content. What happens if the code then runs await res.json()?",
          options: [
            "It returns an empty object {}",
            "It returns null",
            "It throws an error, because there is no JSON body to parse",
            "It returns the deleted resource",
          ],
          answer: 2,
          explain: "A 204 has an empty body, so res.json() rejects with a SyntaxError (Unexpected end of JSON input). Check res.ok and don't parse the body.",
        },
        {
          id: "A13", type: "mcq", marks: 1,
          prompt: "When does the Promise returned by fetch() reject?",
          options: [
            "When the server responds with 404 Not Found",
            "When the server responds with 500 Internal Server Error",
            "On a network failure, or when the request is aborted",
            "Whenever res.ok is false",
          ],
          answer: 2,
          explain: "fetch() resolves for any HTTP response, including 404 and 500. It rejects only when no usable response arrives (a network failure) or when the request is aborted, so check res.ok yourself.",
        },
        {
          id: "A14", type: "mcq", marks: 1,
          prompt: "Why does a React form's onSubmit handler usually begin with e.preventDefault()?",
          options: [
            "To stop the browser's default form submission, which would reload the page",
            "To clear all the inputs after submitting",
            "To run the browser's built-in validation",
            "To stop React from re-rendering the form",
          ],
          answer: 0,
          explain: "Without preventDefault(), the browser performs its own form submission: it sends the form and reloads the page, which wipes React's state. The handler then validates and sends the data itself.",
        },
        {
          id: "A15", type: "mcq", marks: 1,
          prompt: "In TanStack Query v5, what does isPending from useQuery mean?",
          options: [
            "A background refetch is running while cached data is shown",
            "The query has no data yet, for example on the very first load",
            "The queryFn threw an error",
            "The cached data has become stale",
          ],
          answer: 1,
          explain: "isPending means there is no data yet (status 'pending'), as on the first load. A background refetch while cached data is on screen sets isFetching instead.",
          note: "In v4 this flag was isLoading. In v5, isLoading means isPending && isFetching.",
        },
        {
          id: "A16", type: "mcq", marks: 1,
          prompt: "What does the gcTime option control in TanStack Query v5?",
          options: [
            "How long fetched data counts as fresh",
            "How often the query refetches in the background",
            "How long a request may take before it times out",
            "How long unused cache data is kept in memory before it is garbage-collected",
          ],
          answer: 3,
          explain: "gcTime is how long cached data that no component is using stays in memory before it is removed (default 5 minutes). Freshness is staleTime.",
          note: "gcTime was called cacheTime in v4.",
        },
        {
          id: "A17", type: "mcq", marks: 1,
          prompt: "A ProductPage reads productId from the URL and loads that one product with useQuery. Which queryKey is most appropriate?",
          options: [
            "queryKey: [\"product\"]",
            "queryKey: [\"product\", productId]",
            "queryKey: \"product\"",
            "No queryKey: TanStack Query uses the URL inside the queryFn as the key",
          ],
          answer: 1,
          explain: "Every variable the queryFn depends on belongs in the key, so [\"product\", productId] gives each product its own cache entry. In v5 the key must be an array.",
          note: "With [\"product\"] alone, every product page shares one cache entry, so opening product 2 can show product 1's cached data.",
        },
        {
          id: "A18", type: "mcq", marks: 1,
          prompt: "A Zustand store's state is { count: 0, name: \"Sam\" }. An action calls set({ count: 5 }). What is the state afterwards?",
          options: [
            "{ count: 5, name: \"Sam\" }: set merges the new value into the state",
            "{ count: 5 }: set replaces the whole state, so name is lost",
            "No change: set throws unless every property is passed",
            "{ count: 5, name: \"Sam\" }, but only because set mutated the old state object in place",
          ],
          answer: 0,
          explain: "set() shallow-merges the object you pass into a new state object, so properties you don't mention are kept. That's why actions return only the fields that change.",
        },
        {
          id: "A19", type: "mcq", marks: 1,
          prompt: "What layout does the following CSS produce?\n```\n.cards {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));\n}\n```",
          options: [
            "Exactly 240 columns",
            "Two columns: one 240px wide and one taking the rest of the space",
            "As many columns as fit, each at least 240px wide, sharing the leftover space equally",
            "Columns that are always exactly 240px wide",
          ],
          answer: 2,
          explain: "auto-fit creates as many columns as fit the container, and minmax(240px, 1fr) makes each one at least 240px and at most an equal share of the space. The grid is responsive with no media query.",
        },
        {
          id: "A20", type: "mcq", marks: 1,
          prompt: "Which rule applies its styles only when the viewport is 600px wide or narrower?",
          options: [
            "@media (min-width: 600px) { ... }",
            "@media (max-width: 600px) { ... }",
            "@media (max-height: 600px) { ... }",
            "@supports (max-width: 600px) { ... }",
          ],
          answer: 1,
          explain: "(max-width: 600px) is true while the viewport is at most 600px wide. (min-width: 600px) applies from 600px upwards, which is the mobile-first direction.",
          note: "@supports tests whether the browser supports a CSS feature. It says nothing about the screen size.",
        },
      ],
    },

    // ------------------------------------------------------------------ B
    {
      id: "B",
      title: "Section B - True/False (15 marks)",
      intro: "Select True or False for each statement. Each question is worth 1 mark.",
      items: [
        {
          id: "B1", type: "tf", marks: 1,
          prompt: "Promise.all() rejects as soon as any one of the promises passed to it rejects.",
          answer: true,
          explain: "Promise.all fails fast: it rejects with the first rejection's error. Use Promise.allSettled to wait for every result, successes and failures alike.",
        },
        {
          id: "B2", type: "tf", marks: 1,
          prompt: "The JavaScript map() method returns a new array with the same number of elements as the original array.",
          answer: true,
          explain: "map() transforms every element and returns a new array of the same length. To drop elements, use filter().",
        },
        {
          id: "B3", type: "tf", marks: 1,
          prompt: "The JavaScript filter() method returns undefined when no element matches the condition.",
          answer: false,
          explain: "filter() returns an empty array [] when nothing matches. It's find() that returns undefined when there is no match.",
        },
        {
          id: "B4", type: "tf", marks: 1,
          prompt: "Writing const user: User = await res.json(); makes TypeScript check, while the app is running, that the API's data really matches the User interface.",
          answer: false,
          explain: "TypeScript types are erased before the code runs. The annotation only tells the compiler what to assume, and nothing checks the real JSON. Validate important fields yourself.",
        },
        {
          id: "B5", type: "tf", marks: 1,
          prompt: "A TypeScript intersection type A & B describes a value that has all the properties of both A and B.",
          answer: true,
          explain: "& is an intersection: the value must satisfy both types at once. | is a union: the value is one type or the other.",
        },
        {
          id: "B6", type: "tf", marks: 1,
          prompt: "A child component may change a prop it receives by assigning a new value to it, for example props.title = \"New\".",
          answer: false,
          explain: "Props are read-only. To change the value, the parent updates its own state, often through a callback prop such as onChange.",
        },
        {
          id: "B7", type: "tf", marks: 1,
          prompt: "When two components call the same custom Hook, each component gets its own independent copy of the Hook's state.",
          answer: true,
          explain: "A custom Hook shares logic, not state. Each call runs its own useState, so the components don't affect each other.",
          note: "To share one value between components, lift the state up, or use a store such as Zustand or a context.",
        },
        {
          id: "B8", type: "tf", marks: 1,
          prompt: "In React Router, a child route whose path has no leading slash, such as path: \"books\" under a parent with path: \"/admin\", is matched relative to its parent, so it renders at /admin/books.",
          answer: true,
          explain: "Child paths without a leading / are relative to the parent route, so \"books\" under \"/admin\" matches /admin/books.",
        },
        {
          id: "B9", type: "tf", marks: 1,
          prompt: "If the server responds with 404 Not Found, fetch() throws an error automatically, so the catch block runs without any extra check.",
          answer: false,
          explain: "fetch() resolves for a 404, with res.ok set to false. It only rejects on a network failure or an abort, so write if (!res.ok) throw new Error(...).",
        },
        {
          id: "B10", type: "tf", marks: 1,
          prompt: "A 400 Bad Request response usually means the server rejected the data the client sent, for example because a required field was missing or invalid.",
          answer: true,
          explain: "400 Bad Request means the request or its data was invalid. Show the server's validation messages so the user can fix the input.",
        },
        {
          id: "B11", type: "tf", marks: 1,
          prompt: "In TanStack Query v5, the object returned by useMutation has an isPending flag that is true while the mutation is running.",
          answer: true,
          explain: "Mutations report isPending while mutationFn runs. A typical use is <button disabled={mutation.isPending}>.",
        },
        {
          id: "B12", type: "tf", marks: 1,
          prompt: "With staleTime set to 0 (the default), TanStack Query never shows cached data and always waits for a new request to finish.",
          answer: false,
          explain: "staleTime 0 means cached data is stale at once, not hidden. TanStack shows the cached data immediately and refetches it in the background (on mount, window focus or reconnect).",
          note: "Stale is about when to refetch. How long unused data stays in the cache is gcTime.",
        },
        {
          id: "B13", type: "tf", marks: 1,
          prompt: "A Zustand store can only be used after the application has been wrapped in a Provider component.",
          answer: false,
          explain: "Zustand needs no Provider. create() returns a Hook that any component can import and call.",
        },
        {
          id: "B14", type: "tf", marks: 1,
          prompt: "The CSS clamp() function can be used on properties other than grid tracks, for example font-size: clamp(1rem, 2.5vw, 2rem).",
          answer: true,
          explain: "clamp(min, preferred, max) works on any property that takes a length or number, such as font-size, width or padding. It's minmax() that only works in grid track sizes.",
        },
        {
          id: "B15", type: "tf", marks: 1,
          prompt: "Browsers typically apply :focus-visible styles when a button is focused with the keyboard (Tab), but not when the same button is clicked with a mouse.",
          answer: true,
          explain: "The browser matches :focus-visible when a focus ring helps, mainly for keyboard focus. A mouse click on a button gives :focus but not :focus-visible.",
          note: "Text inputs are the exception: they match :focus-visible even when clicked, because you type into them next.",
        },
      ],
    },

    // ------------------------------------------------------------------ C
    {
      id: "C",
      title: "Section C - Short Answer (15 marks)",
      intro: "Answer all five questions. Each question is worth 3 marks.",
      items: [
        {
          id: "C1", type: "written", marks: 3,
          title: "JavaScript - Parallel Requests",
          prompt: "Two service functions each return a Promise:\n```\ngetProfile(id)   // resolves to the user's profile\ngetOrders(id)    // resolves to the user's orders\n```\nInside an async function, write ONE statement that starts both requests at the same time, waits for both to finish, and stores the results in variables named profile and orders.",
          explain: "Promise.all([...]) starts both calls at once, and await gives an array of results in the same order as the input, which you destructure.",
          note: "Two separate awaits run one after the other, so the wait is both requests added together.",
          parts: [
            {
              id: "C1", label: "", marks: 3, format: "code",
              model: "const [profile, orders] = await Promise.all([getProfile(id), getOrders(id)]);",
              rubric: [
                { text: "Uses Promise.all with both calls, getProfile(id) and getOrders(id)", marks: 1, all: ["Promise\\s*\\.\\s*all\\s*\\(", "getProfile\\s*\\(", "getOrders\\s*\\("] },
                { text: "Waits for the result: await Promise.all(...) (or .then)", marks: 1, any: ["await\\s+Promise\\s*\\.\\s*all", "\\.\\s*then\\s*\\("] },
                { text: "Passes an array and destructures the results: const [profile, orders] = ...", marks: 1, all: ["Promise\\s*\\.\\s*all\\s*\\(\\s*\\[", "\\[\\s*profile\\s*,\\s*orders\\s*\\]"] },
              ],
              wrong: [
                "const profile = await getProfile(id);\nconst orders = await getOrders(id);",
                "const [profile, orders] = Promise.all(getProfile(id), getOrders(id));",
              ],
            },
          ],
        },
        {
          id: "C2", type: "written", marks: 3,
          title: "TypeScript - Literal Unions and Arrays",
          prompt: "An order can only be in one of three states: \"pending\", \"shipped\" or \"delivered\".\n- Write a type alias named OrderStatus that allows only those three strings.\n- Write an interface named Order with the properties id (a number), status (an OrderStatus) and items (an array of strings).",
          explain: "A literal union restricts a value to a fixed set of exact strings, and string[] types an array of strings.",
          parts: [
            {
              id: "C2", label: "", marks: 3, format: "code",
              model: "type OrderStatus = \"pending\" | \"shipped\" | \"delivered\";\n\ninterface Order {\n  id: number;\n  status: OrderStatus;\n  items: string[];\n}",
              rubric: [
                {
                  text: "type OrderStatus = \"pending\" | \"shipped\" | \"delivered\" (a literal union)", marks: 1,
                  all: ["\\btype\\s+OrderStatus\\s*=\\s*\\|?\\s*['\"`]\\w+['\"`]\\s*\\|", "['\"`]pending['\"`]", "['\"`]shipped['\"`]", "['\"`]delivered['\"`]"],
                },
                { text: "Declares interface Order with id: number", marks: 1, all: ["\\binterface\\s+Order\\b|\\btype\\s+Order\\s*=", "\\bid\\s*:\\s*number"] },
                { text: "status: OrderStatus and items: string[]", marks: 1, all: ["\\bstatus\\s*:\\s*OrderStatus\\b", "\\bitems\\s*:\\s*(string\\s*\\[\\s*\\]|Array\\s*<\\s*string\\s*>)"] },
              ],
              wrong: [
                "type OrderStatus = string;\ninterface Order { id: number; status: string; items: string; }",
                "interface Order { id: number; status: 'pending' | 'shipped' | 'delivered'; items: []; }",
              ],
            },
          ],
        },
        {
          id: "C3", type: "written", marks: 3,
          title: "React - State and Conditional Rendering",
          prompt: "Write a React component named ShowMore that receives a text prop (a string). It should:\n- keep a boolean state value named expanded, initially false\n- render a button that toggles expanded each time it is clicked\n- render <p>{text}</p> only while expanded is true",
          explain: "useState(false) holds the boolean, the button flips it through the setter, and && renders the paragraph only when it is true.",
          parts: [
            {
              id: "C3", label: "", marks: 3, format: "code",
              model: "import { useState } from \"react\";\n\nfunction ShowMore({ text }: { text: string }) {\n  const [expanded, setExpanded] = useState(false);\n  return (\n    <div>\n      <button onClick={() => setExpanded((e) => !e)}>\n        {expanded ? \"Show less\" : \"Show more\"}\n      </button>\n      {expanded && <p>{text}</p>}\n    </div>\n  );\n}",
              rubric: [
                { text: "State: const [expanded, setExpanded] = useState(false)", marks: 1, all: ["useState\\s*(<\\s*boolean\\s*>)?\\s*\\(\\s*false\\s*\\)", "\\[\\s*\\w+\\s*,\\s*set\\w+\\s*\\]"] },
                { text: "Button onClick toggles it with the setter: setExpanded(!expanded) or setExpanded((e) => !e)", marks: 1, all: ["onClick\\s*=", "set\\w+\\s*\\(\\s*(\\(?\\s*\\w+\\s*\\)?\\s*=>\\s*)?!\\s*\\w+"] },
                { text: "Conditional rendering: {expanded && <p>{text}</p>} (or a ternary)", marks: 1, any: ["\\{\\s*\\w+\\s*&&\\s*(\\(\\s*)?<", "\\{\\s*\\w+\\s*\\?\\s*(\\(\\s*)?<.*?:\\s*(null|<|\\(|['\"])"] },
              ],
              wrong: [
                "let expanded = false;\nreturn <div><button onClick={() => expanded = !expanded}>More</button>{expanded && <p>{text}</p>}</div>;",
                "const [expanded, setExpanded] = useState(false);\nreturn <p>{text}</p>;",
              ],
            },
          ],
        },
        {
          id: "C4", type: "written", marks: 3,
          title: "TanStack Query - A Typed Query",
          prompt: "A component receives userId as a prop and a service function getOrders(userId) returns a Promise of that user's orders.\nWrite a TanStack Query v5 useQuery call that:\n- uses the query key [\"orders\", userId]\n- calls getOrders(userId)\n- treats the data as fresh for 30 seconds\n- destructures data, isPending and isError",
          explain: "v5 takes one options object: a queryKey that contains every variable the query uses, a queryFn, and staleTime in milliseconds.",
          note: "staleTime is in milliseconds, so 30 seconds is 30000 (or 30_000), not 30.",
          parts: [
            {
              id: "C4", label: "", marks: 3, format: "code",
              model: "const { data, isPending, isError } = useQuery({\n  queryKey: [\"orders\", userId],\n  queryFn: () => getOrders(userId),\n  staleTime: 30_000,\n});",
              rubric: [
                {
                  text: "v5 object syntax with queryKey: [\"orders\", userId]", marks: 1,
                  all: ["useQuery\\s*(<[^>]*>)?\\s*\\(\\s*\\{", "queryKey\\s*:\\s*\\[\\s*['\"`]orders['\"`]\\s*,\\s*userId\\s*\\]"],
                },
                {
                  text: "queryFn is a function that calls getOrders(userId): queryFn: () => getOrders(userId)", marks: 1,
                  any: [
                    "queryFn\\s*:\\s*(async\\s*)?(\\([^)]*\\)|\\w+)\\s*=>\\s*(\\{\\s*return\\s+)?(await\\s+)?getOrders\\s*\\(\\s*userId",
                    "queryFn\\s*:\\s*(async\\s+)?function\\s*\\([^)]*\\)\\s*\\{\\s*return\\s+(await\\s+)?getOrders\\s*\\(\\s*userId",
                  ],
                },
                {
                  text: "staleTime: 30000 (milliseconds), and destructures isPending and isError", marks: 1,
                  all: ["staleTime\\s*:\\s*(30_?000|30\\s*\\*\\s*1_?000|1_?000\\s*\\*\\s*30)\\b", "\\bisPending\\b", "\\bisError\\b"],
                },
              ],
              wrong: [
                "const { data, isLoading } = useQuery(['orders', userId], () => getOrders(userId), { staleTime: 30 });",
                "const { data, isPending, isError } = useQuery({ queryKey: ['orders'], queryFn: () => getOrders(userId), staleTime: 30 });",
              ],
            },
          ],
        },
        {
          id: "C5", type: "written", marks: 3,
          title: "API Handling - Responses to a Sign-up Request",
          prompt: "A sign-up form sends the new account's details with POST /api/users.\nFor each of the following responses, state what it means and what the frontend should do:\n- 201 Created\n- 400 Bad Request\n- 409 Conflict",
          explain: "201 = created (success), 400 = the data was invalid (show validation errors), 409 = the data clashes with existing data (for example the email is taken).",
          parts: [
            {
              id: "C5", label: "", marks: 3, format: "text",
              model: "201 Created: the account was created successfully. Show a success message and navigate to the login (or welcome) page.\n400 Bad Request: the data sent was invalid, for example a missing field or a badly formatted email, so it failed the server's validation. Show the server's validation errors next to the fields so the user can fix them and resubmit.\n409 Conflict: the data clashes with something that already exists, most likely the email is already registered. Tell the user that email is taken and let them use another one or log in instead.",
              rubric: [
                {
                  text: "201: success, the account was created; show success and/or navigate on", marks: 1,
                  all: ["201"],
                  any: ["success", "navigate", "redirect", "welcome", "confirm", "log ?in page", "sign ?in page"],
                },
                {
                  text: "400: the data was invalid; show the validation errors so the user can fix them", marks: 1,
                  all: ["400"],
                  any: ["invalid", "validat", "bad data", "malformed", "missing", "wrong (data|input|format|value)", "\\bfix"],
                },
                {
                  text: "409: conflicts with existing data (e.g. the email is already registered); tell the user", marks: 1,
                  all: ["409"],
                  any: ["already (exists|registered|taken|in use|used)", "duplicate", "\\btaken\\b", "in use", "exists"],
                },
              ],
              wrong: [
                "201 means the request failed, 400 means the server crashed and 409 means the user is not logged in.",
                "All three are errors, so show a generic 'Something went wrong' message and retry.",
              ],
            },
          ],
        },
      ],
    },

    // ------------------------------------------------------------------ D
    {
      id: "D",
      title: "Section D - Programming, Explanation and Code Analysis (40 marks)",
      intro: "Answer all four questions. Each question is worth 10 marks.",
      items: [
        {
          id: "D1", type: "written", marks: 10,
          title: "React Router - Public Pages and a Protected Admin Area (10 marks)",
          prompt: "A library website has public pages and an admin area:\n- Home: /\n- Book list: /books (with an optional genre filter in the query string, e.g. /books?genre=fantasy)\n- Book details: /books/:bookId\n- Login: /login\n- Admin dashboard: /admin\n- Manage books: /admin/books\nThe public pages share a layout called MainLayout (top navigation). The admin pages share a different layout called AdminLayout (a sidebar), and only admins may see them. A component called RequireAdmin guards the admin area.\nAll the page and layout components already exist unless a part asks you to write them.",
          explain: "Two sibling route groups, each under its own layout route with an <Outlet />; the admin group sits under a RequireAdmin guard that returns <Navigate> or <Outlet />; useSearchParams reads and sets ?genre=.",
          note: "The guard is only for user experience. The admin API endpoints must still check the token and role on the server.",
          parts: [
            {
              id: "D1a", label: "a", marks: 4, format: "code",
              prompt: "Write a React Router configuration for these routes. Use MainLayout for the public pages and AdminLayout for the admin pages, and put the admin pages behind RequireAdmin. (4 marks)",
              model: "import { createBrowserRouter, RouterProvider } from \"react-router-dom\";\n\nconst router = createBrowserRouter([\n  {\n    path: \"/\",\n    element: <MainLayout />,\n    children: [\n      { index: true, element: <Home /> },\n      { path: \"books\", element: <BookList /> },\n      { path: \"books/:bookId\", element: <BookDetails /> },\n      { path: \"login\", element: <Login /> },\n    ],\n  },\n  {\n    path: \"/admin\",\n    element: <RequireAdmin />,\n    children: [\n      {\n        element: <AdminLayout />,\n        children: [\n          { index: true, element: <AdminDashboard /> },\n          { path: \"books\", element: <ManageBooks /> },\n        ],\n      },\n    ],\n  },\n]);\n\nexport default function App() {\n  return <RouterProvider router={router} />;\n}",
              rubric: [
                {
                  text: "Creates a router with MainLayout as a parent layout route with children", marks: 1,
                  all: ["createBrowserRouter|<\\s*BrowserRouter|<\\s*Routes\\b|RouterProvider", "<\\s*MainLayout"],
                  any: ["children\\s*:", "<\\s*Route\\b[^>]*element\\s*=\\s*\\{\\s*<\\s*MainLayout[^>]*>\\s*\\}\\s*>"],
                },
                {
                  text: "Public pages: home as the index (or \"/\"), books, books/:bookId and login", marks: 1,
                  all: ["\\bindex\\b|path\\s*[:=]\\s*\\{?\\s*['\"`]/['\"`]", "['\"`]/?books['\"`]", "['\"`]/?books/:bookId['\"`]", "['\"`]/?login['\"`]"],
                },
                {
                  text: "Admin area at /admin with its own AdminLayout wrapping nested admin routes", marks: 1,
                  all: ["['\"`]/?admin['\"`]", "<\\s*AdminLayout"],
                  any: ["children\\s*:", "<\\s*Route\\b[^>]*element\\s*=\\s*\\{\\s*<\\s*AdminLayout"],
                },
                {
                  text: "Admin routes guarded: RequireAdmin is the element of the admin parent route (or wraps AdminLayout)", marks: 1,
                  any: ["element\\s*:\\s*<\\s*RequireAdmin", "element\\s*=\\s*\\{\\s*<\\s*RequireAdmin"],
                },
              ],
              wrong: [
                "<a href=\"/admin\">Admin</a>\n<a href=\"/books\">Books</a>",
                "const router = createBrowserRouter([\n  { path: '/', element: <Home /> },\n  { path: '/books', element: <BookList /> },\n  { path: '/books/:bookId', element: <BookDetails /> },\n  { path: '/login', element: <Login /> },\n  { path: '/admin', element: <AdminDashboard /> },\n]);",
              ],
            },
            {
              id: "D1b", label: "b", marks: 2, format: "text",
              prompt: "Explain how one application can show the admin pages inside AdminLayout and the public pages inside MainLayout, and what each layout component must render for its pages to appear. (2 marks)",
              model: "Each group of pages is nested under its own parent layout route: the public pages are children of the MainLayout route and the admin pages are children of the AdminLayout route, so React Router renders whichever layout matches the URL. Each layout must render an <Outlet />, which is where the matched child page appears. Without it the layout shows but the page inside it doesn't.",
              rubric: [
                { text: "Each group of routes is nested as children of its own parent layout route", marks: 1, any: ["nest", "children", "child routes?", "parent (route|layout)", "layout route", "group\\w* under"] },
                { text: "Each layout renders <Outlet />, where the matched child page appears", marks: 1, any: ["outlet"] },
              ],
              wrong: [
                "Because the admin pages import a different CSS file.",
                "Use a second BrowserRouter for the admin pages so they get their own layout.",
              ],
            },
            {
              id: "D1c", label: "c", marks: 2, format: "code",
              prompt: "Write a component GenreFilter for the book list. It reads genre from the query string and displays it (or 'All genres' when there is none), and has a button that changes the URL to /books?genre=fantasy. (2 marks)",
              model: "import { useSearchParams } from \"react-router-dom\";\n\nfunction GenreFilter() {\n  const [searchParams, setSearchParams] = useSearchParams();\n  const genre = searchParams.get(\"genre\");\n\n  return (\n    <div>\n      <p>{genre ? `Genre: ${genre}` : \"All genres\"}</p>\n      <button onClick={() => setSearchParams({ genre: \"fantasy\" })}>Fantasy</button>\n    </div>\n  );\n}",
              rubric: [
                {
                  text: "Reads it with useSearchParams() and searchParams.get(\"genre\")", marks: 1,
                  all: ["useSearchParams\\s*\\(\\s*\\)", "\\.\\s*get\\s*\\(\\s*['\"`]genre['\"`]\\s*\\)"],
                },
                {
                  text: "Button sets the query string: setSearchParams({ genre: \"fantasy\" })", marks: 1,
                  any: [
                    "set\\w*\\s*\\(\\s*\\{\\s*['\"]?genre['\"]?\\s*:\\s*['\"`]fantasy['\"`]",
                    "set\\w*\\s*\\(\\s*['\"`]\\??genre=fantasy['\"`]",
                    "\\.\\s*set\\s*\\(\\s*['\"`]genre['\"`]\\s*,\\s*['\"`]fantasy['\"`]",
                  ],
                },
              ],
              wrong: [
                "const { genre } = useParams();\nreturn <p>{genre}</p>;",
                "const genre = window.location.search;\nreturn <button onClick={() => navigate('/books/fantasy')}>{genre}</button>;",
              ],
            },
            {
              id: "D1d", label: "d", marks: 2, format: "code",
              prompt: "Write the RequireAdmin component. Use const user = useAuthStore((s) => s.user), where user is { name: string; role: string } | null. If no one is logged in, redirect to /login. If the user's role is not \"admin\", show an 'Access denied' message. Otherwise render the admin pages. (2 marks)",
              model: "import { Navigate, Outlet } from \"react-router-dom\";\n\nfunction RequireAdmin() {\n  const user = useAuthStore((s) => s.user);\n\n  if (!user) return <Navigate to=\"/login\" replace />;\n  if (user.role !== \"admin\") return <p>Access denied</p>;\n  return <Outlet />;\n}",
              rubric: [
                {
                  text: "No user: returns <Navigate to=\"/login\" /> (conditionally)", marks: 1,
                  all: ["if\\s*\\(|\\?", "<\\s*Navigate\\b[^>]*to\\s*=\\s*\\{?\\s*['\"`]/login['\"`]"],
                },
                { text: "Checks the role, and otherwise renders <Outlet /> for the admin pages", marks: 1, all: ["\\brole\\b", "<\\s*Outlet\\s*/?\\s*>"] },
              ],
              wrong: [
                "if (!user) navigate('/login');\nreturn <AdminLayout />;",
                "return user ? <Outlet /> : <Link to=\"/login\">Log in</Link>;",
              ],
            },
          ],
        },
        {
          id: "D2", type: "written", marks: 10,
          title: "React API Consumption - Two Endpoints at Once (10 marks)",
          prompt: "A dashboard shows a user's name and how many orders they have. It needs data from two endpoints:\n```\nGET /api/users/:userId\nGET /api/users/:userId/orders\n```\nThe component receives userId as a prop. It should:\n- Start both requests at the same time and wait for both.\n- Display a loading message while the requests are in progress.\n- Display an error message if either request fails, including when the server responds with an error status such as 404 or 500.\n- Display the user's name and the number of orders when both succeed.\n- Load again when userId changes, and never update state for a request that is no longer needed (after unmount, or after userId has changed).",
          explain: "Promise.all inside useEffect with [userId], loading and error state, a res.ok check for each response, and an AbortController whose cleanup cancels requests that are no longer needed.",
          note: "fetch() does not reject on 404 or 500, so without the res.ok check an error page's body would be treated as data.",
          parts: [
            {
              id: "D2a", label: "a", marks: 2, format: "text",
              prompt: "Explain why Promise.all is a better choice here than awaiting the two requests one after the other, and what happens if one of the requests fails. (2 marks)",
              model: "Promise.all starts both requests at the same time (in parallel) and waits for both, so the total wait is about as long as the slower request, instead of the two added together as happens when you await one and then the other. If either request fails, Promise.all rejects straight away with that error, so one catch block handles it and shows the error message.",
              rubric: [
                { text: "Both requests run at the same time (in parallel), so it is faster than one after the other", marks: 1, any: ["parallel", "same time", "concurrent", "simultaneous", "at once", "together"] },
                {
                  text: "If one fails, Promise.all rejects immediately (fail fast) and the catch handles it", marks: 1,
                  all: ["fail|reject|error"],
                  any: ["reject", "catch", "fail\\w* fast", "immediately", "straight away", "whole (thing|promise|call) fails"],
                },
              ],
              wrong: [
                "Promise.all runs the requests one after another so they don't overload the server.",
                "Because Promise.all cancels the other request when the component unmounts.",
              ],
            },
            {
              id: "D2b", label: "b", marks: 6, format: "code",
              prompt: "Write a React component UserDashboard({ userId }: { userId: number }) that implements the requirements above, using useEffect, useState, Promise.all and AbortController. (6 marks)",
              model: "import { useEffect, useState } from \"react\";\n\ninterface User { id: number; name: string; }\ninterface Order { id: number; total: number; }\n\nasync function getJson<T>(url: string, signal: AbortSignal): Promise<T> {\n  const res = await fetch(url, { signal });\n  if (!res.ok) throw new Error(\"HTTP \" + res.status);\n  return res.json();\n}\n\nexport function UserDashboard({ userId }: { userId: number }) {\n  const [user, setUser] = useState<User | null>(null);\n  const [orders, setOrders] = useState<Order[]>([]);\n  const [loading, setLoading] = useState(true);\n  const [error, setError] = useState<string | null>(null);\n\n  useEffect(() => {\n    const controller = new AbortController();\n    setLoading(true);\n    setError(null);\n\n    async function load() {\n      try {\n        const [u, o] = await Promise.all([\n          getJson<User>(`/api/users/${userId}`, controller.signal),\n          getJson<Order[]>(`/api/users/${userId}/orders`, controller.signal),\n        ]);\n        setUser(u);\n        setOrders(o);\n      } catch (err) {\n        if (controller.signal.aborted) return;\n        setError(err instanceof Error ? err.message : \"Request failed\");\n      } finally {\n        if (!controller.signal.aborted) setLoading(false);\n      }\n    }\n\n    load();\n    return () => controller.abort();\n  }, [userId]);\n\n  if (loading) return <p>Loading...</p>;\n  if (error) return <p>Error: {error}</p>;\n  return <p>{user?.name} has {orders.length} orders</p>;\n}",
              rubric: [
                { text: "useEffect with [userId] as the dependency array", marks: 1, all: ["useEffect\\s*\\(", "\\[\\s*(props\\s*\\.\\s*)?userId\\s*\\]\\s*\\)"] },
                { text: "Promise.all over the user and orders requests", marks: 1, all: ["Promise\\s*\\.\\s*all\\s*\\(", "/api/users/", "/orders"] },
                {
                  text: "Treats a non-2xx response as an error (res.ok / status), catches it and shows an error message", marks: 1,
                  all: ["\\.\\s*ok\\b|\\bstatus\\b", "catch"],
                  any: ["if\\s*\\(\\s*\\w*error\\w*\\s*\\)", "\\w*error\\w*\\s*(\\?|&&)"],
                },
                {
                  text: "Loading state, shown while the requests are in progress", marks: 1,
                  all: ["useState", "loading"],
                  any: ["if\\s*\\(\\s*\\w*loading\\w*\\s*\\)", "\\w*loading\\w*\\s*(\\?|&&)"],
                },
                { text: "Displays the user's name and the number of orders (.length)", marks: 1, all: ["\\.\\s*name\\b", "\\.\\s*length\\b"] },
                {
                  text: "Passes controller.signal and aborts in the cleanup: return () => controller.abort()", marks: 1,
                  all: ["signal", "\\.\\s*abort\\s*\\(", "return\\s*(\\(\\s*\\)\\s*=>|function)"],
                },
              ],
              wrong: [
                "useEffect(() => {\n  fetch('/api/users/' + userId).then((r) => r.json()).then(setUser);\n  fetch('/api/users/' + userId + '/orders').then((r) => r.json()).then(setOrders);\n}, []);\nreturn <p>{user.name} has {orders.length} orders</p>;",
                "const [data, setData] = useState(null);\nuseEffect(() => {\n  Promise.all([fetch('/api/users/' + userId), fetch('/api/users/' + userId + '/orders')]).then(setData);\n}, [userId]);\nreturn <p>{data.length}</p>;",
              ],
            },
            {
              id: "D2c", label: "c", marks: 2, format: "text",
              prompt: "Explain why userId must appear in the effect's dependency array, and what the cleanup function does when userId changes from 7 to 8 while the requests for user 7 are still loading. (2 marks)",
              model: "The effect uses userId, so it must re-run whenever userId changes. With [] the dashboard would keep showing user 7's data after the prop changed to 8. Before re-running the effect, React calls the previous run's cleanup, which aborts user 7's requests that are still in flight, so a slow response for the old user can't arrive late and overwrite user 8's data (a race condition). The same cleanup runs on unmount.",
              rubric: [
                { text: "The effect re-runs (re-fetches) whenever userId changes, so the new user's data loads", marks: 1, any: ["re-?run", "runs? again", "whenever (the )?userId changes", "when userId changes", "re-?fetch", "fetch\\w* again", "new user", "user 8"] },
                {
                  text: "The cleanup aborts the old (user 7) requests so a late response can't overwrite the new data", marks: 1,
                  all: ["abort|cancel"],
                  any: ["\\bold\\b", "previous", "stale", "race", "overwrit", "out of date", "wrong user", "earlier", "user 7"],
                },
              ],
              wrong: [
                "userId is in the array so that the effect runs only once, and the cleanup deletes the data.",
                "The cleanup function cancels the component so it stops rendering.",
              ],
            },
          ],
        },
        {
          id: "D3", type: "written", marks: 10,
          title: "Forms, Validation and CRUD - Editing a Booking (10 marks)",
          prompt: "A hotel app lets a user edit an existing booking at /bookings/:bookingId/edit. The form is pre-filled with the booking loaded from GET /api/bookings/:bookingId and contains:\n- Email\n- Check-in date: an <input type=\"date\">, whose value is a \"YYYY-MM-DD\" string, or \"\" when empty\n- Check-out date: the same format\nThe form's values are held in an object of type BookingForm:\n```\ninterface BookingForm {\n  email: string;\n  checkIn: string;\n  checkOut: string;\n}\n```\nThe requirements are:\n- Email must be in a valid email format (some text, then @, then some text, a dot and some more text).\n- Check-in date must not be empty.\n- Check-out date must be after the check-in date.\n- If validation fails, the user must see an error message for each invalid field.\n- Valid changes are saved with PUT /api/bookings/:bookingId.\n- A Delete button removes the booking with DELETE /api/bookings/:bookingId after the user confirms.",
          explain: "Validate into an errors object (a regex for the email, an empty check, a date comparison); PUT the JSON to the record's own URL; DELETE only after confirm(), and don't parse the empty 204 body.",
          note: "This is an edit form, so it uses PUT to the booking's own URL (with its id), not POST to the collection.",
          parts: [
            {
              id: "D3a", label: "a", marks: 4, format: "code",
              prompt: "Write a TypeScript function validateBooking(form: BookingForm) that checks the three rules and returns an object of error messages, one per invalid field (an empty object means the form is valid). (4 marks)",
              model: "function validateBooking(form: BookingForm): Record<string, string> {\n  const errors: Record<string, string> = {};\n\n  if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(form.email.trim())) {\n    errors.email = \"Enter a valid email address.\";\n  }\n  if (form.checkIn === \"\") {\n    errors.checkIn = \"Check-in date is required.\";\n  }\n  if (form.checkOut === \"\" || new Date(form.checkOut) <= new Date(form.checkIn)) {\n    errors.checkOut = \"Check-out must be after check-in.\";\n  }\n\n  return errors;\n}",
              rubric: [
                {
                  text: "Checks the email format (a regex .test(), or checks for @ and a dot)", marks: 1,
                  all: ["email"],
                  any: ["\\.\\s*test\\s*\\(", "\\.\\s*match\\s*\\(", "includes\\s*\\(\\s*['\"`]@", "indexOf\\s*\\(\\s*['\"`]@"],
                },
                {
                  text: "Checks the check-in date is not empty", marks: 1,
                  any: ["checkIn\\s*(===|==)\\s*(''|\"\"|``)", "!\\s*(\\w+\\s*\\.\\s*)?checkIn\\b", "checkIn\\s*\\.\\s*(trim\\s*\\(\\s*\\)|length)"],
                },
                {
                  text: "Compares the dates: check-out must be after check-in", marks: 1,
                  any: [
                    "checkOut[^;{}]{0,40}(<=?|>=?)\\s*(new\\s+Date\\s*\\(\\s*)?(\\w+\\s*\\.\\s*)?checkIn",
                    "checkIn[^;{}]{0,40}(<=?|>=?)\\s*(new\\s+Date\\s*\\(\\s*)?(\\w+\\s*\\.\\s*)?checkOut",
                  ],
                },
                {
                  text: "Collects a message per invalid field in an errors object and returns it", marks: 1,
                  all: ["errors?\\w*\\s*(\\.\\s*\\w+\\s*=|\\[|\\.\\s*push)|['\"`][^'\"`]*(required|must|valid|empty|after)[^'\"`]*['\"`]", "\\breturn\\b"],
                },
              ],
              wrong: [
                "function validate(form) {\n  if (form.email === '' || form.checkIn === '') return false;\n  return true;\n}",
                "const errors = {};\nif (form.email === '') errors.email = 'Email is required';\nif (form.checkOut === '') errors.checkOut = 'Check-out is required';\nreturn errors;",
              ],
            },
            {
              id: "D3b", label: "b", marks: 3, format: "code",
              prompt: "Write a function saveBooking(id: number, booking: BookingForm) that sends the updated booking using the Fetch API and the PUT method. Include the request headers and JSON serialisation, and throw an error if the response is not successful. (3 marks)",
              model: "async function saveBooking(id: number, booking: BookingForm): Promise<void> {\n  const res = await fetch(`/api/bookings/${id}`, {\n    method: \"PUT\",\n    headers: { \"Content-Type\": \"application/json\" },\n    body: JSON.stringify(booking),\n  });\n  if (!res.ok) throw new Error(\"Save failed: HTTP \" + res.status);\n}",
              rubric: [
                {
                  text: "fetch to the booking's own URL (/api/bookings/${id}) with method: \"PUT\"", marks: 1,
                  all: ["fetch\\s*\\(\\s*[`'\"][^`'\"]*/api/bookings/(\\$\\{\\s*\\w+\\s*\\}|['\"]\\s*\\+\\s*\\w+)", "method\\s*:\\s*['\"`]PUT['\"`]"],
                },
                {
                  text: "Content-Type: application/json header and body: JSON.stringify(...)", marks: 1,
                  all: ["content-type['\"`]?\\s*:\\s*['\"`]application/json", "body\\s*:\\s*JSON\\s*\\.\\s*stringify\\s*\\("],
                },
                { text: "Checks res.ok (or the status) and throws when it fails", marks: 1, all: ["\\.\\s*ok\\b|\\bstatus\\b", "\\bthrow\\b"] },
              ],
              wrong: [
                "fetch('/api/bookings', { method: 'POST', body: JSON.stringify(booking) });",
                "await fetch(`/api/bookings/${id}`, { method: 'PUT', body: booking });",
              ],
            },
            {
              id: "D3c", label: "c", marks: 3, format: "code",
              prompt: "Write the Delete button's async click handler. Ask the user to confirm first, and only if they agree send the DELETE request. On success the server replies 204 No Content: then navigate to /bookings (navigate comes from useNavigate()). If the request fails, call setError with a message instead. (3 marks)",
              model: "async function handleDelete() {\n  if (!window.confirm(\"Delete this booking?\")) return;\n\n  const res = await fetch(`/api/bookings/${bookingId}`, { method: \"DELETE\" });\n  if (!res.ok) {\n    setError(\"Could not delete the booking (HTTP \" + res.status + \")\");\n    return;\n  }\n  // 204 No Content: there is no body, so don't call res.json()\n  navigate(\"/bookings\");\n}",
              rubric: [
                {
                  text: "Asks for confirmation and stops if the user cancels: if (!window.confirm(...)) return;", marks: 1,
                  all: ["confirm\\s*\\("],
                  any: ["!\\s*(window\\s*\\.\\s*)?confirm\\s*\\(", "if\\s*\\(\\s*(window\\s*\\.\\s*)?confirm\\s*\\(", "(const|let|var)\\s+\\w+\\s*=\\s*(window\\s*\\.\\s*)?confirm\\s*\\("],
                },
                {
                  text: "Sends method: \"DELETE\" to the booking's own URL", marks: 1,
                  all: ["method\\s*:\\s*['\"`]DELETE['\"`]", "/api/bookings/(\\$\\{|['\"`]\\s*\\+)"],
                },
                {
                  text: "Checks success (res.ok / 204) before calling navigate(\"/bookings\")", marks: 1,
                  all: ["\\.\\s*ok\\b|\\b204\\b|\\bstatus\\b", "navigate\\s*\\(\\s*['\"`]/bookings['\"`]"],
                },
              ],
              wrong: [
                "await fetch(`/api/bookings/${id}`, { method: 'DELETE' });\nnavigate('/bookings');",
                "if (confirm('Delete?')) {\n  await fetch('/api/bookings/' + id, { method: 'POST' });\n}",
              ],
            },
          ],
        },
        {
          id: "D4", type: "written", marks: 10,
          title: "State Management - A Basket in Zustand, Orders in TanStack Query (10 marks)",
          prompt: "A café ordering app has these requirements:\n- Customers add menu items to a basket before checkout. The basket appears in a header badge (the item count) and on the basket page.\n- The customer's past orders are loaded from GET /api/orders and shown on an Orders page.\n- Placing an order sends the basket with POST /api/orders, through placeOrder(items) in the service module. After a successful order, the basket must be emptied and the Orders page must show the new order.\nA basket item has this shape:\n```\ninterface BasketItem {\n  id: number;\n  name: string;\n  qty: number;\n}\n```\nFor part (d), a teammate wrote this component:\n```\nfunction ClearButton() {\n  const store = useBasketStore();\n  return <button onClick={store.clear}>Clear basket</button>;\n}\n```\nAnswer all parts.",
          explain: "Zustand holds the basket, which the browser owns; TanStack Query holds the orders, which the server owns. useMutation with invalidateQueries refreshes the orders, and a selector limits re-renders.",
          parts: [
            {
              id: "D4a", label: "a", marks: 4, format: "code",
              prompt: "Write a typed Zustand store useBasketStore with items (initially empty), addItem(item) which adds an item, removeItem(id) which removes the item with that id, and clear() which empties the basket. (4 marks)",
              model: "import { create } from \"zustand\";\n\ninterface BasketState {\n  items: BasketItem[];\n  addItem: (item: BasketItem) => void;\n  removeItem: (id: number) => void;\n  clear: () => void;\n}\n\nexport const useBasketStore = create<BasketState>()((set) => ({\n  items: [],\n  addItem: (item) => set((state) => ({ items: [...state.items, item] })),\n  removeItem: (id) => set((state) => ({ items: state.items.filter((i) => i.id !== id) })),\n  clear: () => set({ items: [] }),\n}));",
              rubric: [
                { text: "const useBasketStore = create<BasketState>()(...) with items: [] to start", marks: 1, all: ["(const|let)\\s+useBasketStore\\s*=\\s*create\\b", "items\\s*:\\s*\\[\\s*\\]"] },
                {
                  text: "addItem returns a new array via set: [...state.items, item]", marks: 1,
                  all: ["addItem"],
                  any: ["\\[\\s*\\.\\.\\.\\s*(\\w+\\s*\\.\\s*)?items\\s*,", "items\\s*\\.\\s*concat\\s*\\("],
                },
                { text: "removeItem filters the item out by id: state.items.filter(...)", marks: 1, all: ["removeItem", "items\\s*\\.\\s*filter\\s*\\("] },
                {
                  text: "clear sets items back to []: set({ items: [] })", marks: 1,
                  all: ["clear"],
                  any: ["set\\s*\\(\\s*(\\(\\s*\\w*\\s*\\)\\s*=>\\s*\\(\\s*)?\\{\\s*items\\s*:\\s*\\[\\s*\\]"],
                },
              ],
              wrong: [
                "const useBasketStore = create((set) => ({\n  items: [],\n  addItem: (item) => set((state) => { state.items.push(item); return state; }),\n}));",
                "const [items, setItems] = useState([]);\nconst addItem = (item) => setItems([...items, item]);\nconst clear = () => setItems([]);",
              ],
            },
            {
              id: "D4b", label: "b", marks: 2, format: "text",
              prompt: "Explain why the basket belongs in Zustand while the past orders belong in TanStack Query. (2 marks)",
              model: "The basket is client state: it exists only in the browser until checkout, the app itself creates and changes it, and several components (the header badge and the basket page) need it, so a Zustand store shares it without prop drilling.\nThe past orders are server state: they live on the server and the app only holds a cached copy that can go out of date, so TanStack Query should fetch them, cache them by query key, track loading and error, and refetch or invalidate them when they change.",
              rubric: [
                {
                  text: "Basket: client/UI state that only the browser owns and several components share", marks: 1,
                  all: ["basket|cart"],
                  any: ["client(-| )?(side )?state", "\\bui state", "in the browser", "not (stored )?(from|on) the server", "no server", "local state", "(the )?app owns", "global (client )?state"],
                },
                {
                  text: "Orders: server state, a cached copy that can go stale, so Query handles caching and refetching", marks: 1,
                  all: ["order"],
                  any: ["server(-| )?state", "server data", "(lives?|stored) on the server", "cach", "refetch", "\\bstale\\b", "out of date", "invalidat"],
                },
              ],
              wrong: [
                "Both could go in Zustand because Zustand is a global store.",
                "The basket should use TanStack Query because it changes often, and orders should use Zustand.",
              ],
            },
            {
              id: "D4c", label: "c", marks: 2, format: "code",
              prompt: "Write the useMutation call for placing an order. It calls placeOrder(items), and when the order succeeds it empties the basket and makes the Orders page refetch the [\"orders\"] query. Assume const queryClient = useQueryClient() and const clear = useBasketStore((s) => s.clear) already exist. (2 marks)",
              model: "const placeOrderMutation = useMutation({\n  mutationFn: (items: BasketItem[]) => placeOrder(items),\n  onSuccess: () => {\n    clear();\n    queryClient.invalidateQueries({ queryKey: [\"orders\"] });\n  },\n});\n\n// on the Place order button:\n// onClick={() => placeOrderMutation.mutate(items)}",
              rubric: [
                { text: "useMutation({ mutationFn: ... placeOrder ... }) (v5 object syntax)", marks: 1, all: ["useMutation\\s*(<[^>]*>)?\\s*\\(\\s*\\{", "mutationFn\\s*:", "placeOrder"] },
                {
                  text: "onSuccess clears the basket and calls invalidateQueries({ queryKey: [\"orders\"] })", marks: 1,
                  all: ["onSuccess", "invalidateQueries\\s*\\(\\s*\\{\\s*queryKey\\s*:\\s*\\[\\s*['\"`]orders['\"`]", "clear\\w*\\s*\\("],
                },
              ],
              wrong: [
                "const mutation = useMutation(placeOrder, {\n  onSuccess: () => queryClient.invalidateQueries(['orders']),\n});",
                "const mutation = useMutation({ mutationFn: placeOrder });\nmutation.mutate(items);\nuseBasketStore.getState().clear();",
              ],
            },
            {
              id: "D4d", label: "d", marks: 2, format: "text",
              prompt: "Look at the ClearButton component above. Explain why it re-renders every time an item is added to the basket, and rewrite its first line so that it no longer does. (2 marks)",
              model: "useBasketStore() with no selector subscribes the component to the whole store. Every set (for example addItem changing items) produces a new state object, so ClearButton re-renders even though it only uses clear.\nRewrite the line with a selector:\nconst clear = useBasketStore((s) => s.clear);\nNow it subscribes only to the clear function, which never changes, so adding items no longer re-renders it (and the button becomes onClick={clear}).",
              rubric: [
                {
                  text: "No selector: it subscribes to the whole store, so any change re-renders it", marks: 1,
                  any: ["whole store", "entire store", "(all|every part) of the (store|state)", "every (store )?(change|update)", "any (store )?(change|update)", "(any|every) (call to )?set\\b", "no selector", "without a selector"],
                },
                { text: "Rewrite with a selector: const clear = useBasketStore((s) => s.clear)", marks: 1, any: ["useBasketStore\\s*\\(\\s*\\(?\\s*\\w+\\s*\\)?\\s*=>\\s*\\w+\\s*\\.\\s*clear\\s*\\)"] },
              ],
              wrong: [
                "It re-renders because clear is a function. Wrap it in useMemo.",
                "const store = useBasketStore((s) => s);",
              ],
            },
          ],
        },
      ],
    },

    // ------------------------------------------------------------------ E
    {
      id: "E",
      title: "Section E - Front-End Security (10 marks)",
      intro: "Answer all five questions. Each question is worth 2 marks.",
      items: [
        {
          id: "E1", type: "mcq", marks: 2,
          prompt: "A frontend decodes a JWT payload and gets { \"sub\": \"42\", \"exp\": 1795000000 }. Which check correctly tells whether the token has expired?",
          options: [
            "payload.exp < Date.now()",
            "payload.exp * 1000 < Date.now()",
            "payload.exp < Date.now() * 1000",
            "new Date(payload.exp) < new Date()",
          ],
          answer: 1,
          explain: "exp is in seconds since 1 Jan 1970, but Date.now() is in milliseconds, so multiply exp by 1000 before comparing.",
          note: "new Date(payload.exp) treats the seconds as milliseconds, which gives a date in January 1970, so every token would look expired. The server still makes the final decision.",
        },
        {
          id: "E2", type: "mcq", marks: 2,
          prompt: "A user is logged in with a valid token and the role \"member\". They call DELETE /api/books/5, which only librarians may do. Which response and frontend reaction are correct?",
          options: [
            "401 Unauthorized: clear the token and redirect to the login page",
            "404 Not Found: show a 'page not found' message",
            "403 Forbidden: keep the user logged in and show a 'You don't have permission' message",
            "201 Created: show 'Book deleted'",
          ],
          answer: 2,
          explain: "The user is authenticated (we know who they are) but not authorised for this action, so the server replies 403. Logging in again won't help, so keep the session and explain that they lack permission.",
          note: "The server must enforce the role check on every request, even if the UI hides the Delete button from members.",
        },
        {
          id: "E3", type: "tf", marks: 2,
          prompt: "True or False: Rendering a product review from an API with <div dangerouslySetInnerHTML={{ __html: review.text }} /> is safe, as long as the review was fetched over HTTPS.",
          answer: false,
          explain: "HTTPS protects data only while it travels. dangerouslySetInnerHTML inserts the review as raw HTML, so a review containing <img src=x onerror=...> runs the attacker's script (XSS). Render it as {review.text}, or sanitise it first.",
        },
        {
          id: "E4", type: "tf", marks: 2,
          prompt: "True or False: If a JWT is stored in localStorage, any JavaScript running on the page, including a script injected through an XSS bug, can read it.",
          answer: true,
          explain: "localStorage is readable by any script on the page, so XSS can steal the token. An httpOnly cookie (with Secure and SameSite, set by the server) can't be read by JavaScript at all.",
        },
        {
          id: "E5", type: "mcq", marks: 2,
          prompt: "A shared request helper receives 401 Unauthorized from the API while a user is browsing their account page. What should the frontend do?",
          options: [
            "Clear the stored token and session, and send the user to log in again (or try a token refresh once)",
            "Keep retrying the same request with the same token until it succeeds",
            "Show 'Access denied' and keep the user logged in, because 401 means their role is wrong",
            "Ignore it, because the frontend already checked the token's exp before sending the request",
          ],
          answer: 0,
          explain: "401 means the server no longer accepts the token: it is missing, expired or revoked. Treat the user as logged out: clear the token and redirect to login, or try a refresh-token flow once. Retrying with the same token can't work.",
          note: "403 is the 'wrong role' code. The frontend's exp check is only a guess, and the server's 401 is the final answer.",
        },
      ],
    },
  ],
});
