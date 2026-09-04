/**
 * Single source of truth for every piece of content on the site.
 * Edit here — no copy lives inside components.
 */

// ─── FILL THESE IN ────────────────────────────────────────────────────────────
// Placeholders. Replace with your real profile URLs before deploying.
export const PROFILE_URLS = {
  github: 'https://github.com/ankitsaklani',
  linkedin: 'https://www.linkedin.com/in/ankitsaklani',
};

// Web3Forms access key for the contact form (free, no backend).
// Public by design — it ships in the page source, so it isn't a secret.
// Submissions are delivered to the address this key was registered against.
export const CONTACT_FORM_KEY = 'ed3bbe4f-57a1-4f23-954b-84a7d39d151a';
// ──────────────────────────────────────────────────────────────────────────────

export const person = {
  name: 'Ankit Saklani',
  firstName: 'Ankit',
  role: 'Software Developer',
  headline: 'Backend & Distributed Systems Engineer',
  location: 'Delhi, India',
  timezone: 'IST · UTC+5:30',
  email: 'saklanis960@gmail.com',
  resumePath: '/Ankit-Saklani-Resume.pdf',
  available: true,
  availabilityNote: 'Open to backend & platform engineering roles',
  // Used for <meta description>, JSON-LD and social cards.
  metaDescription:
    'Ankit Saklani — Software Developer specialising in Golang, Node.js and Laravel backends. Microservices, distributed caching, database optimisation, observability and LLM/RAG systems.',
};

export const hero = {
  eyebrow: 'Software Developer · Delhi, India',
  // Rendered as three lines with the middle word emphasised in serif italic.
  titleLines: ['I build backends', 'that stay fast', 'under pressure'],
  emphasis: 'fast',
  intro:
    'Backend engineer with 3+ years building microservices and RESTful APIs in Golang, Node.js and Laravel. I work on the parts users never see — caching layers, query plans, load balancing and observability — so the parts they do see stay quick.',
  stats: [
    { value: '3+', label: 'Years building backends' },
    { value: '5', label: 'Core languages shipped' },
    { value: '3', label: 'Engineering teams' },
    { value: 'Go', label: 'Primary stack today' },
  ],
};

export const about = {
  paragraphs: [
    'I’m a Software Developer based in Delhi, currently at Z1 Tech in Gurugram, where I architect microservices-based backend systems in Golang and Laravel. Most of my work sits at the layer where correctness meets latency: designing APIs that hold up under load, tuning MySQL query plans, and building distributed caching so the database isn’t doing work it doesn’t need to.',
    'My path into backend work ran through full-stack product teams. I started at Globiance Intelliweb building enterprise applications in Python and PHP/Laravel, moved through API and payments work at Ajath Infotech, and have spent the last two years going deep on distributed systems — Redis clustering, gRPC services, Nginx load balancing, auto-scaling, and an observability stack that made incidents diagnosable instead of mysterious.',
    'More recently I’ve been building with LLMs as infrastructure rather than novelty: integrating OpenAI and Claude APIs into internal engineering workflows to remove repetitive work, and building a Retrieval-Augmented Generation pipeline on a vector database for semantic search and context-aware answers.',
  ],
  pillars: [
    {
      title: 'Performance is a design decision',
      body: 'Indexes, connection pooling and cache topology get decided before the first endpoint ships — not bolted on after a latency alert.',
    },
    {
      title: 'Systems should explain themselves',
      body: 'Structured logging, metrics and alerting are part of the feature. If you can’t see it failing, you can’t fix it quickly.',
    },
    {
      title: 'Resilience over optimism',
      body: 'JWT auth, rate limiting and circuit breakers assume dependencies will fail, because eventually they all do.',
    },
    {
      title: 'Code others can own',
      body: 'Design patterns, review culture and real test coverage — I’ve mentored juniors on exactly this and it compounds.',
    },
  ],
  facts: [
    { k: 'Based in', v: 'Delhi, India' },
    { k: 'Working hours', v: 'IST · UTC+5:30' },
    { k: 'Primary stack', v: 'Golang · Node.js · Laravel' },
    { k: 'Focus', v: 'Microservices · Caching · LLM systems' },
    { k: 'Education', v: 'MCA, Graphic Era Hill University' },
    { k: 'Open to', v: 'Backend & platform engineering roles' },
  ],
};

export type SkillGroup = {
  id: string;
  layer: string;
  caption: string;
  items: string[];
};

// Grouped by where each technology sits in a request's path, not alphabetically.
export const skillGroups: SkillGroup[] = [
  {
    id: 'languages',
    layer: 'Languages',
    caption: 'What I write day to day',
    items: ['Golang', 'Node.js', 'Python', 'PHP', 'JavaScript', 'SQL', 'HTML', 'CSS'],
  },
  {
    id: 'edge',
    layer: 'Edge & Traffic',
    caption: 'Before a request reaches application code',
    items: ['Nginx', 'Load Balancing', 'Auto-scaling', 'Rate Limiting', 'JWT Authentication', 'Circuit Breakers'],
  },
  {
    id: 'services',
    layer: 'Services & APIs',
    caption: 'How the system is decomposed',
    items: ['Microservices Architecture', 'RESTful APIs', 'gRPC', 'SOAP', 'Gin', 'FastAPI', 'Laravel', 'Message Queues'],
  },
  {
    id: 'data',
    layer: 'Data & Caching',
    caption: 'Where state lives and how it stays fast',
    items: ['MySQL', 'PostgreSQL', 'Redis', 'Redis Clustering', 'MongoDB', 'Query Optimization', 'Database Design', 'Read Replicas', 'Connection Pooling'],
  },
  {
    id: 'ai',
    layer: 'AI & LLM Systems',
    caption: 'Applied, in production workflows',
    items: ['LLM API Integration', 'OpenAI', 'Claude', 'Retrieval-Augmented Generation', 'Vector Databases', 'Semantic Search', 'Prompt Engineering'],
  },
  {
    id: 'ops',
    layer: 'Delivery & Operations',
    caption: 'Getting it out and keeping it healthy',
    items: ['Git', 'CI/CD', 'Docker', 'Linux', 'Observability', 'Structured Logging', 'Metrics Collection', 'Alerting', 'Postman'],
  },
  {
    id: 'foundations',
    layer: 'Foundations',
    caption: 'The reasoning underneath the tools',
    items: ['System Design', 'Distributed Systems', 'Caching Strategies', 'Design Patterns', 'OOP', 'Code Review', 'Mentoring'],
  },
];

export type Job = {
  company: string;
  role: string;
  location: string;
  start: string;
  end: string;
  period: string;
  current?: boolean;
  summary: string;
  bullets: string[];
  stack: string[];
};

export const experience: Job[] = [
  {
    company: 'Z1 Tech',
    role: 'Software Developer',
    location: 'Gurugram, India',
    start: '2024-07',
    end: '',
    period: 'Jul 2024 — Present',
    current: true,
    summary:
      'Architecting microservices-based backend systems and the caching, scaling and observability layers around them.',
    bullets: [
      'Architected microservices-based backend systems using Golang and Laravel, improving API response time through Redis caching, connection pooling and database indexing optimisation.',
      'Engineered RESTful APIs with JWT authentication, rate limiting and circuit breakers, achieving high uptime and low-latency performance.',
      'Optimised MySQL query performance through strategic indexing, query refactoring and read replica implementation, reducing database load and improving throughput.',
      'Designed and deployed horizontally scalable services with Nginx load balancing and auto-scaling, handling traffic spikes without degradation.',
      'Built a distributed caching layer using Redis clustering, reducing database hits and improving overall system performance.',
      'Implemented an observability stack with structured logging, metrics collection and alerting, reducing mean time to resolution (MTTR).',
      'Integrated LLM APIs (OpenAI / Claude) into internal engineering workflows to automate repetitive tasks and improve development efficiency.',
      'Collaborated with cross-functional teams, consistently delivering features ahead of schedule through efficient system design and code reviews.',
    ],
    stack: ['Golang', 'Laravel', 'Redis', 'MySQL', 'Nginx', 'gRPC', 'LLM APIs'],
  },
  {
    company: 'Ajath Infotech Pvt Ltd',
    role: 'Software Developer',
    location: 'Delhi, India',
    start: '2024-01',
    end: '2024-03',
    period: 'Jan 2024 — Mar 2024',
    summary: 'Backend API development for web platforms, with a focus on payments and real-time delivery.',
    bullets: [
      'Developed backend APIs using Node.js and Laravel for web platforms, implementing efficient data serialisation to reduce payload size.',
      'Integrated payment gateways and real-time notification systems, improving overall user engagement.',
      'Designed and delivered backend services with a focus on clean API structure and maintainable application logic.',
    ],
    stack: ['Node.js', 'Laravel', 'REST APIs', 'Payment Gateways'],
  },
  {
    company: 'Globiance Intelliweb',
    role: 'Software Developer',
    location: 'Dehradun, India',
    start: '2023-01',
    end: '2023-10',
    period: 'Jan 2023 — Oct 2023',
    summary: 'Enterprise web applications, access control and asynchronous processing — plus mentoring the juniors on the team.',
    bullets: [
      'Built enterprise web applications using Python and PHP/Laravel, implementing role-based access control (RBAC) and session management.',
      'Designed an asynchronous task processing system using message queues, improving application responsiveness and user experience.',
      'Mentored junior developers on system design, design patterns and code quality best practices.',
    ],
    stack: ['Python', 'PHP', 'Laravel', 'Message Queues', 'RBAC'],
  },
];

export type Project = {
  id: string;
  title: string;
  kind: 'Personal project' | 'Professional work';
  tagline: string;
  problem: string;
  approach: string;
  outcome: string;
  stack: string[];
  links?: { label: string; href: string }[];
};

export const projects: Project[] = [
  {
    id: 'rag',
    title: 'RAG-Based Q&A System',
    kind: 'Personal project',
    tagline: 'Retrieval-Augmented Generation over a vector database',
    problem:
      'Language models answer confidently from training data alone, which makes them unreliable against a private, changing document set.',
    approach:
      'Built a Retrieval-Augmented Generation pipeline: documents are chunked and embedded into a vector database, a query is embedded and matched by semantic similarity, and the retrieved context is composed into the prompt before it reaches the model.',
    outcome:
      'Answers are grounded in the actual source material rather than model memory, and semantic search surfaces relevant passages that keyword matching misses entirely.',
    stack: ['Python', 'Vector Database', 'LLM APIs', 'Semantic Search', 'Prompt Engineering'],
  },
  {
    id: 'microservices',
    title: 'High-Performance Microservices Platform',
    kind: 'Professional work',
    tagline: 'Distributed Golang architecture built for low latency',
    problem:
      'A monolithic request path meant every read hit the primary database, and traffic spikes degraded response times across unrelated features.',
    approach:
      'Designed a distributed architecture in Golang with services communicating over gRPC, a Redis cluster providing a shared caching layer, connection pooling on the database side, and Nginx load balancing with auto-scaling in front.',
    outcome:
      'Database hits dropped sharply, services scaled horizontally through traffic spikes without degradation, and failures stayed contained to the service that caused them.',
    stack: ['Golang', 'gRPC', 'Redis Clustering', 'MySQL', 'Nginx', 'Docker'],
  },
  {
    id: 'observability',
    title: 'Production Observability Stack',
    kind: 'Professional work',
    tagline: 'Making incidents diagnosable instead of mysterious',
    problem:
      'Incidents were being detected by users rather than by the system, and debugging meant reading unstructured logs after the fact.',
    approach:
      'Implemented structured logging with consistent request context, metrics collection across service boundaries, and alerting tuned to symptoms users actually feel rather than raw resource thresholds.',
    outcome:
      'Measurably reduced mean time to resolution (MTTR) — problems now surface with enough context attached to act on immediately.',
    stack: ['Golang', 'Structured Logging', 'Metrics', 'Alerting', 'Linux'],
  },
  {
    id: 'llm-workflows',
    title: 'LLM-Assisted Engineering Workflows',
    kind: 'Professional work',
    tagline: 'Internal tooling that removes repetitive engineering work',
    problem:
      'Recurring, low-judgement tasks were consuming engineering time that should have gone to design and delivery.',
    approach:
      'Integrated OpenAI and Claude APIs into internal engineering workflows, with prompt design and guardrails tuned to each task so output was reviewable rather than blindly trusted.',
    outcome:
      'Repetitive work was automated out of the loop, improving day-to-day development efficiency across the team.',
    stack: ['LLM APIs', 'OpenAI', 'Claude', 'Golang', 'Prompt Engineering'],
  },
];

export type Education = {
  degree: string;
  institution: string;
  year: string;
  note?: string;
};

export const education: Education[] = [
  {
    degree: 'Master of Computer Applications (MCA)',
    institution: 'Graphic Era Hill University',
    year: '2023',
    note: 'Advanced coursework in software engineering, algorithms, databases and distributed systems.',
  },
  {
    degree: 'Bachelor of Computer Application (BCA)',
    institution: 'Himalayan Institute of Technology',
    year: '2021',
    note: 'Foundations in programming, data structures, operating systems and computer networks.',
  },
];

export const achievements = [
  {
    title: 'Delivered ahead of schedule, consistently',
    body: 'Recognised across cross-functional teams for shipping features ahead of schedule through efficient system design and thorough code review.',
  },
  {
    title: 'Reduced mean time to resolution',
    body: 'Designed and rolled out the observability stack — structured logging, metrics and alerting — that measurably cut MTTR on production services.',
  },
  {
    title: 'Mentored junior developers',
    body: 'Coached junior engineers on system design, design patterns and code quality practices, raising the baseline of what the team shipped.',
  },
  {
    title: 'Strong test coverage in production',
    body: 'Maintained meaningful unit and integration test coverage across production services, so refactors stayed safe as systems grew.',
  },
  {
    title: 'Applied LLM engineering, early',
    body: 'Shipped RAG and vector-search systems and put LLM APIs into real internal workflows while most teams were still evaluating them.',
  },
  {
    title: 'Scaled through traffic spikes',
    body: 'Built horizontally scalable services with Nginx load balancing and auto-scaling that absorbed spikes without user-visible degradation.',
  },
];

export const nav = [
  { id: 'about', label: 'About', index: '01' },
  { id: 'skills', label: 'Skills', index: '02' },
  { id: 'experience', label: 'Experience', index: '03' },
  { id: 'work', label: 'Work', index: '04' },
  { id: 'education', label: 'Education', index: '05' },
  { id: 'contact', label: 'Contact', index: '06' },
];

export const socials = [
  { label: 'GitHub', href: PROFILE_URLS.github, handle: '@ankitsaklani' },
  { label: 'LinkedIn', href: PROFILE_URLS.linkedin, handle: 'in/ankitsaklani' },
  { label: 'Email', href: `mailto:${person.email}`, handle: person.email },
];
