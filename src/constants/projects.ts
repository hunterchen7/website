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
  AI = "AI/ML",
  web3 = "web3",
  database = "database",
  game = "game",
  school = "school",
  fun = "fun",
}

export const TagColorsHover: Record<Tags, string> = {
  [Tags.frontend]: "blue-600",
  [Tags.backend]: "green-600",
  [Tags.school]: "purple-600",
  [Tags.fun]: "orange-600",
  [Tags.game]: "red-600",
  [Tags.AI]: "yellow-600",
  [Tags.database]: "gray-600",
  [Tags.web3]: "teal-600",
};

export const TagColors: Record<Tags, string> = {
  [Tags.frontend]: "blue-400",
  [Tags.backend]: "green-400",
  [Tags.school]: "purple-400",
  [Tags.fun]: "orange-400",
  [Tags.game]: "red-400",
  [Tags.AI]: "yellow-400",
  [Tags.database]: "gray-400",
  [Tags.web3]: "teal-400",
};

// Helper to generate static Tailwind classes for tag buttons
export const getTagButtonClass = (tag: Tags, selected: boolean) => {
  const base =
    "px-2 py-1 rounded-full border text-xs cursor-pointer transition-colors";
  const border = `border-${TagColors[tag] ?? "gray-400"}`;
  const bg = selected
    ? `bg-${TagColors[tag] ?? "gray-400"} text-black`
    : `text-white`;
  const hover = `hover:bg-${TagColorsHover[tag] ?? "gray-600"} hover:text-white`;
  return `${base} ${border} ${bg} ${hover}`;
};

// Helper to generate an HTML anchor tag string with consistent styling
export const link = (url: string, text?: string, newtab = true) => {
  const display = text ?? url;
  return `<a href="${url}" class="text-violet-300 hover:text-violet-400"${newtab ? ' target="_blank" rel="noopener noreferrer"' : ""}>${display}</a>`;
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
  overview: string;
  video?: string;
  description: string;
  repoUrl?: string;
  demoUrl?: string;
  otherUrl?: string;
  technologies: Technology[];
  tags: Tags[];
  images: string[];
  favourite?: boolean;
  index?: number;
}

export const projects: ProjectProps[] = [
  {
    title: "hack western 12",
    overview:
      "Website, application & hacker portal for the 12th Iteration of Hack Western, Western University's flagship hackathon",
    description:
      "12th iteration of Hack Western in 2025, Western University's flagship hackathon. co-leading the web team of 7 this year; building the event website, the application portal and live dashboard for hackers. Next.js web app with a postgres db.",
    repoUrl: "https://github.com/hackwestern/hackwestern",
    demoUrl: "https://hackwestern.com",
    video: "/projects/hw12/video.mp4",
    technologies: [
      Technology.TypeScript,
      Technology.React,
      Technology.NextJS,
      Technology.PostgreSQL,
      Technology.SQL,
    ],
    tags: [Tags.frontend, Tags.backend, Tags.database],
    images: ["/projects/hw12/image.webp"],
    favourite: true,
  },
  {
    title: "stabl",
    overview: `AI-powered video stabilization tool, built to stabilize some footage I shot from ${link(
      "/airshow",
      "London Airshow 2025",
      false
    )}`,
    description: `a python program that stabilizes video footage by tracking a subject & cropping to center on it. uses YOLOv8, OpenCV and FFMPEG. built to stabilize some footage I shot from ${link(
      "/airshow",
      "London Airshow 2025",
      false
    )}.`,
    repoUrl: "https://github.com/hunterchen7/stabl",
    technologies: [Technology.Python],
    tags: [Tags.AI, Tags.fun],
    video: "/projects/stabl/video.mp4",
    images: [
      "https://raw.githubusercontent.com/hunterchen7/stabl/main/examples/f18_1_visualization.gif",
    ],
    favourite: true,
  },
  {
    title: "chessbench LLM",
    overview:
      "benchmarking LLMs on solving chess puzzles, also play chess against llama-4-scout",
    description: `play chess against llama-4-scout; I pay for it, please be nice.. also contains benchmarks from different LLMs playing chess puzzles, with their Elo ratings, models also play games against each other. React frontend, TS cloudflare worker backend. Python to run the games and aggregate 1,000,000+ puzzles from ${link(
      "https://database.lichess.org/#puzzles",
      "Lichess's database"
    )}.`,
    repoUrl: "https://github.com/hunterchen7/chessbench-llm",
    demoUrl: "https://chessbench.pages.dev/",
    technologies: [Technology.TypeScript, Technology.React, Technology.Python],
    tags: [Tags.AI, Tags.backend, Tags.frontend, Tags.fun],
    images: [
      "/projects/chessbench/image.webp",
      "/projects/chessbench/game.webp",
    ],
  },
  {
    title: "hack western archive",
    overview: "compilation of the past 10 years of hack western websites",
    description:
      "compilation of the past 10 years of hack western websites; features a mix of Next.js, CRA, Vue, Pug, Express, PHP, Bootstrap & JQuery sites, all compiled & combined into a single static site.",
    demoUrl: "https://archive.hackwestern.com/",
    tags: [Tags.frontend, Tags.fun],
    technologies: [
      Technology.TypeScript,
      Technology.JavaScript,
      Technology.React,
      Technology.NextJS,
    ],
    images: ["/projects/hw-archive/image.webp"],
  },
  {
    title: "marvin",
    overview: "AI Discord bot that can chat and generate images",
    description:
      "AI discord chat bot that can also generate images from user prompts. uses llama-4-maverick for text gen and gemini flash 2.0 for image gen. built with TypeScript, also has TS cloudflare worker for image gen on other models. a modified version of marvin is used in a personal discord server, has currently sent 1,000+ messages!",
    repoUrl: "https://github.com/hunterchen7/marvin",
    technologies: [Technology.TypeScript],
    tags: [Tags.AI, Tags.backend, Tags.fun],
    images: ["/projects/marvin/image.webp"],
    favourite: true,
  },
  {
    title: "viewr",
    overview:
      "high-performance image viewer with multi-threaded buffering & caching",
    description:
      "a high-performance image viewer with multi-threaded buffering & caching, built with C++ and Qt. decompresses JPEGs into memory for near instant loading times; for 20 MP images, loading times go from ~200 ms to <1 ms.",
    repoUrl: "https://github.com/hunterchen7/viewr",
    technologies: [Technology.CPlusPlus],
    tags: [Tags.backend, Tags.school],
    images: [
      "/projects/viewr/image.webp",
      "/projects/viewr/image2.webp",
      "/projects/viewr/image3.webp",
    ],
  },
  {
    title: '"pawfect pitch"',
    overview: "AI-driven speech coaching web app",
    description:
      "AI-driven speech coaching; upload audio to get feedback. built for NWhacks 2025. React frontend, Python/fastAPI backend, uses local ~1B LLM & whisper, among other models; see the devpost link for more info.",
    repoUrl: "https://github.com/hunterchen7/pawfect-pitch",
    demoUrl: "https://devpost.com/software/pawfect-pitch",
    tags: [Tags.AI, Tags.backend, Tags.frontend],
    technologies: [Technology.TypeScript, Technology.React, Technology.Python],
    images: [
      "/projects/pawfect/1.webp",
      "/projects/pawfect/2.webp",
      "/projects/pawfect/3.webp",
      "/projects/pawfect/4.webp",
    ],
    video: "/projects/pawfect/video.mp4",
  },
  {
    title: "hack western 11",
    overview:
      "Website, Application & Hacker portal for the 11th Iteration of Hack Western",
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
    tags: [Tags.frontend, Tags.backend, Tags.database],
    images: ["/projects/hw11/image.webp", "/projects/hw11/live.webp"],
    video: "/projects/hw11/video.mp4",
    favourite: true,
  },
  {
    title: "typing game",
    overview: "typing game where you destroy falling asteroids by typing words",
    description:
      "led a group of 4 to build a Java/LibGDX typing game where you type words to destroy asteroids.",
    repoUrl: "https://github.com/hunterchen7/typing-game",
    demoUrl: "https://www.youtube.com/watch?v=1PN8l_tNcNQ",
    technologies: [Technology.Java, Technology.SQLite, Technology.SQL],
    tags: [Tags.game, Tags.backend, Tags.database, Tags.school],
    images: ["/projects/typing/demo.gif"],
  },
  {
    title: "docket",
    overview: "markdown note-taking chrome extension",
    description:
      "markdown note-taking chrome extension, my friend built most of it but I implemented a couple features :)",
    repoUrl: "https://github.com/LordExodius/docket",
    demoUrl:
      "https://chromewebstore.google.com/detail/docket/hlfjljigolpdfpljaogaiklelolbemfc?hl=en&authuser=0&pli=1",
    technologies: [Technology.TypeScript],
    tags: [Tags.frontend, Tags.fun],
    images: ["/projects/docket/image.webp"],
  },
  {
    title: "waveformer",
    overview: "convert images into parametric equations",
    description:
      "A Rust program that converts images into a series of parametric equations using a combination of fourier transforms and edge detection algorithms.",
    repoUrl: "https://github.com/hunterchen7/waveformer",
    technologies: [Technology.Rust],
    tags: [Tags.backend, Tags.fun],
    images: [
      "/projects/waveformer/demo.webp",
      "/projects/waveformer/toronto.webp",
      "/projects/waveformer/graph.webp",
    ],
    favourite: true,
  },
  {
    title: "pointless",
    overview: "Infinite drawing canvas desktop app built with Tauri & React",
    description: `infinite drawing canvas desktop app built with Tauri (Rust) and React. added the colour picker feature, not that impressive, but it's my first open source contribution so I wanted to share :^)`,
    repoUrl: "https://github.com/kkoomen/pointless",
    technologies: [Technology.Rust, Technology.React, Technology.JavaScript],
    tags: [Tags.frontend, Tags.fun],
    images: ["/projects/pointless/image.webp"],
  },
  {
    title: "wasm game of life",
    overview: "Conway's Game of Life in Rust & WebAssembly",
    description: `a Rust implementation of Conway's Game of Life, compiled to WebAssembly. based on a tutorial from the ${link(
      "https://rustwasm.github.io/book/game-of-life/introduction.html",
      "rustwasm book."
    )}`,
    video: "/projects/gameoflife/video.mp4",
    repoUrl: "https://github.com/hunterchen7/wasm-game-of-life",
    demoUrl: "https://hunterchen7.github.io/wasm-game-of-life/",
    otherUrl: "https://rustwasm.github.io/book/game-of-life/introduction.html",
    technologies: [
      Technology.Rust,
      Technology.TypeScript,
      Technology.JavaScript,
    ],
    tags: [Tags.game, Tags.frontend, Tags.fun],
    images: [
      "/projects/gameoflife/demo.gif",
      "/projects/gameoflife/image.webp",
    ],
  },
  {
    title: "scavenger hunt",
    overview:
      "scavenger hunt game for the first hack western 11 organizer social; updated/reused for hack western 12",
    description:
      "a scavenger hunt game for the first hack western 11 organizer social, and updated/reused for hack western 12.  built with TypeScript, React, and Next.js. Postgres db hosted on Hasura. use code 1023 for a demo.",
    video: "/projects/scavenger/video.mp4",
    repoUrl: "https://github.com/hunterchen7/scavenger-hunt",
    demoUrl: "https://scavenger-hunt-pink.vercel.app/",
    technologies: [Technology.TypeScript, Technology.React, Technology.NextJS],
    tags: [Tags.frontend, Tags.database, Tags.fun],
    images: [
      "/projects/scavenger/image.webp",
      "/projects/scavenger/submission.webp",
    ],
  },
  {
    title: "bluefin",
    overview:
      "WIP (abandoned) MCTS chess engine using bitboards, built with Rust",
    description:
      "a WIP (abandoned) MCTS (monte-carlo tree-search) chess engine using bitboards, built with Rust.",
    repoUrl: "https://github.com/bluefin-chess/bluefin",
    technologies: [Technology.Rust],
    tags: [Tags.game, Tags.AI, Tags.fun],
    images: ["/projects/bluefin/image.webp"],
  },
  {
    title: "voyage",
    overview: `WIP (abandoned) magic-bitboard chess move-generator, based on ${link("https://www.codeproject.com/Articles/5313417/Worlds-Fastest-Bitboard-Chess-Movegenerator", "World's Fastest Bitboard Chess Movegenerator")}.`,
    description:
      'a WIP (abandoned) magic-bitboard chess move-generator intended for use in bluefin (my WIP chess engine). written in Rust. based on a C++ move generator called ${link("https://github.com/Gigantua/Gigantua","Gigantua")}.',
    repoUrl: "https://github.com/bluefin-chess/voyage",
    otherUrl:
      "https://www.codeproject.com/Articles/5313417/Worlds-Fastest-Bitboard-Chess-Movegenerator",
    technologies: [Technology.Rust],
    tags: [Tags.game, Tags.fun],
    images: ["/projects/voyage/image.webp"],
  },
  {
    title: "ballotbox",
    overview: `anonymous data marketplace using zero-knowledge proofs`,
    description:
      "anonymous data marketplace using zero-knowledge proofs; built for the 2023 FVM spacewarp hackathon.",
    repoUrl: "https://github.com/KingGizzard/Ballotbox",
    demoUrl: "https://ethglobal.com/showcase/ballotbox-23fge",
    technologies: [Technology.TypeScript, Technology.React],
    tags: [Tags.web3, Tags.frontend, Tags.backend],
    images: [
      "/projects/ballotbox/architecture.webp",
      "/projects/ballotbox/answerer.webp",
      "/projects/ballotbox/asker.webp",
    ],
  },
  {
    title: "DAOVOZ",
    overview: `Website for DAOVOZ, a DAO (decentralized autonomous organization) forum for DAOs based in Davos, Switzerland.`,
    description:
      "DAOVOZ is a DAO (decentralized autonomous organiztion) forum for DAOs; built website to promote & sell tickets to in-person event in Davos, Switzerland.",
    repoUrl: "https://github.com/hunterchen7/daovos-website",
    demoUrl: "https://daovoz.pages.dev/",
    otherUrl: "https://www.eventbrite.ch/e/daovoz-tickets-511821651337",
    technologies: [Technology.TypeScript, Technology.React, Technology.NextJS],
    tags: [Tags.web3, Tags.frontend],
    images: ["/projects/daovoz/image.webp"],
    video: "/projects/daovoz/video.mp4",
  },
  {
    title: "spacestagram",
    overview: `"image sharing from the final frontier" - see some images from NASA’s API`,
    description:
      '"image sharing from the final frontier" - see some images from NASA’s API, built for Shopify\'s 2021 Frontend Developer Intern Challenge',
    repoUrl: "https://github.com/hunterchen7/spacestagram",
    demoUrl: "https://spacestagram.hunterchen.ca",
    technologies: [Technology.JavaScript, Technology.React],
    tags: [Tags.frontend],
    images: [
      "/projects/spacestagram/image.webp",
      "/projects/spacestagram/image2.webp",
    ],
    video: "/projects/spacestagram/video.mp4",
  },
  {
    title: "deChess",
    overview: "decentralized p2p chess web app with tradeable NFT chess pieces",
    description:
      "decentralized p2p chess web app built for ETHGlobal hackathon(s). won 6k+ USD in prizes, and got a 5k USD grant from Streamr. also built to let you mint NFTs of chess pieces, which you could show off in your games against other people. my first time using react!",
    repoUrl: "https://github.com/deChess/deChess",
    demoUrl: "https://ethglobal.com/showcase/dechess-yzza8",
    otherUrl: "https://blog.streamr.network/hackmoney-round-up/",
    technologies: [Technology.JavaScript, Technology.React],
    tags: [Tags.web3, Tags.frontend, Tags.fun],
    images: [
      "/projects/dechess/image.webp",
      "/projects/dechess/image2.webp",
      "/projects/dechess/image3.webp",
    ],
    favourite: true,
  },
  {
    title: "coinport",
    overview: "DeFi (decentralized finance) portfolio dashboard",
    description:
      "a dashboard that breaks down the makeup & history your DeFi portfolio, built for ETHGlobal's Scaling Ethereum. python/flask backend, displayed with chartJS on frontend. won $1000 USD from Covalent (first ever hackathon win!).",
    repoUrl: "https://github.com/Coin-Port/CoinPort",
    demoUrl: "https://ethglobal.com/showcase/coinport-todjy",
    otherUrl:
      "https://web.archive.org/web/20210519170520/https://www.covalenthq.com/blog/scaling-ethereum-winners/",
    technologies: [Technology.Python, Technology.JavaScript],
    tags: [Tags.web3, Tags.frontend, Tags.backend],
    images: ["/projects/coinport/image.webp", "/projects/coinport/image2.webp"],
    video: "/projects/coinport/video.mp4",
  },
  {
    title: "human benchmark bot",
    overview: `AI bot that automates tasks from ${link(
      "https://humanbenchmark.com/",
      "Human Benchmark"
    )} at 99+ percentiles`,
    description: `a python bot that automates tasks from ${link(
      "https://humanbenchmark.com/",
      "Human Benchmark"
    )} using pyautogui, tesseract, and other libraries, getting in the top 0.1% of 5 tasks and 0.4% of another.`,
    repoUrl: "https://github.com/hunterchen7/HumanBenchmarkBot",
    technologies: [Technology.Python],
    tags: [Tags.AI, Tags.backend, Tags.fun],
    images: ["/projects/benchmark/image.webp"],
    favourite: true,
  },
  {
    title: "seCrypt",
    overview: "simple file encryption/decryption tool",
    description:
      "a simple file encryption/decryption tool built with python using tkinter and fernet.",
    repoUrl: "https://github.com/hunterchen7/SeCrypt",
    technologies: [Technology.Python],
    tags: [Tags.backend],
    images: ["/projects/secrypt/image.webp", "/projects/secrypt/image2.webp"],
  },
  {
    title: "tank game",
    overview: "birds-eye view tank game built with gamemaker",
    description:
      "a birds-eye view tank game I made in high school with gamemaker, has a tutorial, 3 normal levels, and a boss level. has different enemy types, ammo types and a menu screen. download & install the .exe at your own discretion, also has a .gmz file if you want to compile it yourself with gamemaker studio.",
    demoUrl: "https://hunterchen.ca/tank/tankgame.exe",
    otherUrl: "https://hunterchen.ca/tank/tankgame.gmz",
    technologies: [],
    tags: [Tags.game],
    images: [
      "/projects/tank/level1.webp",
      "/projects/tank/level2.webp",
      "/projects/tank/level3.webp",
    ],
  },
];
