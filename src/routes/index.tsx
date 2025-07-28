import { Title } from "@solidjs/meta";
import Link from "~/components/Link";

export default function Home() {
  return (
    <main class="text-center p-4 mx-auto font-mono text-violet-200 pb-20">
      <Title>Hunter Chen</Title>
      <h1 class="text-2xl sm:text-4xl font-thin leading-tight my-16 mx-auto max-w-[14rem] md:max-w-none">
        hello there!👋
      </h1>
      <p class="mx-auto my-8 leading-snug md:max-w-none text-lg">
        I&apos;m Hunter, and I like to build things.
      </p>
      <img
        src="/profile.jpg"
        alt="Profile"
        class="rounded-full w-72 h-72 mx-auto mb-4"
      />
      <p class="mx-auto mt-8 leading-snug md:max-w-none text-lg">
        currently 4th year CS @{" "}
        <Link href="https://www.uwo.ca" external>
          western university
        </Link>{" "}
        and frontend intern @{" "}
        <Link href="https://www.geneial.com" external>
          <img
            src="/geneial_logo-color.png"
            alt="geneial"
            class="inline w-18 bg-gray-200 rounded-lg px-2 mb-1 hover:scale-105 transition-all"
          />
        </Link>
        ,
      </p>
      <p class="mx-auto mt-0 leading-snug md:max-w-none text-lg">
        also working on{" "}
        <Link href="https://github.com/hackwestern/hackwestern" external>
          hack western 12.
        </Link>
      </p>
      <p class="mx-auto my-8 leading-snug md:max-w-none text-lg">
        find me on{" "}
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
