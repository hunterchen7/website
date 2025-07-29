import { For } from "solid-js";
import {
  Tags,
  Technology,
  TechnologyIcons,
  getTagButtonClass,
} from "~/constants/projects";

interface ProjectFiltersProps {
  search: string;
  setSearch: (value: string) => void;
  selectedTags: Tags[];
  setSelectedTags: (tags: Tags[]) => void;
  selectedTech: string[];
  setSelectedTech: (techs: string[]) => void;
  handleTagToggle: (tag: Tags) => void;
  handleTechToggle: (tech: string) => void;
}

export default function ProjectFilters(props: ProjectFiltersProps) {
  return (
    <div class="flex flex-col md:flex-row gap-4 items-center justify-center max-w-6xl mx-auto">
      <input
        type="text"
        placeholder="Search by title or description..."
        value={props.search}
        onInput={(e) => props.setSearch(e.currentTarget.value)}
        class="px-4 py-2 rounded bg-black/60 text-white border border-violet-600 focus:outline-none focus:ring focus:ring-violet-400 w-full md:w-1/2"
      />
      {/* tag filters */}
      <div class="flex flex-wrap gap-2 items-center grid grid-cols-4 md:grid-cols-3 lg:grid-cols-4">
        <For each={Object.values(Tags)}>
          {(tag) => (
            <button
              type="button"
              class={getTagButtonClass(tag as Tags, props.selectedTags.includes(tag as Tags))}
              onClick={() => props.handleTagToggle(tag as Tags)}
            >
              {tag}
            </button>
          )}
        </For>
      </div>
      {/* technology filters */}
      <div class="flex flex-wrap gap-0.5 items-center grid grid-cols-6">
        <For each={Object.values(Technology)}>
          {(tech) => (
            <span class="relative group">
              <button
                type="button"
                class={`rounded-full w-10 h-10 cursor-pointer hover:bg-violet-600 transition-all flex items-center justify-center ${props.selectedTech.includes(tech) ? "bg-violet-600 text-white" : "bg-black/40 text-violet-200 border-violet-600"}`}
                onClick={() => props.handleTechToggle(tech)}
                aria-label={tech}
              >
                <img
                  src={`../icons/${TechnologyIcons[tech]}`}
                  alt={tech}
                  width={20}
                  height={20}
                  style={{
                    display: "inline-block",
                    "vertical-align": "middle",
                  }}
                />
              </button>
              <span class="opacity-0 group-hover:opacity-100 absolute left-1/2 top-0 -translate-x-1/2 -translate-y-full mb-2 bg-black text-white text-xs px-2 py-1 rounded z-10 whitespace-nowrap pointer-events-none">
                {tech}
              </span>
            </span>
          )}
        </For>
      </div>
    </div>
  );
}
