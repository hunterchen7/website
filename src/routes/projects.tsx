import { Title } from "@solidjs/meta";
import { createSignal, For } from "solid-js";
import { projects, Tags, Technology } from "~/constants/projects";
import ProjectFilters from "../components/ProjectFilters";

import Project from "../components/Project";

export default function Projects() {
  const [search, setSearch] = createSignal("");
  const [selectedTags, setSelectedTags] = createSignal<Tags[]>([]);
  const [selectedTech, setSelectedTech] = createSignal<string[]>([]);

  const handleTagToggle = (tag: Tags) => {
    setSelectedTags((tags) =>
      tags.includes(tag) ? tags.filter((t) => t !== tag) : [...tags, tag]
    );
  };
  const handleTechToggle = (tech: string) => {
    setSelectedTech((techs) =>
      techs.includes(tech) ? techs.filter((t) => t !== tech) : [...techs, tech]
    );
  };

  const filteredProjects = () =>
    projects.filter((project) => {
      const query = search().toLowerCase();
      const matchesText =
        project.title.toLowerCase().includes(query) ||
        (project.description?.toLowerCase().includes(query) ?? false);
      const matchesTags =
        selectedTags().length === 0 ||
        (project.tags &&
          selectedTags().every((selectedTag) =>
            project.tags.includes(selectedTag as Tags)
          ));
      const matchesTech =
        selectedTech().length === 0 ||
        (project.technologies &&
          selectedTech().every((selected) =>
            project.technologies.includes(selected as Technology)
          ));
      return matchesText && matchesTags && matchesTech;
    });

  return (
    <main class="text-center p-4 mx-auto font-mono text-violet-200 pb-20 h-screen overflow-y-auto">
      <Title>Projects</Title>
      <h1 class="text-2xl sm:text-4xl font-thin leading-tight mt-12 mb-6 mx-auto max-w-[14rem] md:max-w-none">
        projects
      </h1>
      <ProjectFilters
        search={search()}
        setSearch={setSearch}
        selectedTags={selectedTags()}
        setSelectedTags={setSelectedTags}
        selectedTech={selectedTech()}
        setSelectedTech={setSelectedTech}
        handleTagToggle={handleTagToggle}
        handleTechToggle={handleTechToggle}
      />
      <h3 class="mb-2">
        a compilation of most of my past & current projects.. roughly reverse
        chronological order.
      </h3>
      <section class="grid grid-cols-1 md:grid-cols-2 gap-8 justify-center mx-auto md:max-w-6xl three-xl-grid-cols-3 three-xl-max-w">
        <For each={filteredProjects()}>
          {(project) => <Project {...project} />}
        </For>
      </section>
    </main>
  );
}
