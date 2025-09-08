import { Title } from "@solidjs/meta";
import Link from "~/components/Link";
import Geneial from "~/components/logos/Geneial";

export default function About() {
  return (
    <main class="text-center p-4 mx-auto my-auto flex flex-col xl:justify-center xl:h-screen font-mono text-violet-200 pb-20 md:max-w-[47rem] text-sm text-base gap-8 mt-0 leading-6">
      <Title>About Me</Title>
      <h1 class="text-2xl sm:text-4xl font-thin leading-tight mx-auto max-w-[14rem] md:max-w-none">
        about me..
      </h1>
      <p class="mx-auto">
        I was born in Taiwan 🇹🇼, and grew up in Calgary, Canada 🇨🇦. I&apos;m
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
      <p class="mx-auto">
        at <Geneial />, I work on react & react native apps. I work with AG grid
        on web to build performant data-heavy applications. On mobile, I build
        cross-platform applications with react native.
      </p>
      <p class="mx-auto">
        previously, I contracted as a frontend developer @{" "}
        <Link href="https://aramid.finance" external>
          <img
            src="/aramid.webp"
            alt="aramid finance"
            class="inline w-18 rounded-lg hover:scale-105 transition-all -mr-1.5"
          />
        </Link>
        , where I built the landing website, the frontend core web3 bridge
        application, as well as a web app to track usage. I've also contracted
        at{" "}
        <Link href="https://mora.do" external>
          mora.do
        </Link>{" "}
        to build various web app & sites.
      </p>
      <p class="mx-auto">
        outside of tech, I spend most of my time rock climbing (on real rocks
        when possible! 🧗‍♂️), playing video games, taking pictures, and reading
        books..
      </p>
      <div class="mx-auto text-sm">
        <div class="relative h-64 max-w-md aspect-[3/2] mx-auto mb-1 rounded-xl overflow-hidden">
          <img
            src="/climb.webp"
            alt="Rock Climbing"
            class="absolute inset-0 w-full h-full object-cover"
          />
        </div>
        kananskis, alberta, canada 🇨🇦
      </div>
    </main>
  );
}
