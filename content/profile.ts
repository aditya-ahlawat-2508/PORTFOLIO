export const identity = {
  name: "Aditya Ahlawat",
  headline: "I build multi-agent AI systems.",
  subhead:
    "IT undergrad at Delhi Technological University. I work on RAG pipelines, LangGraph agents, AWS tooling, and a C++ routing engine.",
  metricStrip: "DTU IT '27 · LeetCode Knight 1862 · 650+ problems",
} as const;

export const links = {
  github: "https://github.com/aditya-ahlawat-2508",
  linkedin: "https://www.linkedin.com/in/aditya-2503-/",
  leetcode: "https://leetcode.com/u/Aditya1Ahlawat/",
  codolio: "https://codolio.com/profile/Aditya_",
  emailPrimary: "adityaahlawat544@gmail.com",
  emailUniversity: "adityaahlawat_23it194@dtu.ac.in",
} as const;

export const education = [
  {
    school: "Delhi Technological University",
    detail: "B.Tech, Information Technology",
    dates: "Aug 2023 – Jun 2027",
    note: "CGPA 8.01 · Roll No. 23/IT/194",
  },
  {
    school: "Dayawati Modi Academy",
    detail: "Class XII, CBSE, Uttar Pradesh",
    dates: "2022",
    note: "94%",
  },
  {
    school: "Dayawati Modi Academy",
    detail: "Class X, CBSE, Uttar Pradesh",
    dates: "2020",
    note: "95.1%",
  },
] as const;

export const currentState = {
  location: "Delhi, India",
  focus: "RAG and multi-agent systems",
  learning: "distributed systems, C++ performance work",
  openTo: "AI/ML and backend roles, 2027",
} as const;

export const aboutParagraphs = [
  "I'm in my third year of a B.Tech in Information Technology at Delhi Technological University. I build multi-agent AI systems and the backend infrastructure they run on.",
  "Most of my work is about getting an LLM to produce an answer you can verify. In practice that means retrieval over real documents, function calls instead of guesses, and a validation layer between the model and the user. On my last internship I built a RAG pipeline with hybrid search and an LLM-as-judge step to score how well each answer was grounded in its sources.",
  "I also write C++. Right now that's a routing engine that takes a road network from OpenStreetMap and works out where a group of people should meet so nobody ends up with a much longer commute than everyone else. Outside of projects I do competitive programming — 650+ problems, currently Knight on LeetCode.",
] as const;

export const experience = [
  {
    company: "FEAT",
    role: "AI/ML Developer Intern",
    location: "Meerut, India",
    dates: "Jun 2026 – Aug 2026",
    bullets: [
      "Architected a RAG chatbot pipeline with hybrid search (BM25 + ChromaDB / Sentence-Transformers) and cross-encoder reranking to the top 4 of 10–15 chunks, served by Llama 3.3 70B on Groq with function-calling to eliminate hallucinated figures.",
      "Implemented an LLM-as-judge pipeline to evaluate answer groundedness, plus a semantic + keyword search API, and analysed logged queries via K-Means clustering (scikit-learn) to surface FAQ content gaps.",
      "Partnered with institute staff to scope requirements, then delivered a Smart Attendance Management System (Python, Streamlit, Supabase/PostgreSQL) with role-based Admin/Student panels, live on Streamlit Cloud.",
      "Added Haversine anti-proxy verification via the Geolocation API within a 150 m radius, shareable deep-linking, and Pandas-driven CSV/analytics exports.",
    ],
  },
] as const;

export type Project = {
  slug: string;
  name: string;
  thesis: string;
  dates: string;
  github: string;
  stack: string[];
  bullets: { metric: string; text: string }[];
  status?: "in-progress";
};

export const projects: Project[] = [
  {
    slug: "aws-cost-optimizer",
    name: "AWS Cost Optimizer Dashboard",
    thesis:
      "IaC-provisioned serverless stack for AWS spend analytics and LLM-driven cost advisory.",
    dates: "May 2026 – Jul 2026",
    github: "https://github.com/aditya-ahlawat-2508",
    stack: [
      "Python",
      "AWS Lambda",
      "API Gateway",
      "Cost Explorer",
      "EC2",
      "RDS",
      "S3",
      "boto3",
      "Terraform",
      "LangChain",
      "GPT-4o",
      "Streamlit",
      "Plotly",
    ],
    bullets: [
      {
        metric: "3-layer",
        text: "serverless application on AWS using 3 boto3 service modules to fetch Cost Explorer billing data and manage live EC2, RDS and S3 resources, provisioned end-to-end with Terraform.",
      },
      {
        metric: "4 custom tools",
        text: "built an AI cost advisor using LangChain and GPT-4o exposing 4 custom tools that query real AWS billing and inventory to generate personalised cost-reduction recommendations, surfaced through a 3-page Streamlit dashboard.",
      },
    ],
  },
  {
    slug: "tripmate-ai",
    name: "TripMate AI",
    thesis:
      "A multi-agent AI travel planner that converts a natural-language request into a structured, day-by-day trip plan.",
    dates: "Mar 2026 – May 2026",
    github: "https://github.com/aditya-ahlawat-2508",
    stack: [
      "Python",
      "MCP",
      "LangGraph",
      "LangChain",
      "FastAPI",
      "Groq",
      "Llama 3",
      "PostgreSQL",
      "Tavily",
      "Docker",
    ],
    bullets: [
      {
        metric: "5-agent",
        text: "LangGraph workflow (flight → hotel → weather → itinerary → response) coordinated through a shared typed state, with PostgreSQL checkpointing for stateful multi-turn conversations.",
      },
      {
        metric: "30+ countries",
        text: "integrated 2 real-time data sources (AviationStack flights, Tavily web search) and a location resolver supporting 30+ countries and cities, mapping free-text input to standardised airport codes.",
      },
      {
        metric: "validation layer",
        text: "diagnosed LLM hallucination failures (fabricated fares, incoherent multi-region plans) and engineered a structured-output validation layer to enforce coherent, source-backed itineraries.",
      },
    ],
  },
  {
    slug: "meeting-point",
    name: "Fair Meeting-Point Finder",
    thesis:
      "A C++20 routing engine that answers: N friends live across a city — where do they meet so nobody gets a brutal commute?",
    dates: "2026 – present",
    github: "https://github.com/aditya-ahlawat-2508/MEETING_POINT",
    status: "in-progress",
    stack: [
      "C++20",
      "CMake",
      "Ninja",
      "vcpkg",
      "libosmium",
      "pybind11",
      "FastAPI",
      "React",
      "Vite",
      "MapLibre GL JS",
      "GoogleTest",
      "RapidCheck",
      "Google Benchmark",
      "ASan/UBSan",
      "GitHub Actions",
    ],
    bullets: [
      {
        metric: "2-pass streaming",
        text: "built a CSR graph loader that streams OSM .pbf extracts with libosmium in two passes, assigns dense node IDs, and keeps only the largest connected component so disconnected islands can't break routing.",
      },
      {
        metric: "1.6 ms",
        text: "implemented one-to-many Dijkstra with a binary heap and lazy-deletion guard, plus O(1) nearest-road snapping via a uniform lat/lon grid index — 1.6 ms per source on a real 32,330-node / 64,834-edge OSM graph, so a 12-friend query costs ~19 ms of routing.",
      },
      {
        metric: "2 fairness rules",
        text: "scored candidate venues under two competing fairness rules — utilitarian (minimise total travel) and egalitarian (minimise the worst commute) — with an optional Pareto front over the (sum, max) objective pair.",
      },
      {
        metric: "100 random graphs",
        text: "verified correctness with a RapidCheck property test fuzzing Dijkstra against an independent Bellman-Ford baseline across 100 random graphs, with the full suite running under ASan + UBSan in CI on every push.",
      },
      {
        metric: "pybind11 + FastAPI",
        text: "exposed the engine over HTTP through pybind11 + FastAPI (/health, /rank) with the core staying 100% C++, and shipped a React/MapLibre UI where you drop friend pins and toggle the fairness rule to re-rank venues live.",
      },
    ],
  },
];

export const projectsFraming =
  "Two AI systems and a C++ routing engine. Each one is deployed or running locally, with source on GitHub.";

export const skillGroups = [
  { label: "Languages", tags: ["Python", "SQL", "C++"] },
  {
    label: "AI & Agentic Frameworks",
    tags: [
      "LangChain",
      "LangGraph",
      "RAG",
      "Model Context Protocol (MCP)",
      "OpenAI GPT-4o",
      "Groq",
      "Llama 3",
      "Ollama",
    ],
  },
  {
    label: "Web Frameworks & APIs",
    tags: ["FastAPI", "Pydantic", "Streamlit", "PostgreSQL", "REST APIs"],
  },
  {
    label: "Cloud & Infrastructure",
    tags: ["AWS Lambda", "API Gateway", "S3", "EC2", "IAM", "Terraform", "Docker", "boto3"],
  },
  {
    label: "Developer Tools",
    tags: ["Git", "GitHub", "Cursor", "Power BI", "Claude Code"],
  },
  {
    label: "Domain Knowledge",
    tags: ["Data Structures & Algorithms", "OOP", "DBMS", "Operating Systems", "Computer Networks"],
  },
] as const;

export const achievements = [
  { value: "1862", label: "LeetCode rating — Knight" },
  { value: "5.81%", label: "global percentile" },
  { value: "650+", label: "DSA problems solved" },
  { value: "8947", label: "JEE Advanced rank" },
  { value: "99.31", label: "JEE Mains percentile" },
] as const;

export const leetcodeFallback = {
  totalSolved: 650,
  ranking: 1862,
  updated: "2026-07-25",
} as const;

export type GraphNodeId =
  | "entry"
  | "state"
  | "run"
  | "build"
  | "stack"
  | "solve"
  | "reach";

export const graphNodes: { id: GraphNodeId; label: string; sectionLabel: string }[] = [
  { id: "entry", label: "entry", sectionLabel: "Hero" },
  { id: "state", label: "state", sectionLabel: "About" },
  { id: "run", label: "run", sectionLabel: "Experience" },
  { id: "build", label: "build", sectionLabel: "Projects" },
  { id: "stack", label: "stack", sectionLabel: "Skills" },
  { id: "solve", label: "solve", sectionLabel: "Competitive programming" },
  { id: "reach", label: "reach", sectionLabel: "Contact" },
];
