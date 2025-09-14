import { Title } from "@solidjs/meta";
import { For } from "solid-js";
import { projects } from "~/constants/projects";
import Project from "../components/projects/Project";

export default function Projects() {
  return (
    <main class="text-center p-4 mx-auto font-mono text-violet-200 pb-24">
      <Title>Projects</Title>
      <h1
        class="text-2xl sm:text-4xl font-thin leading-tight mt-2 md:mt-12 mb-6 mx-auto max-w-[14rem] md:max-w-none content-fade-in"
        style={{ "animation-delay": "0.1s" }}
      >
        projects
      </h1>
      <div class="content-fade-in" style={{ "animation-delay": "0.2s" }}>
        <h3 class="mb-2 text-sm md:text-base">
          a compilation of most of my past & current projects.. roughly reverse
          chronological order.
        </h3>
      </div>
      <div class="mx-auto my-2 select-none">
        <a
          href="https://github.com/hunterchen7"
          target="_blank"
          rel="noreferrer"
          title="github.com/hunterchen7"
          aria-label="GitHub Profile"
          class="inline-block"
        >
          <img
            src="http://github-profile-summary-cards.vercel.app/api/cards/profile-details?username=hunterchen7&theme=midnight_purple"
            class="content-fade-in hover:scale-101 transition-all hover:shadow-lg hover:shadow-violet-800/40 rounded-lg"
            style={{ "animation-delay": "0.3s", display: "block" }}
            alt="GitHub profile card"
          />
        </a>
      </div>
      <section class="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-6 lg:mt-4 justify-center mx-auto md:max-w-6xl lg:max-w-7xl xl:max-w-9xl max-w-screen overflow-hidden">
        <For each={projects}>
          {(project, index) => <Project {...project} index={index()} />}
        </For>
      </section>
      <div class="text-sm text-black pb-20">{"text"}</div>
    </main>
  );
}
