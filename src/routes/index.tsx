import { Title } from "@solidjs/meta";
import Link from "~/components/Link";
import Geneial from "~/components/logos/Geneial";

export default function Home() {
  return (
    <main class="text-center p-4 mx-auto my-auto justify-center flex flex-col font-mono text-violet-200 pb-20 h-screen">
      <Title>Hunter Chen</Title>
      <h1 class="text-2xl sm:text-4xl font-thin leading-tight mb-2 mx-auto max-w-[14rem] md:max-w-none flex">
        hello there! <div class="wave-emoji">👋</div>
      </h1>
      <p class="mx-auto my-8 leading-snug md:max-w-none text-lg">
        I&apos;m Hunter, and I like to build things.
      </p>
      <img
        src="/image.png"
        alt="Profile"
        class="rounded-full w-72 h-72 mx-auto mb-4"
        draggable="false"
      />
      <p class="mx-auto mt-8 leading-snug text-lg max-w-[44rem]">
        currently 4th year CS @{" "}
        <Link href="https://www.uwo.ca" external>
          western university
        </Link>{" "}
        and swe intern @ <Geneial />, also leading the web team @{" "}
        <Link href="https://hackwestern.com" external>
          hack western 12
        </Link>
        .
      </p>
      <p class="mx-auto my-8 leading-snug md:max-w-none text-lg">
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
