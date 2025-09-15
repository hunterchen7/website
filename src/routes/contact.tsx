import { Title } from "@solidjs/meta";
import { Github, Linkedin } from "lucide-solid";

export default function Contact() {
  return (
    <main class="text-center p-4 mx-auto font-mono text-violet-200 pb-20 flex flex-col items-center justify-center h-screen">
      <Title>Contact</Title>
      <h1 class="text-2xl sm:text-4xl font-thin leading-tight my-8 mx-auto max-w-[14rem] md:max-w-none content-fade-in inline cursor-text">
        say hello!
      </h1>
      <a
        class="text-lg font-light leading-relaxed text-violet-700 content-fade-in"
        href="mailto:hello@hunterchen.ca"
        style={{ "animation-delay": "0.1s" }}
      >
        hello@hunterchen.ca
      </a>
      {/* linkedin and github links, use logos */}
      <div
        class="mt-8 flex gap-4 content-fade-in"
        style={{ "animation-delay": "0.2s" }}
      >
        <a
          href="https://www.linkedin.com/in/hunterchen"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
        >
          <Linkedin class="w-8 h-8 hover:scale-105 transition-all hover:text-violet-400" />
        </a>
        <a
          href="https://github.com/hunterchen7"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
        >
          <Github class="w-8 h-8 hover:scale-105 transition-all hover:text-violet-400" />
        </a>
      </div>
    </main>
  );
}
