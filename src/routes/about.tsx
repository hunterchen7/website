import { Title } from "@solidjs/meta";
import Link from "~/components/Link";

export default function About() {
  return (
    <main class="text-center p-4 mx-auto font-mono text-violet-200 pb-20 max-w-[47rem]">
      <Title>About Me</Title>
      <h1 class="text-2xl sm:text-4xl font-thin leading-tight my-12 mx-auto max-w-[14rem] md:max-w-none">
        about me..
      </h1>
      <p class="mx-auto my-8 leading-snug text-base">
        I&apos;m a 4th year computer science student at{" "}
        <Link href="https://www.uwo.ca" external>
          western university
        </Link>
        , currently interning as a frontend & mobile engineer @{" "}
        <Link href="https://www.geneial.com" external>
          <img
            src="/geneial_logo-color.png"
            alt="geneial"
            class="inline w-18 bg-gray-200 rounded-lg px-2 mb-1 hover:scale-105 transition-all"
          />
        </Link>
        . I'm also currently the co-lead of the dev team @{" "}
        <Link href="https://hackwestern.com" external>
          hack western 🐎
        </Link>
        .
      </p>
      <p class="mx-auto my-8 leading-snug text-base">
        I've been building with react & typescript/javascript since 2021, and
        doing littler things with python since before that.. familiar with C,
        C++ and Java from school, but I've also been trying to learn rust 🦀!
      </p>
      <p class="mx-auto my-8 leading-snug text-base">
        outside of tech, I spend most of my time rock climbing (on real rocks
        when possible! 🧗‍♂️), playing video games, and reading books (current{" "}
        <Link
          href="https://www.goodreads.com/book/show/40121985-how-to-hide-an-empire"
          external
        >
          favourite book
        </Link>
        )..
      </p>
      <div class="mx-auto text-sm">
        <img
          src="/climb.png"
          alt="Rock Climbing"
          class="rounded-xl h-84 mx-auto mb-1"
        />
        kananskis, alberta, canada 🇨🇦
      </div>
    </main>
  );
}
