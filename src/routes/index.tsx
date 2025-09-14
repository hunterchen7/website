import { Title } from "@solidjs/meta";
import { createSignal, onMount, For } from "solid-js";
import Link from "~/components/Link";
import Geneial from "~/components/logos/Geneial";

const introText = "hey, I'm Hunter";
const letters = introText.split("");
const initialDelay = 500; // Delay before letter reveal starts (ms)
const letterRevealTiming = 15; // Time between each letter reveal and animation duration (ms)

export default function Home() {
  const [showContent, setShowContent] = createSignal(false);
  const [revealedLetters, setRevealedLetters] = createSignal(0);

  onMount(() => {
    // If this page was visited in this session, skip reveal
    try {
      const visited = sessionStorage.getItem("homeVisited");
      if (visited === "true") {
        setShowContent(true);
      }
    } catch (err) {
      // sessionStorage might be unavailable in some environments
    }

    // Start letter-by-letter reveal after initial delay
    setTimeout(() => {
      const revealInterval = setInterval(() => {
        setRevealedLetters((prev) => {
          if (prev >= letters.length) {
            clearInterval(revealInterval);
            // After all letters are revealed, show the rest of the content
            setTimeout(() => {
              setShowContent(true);
              sessionStorage.setItem("homeVisited", "true");
            }, 1000);
            return prev;
          }
          return prev + 1;
        });
      }, letterRevealTiming);
    }, initialDelay);
  });

  const waveEmojiDelay =
    (initialDelay + letterRevealTiming * letters.length) / 1000 + 0.1;

  return (
    <main class="text-center p-4 mx-auto my-auto justify-center flex flex-col font-mono text-violet-200 pb-20 h-screen">
      <Title>Hunter Chen</Title>
      <h1 class="text-2xl sm:text-4xl font-thin leading-tight mb-2 mx-auto max-w-[14rem] md:max-w-none flex">
        <For each={letters}>
          {(letter, index) => (
            <span
              style={{
                opacity: index() < revealedLetters() ? "1" : "0",
                display: "inline-block",
                transform:
                  index() < revealedLetters()
                    ? "translateY(0) scale(1)"
                    : "translateY(20px) scale(0.8)",
                transition: `all ${letterRevealTiming / 1000}s ease-out`,
                "transition-delay": `${index() * ((letterRevealTiming / 1000) * 2.5)}s`,
              }}
            >
              {letter === " " ? "\u00A0" : letter}
            </span>
          )}
        </For>
        <span
          class={`ml-2 wave-emoji ${letters.length <= revealedLetters() ? "opacity-100" : "opacity-0"} select-none cursor-default`}
          style={{
            transition: `opacity ${waveEmojiDelay}s ease-out`,
            "transition-delay": `${waveEmojiDelay}s`,
          }}
        >
          👋
        </span>
      </h1>
      <p
        class={`mx-auto my-8 leading-snug text-sm sm:text-base md:text-lg max-w-[44rem] ${showContent() ? "content-fade-in" : "opacity-0"}`}
        style={{ "animation-delay": "0.1s" }}
      >
        4th year CS @{" "}
        <Link href="https://www.uwo.ca" external>
          western university
        </Link>
        , frontend & mobile @ <Geneial />, and leading the dev team @{" "}
        <Link href="https://hackwestern.com" external>
          hack western 12
        </Link>
        .
      </p>
      <img
        src="/image.webp"
        alt="Profile"
        class={`rounded-full w-72 h-72 mx-auto mb-4 ${showContent() ? "content-fade-in" : "opacity-0"}`}
        style={{ "animation-delay": "0.5s" }}
        draggable="false"
      />
      <p
        class={`mx-auto my-8 leading-snug md:max-w-none text-sm sm:text-base md:text-lg ${showContent() ? "content-fade-in" : "opacity-0"}`}
        style={{ "animation-delay": "0.1s" }}
      >
        see my{" "}
        <Link href="https://hunterchen.ca/resume.pdf" external>
          resume
        </Link>
        {", "}
        or find me on{" "}
        <Link href="https://github.com/hunterchen7" external>
          github
        </Link>
        {" and "}
        <Link href="https://www.linkedin.com/in/hunterchen" external>
          linkedin
        </Link>
        .
      </p>
    </main>
  );
}
