import { Title } from "@solidjs/meta";
import Link from "~/components/Link";
import Geneial from "~/components/logos/Geneial";

export default function About() {
  return (
    <main class="text-center p-4 mx-auto font-mono text-violet-200 pb-20 max-w-[47rem]">
      <Title>About Me</Title>
      <h1 class="text-2xl sm:text-4xl font-thin leading-tight my-12 mx-auto max-w-[14rem] md:max-w-none">
        about me..
      </h1>
      <p class="mx-auto my-8 leading-snug text-base">
        I was born in Taiwan 🇹🇼, and grew up in Calgary, Canada 🇨🇦. I&apos;m
        currently a 4th year computer science student at{" "}
        <Link href="https://www.uwo.ca" external>
          western university
        </Link>
        , currently building web & mobile @ <Geneial />. also currently web team
        lead @{" "}
        <Link href="https://hackwestern.com" external>
          hack western 🐎
        </Link>
        .
      </p>
      <p class="mx-auto my-8 leading-snug text-base">
        at <Geneial />, I work on react & react native apps. I work with AG grid
        on web to build performant data-heavy applications. On mobile, I build
        cross-platform applications with react native.
      </p>
      <p class="mx-auto my-8 leading-snug text-base">
        previously, I contracted as a frontend developer @{" "}
        <Link href="https://aramid.finance" external>
          <img
            src="/aramid.png"
            alt="aramid finance"
            class="inline w-18 rounded-lg hover:scale-105 transition-all -mr-1.5"
          />
        </Link>
        , where I built the landing website and the core web3 bridge
        application. I've also contracted at{" "}
        <Link href="https://mora.do" external>
          mora.do
        </Link>{" "}
        to build various web app & sites.
      </p>
      <p class="mx-auto my-8 leading-snug text-base">
        outside of tech, I spend most of my time rock climbing (on real rocks
        when possible! 🧗‍♂️), playing video games, taking pictures, and reading
        books..
      </p>
      <div class="mx-auto text-sm">
        <div class="relative h-64 max-w-md aspect-[3/2] mx-auto mb-1 rounded-xl overflow-hidden">
          <img
            src="/climb.png"
            alt="Rock Climbing"
            class="absolute inset-0 w-full h-full object-cover"
          />
        </div>
        kananskis, alberta, canada 🇨🇦
      </div>
    </main>
  );
}
