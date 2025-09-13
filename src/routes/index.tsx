import { Title } from "@solidjs/meta";
import { createSignal, onMount, For } from "solid-js";
import Link from "~/components/Link";
import Geneial from "~/components/logos/Geneial";

export default function Home() {
  const [showContent, setShowContent] = createSignal(false);
  const [revealedLetters, setRevealedLetters] = createSignal(0);

  const introText = "hey, I'm Hunter";
  const letters = introText.split("");

  onMount(() => {
    // Start letter-by-letter reveal after a short delay
    setTimeout(() => {
      const revealInterval = setInterval(() => {
        setRevealedLetters((prev) => {
          if (prev >= letters.length) {
            clearInterval(revealInterval);
            // After all letters are revealed, show the rest of the content
            setShowContent(true);
            return prev;
          }
          return prev + 1;
        });
      }, 25); // Slightly faster letter reveal
    }, 300);
  });

  return (
    <main class="text-center p-4 mx-auto my-auto justify-center flex flex-col font-mono text-violet-200 pb-20 h-screen">
      <Title>Hunter Chen</Title>
      <h1 class="text-2xl sm:text-4xl font-thin leading-tight mb-2 mx-auto max-w-[14rem] md:max-w-none flex">
        <For each={letters}>
          {(letter, index) => (
            <span
              class={`letter-reveal ${index() < revealedLetters() ? "" : "opacity-0"}`}
              style={{
                "animation-delay": `${index() * 0.08}s`,
              }}
            >
              {letter === " " ? "\u00A0" : letter}
            </span>
          )}
        </For>
        <span
          class={`wave-emoji ${letters.length <= revealedLetters() ? "opacity-100" : "opacity-0"}`}
          style={{
            "animation-delay": `0.8s`,
            transition: "opacity 0.6s ease-out",
          }}
        >
          👋
        </span>
      </h1>

      <p
        class={`mx-auto my-8 leading-snug md:max-w-none text-base md:text-lg ${showContent() ? "content-fade-in" : "opacity-0"}`}
        style={{ "animation-delay": "0.1s" }}
      >
        and I like to build things..
      </p>
      <img
        src="/image.webp"
        alt="Profile"
        class={`rounded-full w-72 h-72 mx-auto mb-4 ${showContent() ? "content-fade-in" : "opacity-0"}`}
        style={{ "animation-delay": "0.2s" }}
        draggable="false"
      />
      <p
        class={`mx-auto mt-8 leading-snug text-sm sm:text-base md:text-lg max-w-[44rem] ${showContent() ? "content-fade-in" : "opacity-0"}`}
        style={{ "animation-delay": "0.3s" }}
      >
        currently 4th year CS @{" "}
        <Link href="https://www.uwo.ca" external>
          western university
        </Link>{" "}
        and frontend @ <Geneial />, also leading the dev team @{" "}
        <Link href="https://hackwestern.com" external>
          hack western 12
        </Link>
        .
      </p>
      <p
        class={`mx-auto my-8 leading-snug md:max-w-none text-sm sm:text-base md:text-lg ${showContent() ? "content-fade-in" : "opacity-0"}`}
        style={{ "animation-delay": "0.4s" }}
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
