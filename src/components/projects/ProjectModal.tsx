import { createEffect, createSignal, onCleanup } from "solid-js";
import { X, ChevronLeft, ChevronRight, Globe, Link } from "lucide-solid";
import {
  ProjectProps,
  Tags,
  TechnologyIcons,
  TagColors,
} from "~/constants/projects";

const ProjectModal = (props: {
  project: ProjectProps;
  rect: DOMRect | null;
  onClose: () => void;
}) => {
  const [visible, setVisible] = createSignal(false);
  const [index, setIndex] = createSignal(0);

  let wrapper;
  // reuse the same link styles as the project preview
  const linkClass = "text-violet-300 hover:text-violet-400 transition-all mb-2";

  createEffect(() => {
    // trigger entrance after mount
    setTimeout(() => setVisible(true), 10);
  });

  const images = () => {
    const imgs = [];
    if (props.project?.video) imgs.push(props.project.video);
    if (props.project?.images) imgs.push(...props.project.images);
    return imgs;
  };

  const next = () => setIndex((i) => (i + 1) % Math.max(1, images().length));
  const prev = () =>
    setIndex(
      (i) =>
        (i - 1 + Math.max(1, images().length)) % Math.max(1, images().length)
    );

  const onKey = (e: KeyboardEvent) => {
    if (e.key === "Escape") close();
    if (e.key === "ArrowRight") next();
    if (e.key === "ArrowLeft") prev();
  };

  window.addEventListener("keydown", onKey);
  onCleanup(() => window.removeEventListener("keydown", onKey));

  const close = () => {
    setVisible(false);
    setTimeout(() => props.onClose(), 300);
  };

  return (
    <div
      class="fixed inset-0 z-50 flex items-center justify-center"
      aria-modal="true"
      role="dialog"
    >
      <div
        class="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => close()}
      />

      <div
        ref={wrapper}
        class={`max-h-[80vh] max-w-96 sm:max-w-120 md:max-w-154 lg:max-w-180 relative bg-gray-900 text-white rounded-lg overflow-hidden shadow-2xl transform transition-all duration-300 ${
          visible() ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        {/* media carousel */}
        {/* content */}
        <div class="flex justify-center">
          <h2 class="text-2xl m-2">{props.project?.title}</h2>
          {/* preview links (repo / site / demo) shown under description */}
          <div class="flex justify-center gap-2 flex-wrap mx-2 mb-0 mt-3">
            {props.project?.repoUrl && (
              <a
                class={linkClass}
                href={props.project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub Repository"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  role="img"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  class="w-6 h-6"
                  aria-label="GitHub"
                >
                  <title>{props.project.repoUrl}</title>
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.26.82-.577 0-.285-.01-1.04-.015-2.04-3.338.726-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.729.083-.729 1.205.085 1.84 1.237 1.84 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.305.76-1.606-2.665-.304-5.466-1.334-5.466-5.93 0-1.31.468-2.38 1.236-3.22-.124-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.3 1.23a11.48 11.48 0 0 1 3.003-.404c1.02.005 2.047.138 3.003.404 2.29-1.552 3.295-1.23 3.295-1.23.653 1.653.242 2.873.118 3.176.77.84 1.235 1.91 1.235 3.22 0 4.61-2.804 5.624-5.475 5.921.43.372.813 1.102.813 2.222 0 1.606-.014 2.898-.014 3.293 0 .32.216.694.825.576C20.565 21.796 24 17.297 24 12c0-6.63-5.37-12-12-12z" />
                </svg>
              </a>
            )}
            {props.project?.demoUrl && (
              <a
                class={linkClass}
                href={props.project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Live Site"
                title={props.project.demoUrl}
              >
                <Globe size={24} />
              </a>
            )}
            {props.project?.otherUrl && (
              <a
                class={linkClass}
                href={props.project.otherUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Other Link"
                title={props.project.otherUrl}
              >
                <Link size={24} />
              </a>
            )}
          </div>
        </div>

        <div class="flex justify-between items-center gap-2 flex-col lg:flex-row mx-2 select-none mb-2">
          <div class="flex gap-2 items-center">
            {props.project?.technologies?.map((t) => (
              <div class="flex items-center gap-2 bg-gray-800 px-2 py-1 rounded">
                <img
                  src={`/icons/${TechnologyIcons[t]}`}
                  alt={t}
                  class="w-6 h-6"
                />
                <span class="hidden md:block text-xs">{t}</span>
              </div>
            ))}
          </div>

          <div class="flex gap-2">
            {props.project?.tags?.map((tag: Tags) => (
              <span
                class={`text-xs px-2 py-1 rounded-full bg-${
                  TagColors[tag]
                } text-black cursor-default`}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div class="h-72 sm:h-84 lg:h-128 bg-black relative flex items-center justify-center mx-auto border rounded border-gray-700 overflow-hidden">
          {images().length > 0 ? (
            <>
              {props.project?.images.length > 1 && (
                <>
                  <div class="absolute left-3 z-20">
                    <button
                      class="p-2 bg-black/30 rounded-full cursor-pointer hover:bg-gray-800/50 transition-colors"
                      onClick={prev}
                    >
                      <ChevronLeft />
                    </button>
                  </div>
                  <div class="absolute right-3 z-20">
                    <button
                      class="p-2 bg-black/30 rounded-full cursor-pointer border border-black hover:border-gray-600 transition-all"
                      onClick={next}
                    >
                      <ChevronRight />
                    </button>
                  </div>
                </>
              )}

              <div class="w-full h-full flex items-center justify-center overflow-hidden relative">
                {/* blurred background from current image */}
                {images()[index()] &&
                (images()[index()].endsWith(".webm") ||
                  images()[index()].endsWith(".mp4")) ? (
                  // blurred video background when the current slide is a video
                  <video
                    src={images()[index()]}
                    class="absolute inset-0 w-full h-full object-cover filter blur-2xl scale-110 opacity-60"
                    autoplay
                    muted
                    loop
                    playsinline
                    draggable={false}
                    onContextMenu={(e) => e.preventDefault()}
                  />
                ) : images()[index()] ? (
                  <div
                    class="absolute inset-0 bg-center bg-cover filter blur-2xl scale-110 opacity-70"
                    style={{
                      "background-image": `url(${images()[index()]})`,
                    }}
                  />
                ) : (
                  <div class="absolute inset-0 bg-black/20" />
                )}

                {images().map((src, i) => (
                  <div
                    class={`w-full h-full transition-opacity duration-300 absolute top-0 left-0 flex items-center justify-center ${
                      index() === i ? "opacity-100 z-10" : "opacity-0 z-0"
                    }`}
                  >
                    {src.endsWith(".webm") || src.endsWith(".mp4") ? (
                      <video
                        src={src}
                        class="w-full h-full object-contain"
                        autoplay
                        muted
                        loop
                        playsinline
                      />
                    ) : (
                      <img
                        src={src}
                        class="max-h-full max-w-full object-contain mx-auto"
                        alt="project media"
                      />
                    )}
                  </div>
                ))}
              </div>
            </>
          ) : null}
        </div>

        <p
          class="text-xs sm:text-sm text-gray-300 m-2 p-1 md:p-2"
          innerHTML={props.project?.description}
        />
      </div>
    </div>
  );
};

export default ProjectModal;
