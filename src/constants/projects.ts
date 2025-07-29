export enum Technology {
  TypeScript = "TypeScript",
  JavaScript = "JavaScript",
  Python = "Python",
  Java = "Java",
  Rust = "Rust",
  CPlusPlus = "C++",
  React = "React",
  SQL = "SQL",
  SQLite = "SQLite",
  PostgreSQL = "PostgreSQL",
  NextJS = "Next.js",
}

export enum Tags {
  frontend = "frontend",
  backend = "backend",
  fullstack = "fullstack",
  fun = "fun",
  game = "game",
  AI = "AI",
  database = "database",
  web3 = "web3",
}

export const TagColorsHover: Record<string, string> = {
  frontend: "blue-600",
  backend: "green-600",
  fullstack: "purple-600",
  fun: "orange-600",
  game: "red-600",
  AI: "yellow-600",
  database: "gray-600",
  web3: "teal-600",
};

export const TagColors: Record<string, string> = {
  frontend: "blue-400",
  backend: "green-400",
  fullstack: "purple-400",
  fun: "orange-400",
  game: "red-400",
  AI: "yellow-400",
  database: "gray-400",
  web3: "teal-400",
};

// Helper to generate static Tailwind classes for tag buttons
export const getTagButtonClass = (tag: string, selected: boolean) => {
  const base =
    "px-2 py-1 rounded-full border text-xs cursor-pointer transition-colors";
  const border = `border-${TagColors[tag] ?? "gray-400"}`;
  const bg = selected
    ? `bg-${TagColors[tag] ?? "gray-400"} text-black`
    : `text-white`;
  const hover = `hover:bg-${TagColorsHover[tag] ?? "gray-600"} hover:text-white`;
  return `${base} ${border} ${bg} ${hover}`;
};

export const TechnologyIcons: Record<Technology, string> = {
  [Technology.TypeScript]: "typescript.svg",
  [Technology.JavaScript]: "javascript.svg",
  [Technology.Python]: "python.svg",
  [Technology.Java]: "java.svg",
  [Technology.Rust]: "rust.svg",
  [Technology.CPlusPlus]: "cplusplus.svg",
  [Technology.React]: "react.svg",
  [Technology.SQL]: "sql.svg",
  [Technology.SQLite]: "sqlite.svg",
  [Technology.PostgreSQL]: "postgresql.svg",
  [Technology.NextJS]: "next.png",
};

export interface ProjectProps {
  title: string;
  description: string;
  repoUrl?: string;
  demoUrl?: string;
  otherUrl?: string;
  technologies: Technology[];
  tags: Tags[];
  imageUrl?: string;
}

export const projects: ProjectProps[] = [
  {
    title: "hack western 12",
    description:
      "12th iteration of Hack Western in 2025, Western University's flagship hackathon. co-leading the web team of 7 this year; building the event website, the application portal and live dashboard for hackers. Next.js web app with a postgres db.",
    repoUrl: "https://github.com/hackwestern/hackwestern",
    demoUrl: "https://hackwestern.com",
    technologies: [
      Technology.TypeScript,
      Technology.React,
      Technology.NextJS,
      Technology.PostgreSQL,
      Technology.SQL,
    ],
    tags: [Tags.frontend, Tags.fullstack, Tags.backend, Tags.database],
    imageUrl: "https://via.placeholder.com/150",
  },
  {
    title: "chessbench",
    description:
      "play chess against llama-4-scout; I pay for it, please be nice.. also contains benchmarks from different LLMs playing chess puzzles, with their Elo ratings, models also play games against each other. React frontend, TS cloudflare worker backend. Python to run the games and aggregate 1,000,000+ puzzles from Lichess's database.",
    repoUrl: "https://github.com/hunterchen7/chessbench-llm",
    demoUrl: "https://chessbench.pages.dev/",
    technologies: [Technology.TypeScript, Technology.React, Technology.Python],
    tags: [Tags.AI, Tags.backend, Tags.frontend, Tags.fun],
  },
  {
    title: "hack western archive",
    description:
      "compilation of the past 10 years of hack western websites; features a mix of Next.js, CRA, Vue, Pug, Express, PHP, Bootstrap & JQuery sites, all compiled & combined into a single static site.",
    demoUrl: "https://archive.hackwestern.com/",
    tags: [Tags.frontend],
    technologies: [
      Technology.TypeScript,
      Technology.JavaScript,
      Technology.React,
      Technology.NextJS,
    ],
  },
  {
    title: "hack western 11",
    description:
      "2024's iteration of Hack Western; built components for event website and application portal, and created internal review dashboard. implemented CI/CD pipelines for testing and checking code style. also integrated ShadCN and implemented email automation.",
    repoUrl: "https://github.com/hackwestern/hackwestern/tree/hw11",
    demoUrl: "https://2024.hackwestern.com",
    technologies: [
      Technology.TypeScript,
      Technology.React,
      Technology.NextJS,
      Technology.PostgreSQL,
      Technology.SQL,
    ],
    tags: [Tags.frontend, Tags.fullstack, Tags.backend, Tags.database],
    imageUrl: "https://via.placeholder.com/150",
  },
  {
    title: "viewr",
    description:
      "a high-performance image viewer with multi-threaded buffering & caching, built with C++ and Qt. decompresses JPEGs into memory for near instant loading times; for 20 MP images, loading times go from ~200 ms to <1 ms.",
    repoUrl: "https://github.com/hunterchen7/viewr",
    technologies: [Technology.CPlusPlus],
    tags: [Tags.backend],
  },

  {
    title: "marvin",
    description:
      "AI discord chat bot that can also generate images from user prompts. uses llama-4-maverick for text gen and gemini flash 2.0 for image gen. built with TypeScript, also has TS cloudflare worker for image gen on other models.",
    repoUrl: "https://github.com/hunterchen7/marvin",
    technologies: [Technology.TypeScript],
    tags: [Tags.AI, Tags.backend, Tags.fun],
  },
  {
    title: '"pawfect pitch"',
    description:
      "AI-driven speech coaching; upload audio to get feedback. built for NWhacks 2025. React frontend, Python/fastAPI backend, uses local ~1B LLM & whisper, among other models; see the devpost link for more info.",
    repoUrl: "https://github.com/hunterchen7/pawfect-pitch",
    demoUrl: "https://devpost.com/software/pawfect-pitch",
    tags: [Tags.AI, Tags.fullstack, Tags.backend, Tags.frontend],
    technologies: [Technology.TypeScript, Technology.React, Technology.Python],
  },
  {
    title: "typing game",
    description:
      "led a group of 4 to build a Java/LibGDX typing game where you type words to destroy asteroids. built for CS2212 Introduction to Software Engineering @ Western University.",
    repoUrl: "https://github.com/hunterchen7/typing-game",
    technologies: [Technology.Java, Technology.SQLite, Technology.SQL],
    tags: [Tags.game, Tags.backend, Tags.database, Tags.fun],
  },
  {
    title: "pointless",
    description: `infinite drawing canvas desktop app built with Tauri (Rust) and React. added the colour picker feature, not that impressive, but it's my first open source contribution so I wanted to share :^)`,
    repoUrl: "https://github.com/kkoomen/pointless",
    technologies: [Technology.Rust, Technology.React, Technology.JavaScript],
    tags: [Tags.frontend, Tags.fun],
  },
  {
    title: "waveformer",
    description:
      "A Rust program that converts images into a series of parametric equations using a combination of fourier transforms and edge detection algorithms.",
    repoUrl: "https://github.com/hunterchen7/waveformer",
    technologies: [Technology.Rust],
    tags: [Tags.backend, Tags.fun],
  },
  {
    title: "wasm game of life",
    description:
      "a Rust implementation of Conway's Game of Life, compiled to WebAssembly.",
    repoUrl: "https://github.com/hunterchen7/wasm-game-of-life",
    demoUrl: "https://hunterchen7.github.io/wasm-game-of-life/",
    technologies: [
      Technology.Rust,
      Technology.TypeScript,
      Technology.JavaScript,
    ],
    tags: [Tags.game, Tags.frontend, Tags.fun],
  },
  {
    title: "scavenger hunt",
    description:
      "a scavenger hunt game for the first hack western 11 organizer social, and updated/reused for hack western 12.  built with TypeScript, React, and Next.js. Postgres db hosted on Hasura. use code 1023 for a demo.",
    repoUrl: "https://github.com/hunterchen7/scavenger-hunt",
    demoUrl: "https://scavenger-hunt-pink.vercel.app/",
    technologies: [Technology.TypeScript, Technology.React, Technology.NextJS],
    tags: [Tags.frontend, Tags.fullstack, Tags.database, Tags.fun],
  },
  {
    title: "dataquest 2023",
    description:
      "used random forest to predict hotel cancellations; built with Python and scikit-learn for the DataQuest 2023 Hackathon. top 5 finalist out of ~50 teams with only 2 team members.",
    demoUrl:
      "https://devpost.com/software/random-forest-to-predict-hotel-cancellations",
    repoUrl: "https://github.com/hunterchen7/DataQuest-2023",
    technologies: [Technology.Python],
    tags: [Tags.AI],
  },
  {
    title: "F1 finishes predictor",
    description: "python ML program to predict number of finishes in F1 races",
    repoUrl: "https://github.com/hunterchen7/f1-finishers-predictor",
    technologies: [Technology.Python],
    tags: [Tags.AI],
  },

  {
    title: "bluefin",
    description:
      "a WIP (abandoned) monte-carlo tree-search (MCTS) chess engine using bitboards, built with Rust.",
    repoUrl: "https://github.com/bluefin-chess/bluefin",
    technologies: [Technology.Rust],
    tags: [Tags.game, Tags.AI],
  },
  {
    title: "voyage",
    description:
      "a magic bitboard chess move-generator intended for use in bluefin (my WIP chess engine). written in Rust. based on a C++ move generator called Gigantua.",
    repoUrl: "https://github.com/bluefin-chess/voyage",
    technologies: [Technology.Rust],
    tags: [Tags.game],
  },
  {
    title: "ballotbox",
    description:
      "anonymous data marketplace using zero-knowledge proofs; built for the 2023 FVM spacewarp hackathon.",
    repoUrl: "https://github.com/KingGizzard/Ballotbox",
    demoUrl: "https://ethglobal.com/showcase/ballotbox-23fge",
    technologies: [Technology.TypeScript, Technology.React],
    tags: [Tags.web3, Tags.fullstack, Tags.frontend, Tags.backend],
  },
  {
    title: "spacestagram",
    description:
      '"image sharing from the final frontier" - see some images from NASA’s API, built for Shopify Frontend Developer Intern Challenge',
    repoUrl: "https://github.com/hunterchen7/spacestagram",
    demoUrl: "https://spacestagram.hunterchen.ca",
    technologies: [Technology.JavaScript, Technology.React],
    tags: [Tags.frontend],
  },
  {
    title: "deChess",
    description:
      "decentralized p2p chess web app built for ETHGlobal hackathon(s). won 6k+ USD in prizes, and got a 5k USD grant from Streamr. also built to let you mint NFTs of chess pieces, which you could show off in your games against other people. my first time using react!",
    repoUrl: "https://github.com/deChess/deChess",
    demoUrl: "https://ethglobal.com/showcase/dechess-yzza8",
    otherUrl: "https://blog.streamr.network/hackmoney-round-up/",
    technologies: [Technology.JavaScript, Technology.React],
    tags: [Tags.web3, Tags.frontend, Tags.fun],
  },
  {
    title: "coinport",
    description:
      "a DeFi dashboard that shows a detailed history and break down of your portfolio, built for Scaling Ethereum hackathon. built with a python/flask backend, displayed on the frontend with chartJS. won $1000 USD from Covalent.",
    repoUrl: "https://github.com/Coin-Port/CoinPort",
    demoUrl: "https://ethglobal.com/showcase/coinport-todjy",
    otherUrl:
      "https://web.archive.org/web/20210519170520/https://www.covalenthq.com/blog/scaling-ethereum-winners/",
    technologies: [Technology.Python, Technology.JavaScript],
    tags: [Tags.web3, Tags.fullstack, Tags.frontend, Tags.backend],
  },
  {
    title: "human benchmark bot",
    description:
      "a python bot that automates tasks from humanbenchmark.com using pyautogui, tesseract, and other libraries, getting in the top 0.1% of 5 tasks and 0.4% of another.",
    repoUrl: "https://github.com/hunterchen7/HumanBenchmarkBot",
    technologies: [Technology.Python],
    tags: [Tags.AI, Tags.backend, Tags.fun],
  },
  {
    title: "seCrypt",
    description:
      "a simple file encryption/decryption tool built with python using tkinter and fernet.",
    repoUrl: "https://github.com/hunterchen7/SeCrypt",
    technologies: [Technology.Python],
    tags: [Tags.backend],
  },
];
