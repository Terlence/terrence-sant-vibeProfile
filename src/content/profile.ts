/**
 * Single source of truth for all site copy.
 * Edit this file to update the website — no component changes needed.
 */

export const profile = {
  name: "Terrence Sant",
  firstName: "Terrence",
  lastName: "Sant",
  role: "Senior Product Owner",
  company: "Commonwealth Bank",
  location: "Sydney, Australia",
  email: "terlence@gmail.com",
  linkedin: "https://www.linkedin.com/in/terrence-sant",
  headline: "Product Ownership · Data Engineering · Real-time · AI",
  summary:
    "Senior Product Owner and data specialist with 6+ years inside Australian financial services. I translate strategic targets into technical product features — scaling high-impact AI and real-time data products that act in seconds, not hours.",
};

export const heroStats = [
  { value: 4.4, suffix: "M", label: "transactions screened daily", decimals: 1 },
  { value: 8, suffix: "M+", label: "customers reached by my data products", decimals: 0 },
  { value: 498, prefix: "$", suffix: "B", label: "annual transaction value protected", decimals: 0 },
  { value: 85, suffix: "%", label: "faster executive time-to-insight", decimals: 0 },
];

export const about = {
  paragraphs: [
    "Trained as an actuary, shaped by banking. I started out engineering the data features behind one of Australia’s most-used banking apps, moved into credit-risk data architecture at Macquarie, and now lead a cross-border squad scaling Commonwealth Bank’s real-time data infrastructure.",
    "My job is to take a target the board cares about — less fraud, faster insight, sharper marketing — and turn it into a backlog engineers can ship. I speak both languages fluently: the P&L and the pipeline.",
    "As a Thai-Australian dual citizen, I’m at home in cross-border teams and bilingual stakeholder rooms. Before university I served as a deputy squad leader in Thailand’s youth military program (Ror Dor) — still the best crash course in leading under pressure I’ve had.",
  ],
  facts: [
    { k: "Based", v: "Sydney, AU" },
    { k: "Citizenship", v: "Thai · Australian" },
    { k: "Languages", v: "Thai, English · Mandarin (basic)" },
    { k: "Discipline", v: "Actuarial · Commerce" },
  ],
};

export type Role = {
  title: string;
  period: string;
};

export type Chapter = {
  id: string;
  company: string;
  companyNote: string;
  location: string;
  start: string;
  end: string;
  roles: Role[];
  highlights: string[];
  tags: string[];
};

export const journey: Chapter[] = [
  {
    id: "cba-now",
    company: "Commonwealth Bank",
    companyNote:
      "Australia’s largest retail bank — top 5 globally in AI maturity and #1 in APAC (Evident AI Index).",
    location: "Sydney",
    start: "2024",
    end: "Now",
    roles: [
      { title: "Senior Product Owner", period: "Jan 2026 — Present" },
      { title: "Senior Technical Business Analyst", period: "Jul 2024 — Jan 2026" },
    ],
    highlights: [
      "Selected to lead a cross-border, cross-functional squad of 10 (8 engineers, 2 analysts) scaling the bank’s cloud-based real-time data processing infrastructure on a $265K budget.",
      "Orchestrated end-to-end delivery of an enterprise real-time scam intervention engine — detection compressed from hours to seconds across ~4.4M transactions a day, guarding $498B in annual flows.",
      "Partnered with Technology and Consumer Finance to architect a real-time marketing system for 8M+ customers: latency from hours to seconds, manual effort down 20%, 8 analyst-hours saved per use case each week.",
      "Spearheaded GenAI-powered self-serve dashboards, cutting executive time-to-insight by 85% (one week → one day) across 4 core retail banking units.",
    ],
    tags: ["Real-time", "Kafka", "Flink", "GenAI", "Product Ownership"],
  },
  {
    id: "macquarie",
    company: "Macquarie Group",
    companyNote:
      "Global financial services group with $722B+ AUD in assets under management across 34 markets.",
    location: "Sydney",
    start: "2023",
    end: "2024",
    roles: [{ title: "Senior Data Analyst", period: "Jun 2023 — Jul 2024" }],
    highlights: [
      "Led data architecture and risk-reporting frameworks for a core enterprise credit-system migration governing $722B in asset exposure — standardising features for 4 downstream commercial divisions.",
      "Orchestrated data requirements and analytics infrastructure for enterprise credit models, halving cross-functional delivery lead times for hundreds of users.",
      "Directed a regulatory remediation program aligning Risk, Commodities and Finance across 4 global regions — safeguarding against a potential $500M capital overlay (~$60M opportunity cost).",
    ],
    tags: ["Credit Risk", "Data Architecture", "Regulatory", "Global Stakeholders"],
  },
  {
    id: "cba-early",
    company: "Commonwealth Bank",
    companyNote: "Retail Banking data engineering — the CommBank app and the models behind it.",
    location: "Sydney",
    start: "2020",
    end: "2023",
    roles: [{ title: "Technical Business Analyst", period: "Feb 2020 — Jun 2023" }],
    highlights: [
      "Engineered hundreds of data features powering personalisation in the award-winning CommBank app and data science models for 8M+ customers.",
      "Delivered critical datasets for home-loan assessment, term-deposit pricing and credit-bureau reporting — zero operational incidents across usage by hundreds of practitioners in 5 domains.",
      "Built a reusable data-validation and SQL testing framework adopted by 4 analytical squads, cutting delivery lead times by 15%.",
    ],
    tags: ["Feature Engineering", "SQL", "Data Governance", "Testing"],
  },
  {
    id: "foundations",
    company: "Foundations",
    companyNote: "Consulting, risk and analytics — where the habits were formed.",
    location: "Sydney",
    start: "2016",
    end: "2020",
    roles: [
      { title: "Team Leader & Consultant — 180 Degrees Consulting", period: "2018 — 2020" },
      { title: "Summer Intern, Risk Management — Commonwealth Bank", period: "2018 — 2019" },
      { title: "Partnership Model Intern — Social Impact Hub", period: "2019" },
      { title: "Data Analyst — BusinessOne Consulting", period: "2018" },
      { title: "President — Shalom College Residential Society", period: "2017 — 2018" },
    ],
    highlights: [
      "Led pro-bono consulting engagements for non-profits including the Royal Institute for Deaf and Blind Children (RIDBC) and iClick2Learn.",
      "2nd place — ASOC Deloitte Actuarial Case Competition (2018); Finalist — Citi Global Markets Challenge.",
      "Treasurer and board member of the Inter-Residential Council, owning budgets for inter-college events.",
    ],
    tags: ["Consulting", "Leadership", "Risk"],
  },
];

export const education = {
  school: "University of New South Wales",
  location: "Sydney",
  period: "2016 — 2019",
  degrees: [
    "Bachelor of Actuarial Studies — Risk Management & Analytics",
    "Bachelor of Commerce — Accounting",
  ],
};

export const capabilities = [
  {
    title: "Product Ownership",
    blurb: "Strategy to backlog. Roadmaps, squad leadership, budget and stakeholder alignment across borders.",
    items: ["Cross-functional squads", "Roadmapping", "Stakeholder alignment", "Budget ownership"],
  },
  {
    title: "Real-time & Data Engineering",
    blurb: "Streaming architectures that turn events into decisions while they still matter.",
    items: ["Apache Kafka", "Apache Flink", "Apache Spark", "AWS"],
  },
  {
    title: "Analytics & AI",
    blurb: "From feature engineering to GenAI-powered insight for the executive table.",
    items: ["Python", "SQL", "R", "SAS", "Dataiku", "GenAI"],
  },
  {
    title: "Risk & Governance",
    blurb: "An actuary’s instinct for exposure — credit risk, regulatory remediation, data quality.",
    items: ["Credit risk data", "Regulatory remediation", "Data governance", "Testing frameworks"],
  },
];

export const stack = [
  "Apache Kafka",
  "Apache Flink",
  "Apache Spark",
  "AWS",
  "Python",
  "SQL",
  "R",
  "SAS",
  "Dataiku",
  "Power BI",
  "Tableau",
  "GitHub",
  "GenAI",
];

export const certifications = [
  { name: "AWS Certified Data Engineer — Associate", issuer: "Amazon Web Services", code: "AWS" },
  { name: "PL-300: Power BI Data Analyst", issuer: "Microsoft", code: "MS" },
  { name: "SAS Certified Base Programmer for SAS 9", issuer: "SAS Institute", code: "SAS" },
  { name: "Dataiku Core Designer", issuer: "Dataiku", code: "DKU" },
];

export type PortfolioItem = {
  index: string;
  title: string;
  kind: string;
  description: string;
  status: "live" | "in-progress" | "planned";
  /** Add a URL here when the project is ready — the card becomes a link automatically. */
  href?: string;
};

export const portfolio: PortfolioItem[] = [
  {
    index: "01",
    title: "Real-time, end to end",
    kind: "Case study",
    description:
      "How event streaming turns hours of latency into seconds — the product decisions behind fraud and marketing use cases.",
    status: "in-progress",
  },
  {
    index: "02",
    title: "GenAI for the executive table",
    kind: "Case study",
    description:
      "Designing self-serve, AI-assisted dashboards that leaders actually trust — and the guardrails that make it work.",
    status: "planned",
  },
  {
    index: "03",
    title: "Side quests",
    kind: "Game development",
    description:
      "Prototypes and experiments from my game-development hobby. Systems thinking, but with more explosions.",
    status: "planned",
  },
  {
    index: "04",
    title: "Field notes",
    kind: "Writing",
    description:
      "Short essays on data products, product ownership in regulated industries, and building squads across borders.",
    status: "planned",
  },
];

export const interests = [
  { name: "Basketball", note: "I run the weekly Thursday pickup game at work." },
  { name: "Skiing", note: "Every year at Perisher — alpine and backcountry." },
  { name: "Camping", note: "NSW Central Coast, with friends and colleagues." },
  { name: "Game development", note: "Building small worlds after hours." },
  { name: "Weightlifting", note: "The most honest feedback loop there is." },
];

export const nav = [
  { href: "#about", label: "About" },
  { href: "#journey", label: "Journey" },
  { href: "#capabilities", label: "Capabilities" },
  { href: "#portfolio", label: "Portfolio" },
  { href: "#contact", label: "Contact" },
];
