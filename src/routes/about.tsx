import { Title } from "@solidjs/meta";
import Link from "~/components/Link";
import Geneial from "~/components/logos/Geneial";
import TechIcon from "~/components/TechIcon";

export default function About() {
  return (
    <main class="text-center p-4 mx-auto my-auto flex flex-col md:justify-center md:h-screen font-mono text-violet-200 pb-20 md:max-w-[47rem] text-xs md:text-sm gap-8 mt-0 leading-6">
      <Title>About Me</Title>
      <h1
        class={`text-2xl sm:text-4xl font-thin leading-tight mx-auto max-w-[14rem] md:max-w-none content-fade-in select-none`}
      >
        about me..
      </h1>
      <span
        class="content-fade-in flex flex-wrap justify-center max-w-[80vw] mx-auto"
        style={{ "animation-delay": "0.1s" }}
      >
        building with
        <TechIcon src="/icons/typescript.svg" label="TypeScript" />,
        <TechIcon src="/icons/react.svg" label="React" />,
        <TechIcon src="/icons/python.svg" label="Python" />,
        <TechIcon src="/icons/rust.svg" label="Rust" />,
        <TechIcon src="/icons/java.svg" label="Java" />, and{" "}
        <Link href="/projects" class="ml-2">
          more
        </Link>
        ..
      </span>
      <p
        class={`mx-auto content-fade-in`}
        style={{ "animation-delay": "0.2s" }}
      >
        currently studying computer science @{" "}
        <Link href="https://www.uwo.ca" external>
          western university
        </Link>
        , and building on web & mobile @ <Geneial />. also currently leading the
        web team @{" "}
        <Link href="https://hackwestern.com" external>
          hack western 💜
        </Link>{" "}
        for 2025.
      </p>
      <p
        class={`mx-auto content-fade-in`}
        style={{ "animation-delay": "0.3s" }}
      >
        at <Geneial />, I work on react & react native apps. I work with AG grid
        on web to build performant data-heavy applications. On mobile, I build
        cross-platform applications with react native.
      </p>
      <p
        class={`mx-auto content-fade-in`}
        style={{ "animation-delay": "0.4s" }}
      >
        previously, I contracted as a frontend developer @{" "}
        <Link href="https://aramid.finance" external>
          <img
            src="/aramid.webp"
            alt="aramid finance"
            class="inline w-15 md:w-18 rounded-lg hover:scale-105 transition-all -mr-1.5"
          />
        </Link>
        , where I built the landing website, the frontend of the core web3
        bridge application, as well as a fullstack web app to track usage. I've
        also contracted at{" "}
        <Link href="https://mora.do" external>
          mora.do
        </Link>{" "}
        to build various web app & sites.
      </p>
      <p
        class={`mx-auto content-fade-in`}
        style={{ "animation-delay": "0.5s" }}
      >
        outside of tech, I spend most of my time climbing rocks 🧗‍♂️, playing
        video games, taking pictures 📷, playing chess ♟️, and reading books 📖..
      </p>
      <div
        class={`mx-auto content-fade-in`}
        style={{ "animation-delay": "0.6s" }}
      >
        <div class="relative h-64 max-w-md aspect-[3/2] mx-auto mb-1 rounded-xl overflow-hidden">
          <img
            src="/climb.webp"
            alt="Rock Climbing"
            class="absolute inset-0 w-full h-full object-cover"
            loading="eager"
          />
        </div>
        kananskis, alberta, canada 🇨🇦
      </div>
    </main>
  );
}
