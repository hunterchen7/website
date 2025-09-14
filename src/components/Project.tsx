import { ProjectProps } from "~/constants/projects";
import { onMount, onCleanup } from "solid-js";
import { Globe, Link, Star } from "lucide-solid";

export default function Project(props: ProjectProps & { index: number }) {
  let mediaRoot: HTMLElement | undefined;
  let videoEl: HTMLVideoElement | undefined;
  let observer: IntersectionObserver | undefined;

  onMount(() => {
    if (!mediaRoot || !videoEl) return;
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // start playing when on screen
            videoEl?.play().catch(() => {});
          } else {
            // pause when off screen
            videoEl?.pause();
          }
        });
      },
      { threshold: 0.25 }
    );
    observer.observe(mediaRoot);
  });

  onCleanup(() => {
    observer?.disconnect();
  });
  return (
    <div
      class="project-card group bg-violet-900/20 hover:bg-violet-900/40 shadow-md shadow-violet-800/40 rounded border border-gray-400/50 hover:shadow-lg transition-all duration-300 content-fade-in overflow-visible cursor-pointer"
      style={{ "animation-delay": `${Math.min(0.2 + props.index * 0.25, 2)}s` }}
    >
      <div class="flex justify-between">
        <div class="flex items-center gap-2 px-2 pt-1 pb-0.5">
          <h2 class="text-base text-violet-200">{props.title}</h2>
          {props.favourite && (
            <span class="relative select-none">
              <Star
                size={16}
                fill="currentColor"
                stroke="currentColor"
                class="peer text-yellow-400 cursor-pointer transition-transform duration-300 hover:rotate-72 hover:scale-105"
              />
              <span class="opacity-0 peer-hover:opacity-100 absolute left-1/2 bottom-full -translate-x-1/2 mb-2 bg-black text-white text-xs px-2 py-1 rounded z-10 whitespace-nowrap pointer-events-none transition-opacity duration-300">
                a personal favourite!
              </span>
            </span>
          )}
        </div>
        <div class="flex gap-1 items-center px-2 p-1">
          {props.repoUrl && (
            <a
              href={props.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub Repository"
              class="text-gray-400 hover:text-white opacity-0 group-hover:opacity-100 transition-all duration-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                role="img"
                viewBox="0 0 24 24"
                fill="currentColor"
                class="w-6 h-6"
                aria-label="GitHub"
              >
                <title>GitHub</title>
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.26.82-.577 0-.285-.01-1.04-.015-2.04-3.338.726-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.729.083-.729 1.205.085 1.84 1.237 1.84 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.305.76-1.606-2.665-.304-5.466-1.334-5.466-5.93 0-1.31.468-2.38 1.236-3.22-.124-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.3 1.23a11.48 11.48 0 0 1 3.003-.404c1.02.005 2.047.138 3.003.404 2.29-1.552 3.295-1.23 3.295-1.23.653 1.653.242 2.873.118 3.176.77.84 1.235 1.91 1.235 3.22 0 4.61-2.804 5.624-5.475 5.921.43.372.813 1.102.813 2.222 0 1.606-.014 2.898-.014 3.293 0 .32.216.694.825.576C20.565 21.796 24 17.297 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </a>
          )}
          {props.demoUrl && (
            <a
              href={props.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Live Website"
              class="text-gray-400 hover:text-white opacity-0 group-hover:opacity-100 transition-all duration-300"
            >
              <Globe size={24} />
            </a>
          )}
          {props.otherUrl && (
            <a
              href={props.otherUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Other Link"
              class="text-gray-400 hover:text-white opacity-0 group-hover:opacity-100 transition-all duration-300"
            >
              <Link size={24} />
            </a>
          )}
        </div>
      </div>

      {/* wrap media + overview so bottom overflow is clipped, but allow top overflow from header/tooltips */}
      <div class="relative overflow-hidden">
        {/* media preview: borderless video or first image */}
        <div
          ref={(el) => (mediaRoot = el)}
          class="w-full h-96 overflow-hidden bg-gray-900 flex items-center justify-center"
        >
          {props.video ? (
            <video
              ref={(el) => (videoEl = el)}
              src={props.video}
              class="w-full h-full object-cover"
              preload="none"
              muted
              loop
              playsinline
              draggable={false}
              onContextMenu={(e) => e.preventDefault()}
            />
          ) : props.images && props.images.length > 0 ? (
            <img
              src={props.images[0]}
              alt={props.title}
              class="object-fit"
              draggable={false}
              onContextMenu={(e) => e.preventDefault()}
            />
          ) : null}
        </div>

        {/* overview overlay: absolutely positioned, hidden by translate/opacity so it doesn't change layout */}
        <div class="absolute left-0 right-0 bottom-0 transform translate-y-full group-hover:translate-y-0  transition-all duration-300 bg-black/80 pointer-events-auto">
          <p
            class="text-gray-200 text-left text-xs p-3 m-0"
            innerHTML={props.overview}
          />
        </div>
      </div>
    </div>
  );
}
