import { Title } from "@solidjs/meta";
import Counter from "~/components/Counter";

export default function Home() {
  return (
    <main class="text-center p-4 mx-auto">
      <Title>Hunter Chen</Title>
      <h1 class="text-4xl font-thin leading-tight my-16 mx-auto max-w-[14rem] md:max-w-none">
        Hello there!👋
      </h1>
      <p class="mx-auto my-8 leading-snug md:max-w-none text-lg">
        I&apos;m Hunter, and I like to build. Welcome to my website!
      </p>
    </main>
  );
}
