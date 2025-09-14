import { createEffect, createSignal, onCleanup } from "solid-js";
import { X, ChevronLeft, ChevronRight } from "lucide-solid";
import {
  ProjectProps,
  Technology,
  Tags,
  TechnologyIcons,
  TagColors,
  TagColorsHover,
} from "~/constants/projects";

const ProjectModal = (props: {
  project: ProjectProps;
  rect: DOMRect | null;
  onClose: () => void;
}) => {
  const [visible, setVisible] = createSignal(false);
  const [index, setIndex] = createSignal(0);

  let wrapper;

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
        class={`relative bg-gray-900 text-white rounded-lg overflow-hidden shadow-2xl transform transition-all duration-300 ${
          visible() ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
        style={{ width: "min(90vw, 1200px)", height: "min(80vh, 800px)" }}
      >
        {/* media carousel */}
        {/* content */}
        <h2 class="text-2xl m-2">{props.project?.title}</h2>
        <div class="flex justify-between items-center gap-2 mb-3 flex-wrap mx-2 select-none">
          <div class="flex gap-2 items-center">
            {props.project?.technologies?.map((t) => (
              <div class="flex items-center gap-2 bg-gray-800 px-2 py-1 rounded">
                <img
                  src={`/icons/${TechnologyIcons[t]}`}
                  alt={t}
                  class="w-6 h-6"
                />
                <span class="text-xs">{t}</span>
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

        <div class="h-3/4 bg-black relative flex items-center justify-center">
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
          class="text-sm text-gray-300 m-2"
          innerHTML={props.project?.description}
        />
      </div>
    </div>
  );
};

export default ProjectModal;
