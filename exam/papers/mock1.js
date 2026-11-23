/*
 * Mock 1: the module's mock ICT, reproduced verbatim, with answer key, model answers and rubrics.
 * UMD: in the browser this registers window.ACSD_PAPERS.mock1; under Node/Vitest it is module.exports.
 *
 * Paper shape (mock2.js uses the same):
 *   { id, title, minutes, heading, module, duration, totalMarks, instructions[], distribution, end[],
 *     sections: [{ id, title, intro, items: [...] }] }
 *   mcq:     { id, type: "mcq", marks, prompt, options[], answer: <index, 0 = A>, explain, note? }
 *   tf:      { id, type: "tf",  marks, prompt, answer: true|false, explain, note? }
 *   written: { id, type: "written", marks, title?, prompt, explain,
 *              parts: [{ id, label, prompt?, marks, format: "code"|"text", model, rubric[], wrong[] }] }
 *   rubric point: { text, marks, any?: [regex strings], all?: [regex strings] }  (case-insensitive,
 *              run against the whitespace-normalised answer; marks must sum to the part's marks)
 *
 * Prompt text mini-format: one paragraph per line; lines starting "- " form a bullet list;
 * lines between ``` fences form a code block.
 *
 * Note: the exam/ self-check greps for a literal "fetch" + "(" to prove the page makes no requests,
 * so model answers write that paren as \u0028 (the page still shows a normal paren).
 */
(function (root, paper) {
  if (typeof module === "object" && module && module.exports) module.exports = paper;
  else (root.ACSD_PAPERS = root.ACSD_PAPERS || {})[paper.id] = paper;
})(typeof self !== "undefined" ? self : this, {
  id: "mock1",
  title: "ACSD Mock ICT 1",
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
          prompt: "A React application needs to display the total value of all items in a shopping basket. Which JavaScript array method is most appropriate for calculating a single accumulated value?",
          options: ["find()", "reduce()", "sort()", "slice()"],
          answer: 1,
          explain: "reduce() folds an array into one accumulated value, e.g. items.reduce((sum, i) => sum + i.price, 0).",
        },
        {
          id: "A2", type: "mcq", marks: 1,
          prompt: "A developer wants to navigate programmatically to /dashboard after a user successfully signs in. Which React Router Hook is designed for this purpose?",
          options: ["useParams()", "useLocation()", "useNavigate()", "useSearchParams()"],
          answer: 2,
          explain: "useNavigate() returns a navigate function you call from code: navigate(\"/dashboard\").",
        },
        {
          id: "A3", type: "mcq", marks: 1,
          prompt: "In TypeScript, which keyword is used to define a custom type alias?",
          options: ["interfaceOnly", "type", "define", "structure"],
          answer: 1,
          explain: "type Name = ... declares a type alias, e.g. type Id = string | number.",
        },
        {
          id: "A4", type: "mcq", marks: 1,
          prompt: "A React application needs to display different content depending on whether a user has selected a particular tab. Which programming technique is most appropriate?",
          options: ["Conditional rendering", "Database migration", "Server-side rendering configuration", "CSS font loading"],
          answer: 0,
          explain: "Conditional rendering (&&, a ternary or an early return) shows different JSX depending on state.",
        },
        {
          id: "A5", type: "mcq", marks: 1,
          prompt: "Which HTTP status code indicates that a request was understood but the user is not authenticated?",
          options: ["201", "204", "401", "500"],
          answer: 2,
          explain: "401 Unauthorized means not authenticated: credentials/token missing, invalid or expired.",
        },
        {
          id: "A6", type: "mcq", marks: 1,
          prompt: "Which React Router component allows child routes to render inside a parent layout?",
          options: ["<Navigate />", "<Outlet />", "<Link />", "<BrowserRouter />"],
          answer: 1,
          explain: "<Outlet /> marks the spot in the parent layout where the matched child route renders.",
        },
        {
          id: "A7", type: "mcq", marks: 1,
          prompt: "What is the main purpose of Promise.all() in JavaScript?",
          options: [
            "To execute multiple asynchronous operations and wait for all of them to settle successfully",
            "To cancel every pending request",
            "To convert JavaScript objects into TypeScript interfaces",
            "To execute asynchronous operations one after another automatically",
          ],
          answer: 0,
          explain: "Promise.all() runs several promises concurrently and resolves with all their results.",
          note: "Promise.all waits for all promises to fulfil and rejects as soon as any one rejects. Promise.allSettled waits for every one to settle either way. The option's wording \"settle successfully\" means fulfil.",
        },
        {
          id: "A8", type: "mcq", marks: 1,
          prompt: "In TypeScript, what is the purpose of an interface?",
          options: [
            "To define the expected structure of an object",
            "To create a CSS class",
            "To automatically send API requests",
            "To store application data permanently",
          ],
          answer: 0,
          explain: "An interface describes an object's shape: its property names and types.",
        },
        {
          id: "A9", type: "mcq", marks: 1,
          prompt: "Which CSS property is particularly useful for creating layouts with named grid areas?",
          options: ["grid-template-areas", "text-transform", "letter-spacing", "border-radius"],
          answer: 0,
          explain: "grid-template-areas names regions; children claim them with grid-area: header etc.",
        },
        {
          id: "A10", type: "mcq", marks: 1,
          prompt: "A developer wants to retrieve the identifier from a dynamic route such as /products/42. Which React Router Hook is most suitable?",
          options: ["useNavigate()", "useParams()", "useState()", "useRef()"],
          answer: 1,
          explain: "useParams() returns the dynamic segments, e.g. { productId: \"42\" } for /products/:productId.",
        },
        {
          id: "A11", type: "mcq", marks: 1,
          prompt: "What does the staleTime option in TanStack Query control?",
          options: [
            "How long cached query data is considered fresh",
            "How long a browser session remains authenticated",
            "How long a React component remains mounted",
            "How long a form submission takes",
          ],
          answer: 0,
          explain: "staleTime is how long fetched data counts as fresh; fresh data is served from cache without refetching.",
        },
        {
          id: "A12", type: "mcq", marks: 1,
          prompt: "Which Zustand function is commonly used to access a particular piece of data from a store?",
          options: ["useState()", "useEffect()", "The store's generated Hook", "createContext()"],
          answer: 2,
          explain: "create() returns a Hook (e.g. useThemeStore); call it with a selector to read one value.",
          note: "e.g. const theme = useThemeStore((s) => s.theme). create() returns the Hook.",
        },
        {
          id: "A13", type: "mcq", marks: 1,
          prompt: "What is the purpose of an HTTP 204 No Content response?",
          options: [
            "It indicates that the request succeeded but there is no response body to return",
            "It indicates that the server has crashed",
            "It means that authentication has failed",
            "It indicates that a requested page has moved permanently",
          ],
          answer: 0,
          explain: "204 No Content: success with an empty body (common after DELETE), so don't call res.json().",
        },
        {
          id: "A14", type: "mcq", marks: 1,
          prompt: "Which TypeScript type would be most appropriate for a variable that can contain either a string or a number?",
          options: ["string & number", "string | number", "string + number", "string / number"],
          answer: 1,
          explain: "string | number is a union (either type); string & number is an intersection, which no value satisfies.",
        },
        {
          id: "A15", type: "mcq", marks: 1,
          prompt: "What is the main purpose of the invalidateQueries() function in TanStack Query?",
          options: [
            "To remove all React components",
            "To mark matching cached queries as invalid so they can be refreshed",
            "To permanently delete the API endpoint",
            "To disable all future API requests",
          ],
          answer: 1,
          explain: "invalidateQueries({ queryKey }) marks matching cached queries stale so active ones refetch.",
        },
        {
          id: "A16", type: "mcq", marks: 1,
          prompt: "Which CSS function allows a property to have a preferred value while respecting minimum and maximum limits?",
          options: ["calc()", "minmax()", "clamp()", "var()"],
          answer: 2,
          explain: "clamp(min, preferred, max), e.g. font-size: clamp(1rem, 2.5vw, 2rem).",
        },
        {
          id: "A17", type: "mcq", marks: 1,
          prompt: "A developer wants to prevent a user from submitting a form if an email address does not meet a required format. Which approach is most appropriate?",
          options: [
            "Client-side validation",
            "Changing the page title",
            "Adding a CSS animation",
            "Using browser local storage only",
          ],
          answer: 0,
          explain: "Client-side validation checks input before submit and shows errors (the server must still validate).",
        },
        {
          id: "A18", type: "mcq", marks: 1,
          prompt: "Which React Hook is commonly used to access URL query-string parameters through React Router?",
          options: ["useSearchParams()", "useReducer()", "useMemo()", "useCallback()"],
          answer: 0,
          explain: "useSearchParams() reads and updates ?key=value parameters: searchParams.get(\"page\").",
        },
        {
          id: "A19", type: "mcq", marks: 1,
          prompt: "What is the main benefit of separating API calls into a dedicated service module?",
          options: [
            "It removes the need for HTTP requests",
            "It separates data-access logic from presentation components",
            "It automatically creates a backend",
            "It prevents all network errors",
          ],
          answer: 1,
          explain: "A service module keeps request code out of components: separation of concerns and reuse.",
        },
        {
          id: "A20", type: "mcq", marks: 1,
          prompt: "What is the purpose of the CSS pseudo-class :focus-visible?",
          options: [
            "To apply styling when an element receives focus in situations where a visible focus indicator is appropriate",
            "To hide all focused elements",
            "To prevent keyboard navigation",
            "To resize elements when clicked",
          ],
          answer: 0,
          explain: ":focus-visible styles focus when the browser judges a ring is useful, e.g. keyboard focus, not mouse clicks.",
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
          prompt: "A React application can use React Router to display different page components without requiring a full browser page reload for every navigation.",
          answer: true,
          explain: "Client-side routing swaps components using the History API, with no full reload.",
        },
        {
          id: "B2", type: "tf", marks: 1,
          prompt: "TypeScript interfaces can be used to describe the expected properties of objects received from an API.",
          answer: true,
          explain: "e.g. const courses: Course[] = await res.json(), with interface Course { id: number; title: string }.",
        },
        {
          id: "B3", type: "tf", marks: 1,
          prompt: "The JavaScript find() method returns every element that satisfies a condition.",
          answer: false,
          explain: "find() returns the first match (or undefined); filter() returns every match.",
        },
        {
          id: "B4", type: "tf", marks: 1,
          prompt: "A React custom Hook must follow the Rules of Hooks, including being called at the top level of a component or another custom Hook.",
          answer: true,
          explain: "Hooks, custom ones included, must be called unconditionally at the top level of a component or Hook.",
        },
        {
          id: "B5", type: "tf", marks: 1,
          prompt: "A 403 Forbidden response generally indicates that the request was understood but the user does not have sufficient permission.",
          answer: true,
          explain: "403: the server knows who you are, but you lack permission. Logging in again won't help.",
        },
        {
          id: "B6", type: "tf", marks: 1,
          prompt: "TanStack Query is designed to help manage asynchronous server data, including caching and synchronisation.",
          answer: true,
          explain: "TanStack Query manages server state: fetching, caching, background refetching and invalidation.",
        },
        {
          id: "B7", type: "tf", marks: 1,
          prompt: "Zustand requires every component in an application to subscribe to the entire store.",
          answer: false,
          explain: "Components subscribe only to the slice they select, e.g. useStore((s) => s.count).",
        },
        {
          id: "B8", type: "tf", marks: 1,
          prompt: "A dynamic route can use a URL parameter to identify which record should be displayed.",
          answer: true,
          explain: "e.g. /students/:studentId, read in the page with useParams().",
        },
        {
          id: "B9", type: "tf", marks: 1,
          prompt: "Client-side validation guarantees that invalid data can never reach a server.",
          answer: false,
          explain: "Client-side checks are for UX and can be bypassed; the server must validate too.",
        },
        {
          id: "B10", type: "tf", marks: 1,
          prompt: "The HTTP PUT method can be used by a frontend application when updating an existing resource.",
          answer: true,
          explain: "PUT updates/replaces an existing resource at its URL, e.g. PUT /api/events/42.",
        },
        {
          id: "B11", type: "tf", marks: 1,
          prompt: "A React application can use different layouts for different route groups.",
          answer: true,
          explain: "Nest each route group under its own layout route, each rendering an <Outlet />.",
        },
        {
          id: "B12", type: "tf", marks: 1,
          prompt: "The CSS minmax() function can specify minimum and maximum sizes for grid tracks.",
          answer: true,
          explain: "e.g. grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)).",
        },
        {
          id: "B13", type: "tf", marks: 1,
          prompt: "A TypeScript union type allows a value to belong to one of several specified types.",
          answer: true,
          explain: "A union such as \"light\" | \"dark\" accepts any one of the listed types.",
        },
        {
          id: "B14", type: "tf", marks: 1,
          prompt: "TanStack Query and Zustand are interchangeable tools designed exclusively for storing server responses.",
          answer: false,
          explain: "Zustand holds client state (e.g. theme); TanStack Query manages server state. They complement each other.",
        },
        {
          id: "B15", type: "tf", marks: 1,
          prompt: "A frontend application can use a JWT's expiry information to determine whether a token may have expired.",
          answer: true,
          explain: "The decoded payload's exp claim (seconds since 1970) says when it expires; the server still verifies it.",
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
          title: "JavaScript - Array Reduction",
          prompt: "Consider the following data:\n```\nconst prices = [15, 25, 10, 30];\n```\nWrite a JavaScript statement using reduce() to calculate the total of all prices and store the result in a variable named total.",
          explain: "reduce((sum, price) => sum + price, 0) adds each price to a running total that starts at 0.",
          parts: [
            {
              id: "C1", label: "", marks: 3, format: "code",
              model: "const total = prices.reduce((sum, price) => sum + price, 0);",
              rubric: [
                { text: "Calls reduce on prices: prices.reduce(...)", marks: 1, any: ["prices\\s*\\.\\s*reduce\\s*\\("] },
                { text: "Callback returns accumulator + current value (sum + price)", marks: 1, all: ["=>|function|return", "\\w+\\s*\\+\\s*\\w+"] },
                { text: "Initial value 0 and the result stored in total", marks: 1, all: ["\\btotal\\s*=", ",\\s*0\\s*\\)"] },
              ],
              wrong: [
                "const total = prices.length;",
                "const total = prices.map((p) => p + p);",
              ],
            },
          ],
        },
        {
          id: "C2", type: "written", marks: 3,
          title: "TypeScript - Object Structure",
          prompt: "Write a TypeScript interface named Product containing the following properties:\n- id: number\n- name: string\n- price: number\n- description: optional string",
          explain: "An optional property is written with ? before the colon: description?: string.",
          parts: [
            {
              id: "C2", label: "", marks: 3, format: "code",
              model: "interface Product {\n  id: number;\n  name: string;\n  price: number;\n  description?: string;\n}",
              rubric: [
                { text: "Declares interface Product { ... }", marks: 1, any: ["\\binterface\\s+Product\\s*\\{"] },
                { text: "id: number, name: string and price: number", marks: 1, all: ["\\bid\\s*:\\s*number", "\\bname\\s*:\\s*string", "\\bprice\\s*:\\s*number"] },
                { text: "description is optional: description?: string", marks: 1, any: ["\\bdescription\\s*\\?\\s*:\\s*string"] },
              ],
              wrong: [
                "type Product = { id: string; name: string; price: string; description: string }",
                "class Product { id = 0; name = ''; }",
              ],
            },
          ],
        },
        {
          id: "C3", type: "written", marks: 3,
          title: "React Router - Dynamic Parameters",
          prompt: "A React application uses the following route:\n```\n/orders/:orderId\n```\nName the React Router Hook that retrieves the route parameter and write the expression used to obtain orderId.",
          explain: "useParams() returns an object of the route's dynamic segments; destructure orderId from it.",
          parts: [
            {
              id: "C3", label: "", marks: 3, format: "code",
              model: "Hook: useParams (from react-router-dom)\nconst { orderId } = useParams();",
              rubric: [
                { text: "Names the useParams Hook", marks: 1, any: ["\\buseParams\\b"] },
                {
                  text: "Reads orderId from useParams(), e.g. const { orderId } = useParams()", marks: 2,
                  all: ["useParams\\s*(<[^>]*>)?\\s*\\(\\s*\\)"],
                  any: ["\\{\\s*orderId\\s*\\}\\s*=", "\\.\\s*orderId\\b", "\\[\\s*['\"`]orderId['\"`]\\s*\\]"],
                },
              ],
              wrong: [
                "useNavigate()\nconst orderId = navigate('/orders');",
                "useSearchParams()\nconst orderId = searchParams.get('orderId');",
              ],
            },
          ],
        },
        {
          id: "C4", type: "written", marks: 3,
          title: "TanStack Query - Cache Management",
          prompt: "After successfully updating a customer's profile, the application needs to ensure that previously cached customer information is refreshed.\nWrite the TanStack Query function commonly used for this purpose and briefly explain what it does.",
          explain: "invalidateQueries marks the matching cached queries stale, so TanStack Query refetches them.",
          parts: [
            {
              id: "C4", label: "", marks: 3, format: "text",
              model: "queryClient.invalidateQueries({ queryKey: [\"customer\"] });\n\nIt marks the cached queries that match that key as stale (invalid), so TanStack Query refetches them (straight away if they are on screen) and the UI shows the updated profile. Call it in the mutation's onSuccess.",
              rubric: [
                { text: "Names invalidateQueries", marks: 1, any: ["invalidateQueries"] },
                { text: "Targets the cached data by query key, e.g. { queryKey: [\"customer\"] }", marks: 1, any: ["queryKey\\s*:", "invalidateQueries\\s*\\(\\s*\\["] },
                { text: "Explains it marks matching data stale/invalid so it is refetched", marks: 1, any: ["\\bstale\\b", "\\binvalid\\b", "refetch", "re-fetch", "fetch\\w* (\\w+ )?again", "\\brefresh"] },
              ],
              wrong: [
                "queryClient.setQueryData(['customer'], newData)",
                "useQuery refreshes the data.",
              ],
            },
          ],
        },
        {
          id: "C5", type: "written", marks: 3,
          title: "API Handling - HTTP Status Codes",
          prompt: "Explain the difference between an HTTP 401 Unauthorized response and a 403 Forbidden response from the perspective of a frontend application.",
          explain: "401 = we don't know who you are (log in); 403 = we know who you are, but you may not do this.",
          parts: [
            {
              id: "C5", label: "", marks: 3, format: "text",
              model: "401 Unauthorized means the user is not authenticated: there is no token, or it is missing, invalid or expired. The frontend should send them to the login page (or refresh the token) and clear the stored session.\n403 Forbidden means the user is authenticated (the server knows who they are) but does not have permission for that resource. Logging in again won't help: the frontend should show an 'access denied' message and hide that feature.",
              rubric: [
                {
                  text: "401: not authenticated (not logged in / missing, invalid or expired token)", marks: 1,
                  all: ["401"],
                  any: ["not (authenticated|logged|signed)", "unauthenticated", "(missing|invalid|expired|no) (\\w+ )?token", "credential", "identity", "not identified"],
                },
                {
                  text: "403: authenticated but not permitted (insufficient permission or role)", marks: 1,
                  all: ["403"],
                  any: ["permission", "not (allowed|permitted)", "access", "\\brole", "privilege", "rights"],
                },
                {
                  text: "Frontend reaction: 401 → redirect to login / re-authenticate; 403 → show a forbidden/access-denied message", marks: 1,
                  all: [
                    "redirect|login page|log ?in page|sign ?in page|log (them|the user|you) in|re-?log|re-?authenticat|refresh (the )?token",
                    "(show|display|render)\\w*\\b.*(message|error|denied|forbidden|page)|access denied|hide",
                  ],
                },
              ],
              wrong: [
                "401 and 403 are both server errors, so the frontend should just retry the request.",
                "401 means the page was not found and 403 means the server crashed.",
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
          title: "React Router - Application Navigation (10 marks)",
          prompt: "A student-management application contains the following pages:\n- Home page: /\n- Student list: /students\n- Individual student details: /students/:studentId\n- Settings page: /settings\nThe application should use a shared layout containing a navigation menu. The student details page must display the ID belonging to the selected student.",
          explain: "A layout route with children + <Outlet />, a :studentId segment read by useParams(), and useNavigate() for code-driven navigation.",
          parts: [
            {
              id: "D1a", label: "a", marks: 4, format: "code",
              prompt: "Write a React Router configuration that defines the routes listed above. Use a shared layout for the pages. (4 marks)",
              model: "import { createBrowserRouter, RouterProvider } from \"react-router-dom\";\n\nconst router = createBrowserRouter([\n  {\n    path: \"/\",\n    element: <Layout />,\n    children: [\n      { index: true, element: <Home /> },\n      { path: \"students\", element: <StudentList /> },\n      { path: \"students/:studentId\", element: <StudentDetails /> },\n      { path: \"settings\", element: <Settings /> },\n    ],\n  },\n]);\n\nexport default function App() {\n  return <RouterProvider router={router} />;\n}",
              rubric: [
                { text: "Creates a router (createBrowserRouter + RouterProvider, or <BrowserRouter><Routes>)", marks: 1, any: ["createBrowserRouter", "RouterProvider", "<\\s*BrowserRouter", "<\\s*Routes\\b"] },
                { text: "Parent layout route with nested child routes (children: [...] or nested <Route>)", marks: 1, any: ["children\\s*:", "<\\s*Route\\b[^>]*element\\s*=\\s*\\{\\s*<\\s*\\w*Layout[^>]*>\\s*\\}\\s*>"] },
                { text: "Home as the index route (or path \"/\") and a students route", marks: 1, all: ["\\bindex\\b|path\\s*[:=]\\s*\\{?\\s*['\"`]/['\"`]", "path\\s*[:=]\\s*\\{?\\s*['\"`]/?students['\"`]"] },
                { text: "Dynamic students/:studentId route and a settings route", marks: 1, all: ["['\"`]/?students/:studentId['\"`]", "['\"`]/?settings['\"`]"] },
              ],
              wrong: [
                "<a href=\"/students\">Students</a>\n<a href=\"/settings\">Settings</a>",
                "const routes = ['/', '/students', '/students/:studentId', '/settings'];",
              ],
            },
            {
              id: "D1b", label: "b", marks: 2, format: "text",
              prompt: "Explain the purpose of the <Outlet /> component in the shared layout. (2 marks)",
              model: "<Outlet /> is a placeholder in the layout component: it is where the matched child route's element is rendered. The layout (navigation menu) stays on screen and only the content in the Outlet changes when the user navigates.",
              rubric: [
                { text: "Outlet is where the matched child route renders", marks: 1, any: ["child (route|page|component|element)", "nested (route|page|component)", "matched (route|child|page)", "placeholder"] },
                { text: "So the shared layout/nav stays and only the inner content changes", marks: 1, all: ["layout|nav|menu|header|shared", "stay|remain|persist|keep|same|only (the )?(\\w+ )?(content|part|section|outlet|page)|without (re-?)?(rendering|reloading)"] },
              ],
              wrong: [
                "<Outlet /> redirects the user to another page.",
                "It loads data from the API.",
              ],
            },
            {
              id: "D1c", label: "c", marks: 2, format: "code",
              prompt: "Write a small React component that retrieves studentId from the URL and displays it. (2 marks)",
              model: "import { useParams } from \"react-router-dom\";\n\nfunction StudentDetails() {\n  const { studentId } = useParams();\n  return <p>Student ID: {studentId}</p>;\n}",
              rubric: [
                {
                  text: "Reads studentId with useParams()", marks: 1,
                  all: ["useParams\\s*(<[^>]*>)?\\s*\\(\\s*\\)"],
                  any: ["\\{\\s*studentId\\s*\\}\\s*=", "\\.\\s*studentId\\b", "\\[\\s*['\"`]studentId['\"`]\\s*\\]"],
                },
                { text: "Returns JSX that displays it, e.g. <p>{studentId}</p>", marks: 1, any: ["<\\s*\\w+[^>]*>[^<]*\\{\\s*(\\w+\\s*\\.\\s*)?studentId\\s*\\}"] },
              ],
              wrong: [
                "const studentId = useState();",
                "<p>studentId</p>",
              ],
            },
            {
              id: "D1d", label: "d", marks: 2, format: "text",
              prompt: "Explain how a user could navigate to the settings page programmatically after saving their preferences. Name the appropriate Hook and describe its use. (2 marks)",
              model: "Use the useNavigate Hook. Call it at the top level of the component: const navigate = useNavigate(); then, once the preferences have saved successfully (e.g. in the submit handler after the await), call navigate(\"/settings\").",
              rubric: [
                { text: "Names useNavigate", marks: 1, any: ["\\buseNavigate\\b"] },
                { text: "Calls navigate(\"/settings\") after the save succeeds", marks: 1, any: ["navigate\\s*\\(\\s*['\"`]/settings['\"`]"] },
              ],
              wrong: [
                "Use <Link to=\"/settings\"> so the user clicks it.",
                "window.location.href = '/settings'",
              ],
            },
          ],
        },
        {
          id: "D2", type: "written", marks: 10,
          title: "React API Consumption - Asynchronous Operations (10 marks)",
          prompt: "A React application needs to retrieve a list of courses from the following API endpoint:\n```\nhttps://example.com/api/courses\n```\nThe application should:\n- Retrieve the course data when the component loads.\n- Display a loading message while the request is in progress.\n- Display an error message if the request fails.\n- Display the number of courses after a successful request.\n- Avoid updating component state after the component has been unmounted.",
          explain: "useEffect + [] to fetch on mount, loading/error/data state, check res.ok, and abort in the cleanup.",
          parts: [
            {
              id: "D2a", label: "a", marks: 2, format: "text",
              prompt: "Explain why an asynchronous operation is needed when communicating with an external API. (2 marks)",
              model: "A network request takes an unknown amount of time to finish (and may fail), so the result is not available immediately. If the code waited synchronously it would block the main thread and freeze the UI. Doing it asynchronously (a Promise with async/await) keeps the page responsive: it can show a loading message and handle the data or error when the response arrives.",
              rubric: [
                { text: "The request takes time; the result isn't available immediately", marks: 1, any: ["takes? (\\w+ ){0,3}time", "not (\\w+ )?(available )?(immediately|instantly|straight away)", "latency", "\\bwait", "slow", "delay", "\\blater\\b"] },
                { text: "Async avoids blocking the UI/main thread; the page stays responsive", marks: 1, any: ["block", "freez", "responsive", "main thread"] },
              ],
              wrong: [
                "Because TypeScript requires every function to be async.",
                "So the API returns JSON.",
              ],
            },
            {
              id: "D2b", label: "b", marks: 6, format: "code",
              prompt: "Write a React component or custom Hook that implements the requirements above. You may use useEffect, useState and AbortController. (6 marks)",
              model: "import { useEffect, useState } from \"react\";\n\ninterface Course {\n  id: number;\n  title: string;\n}\n\nexport function CourseCount() {\n  const [courses, setCourses] = useState<Course[]>([]);\n  const [loading, setLoading] = useState(true);\n  const [error, setError] = useState<string | null>(null);\n\n  useEffect(() => {\n    const controller = new AbortController();\n\n    async function load() {\n      try {\n        const res = await fetch\u0028\"https://example.com/api/courses\", {\n          signal: controller.signal,\n        });\n        if (!res.ok) throw new Error(\"HTTP \" + res.status);\n        const data: Course[] = await res.json();\n        setCourses(data);\n      } catch (err) {\n        if ((err as Error).name !== \"AbortError\") setError((err as Error).message);\n      } finally {\n        if (!controller.signal.aborted) setLoading(false);\n      }\n    }\n\n    load();\n    return () => controller.abort();\n  }, []);\n\n  if (loading) return <p>Loading courses...</p>;\n  if (error) return <p>Error: {error}</p>;\n  return <p>{courses.length} courses</p>;\n}",
              rubric: [
                { text: "useEffect with an empty dependency array (runs when the component loads)", marks: 1, all: ["useEffect\\s*\\(", "\\[\\s*\\]\\s*\\)"] },
                { text: "Fetches the courses endpoint", marks: 1, any: ["fetch\\s*\\(\\s*['\"`][^'\"`]*api/courses", "axios\\s*\\.\\s*get\\s*\\("] },
                { text: "Loading state, shown while the request is in progress", marks: 1, all: ["useState", "loading"], any: ["if\\s*\\(\\s*\\w*loading\\w*\\s*\\)", "\\w*loading\\w*\\s*(\\?|&&)"] },
                { text: "Error handled (catch / res.ok) and an error message shown", marks: 1, all: ["catch|\\.ok\\b|status"], any: ["if\\s*\\(\\s*\\w*error\\w*\\s*\\)", "\\w*error\\w*\\s*(\\?|&&)"] },
                { text: "Displays the number of courses (.length)", marks: 1, any: ["\\.length"] },
                { text: "Cleanup avoids updates after unmount (controller.abort() or an ignore flag in the returned function)", marks: 1, all: ["\\.abort\\s*\\(|ignore\\s*=\\s*true|cancell?ed\\s*=\\s*true|mounted\\s*=\\s*false|active\\s*=\\s*false", "return\\s*(\\(\\s*\\)\\s*=>|function)"] },
              ],
              wrong: [
                "fetch\u0028'https://example.com/api/courses').then(res => res.json()).then(data => console.log(data.length));",
                "const data = fetch\u0028'/api/courses');\nreturn <p>{data.length} courses</p>;",
              ],
            },
            {
              id: "D2c", label: "c", marks: 2, format: "text",
              prompt: "Explain why an API service module can be beneficial when several components need to access the same endpoint. (2 marks)",
              model: "The request logic (URL, headers, res.ok check, JSON parsing) is written once, e.g. getCourses() in courseService.ts, and every component imports it, so there is no duplicated code. A change such as a new URL or an auth header is then made in one place. It also separates data access from presentation, so components stay simple and are easier to test (the service can be mocked).",
              rubric: [
                { text: "Reuse: written once, no duplicated request code", marks: 1, any: ["reus", "duplicat", "\\bonce\\b", "(don'?t|not) repeat", "\\bDRY\\b", "\\bshare"] },
                { text: "Maintainability: change it in one place; separates data access from UI; easier to test", marks: 1, any: ["one place", "single place", "maintain", "separat", "concern", "\\btest", "\\bmock", "presentation", "consisten"] },
              ],
              wrong: [
                "It makes the API respond faster.",
                "Because components cannot call fetch.",
              ],
            },
          ],
        },
        {
          id: "D3", type: "written", marks: 10,
          title: "Forms, Validation and CRUD (10 marks)",
          prompt: "A React application allows users to create a new event.\nThe form contains the following information:\nEvent Name\nLocation\nMaximum Attendees\nThe requirements are:\n- Event Name must not be empty.\n- Location must not be empty.\n- Maximum Attendees must be a positive integer.\n- If validation fails, the user must receive an appropriate error message.\n- If validation succeeds, the frontend must submit the data to the following endpoint:\n```\nPOST /api/events\n```",
          explain: "Validate each field into an errors object; POST JSON with a Content-Type header; POST creates, PUT updates.",
          parts: [
            {
              id: "D3a", label: "a", marks: 4, format: "code",
              prompt: "Write a JavaScript or TypeScript validation function that checks all three requirements. It should return suitable validation errors. (4 marks)",
              model: "interface EventForm {\n  name: string;\n  location: string;\n  maxAttendees: string;\n}\n\nfunction validateEvent(form: EventForm): Record<string, string> {\n  const errors: Record<string, string> = {};\n\n  if (form.name.trim() === \"\") {\n    errors.name = \"Event name is required.\";\n  }\n  if (form.location.trim() === \"\") {\n    errors.location = \"Location is required.\";\n  }\n  const max = Number(form.maxAttendees);\n  if (!Number.isInteger(max) || max <= 0) {\n    errors.maxAttendees = \"Maximum attendees must be a positive integer.\";\n  }\n\n  return errors;\n}",
              rubric: [
                { text: "Checks the event name is not empty", marks: 1, any: ["name\\s*\\.\\s*trim\\s*\\(\\s*\\)", "!\\s*\\w*\\.?name\\b", "name\\w*\\s*(===|==)\\s*(''|\"\"|``)", "name\\w*\\s*\\.\\s*length\\s*(===|==|<)\\s*[01]"] },
                { text: "Checks the location is not empty", marks: 1, any: ["location\\s*\\.\\s*trim\\s*\\(\\s*\\)", "!\\s*\\w*\\.?location\\b", "location\\w*\\s*(===|==)\\s*(''|\"\"|``)", "location\\w*\\s*\\.\\s*length\\s*(===|==|<)\\s*[01]"] },
                { text: "Checks max attendees is a positive integer (Number.isInteger and > 0)", marks: 1, all: ["isInteger|%\\s*1\\b|parseInt|Math\\s*\\.\\s*(floor|trunc|round)|\\\\d", ">\\s*0|<=\\s*0|<\\s*1\\b|>=\\s*1\\b"] },
                { text: "Collects and returns suitable error messages", marks: 1, all: ["errors?\\w*\\s*(\\.\\s*\\w+\\s*=|\\[|\\.\\s*push)|['\"`][^'\"`]*(required|must|empty|invalid)[^'\"`]*['\"`]", "\\breturn\\b"] },
              ],
              wrong: [
                "function validate(form) { return true; }",
                "if (form.maxAttendees > 0) { return 'valid'; }",
              ],
            },
            {
              id: "D3b", label: "b", marks: 3, format: "code",
              prompt: "Write a function that submits valid event data using the Fetch API and the POST method. Include appropriate request headers and JSON serialisation. (3 marks)",
              model: "async function createEvent(event: EventForm): Promise<void> {\n  const res = await fetch\u0028\"/api/events\", {\n    method: \"POST\",\n    headers: { \"Content-Type\": \"application/json\" },\n    body: JSON.stringify({\n      name: event.name,\n      location: event.location,\n      maxAttendees: Number(event.maxAttendees),\n    }),\n  });\n  if (!res.ok) throw new Error(\"Create failed: HTTP \" + res.status);\n}",
              rubric: [
                { text: "Calls fetch on /api/events with method: \"POST\"", marks: 1, all: ["fetch\\s*\\(\\s*['\"`][^'\"`]*/api/events", "method\\s*:\\s*['\"`]POST['\"`]"] },
                { text: "Sends a Content-Type: application/json header", marks: 1, any: ["content-type['\"`]?\\s*:\\s*['\"`]application/json"] },
                { text: "Serialises the body with JSON.stringify(...)", marks: 1, any: ["body\\s*:\\s*JSON\\s*\\.\\s*stringify\\s*\\("] },
              ],
              wrong: [
                "fetch\u0028'/api/events', { method: 'GET' })",
                "fetch\u0028'/api/events', { method: 'POST', body: event })",
              ],
            },
            {
              id: "D3c", label: "c", marks: 3, format: "text",
              prompt: "Explain the difference between POST and PUT from the perspective of a frontend application performing CRUD operations. (3 marks)",
              model: "POST creates a new resource: the frontend sends the data to the collection URL (POST /api/events) without an id, and the server creates the record and assigns its id (usually replying 201 Created).\nPUT updates (replaces) an existing resource: the frontend sends the full updated object to that resource's own URL, which includes its id (PUT /api/events/42).\nPUT is idempotent (sending it twice gives the same result); POST is not (sending it twice creates two events).",
              rubric: [
                { text: "POST creates a new resource (Create)", marks: 1, any: ["POST\\b[^.]*\\b(creat|add|new|insert)"] },
                { text: "PUT updates/replaces an existing resource (Update)", marks: 1, any: ["PUT\\b[^.]*\\b(updat|replac|modif|edit|chang)"] },
                { text: "PUT targets one resource by id (/api/events/42) and is idempotent; POST goes to the collection and is not", marks: 1, any: ["idempoten", "\\bid\\b", "/api/events/(\\d+|:id|\\$\\{)", "same result", "twice", "duplicate"] },
              ],
              wrong: [
                "POST gets data from the server and PUT deletes it.",
                "They are the same; both send data.",
              ],
            },
          ],
        },
        {
          id: "D4", type: "written", marks: 10,
          title: "State Management - Zustand and TanStack Query (10 marks)",
          prompt: "A shopping application contains the following requirements:\n- The selected theme (light or dark) must be available across multiple components.\n- Product information must be retrieved from an external API.\n- Product information should be cached.\n- When a product is updated, the application should refresh the relevant product information.\n- The application should avoid unnecessary API requests.\nAnswer all parts.",
          explain: "Zustand for client state (theme); TanStack Query for server state (products: fetch, cache, invalidate).",
          parts: [
            {
              id: "D4a", label: "a", marks: 4, format: "text",
              prompt: "Identify which of the requirements should be handled using Zustand and which should be handled using TanStack Query. Explain your choices. (4 marks)",
              model: "Zustand: the selected theme (light/dark). It is client/UI state that lives only in the browser, so a small global store such as useThemeStore lets any component read or change it without prop drilling.\nTanStack Query: retrieving product information from the API, caching it, refreshing it after a product is updated, and avoiding unnecessary requests. That is server state, and TanStack Query handles fetching, caching, staleTime, deduplication and invalidation for us.",
              rubric: [
                { text: "Theme → Zustand", marks: 1, any: ["theme[^.;]*zustand", "zustand[^.;]*theme"] },
                { text: "Product fetching/caching/refresh → TanStack Query", marks: 1, any: ["(product|fetch|api)[^.;]*(tanstack|react[ -]query|usequery)", "(tanstack|react[ -]query)[^.;]*(product|fetch|api|cach)"] },
                { text: "Reason: the theme is client/UI state shared across components", marks: 1, any: ["client(-| )?(side )?state", "\\bui state", "local state", "global (client )?state", "(across|between|many|multiple) components", "prop drilling", "\\bshared\\b"] },
                { text: "Reason: products are server state; Query handles caching, refetch/invalidation, deduplication", marks: 1, any: ["server(-| )?state", "server data", "invalidat", "staleTime", "dedup", "refetch", "(unnecessary|duplicate|extra) (\\w+ )?requests"] },
              ],
              wrong: [
                "Use Zustand for everything, including the product data, because it is a global store.",
                "Both should use useState in each component.",
              ],
            },
            {
              id: "D4b", label: "b", marks: 2, format: "text",
              prompt: "Describe what query caching means in TanStack Query and how it benefits the application. (2 marks)",
              model: "TanStack Query stores each query's result in a cache under its queryKey (e.g. [\"products\"]). Other components that use the same key reuse the cached data immediately instead of making a new request, and while the data is fresh (staleTime) it is not refetched. This means fewer API requests, faster screens and no repeated loading spinners.",
              rubric: [
                { text: "Results are stored in a cache under a query key and reused", marks: 1, all: ["cach|stor|sav|kept|keep"], any: ["query ?key", "\\bkey\\b", "reus", "same data", "\\bshared\\b", "remember"] },
                { text: "Benefit: fewer/no unnecessary requests; faster UI", marks: 1, any: ["(fewer|less|reduc\\w*|avoid\\w*|no|unnecessary|duplicate|extra|repeat\\w*) (\\w+ )?(api |network |http )?(requests|calls|fetch)", "faster", "instant", "immediately", "performance", "without (re-?)?fetch"] },
              ],
              wrong: [
                "Caching means the data is saved to a database.",
                "It deletes old products.",
              ],
            },
            {
              id: "D4c", label: "c", marks: 2, format: "text",
              prompt: "Explain how the application can ensure that product information is refreshed after a successful update. (2 marks)",
              model: "Do the update with useMutation and, in its onSuccess callback, call queryClient.invalidateQueries({ queryKey: [\"products\"] }). That marks the cached product queries stale, so they are refetched and the screen shows the updated product.",
              rubric: [
                { text: "invalidateQueries on the product query key", marks: 1, all: ["invalidateQueries", "product"] },
                { text: "Done after the update succeeds (useMutation onSuccess), triggering a refetch", marks: 1, any: ["onSuccess", "after (the )?(update|mutation|save)\\w* (succeed|success|complet|finish)", "refetch"] },
              ],
              wrong: [
                "Reload the whole page with window.location.reload().",
                "Increase staleTime so the data stays cached.",
              ],
            },
            {
              id: "D4d", label: "d", marks: 2, format: "text",
              prompt: "Explain one advantage of using a selector when accessing data from a Zustand store. (2 marks)",
              model: "A selector subscribes the component to just one slice of the store, e.g. const theme = useThemeStore((s) => s.theme). The component then re-renders only when that value changes, not on every store update, which avoids unnecessary re-renders and makes it clear what the component uses.",
              rubric: [
                { text: "Selects only the piece of state needed, e.g. useStore((s) => s.theme)", marks: 1, any: ["\\(\\s*\\(?\\s*\\w+\\s*\\)?\\s*=>\\s*\\w+\\s*\\.\\s*\\w+\\s*\\)", "only (the )?(\\w+ ){0,3}(piece|part|slice|value|field|data|state)", "specific", "particular", "\\bslice\\b"] },
                { text: "Benefit: re-renders only when that value changes (avoids unnecessary re-renders)", marks: 1, any: ["re-?render", "performance"] },
              ],
              wrong: [
                "Selectors make the store save to localStorage.",
                "It lets the component fetch data from the API.",
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
          prompt: "A user successfully signs in, but their JWT has expired when they attempt to access a protected page. What should the frontend application normally do?",
          options: [
            "Continue treating the user as authenticated indefinitely",
            "Handle the expired authentication state and require reauthentication or an appropriate token-renewal flow",
            "Ignore the expiry information",
            "Display the protected page regardless of authentication",
          ],
          answer: 1,
          explain: "An expired token means logged out: clear it, then refresh it or send the user to log in again.",
        },
        {
          id: "E2", type: "mcq", marks: 2,
          prompt: "What is the main difference between authentication and authorisation?",
          options: [
            "Authentication identifies who a user is; authorisation determines what they are allowed to access",
            "Authentication controls CSS; authorisation controls HTML",
            "Both terms mean exactly the same thing",
            "Authorisation always happens before a user is identified",
          ],
          answer: 0,
          explain: "Authentication = who you are (401 if missing); authorisation = what you may do (403 if not allowed).",
        },
        {
          id: "E3", type: "mcq", marks: 2,
          prompt: "A frontend application allows users to access different pages depending on their roles. Why should the frontend not rely exclusively on hiding restricted pages as its security mechanism?",
          options: [
            "Because React cannot display different pages",
            "Because users may manipulate client-side code or requests, so access permissions must also be enforced by the server",
            "Because CSS cannot hide pages",
            "Because routing automatically encrypts user information",
          ],
          answer: 1,
          explain: "Client code runs on the user's machine and can be changed; the server must check permissions on every request.",
        },
        {
          id: "E4", type: "tf", marks: 2,
          prompt: "True or False: Sending authentication tokens and other sensitive information over HTTPS helps protect them while travelling between the browser and server.",
          answer: true,
          explain: "HTTPS (TLS) encrypts traffic in transit, so tokens can't be read by someone on the network.",
        },
        {
          id: "E5", type: "tf", marks: 2,
          prompt: "True or False: A frontend application should treat data received from an external API as automatically trustworthy simply because the request was successful.",
          answer: false,
          explain: "A 200 only means the request worked; validate the data and never inject it as raw HTML (XSS).",
        },
      ],
    },
  ],
});
