import { Title } from "@solidjs/meta";
import { HttpStatusCode } from "@solidjs/start";

export default function NotFound() {
  return (
    <main class="text-center p-4 mx-auto text-violet-200 font-mono pb-20">
      <Title>Not Found</Title>
      <HttpStatusCode code={404} />
      <h1 class="uppercase text-4xl font-thin leading-tight my-16 mx-auto max-w-[14rem] md:max-w-none">
        Page Not Found
      </h1>
    </main>
  );
}
